import type { StateTemplates } from "./types";

export const MI: StateTemplates = {
	name: "Michigan",
	statute: "Michigan Construction Lien Act MCL 570.1115",
	lastVerified: "Feb 15, 2026",
	sourceUrl:
		"https://www.legislature.mi.gov/documents/mcl/pdf/mcl-570-1115.pdf",
	forms: {
		conditional_progress: {
			title: "PARTIAL CONDITIONAL WAIVER",
			body: "I/we have received partial payment in the amount of $ {{paymentAmount}} conditioned upon the actual payment thereof, and do hereby waive and release my/our construction lien rights to the improvement and property described below for the amount received upon the actual payment of the amount shown: {{projectAddress}}. This waiver, together with all previous waivers, if any, (does) (does not) cover all amounts due to me/us for contract improvement provided through {{throughDate}}.",
			fields: ["paymentAmount", "projectAddress", "throughDate"],
		},
		unconditional_progress: {
			title: "PARTIAL UNCONDITIONAL WAIVER",
			body: "I/we have received partial payment in the amount of $ {{paymentAmount}} and do hereby waive and release my/our construction lien rights to the improvement and property described below for the amount received: {{projectAddress}}. This waiver, together with all previous waivers, if any, (does) (does not) cover all amounts due to me/us for contract improvement provided through {{throughDate}}.",
			fields: ["paymentAmount", "projectAddress", "throughDate"],
		},
		conditional_final: {
			title: "FULL CONDITIONAL WAIVER",
			body: "I/we have received full payment in the amount of $ {{paymentAmount}} conditioned upon the actual payment thereof, and do hereby waive and release all my/our construction lien rights to the improvement and property described below upon the actual payment of the amount shown: {{projectAddress}}.",
			fields: ["paymentAmount", "projectAddress"],
		},
		unconditional_final: {
			title: "FULL UNCONDITIONAL WAIVER",
			body: "I/we have received full payment and do hereby waive and release all my/our construction lien rights to the improvement and property described below: {{projectAddress}}.",
			fields: ["projectAddress"],
		},
	},
};
