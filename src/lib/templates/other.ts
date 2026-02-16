import type { StateTemplates } from "./types";

export const OTHER: StateTemplates = {
	name: "Standard (Other States)",
	statute: "Common Law Template (Fallback for non-statutory states)",
	forms: {
		conditional_progress: {
			title: "CONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			notice: "NOTICE: THIS DOCUMENT WAIVES RIGHTS UPON RECEIPT OF PAYMENT.",
			body: "Upon receipt by the undersigned of a check or payment from {{customerName}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank upon which it is drawn, this document shall become effective to release any mechanic's lien, stop notice, or bond right the undersigned has on the job of {{ownerName}} located at {{projectAddress}} to the following extent: Progress payment for labor, services, equipment, or materials furnished through {{throughDate}}.",
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
			title: "UNCONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY. DO NOT SIGN UNLESS YOU HAVE BEEN PAID.",
			body: "The undersigned has been paid and has received a progress payment in the sum of ${{paymentAmount}} for labor, services, equipment, or materials furnished to {{customerName}} on the job of {{ownerName}} located at {{projectAddress}} through {{throughDate}} and does hereby release any mechanic's lien, stop notice, or bond right that the undersigned has on the above referenced property to that extent.",
			fields: [
				"paymentAmount",
				"customerName",
				"ownerName",
				"projectAddress",
				"throughDate",
			],
		},
		conditional_final: {
			title: "CONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT",
			notice: "NOTICE: THIS DOCUMENT WAIVES RIGHTS UPON RECEIPT OF PAYMENT.",
			body: "Upon receipt by the undersigned of a check or payment from {{customerName}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank upon which it is drawn, this document shall become effective to release any mechanic's lien, stop notice, or bond right the undersigned has on the job of {{ownerName}} located at {{projectAddress}}. This release covers the final payment to the undersigned for all labor, services, equipment, or material furnished on the job.",
			fields: [
				"customerName",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
			],
		},
		unconditional_final: {
			title: "UNCONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY. DO NOT SIGN UNLESS YOU HAVE BEEN PAID.",
			body: "The undersigned has been paid in full for all labor, services, equipment, or materials furnished to {{customerName}} on the job of {{ownerName}} located at {{projectAddress}} and does hereby waive and release any right to a mechanic's lien, stop notice, or any right against a labor and material bond on the job, except for disputed claims for extra work in the amount of $0.",
			fields: ["customerName", "ownerName", "projectAddress"],
		},
	},
};
