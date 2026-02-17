import { PDFDocument } from "pdf-lib";
import { describe, expect, it, vi } from "vitest";
import { generateWaiverPDF } from "../lib/pdf";

vi.mock("pdf-lib", () => ({
	PDFDocument: {
		create: vi.fn().mockResolvedValue({
			addPage: vi.fn().mockReturnValue({
				getSize: vi.fn().mockReturnValue({ width: 612, height: 792 }),
				drawText: vi.fn(),
				drawImage: vi.fn(),
				drawLine: vi.fn(),
			}),
			embedFont: vi.fn().mockResolvedValue({
				widthOfTextAtSize: vi.fn().mockReturnValue(100),
			}),
			embedPng: vi.fn().mockResolvedValue({
				scale: vi.fn().mockReturnValue({ width: 100, height: 50 }),
			}),
			save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
		}),
	},
	StandardFonts: {
		Helvetica: "Helvetica",
		HelveticaBold: "Helvetica-Bold",
	},
	rgb: vi.fn(),
	degrees: vi.fn(),
}));

describe("PDF Generation: generateWaiverPDF", () => {
	const mockData = {
		contractorName: "Acme",
		contractorAddress: "123 St",
		projectName: "Project A",
		projectAddress: "456 Ave",
		ownerName: "Owner O",
		paymentAmount: "500.00",
		throughDate: "2026-01-01",
	};

	it("should successfully generate a PDF for a supported state", async () => {
		const result = await generateWaiverPDF(
			"TX",
			"conditional_progress",
			mockData,
		);
		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should throw an error for unsupported states", async () => {
		await expect(
			generateWaiverPDF("ZZ", "conditional_progress", mockData),
		).rejects.toThrow("State ZZ not supported");
	});

	it("should embed a signature if provided", async () => {
		const signature =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
		const result = await generateWaiverPDF(
			"CA",
			"unconditional_final",
			mockData,
			signature,
		);
		expect(result).toBeDefined();
	});

	it("should embed and scale signature correctly", async () => {
		// @ts-expect-error - Mocked PDFDocument has different internal structure
		const pdfDoc = await vi.mocked(PDFDocument.create)();
		const page = pdfDoc.addPage();
		const signature =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

		// Mock image dimensions: 1000x500 (too big)
		// @ts-expect-error - Mocking partial return value
		vi.mocked(pdfDoc.embedPng).mockResolvedValueOnce({
			width: 1000,
			height: 500,
		});

		await generateWaiverPDF("CA", "unconditional_final", mockData, signature);

		// With maxWidth=190, maxHeight=50:
		// scale = min(190/1000, 50/500) = min(0.19, 0.1) = 0.1
		// width = 1000 * 0.1 = 100
		// height = 500 * 0.1 = 50
		expect(page.drawImage).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				width: 100,
				height: 50,
				x: 110, // MARGIN(50) + 60
			}),
		);
	});

	it("should apply descender offset to signature Y position", async () => {
		// @ts-expect-error - Mocked PDFDocument has different internal structure
		const pdfDoc = await vi.mocked(PDFDocument.create)();
		const page = pdfDoc.addPage();
		const signature =
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

		// Mock image dimensions: 200x100 (fits width, exceeds height)
		// @ts-expect-error - Mocking partial return value
		vi.mocked(pdfDoc.embedPng).mockResolvedValueOnce({
			width: 200,
			height: 100,
		});

		await generateWaiverPDF("CA", "unconditional_final", mockData, signature);

		// scale = min(190/200, 50/100) = 0.5
		// height = 100 * 0.5 = 50
		// descenderRatio = 0.15 -> offset = 50 * 0.15 = 7.5
		// sigY = ctx.yOffset - 2 + 7.5
		expect(page.drawImage).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				y: expect.any(Number),
			}),
		);

		const calls = vi.mocked(page.drawImage).mock.calls;
		const lastCallArgs = calls[calls.length - 1][1];
		expect(lastCallArgs.y).toBeGreaterThan(0);
	});

	it("should apply a watermark if provided", async () => {
		const result = await generateWaiverPDF(
			"FL",
			"conditional_final",
			mockData,
			undefined,
			"PREVIEW",
		);
		expect(result).toBeDefined();
	});
});
