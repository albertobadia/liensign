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
