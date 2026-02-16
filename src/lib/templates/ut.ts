import type { StateTemplates } from "./types";

export const UT: StateTemplates = {
	name: "Utah",
	statute: "Utah Code § 38-1a-802",
	lastVerified: "Feb 15, 2026",
	sourceUrl: "https://le.utah.gov/xcode/Title38/Chapter1a/38-1a-S802.html",
	forms: {
		conditional_progress: {
			title: "UTAH CONDITIONAL WAIVER AND RELEASE UPON PROGRESS PAYMENT",
			body: "On receipt by the undersigned of a check from {{customerName}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures, or tools to {{ownerName}} on the project of {{customerName}} located at {{projectAddress}} to the following extent: all labor, professional services, materials, machinery, fixtures, or tools furnished through {{throughDate}}.",
			fields: [
				"customerName",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
				"throughDate",
			],
		},
		unconditional_progress: {
			title: "UTAH UNCONDITIONAL WAIVER AND RELEASE UPON PROGRESS PAYMENT",
			body: "The undersigned has been paid and has received a progress payment in the sum of ${{paymentAmount}} for all labor, professional services, materials, machinery, fixtures, or tools furnished to {{customerName}} on the project of {{ownerName}} located at {{projectAddress}} through {{throughDate}} and does hereby release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures, or tools to the project to the following extent: all labor, professional services, materials, machinery, fixtures, or tools furnished through {{throughDate}}.",
			fields: [
				"paymentAmount",
				"customerName",
				"ownerName",
				"projectAddress",
				"throughDate",
			],
		},
		conditional_final: {
			title: "UTAH CONDITIONAL WAIVER AND RELEASE UPON FINAL PAYMENT",
			body: "On receipt by the undersigned of a check from {{customerName}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures, or tools to {{ownerName}} on the project of {{customerName}} located at {{projectAddress}}.",
			fields: [
				"customerName",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
			],
		},
		unconditional_final: {
			title: "UTAH UNCONDITIONAL WAIVER AND RELEASE UPON FINAL PAYMENT",
			body: "The undersigned has been paid in full for all labor, professional services, materials, machinery, fixtures, or tools furnished to {{customerName}} on the project of {{ownerName}} located at {{projectAddress}} and does hereby waive and release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures, or tools to the project, except for [disputed claims].",
			fields: ["customerName", "ownerName", "projectAddress"],
		},
	},
};
