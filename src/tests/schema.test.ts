import { describe, expect, it } from "vitest";
import { wizardSchema } from "../components/wizard/schema";

describe("Wizard Schema Validation", () => {
	const validData = {
		contractorName: "Build Co",
		contractorAddress: "123 Main St",
		contractorPhone: "555-0199",
		projectName: "Renovation",
		projectAddress: "456 Project Way",
		projectState: "TX",
		ownerName: "Jane Doe",
		customerName: "Acme Corp",
		waiverType: "conditional_progress",
		paymentAmount: "1000",
		throughDate: "2026-02-15",
		signature: "data:image/png;base64,fake_signature_data",
		signatureOffsetX: 0,
		signatureOffsetY: 0,
		signatureScale: 1,
		signatureRotation: 0,
		isDraft: false,
		jobNumber: "2024-001",
		jobDescription: "General Contracting",
		maker: "Property Owner LLC",
	};

	it("should validate a complete and correct data set", () => {
		const result = wizardSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should fail if contractorName is too short", () => {
		const result = wizardSchema.safeParse({
			...validData,
			contractorName: "A",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				"Contractor name is required",
			);
		}
	});

	it("should fail if projectState is not supported", () => {
		const result = wizardSchema.safeParse({ ...validData, projectState: "XX" });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("State is required");
		}
	});

	it("should fail if paymentAmount is empty", () => {
		const result = wizardSchema.safeParse({ ...validData, paymentAmount: "" });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Amount is required");
		}
	});

	it("should fail if waiverType is invalid", () => {
		const result = wizardSchema.safeParse({
			...validData,
			waiverType: "invalid_type",
		});
		expect(result.success).toBe(false);
	});
});
