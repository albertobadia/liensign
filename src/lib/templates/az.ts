import type { StateTemplates } from "./types";

export const AZ: StateTemplates = {
	name: "Arizona",
	statute: "A.R.S. § 33-1008",
	lastVerified: "Feb 15, 2026",
	sourceUrl: "https://www.azleg.gov/ars/33/01008.htm",
	forms: {
		conditional_progress: {
			title: "CONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			body: "On receipt by the undersigned of a check from {{maker}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures or tools to {{ownerName}} on the job of {{customerName}} located at {{projectAddress}} to the following extent: Labor, professional services, materials, machinery, fixtures or tools furnished through {{throughDate}} only.",
			fields: [
				"maker",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"customerName",
				"projectAddress",
				"throughDate",
			],
		},
		unconditional_progress: {
			title: "UNCONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 11 },
			body: "The undersigned has been paid and has received a progress payment in the sum of ${{paymentAmount}} for all labor, professional services, materials, machinery, fixtures or tools furnished to {{customerName}} on the job of {{ownerName}} located at {{projectAddress}} through {{throughDate}} and does hereby release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures or tools to the job to the following extent: Progress payment for labor, professional services, materials, machinery, fixtures or tools furnished through {{throughDate}} only.",
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
			body: "On receipt by the undersigned of a check from {{maker}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures or tools to {{ownerName}} on the job of {{customerName}} located at {{projectAddress}}.",
			fields: [
				"maker",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"customerName",
				"projectAddress",
			],
		},
		unconditional_final: {
			title: "UNCONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 11 },
			body: "The undersigned has been paid in full for all labor, professional services, materials, machinery, fixtures or tools furnished to {{customerName}} on the job of {{ownerName}} located at {{projectAddress}} and does hereby waive and release any mechanic's lien, any state or federal statutory payment bond right, any common law payment bond right and any claim for payment to any person in the undersigned's position who has furnished labor, professional services, materials, machinery, fixtures or tools to the job, except for disputed claims for extra work in the amount of $0.00.",
			fields: ["customerName", "ownerName", "projectAddress"],
		},
	},
};
