import type { StateTemplates } from "./types";

export const NY: StateTemplates = {
	name: "New York",
	statute: "NY Lien Law § 34",
	lastVerified: "Feb 15, 2026",
	sourceUrl: "https://www.nysenate.gov/legislation/laws/LIE/34",
	forms: {
		conditional_progress: {
			title: "WAIVER OF LIEN TO DATE (CONDITIONAL)",
			notice:
				"NOTICE: THIS WAIVER IS EFFECTIVE ONLY UPON RECEIPT OF PAYMENT (NY LIEN LAW § 34).",
			body: "Upon receipt by the undersigned of the sum of ${{paymentAmount}} payable to {{contractorName}}, this document shall become effective to waive and release any and all lien, stop notice, or bond rights the undersigned has on the job of {{ownerName}} located at {{projectAddress}} to the following extent: Labor, services, equipment, or materials furnished through {{throughDate}}. This waiver is conditioned on actual payment.",
			fields: [
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
				"throughDate",
			],
		},
		unconditional_progress: {
			title: "WAIVER OF LIEN TO DATE (UNCONDITIONAL)",
			notice:
				"WARNING: DO NOT SIGN UNLESS YOU HAVE RECEIVED FUNDS. UNENFORCEABLE IN ADVANCE OF PAYMENT (NY LIEN LAW § 34).",
			body: "The undersigned has been paid and has received a progress payment in the sum of ${{paymentAmount}} for labor, services, equipment, or materials furnished to {{customerName}} on the job of {{ownerName}} located at {{projectAddress}} through {{throughDate}} and does hereby release any lien rights to that extent.",
			fields: [
				"paymentAmount",
				"customerName",
				"ownerName",
				"projectAddress",
				"throughDate",
			],
		},
		conditional_final: {
			title: "FINAL WAIVER OF LIEN (CONDITIONAL)",
			notice:
				"NOTICE: THIS WAIVER IS EFFECTIVE ONLY UPON RECEIPT OF FINAL PAYMENT.",
			body: "Upon receipt by the undersigned of the final payment sum of ${{paymentAmount}}, this document shall become effective to waive and release any and all lien rights the undersigned has on the job of {{ownerName}} located at {{projectAddress}}.",
			fields: ["paymentAmount", "ownerName", "projectAddress"],
		},
		unconditional_final: {
			title: "FINAL WAIVER OF LIEN (UNCONDITIONAL)",
			notice:
				"WARNING: DO NOT SIGN UNLESS FINAL PAYMENT IS IN HAND. (NY LIEN LAW § 34)",
			body: "The undersigned has been paid in full for all labor, services, equipment, or materials furnished to {{customerName}} on the job of {{ownerName}} located at {{projectAddress}} and does hereby waive and release any right to a mechanic's lien.",
			fields: ["customerName", "ownerName", "projectAddress"],
		},
	},
};
