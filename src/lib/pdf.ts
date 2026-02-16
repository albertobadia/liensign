import {
	degrees,
	PDFDocument,
	type PDFFont,
	rgb,
	StandardFonts,
} from "pdf-lib";
import { WAIVER_TEMPLATES } from "./templates";

export async function generateWaiverPDF(
	stateCode: string,
	formType:
		| "conditional_progress"
		| "unconditional_progress"
		| "conditional_final"
		| "unconditional_final",
	data: Record<string, string>,
	signatureBase64?: string,
	watermark?: string,
) {
	const state = WAIVER_TEMPLATES[stateCode];
	if (!state) throw new Error(`State ${stateCode} not supported`);

	const template = state.forms[formType];
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([612, 792]);
	const { width, height } = page.getSize();

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	if (watermark) {
		page.drawText(watermark, {
			x: width / 2 - 150,
			y: height / 2,
			size: 80,
			font: boldFont,
			color: rgb(0.9, 0.9, 0.9),
			rotate: degrees(45),
			opacity: 0.5,
		});
	}

	let yOffset = height - 50;
	const margin = 50;
	const contentWidth = width - margin * 2;

	page.drawText(template.title, {
		x: margin,
		y: yOffset,
		size: 14,
		font: boldFont,
	});
	yOffset -= 30;

	if (template.notice) {
		const style = template.noticeStyle || { fontSize: 10, isBold: true };
		const noticeText = style.isAllCaps
			? template.notice.toUpperCase()
			: template.notice;
		const noticeFontSize = style.fontSize || 10;
		const noticeFont = style.isBold ? boldFont : font;

		const noticeLines = wrapText(
			noticeText,
			contentWidth,
			noticeFont,
			noticeFontSize,
		);
		for (const line of noticeLines) {
			page.drawText(line, {
				x: margin,
				y: yOffset,
				size: noticeFontSize,
				font: noticeFont,
			});
			yOffset -= noticeFontSize + 3;
		}
		yOffset -= 15;
	}

	let bodyText = template.body;
	// Replace fields defined in metadata
	for (const field of template.fields) {
		const value = data[field] || `[${field.toUpperCase()}]`;
		bodyText = bodyText.replaceAll(`{{${field}}}`, value);
	}

	// Safety pass: replace any other keys present in the data object
	for (const [key, value] of Object.entries(data)) {
		if (typeof value === "string") {
			bodyText = bodyText.replaceAll(`{{${key}}}`, value);
		}
	}

	const bodyFontSize = state.baseFontSize || 11;
	const bodyLines = wrapText(bodyText, contentWidth, font, bodyFontSize);
	for (const line of bodyLines) {
		page.drawText(line, {
			x: margin,
			y: yOffset,
			size: bodyFontSize,
			font,
		});
		yOffset -= bodyFontSize + 3;
	}

	yOffset -= 50;

	page.drawText("Dated:", { x: margin, y: yOffset, size: 12, font: boldFont });
	page.drawText(new Date().toLocaleDateString(), {
		x: margin + 60,
		y: yOffset,
		size: 11,
		font,
	});

	yOffset -= 40;

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
			const sigDims = sigImage.scale(0.5);
			page.drawImage(sigImage, {
				x: margin + 100,
				y: yOffset - 10,
				width: sigDims.width,
				height: sigDims.height,
			});
		} catch (e) {
			console.error("Signature embedding failed:", e);
		}
	}

	page.drawText("By:", { x: margin, y: yOffset, size: 12, font: boldFont });
	page.drawLine({
		start: { x: margin + 60, y: yOffset - 2 },
		end: { x: margin + 250, y: yOffset - 2 },
		thickness: 1,
	});

	if (stateCode === "GA") {
		page.drawText("(SEAL)", { x: margin + 260, y: yOffset, size: 10, font });
	}

	yOffset -= 20;
	page.drawText("(Signature)", { x: margin + 140, y: yOffset, size: 8, font });

	page.drawText("LienSign.com", {
		x: width - 100,
		y: 15,
		size: 7,
		font,
		color: rgb(0.8, 0.8, 0.8),
	});

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
			lines.push(""); // Preserve empty lines (paragraph breaks)
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
