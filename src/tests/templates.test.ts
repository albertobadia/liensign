import { describe, expect, it } from "vitest";
import { WAIVER_TEMPLATES } from "../lib/templates";

const SUPPORTED_STATES = [
	"TX",
	"CA",
	"FL",
	"GA",
	"MI",
	"NY",
	"AZ",
	"NV",
	"UT",
	"OTHER",
];
const FORM_TYPES = [
	"conditional_progress",
	"unconditional_progress",
	"conditional_final",
	"unconditional_final",
];

describe("Legal Templates Integrity", () => {
	it.each(SUPPORTED_STATES)("should have a valid template for %s", (state) => {
		expect(WAIVER_TEMPLATES[state]).toBeDefined();
		expect(WAIVER_TEMPLATES[state].statute).toBeDefined();
	});

	it.each(SUPPORTED_STATES)("should have all 4 form types for %s", (state) => {
		for (const type of FORM_TYPES) {
			const form =
				WAIVER_TEMPLATES[state].forms[
					type as keyof (typeof WAIVER_TEMPLATES)[typeof state]["forms"]
				];
			expect(form, `Missing form ${type} for ${state}`).toBeDefined();
			expect(form.title).toBeDefined();
			expect(form.body).toBeDefined();
			expect(form.fields.length).toBeGreaterThan(0);
		}
	});

	it("should include maker field in CA, TX, NV and AZ conditional templates", () => {
		const states = ["CA", "TX", "NV", "AZ"];
		for (const state of states) {
			expect(
				WAIVER_TEMPLATES[state].forms.conditional_progress.fields,
				`Missing maker field for ${state} conditional_progress`,
			).toContain("maker");
			expect(
				WAIVER_TEMPLATES[state].forms.conditional_final.fields,
				`Missing maker field for ${state} conditional_final`,
			).toContain("maker");
		}
	});

	it("should include jobDescription in TX and NV templates", () => {
		const states = ["TX", "NV"];
		for (const state of states) {
			for (const type of FORM_TYPES) {
				expect(
					WAIVER_TEMPLATES[state].forms[
						type as keyof (typeof WAIVER_TEMPLATES)[typeof state]["forms"]
					].fields,
					`Missing jobDescription field for ${state} ${type}`,
				).toContain("jobDescription");
			}
		}
	});

	it("should have consistent placeholder mapping in all templates", () => {
		for (const state of SUPPORTED_STATES) {
			for (const type of FORM_TYPES) {
				const form =
					WAIVER_TEMPLATES[state].forms[
						type as keyof (typeof WAIVER_TEMPLATES)[typeof state]["forms"]
					];
				for (const field of form.fields) {
					expect(
						form.body,
						`Placeholder {{${field}}} missing in ${state} ${type} body`,
					).toContain(`{{${field}}}`);
				}
			}
		}
	});
});
