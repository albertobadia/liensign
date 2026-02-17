import {
	degrees,
	PDFDocument,
	type PDFFont,
	type PDFPage,
	rgb,
	StandardFonts,
} from "pdf-lib";
import { WAIVER_TEMPLATES } from "./templates";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_MARGIN = 60;

interface PageContext {
	pdfDoc: PDFDocument;
	page: PDFPage;
	yOffset: number;
	font: PDFFont;
	boldFont: PDFFont;
	watermark?: string;
}

function addNewPage(ctx: PageContext): void {
	addPageFooter(ctx);

	ctx.page = ctx.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
	ctx.yOffset = PAGE_HEIGHT - MARGIN;

	if (ctx.watermark) {
		ctx.page.drawText(ctx.watermark, {
			x: PAGE_WIDTH / 2 - 150,
			y: PAGE_HEIGHT / 2,
			size: 80,
			font: ctx.boldFont,
			color: rgb(0.9, 0.9, 0.9),
			rotate: degrees(45),
			opacity: 0.5,
		});
	}
}

function ensureSpace(ctx: PageContext, needed: number): void {
	if (ctx.yOffset - needed < BOTTOM_MARGIN) {
		addNewPage(ctx);
	}
}

function addPageFooter(ctx: PageContext): void {
	ctx.page.drawText("LienSign.com", {
		x: PAGE_WIDTH - 100,
		y: 15,
		size: 7,
		font: ctx.font,
		color: rgb(0.8, 0.8, 0.8),
	});
}

