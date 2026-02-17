import { describe, expect, it } from "vitest";
import { WAIVER_TEMPLATES } from "../lib/templates";

const SUPPORTED_STATES = Object.keys(WAIVER_TEMPLATES);
const FORM_TYPES = [
	"conditional_progress",
	"unconditional_progress",
	"conditional_final",
	"unconditional_final",
] as const;

// Mock data that covers all known fields in all templates
const MOCK_DATA = {
	contractorName: "Acme Corp",
	contractorAddress: "123 Contractor St",
	contractorPhone: "555-1234",
	projectName: "Big Building",
	projectAddress: "456 Project Ave",
	projectState: "TX",
	ownerName: "Property Owner",
	customerName: "General Contractor",
	waiverType: "conditional_progress",
	paymentAmount: "1000.00",
	throughDate: "2026-02-15",
	signature: "data:image/png;base64,mock",
	jobNumber: "JOB-001",
	maker: "Check Writer",
	jobDescription: "Description of work",
};

describe("Exhaustive Template Field Replacement Test", () => {
	describe.each(SUPPORTED_STATES)("State: %s", (stateCode) => {
		it.each(
			FORM_TYPES,
		)("should replace all placeholders in %s form", (formType) => {
			const state = WAIVER_TEMPLATES[stateCode];
			const form = state.forms[formType];
			let bodyText = form.body;

			// Perform replacement using the same logic as pdf.ts
			// 1. Defined fields
			for (const field of form.fields) {
				const value =
					(MOCK_DATA as Record<string, string>)[field] ||
					`[${field.toUpperCase()}]`;
				bodyText = bodyText.replaceAll(`{{${field}}}`, value);
			}

			// 2. All data keys (safety pass)
			for (const [key, value] of Object.entries(MOCK_DATA)) {
				if (typeof value === "string") {
					bodyText = bodyText.replaceAll(`{{${key}}}`, value);
				}
			}

			// ASSERTION: No {{placeholder}} should remain
			const remainingPlaceholders = bodyText.match(/{{.*?}}/g);

			expect(
				remainingPlaceholders,
				`Template ${stateCode} ${formType} has unreplaced fields: ${remainingPlaceholders?.join(", ")}`,
			).toBeNull();
		});
	});

	describe("Sparse Data Success Path", () => {
		it("should result in clean text even if some fields are missing (optional fields)", () => {
			const state = WAIVER_TEMPLATES.TX;
			const form = state.forms.conditional_progress;
			let bodyText = form.body;

			// MOCK_DATA but without jobNumber
			const sparseData: Record<string, string> = { ...MOCK_DATA };
			delete sparseData.jobNumber;

			// Perform replacement (Simulating pdf.ts logic)
			for (const field of form.fields) {
				const value = sparseData[field] || "";
				bodyText = bodyText.replaceAll(`{{${field}}}`, value);
			}

			// ASSERTION: No [JOBNUMBER] or {{jobNumber}} should remain
			expect(bodyText).not.toContain("[JOBNUMBER]");
			expect(bodyText).not.toContain("{{jobNumber}}");
			// It should just be empty after "Job No.: "
			expect(bodyText).toContain("Job No.: \n");
		});
	});
});