export async function generateWaiverPDF(
	stateCode: string,
	formType:
		| "conditional_progress"
		| "unconditional_progress"
		| "conditional_final"
		| "unconditional_final",
	data: Record<string, string | number | boolean | undefined>,
	signatureBase64?: string,
	watermark?: string,
) {
	const state = WAIVER_TEMPLATES[stateCode];
	if (!state) throw new Error(`State ${stateCode} not supported`);

	const template = state.forms[formType];
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	const ctx: PageContext = {
		pdfDoc,
		page,
		yOffset: PAGE_HEIGHT - MARGIN,
		font,
		boldFont,
		watermark,
	};

	if (watermark) {
		ctx.page.drawText(watermark, {
			x: PAGE_WIDTH / 2 - 150,
			y: PAGE_HEIGHT / 2,
			size: 80,
			font: boldFont,
			color: rgb(0.9, 0.9, 0.9),
			rotate: degrees(45),
			opacity: 0.5,
		});
	}

	ctx.page.drawText(template.title, {
		x: MARGIN,
		y: ctx.yOffset,
		size: 14,
		font: boldFont,
	});
	ctx.yOffset -= 30;

	if (template.notice) {
		const style = template.noticeStyle || { fontSize: 10, isBold: true };
		const noticeText = style.isAllCaps
			? template.notice.toUpperCase()
			: template.notice;
		const noticeFontSize = style.fontSize || 10;
		const noticeFont = style.isBold ? boldFont : font;
		const noticeLineHeight = noticeFontSize + 3;

		const noticeLines = wrapText(
			noticeText,
			CONTENT_WIDTH,
			noticeFont,
			noticeFontSize,
		);
		for (const line of noticeLines) {
			ensureSpace(ctx, noticeLineHeight);
			ctx.page.drawText(line, {
				x: MARGIN,
				y: ctx.yOffset,
				size: noticeFontSize,
				font: noticeFont,
			});
			ctx.yOffset -= noticeLineHeight;
		}
		ctx.yOffset -= 15;
	}

	let bodyText = template.body;
	for (const [key, value] of Object.entries(data)) {
		const stringValue = String(value ?? "");
		bodyText = bodyText.replace(new RegExp(`{{${key}}}`, "g"), stringValue);
	}

	const bodyFontSize = state.baseFontSize || 11;
	const bodyLineHeight = bodyFontSize + 3;
	const bodyLines = wrapText(bodyText, CONTENT_WIDTH, font, bodyFontSize);

	for (const line of bodyLines) {
		ensureSpace(ctx, bodyLineHeight);
		ctx.page.drawText(line, {
			x: MARGIN,
			y: ctx.yOffset,
			size: bodyFontSize,
			font,
		});
		ctx.yOffset -= bodyLineHeight;
	}

	const signatureBlockHeight = signatureBase64 ? 130 : 80;
	ensureSpace(ctx, signatureBlockHeight);

	ctx.yOffset -= 50;

	ctx.page.drawText("Dated:", {
		x: MARGIN,
		y: ctx.yOffset,
		size: 12,
		font: boldFont,
	});
	ctx.page.drawText(
		new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}),
		{
			x: MARGIN + 60,
			y: ctx.yOffset,
			size: 11,
			font,
		},
	);

	ctx.yOffset -= 40;

	if (signatureBase64) {
		try {
			const cleanBase64 = signatureBase64.replace(
				/^data:image\/png;base64,/,
				"",
			);
			const binaryString = atob(cleanBase64);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			const sigImage = await pdfDoc.embedPng(bytes);

			const sigConfig = state.signatureConfig ?? {};
			const maxWidth = sigConfig.maxWidth ?? 190;
			const maxHeight = sigConfig.maxHeight ?? 50;

			const originalWidth = sigImage.width;
			const originalHeight = sigImage.height;

			// Base scale to fit within max bounds
			const baseScale = Math.min(
				maxWidth / originalWidth,
				maxHeight / originalHeight,
				1,
			);

			// User applied scale
			const userScale = (data.signatureScale as number) ?? 1;
			const finalScale = baseScale * userScale;

			const scaledWidth = originalWidth * finalScale;
			const scaledHeight = originalHeight * finalScale;

			// Coords relative to the "By:" line start (MARGIN + 60, current yOffset - 2)
			const offsetX = (data.signatureOffsetX as number) ?? 0;
			const offsetY = (data.signatureOffsetY as number) ?? 0;
			const rotation = (data.signatureRotation as number) ?? 0;

			// Adjusted position
			// In UI, +offset is DOWN. In PDF-lib, SUBTRACTING from Y moves DOWN.
			const sigX = MARGIN + 60 + offsetX;
			const sigY = ctx.yOffset - 2 - offsetY;

			ctx.page.drawImage(sigImage, {
				x: sigX,
				y: sigY,
				width: scaledWidth,
				height: scaledHeight,
				rotate: degrees(-rotation),
			});
		} catch (e) {
			console.error("Signature embedding failed:", e);
		}
	}

	ctx.page.drawText("By:", {
		x: MARGIN,
		y: ctx.yOffset,
		size: 12,
		font: boldFont,
	});
	ctx.page.drawLine({
		start: { x: MARGIN + 60, y: ctx.yOffset - 2 },
		end: { x: MARGIN + 250, y: ctx.yOffset - 2 },
		thickness: 1,
	});

	if (stateCode === "GA") {
		ctx.page.drawText("(SEAL)", {
			x: MARGIN + 260,
			y: ctx.yOffset,
			size: 10,
			font,
		});
	}

	ctx.yOffset -= 20;
	ctx.page.drawText("(Signature)", {
		x: MARGIN + 140,
		y: ctx.yOffset,
		size: 8,
		font,
	});

	addPageFooter(ctx);

	return await pdfDoc.save();
}

function wrapText(
	text: string,
	maxWidth: number,
	font: PDFFont,
	fontSize: number,
): string[] {
	const paragraphs = text.split("\n");
	const lines: string[] = [];

	for (const paragraph of paragraphs) {
		if (paragraph === "") {
			lines.push("");
			continue;
		}

		const words = paragraph.split(" ");
		let currentLine = "";

		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word;
			const testWidth = font.widthOfTextAtSize(testLine, fontSize);
			if (testWidth > maxWidth) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine = testLine;
			}
		}
		if (currentLine) {
			lines.push(currentLine);
		}
	}
	return lines;
}
