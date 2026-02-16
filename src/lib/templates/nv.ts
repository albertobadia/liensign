import type { StateTemplates } from "./types";

export const NV: StateTemplates = {
	name: "Nevada",
	statute: "Nevada NRS 108.2457",
	lastVerified: "Feb 15, 2026",
	sourceUrl: "https://www.leg.state.nv.us/nrs/nrs-108.html#NRS108Sec2457",
	forms: {
		conditional_progress: {
			title: "CONDITIONAL WAIVER AND RELEASE UPON PROGRESS PAYMENT",
			body: "Upon receipt by the undersigned of a check from {{maker}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank upon which it is drawn, this document becomes effective to release and the undersigned shall be deemed to waive any notice of lien, any private or public lien, any bond right, any claim for payment and any rights under any similar ordinance, rule or statute related to payment rights that the undersigned has on the property of {{ownerName}} located at {{projectAddress}} to the following extent: {{jobDescription}} furnished through {{throughDate}}.",
			fields: [
				"maker",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
				"jobDescription",
				"throughDate",
			],
		},
		unconditional_progress: {
			title: "UNCONDITIONAL WAIVER AND RELEASE UPON PROGRESS PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 10 },
			body: "The undersigned has been paid and has received a progress payment in the sum of ${{paymentAmount}} for all labor, services, equipment and material furnished to the property or to {{customerName}} on the property of {{ownerName}} located at {{projectAddress}} through {{throughDate}} and does hereby release and the undersigned shall be deemed to waive any notice of lien, any private or public lien, any bond right, any claim for payment and any rights under any similar ordinance, rule or statute related to payment rights that the undersigned has on the property to the following extent: {{jobDescription}} furnished through {{throughDate}}.",
			fields: [
				"paymentAmount",
				"customerName",
				"ownerName",
				"projectAddress",
				"throughDate",
				"jobDescription",
			],
		},
		conditional_final: {
			title: "CONDITIONAL WAIVER AND RELEASE UPON FINAL PAYMENT",
			body: "Upon receipt by the undersigned of a check from {{maker}} in the sum of ${{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank upon which it is drawn, this document becomes effective to release and the undersigned shall be deemed to waive any notice of lien, any private or public lien, any bond right, any claim for payment and any rights under any similar ordinance, rule or statute related to payment rights that the undersigned has on the property of {{ownerName}} located at {{projectAddress}} relating to the following work: {{jobDescription}}.",
			fields: [
				"maker",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
				"jobDescription",
			],
		},
		unconditional_final: {
			title: "UNCONDITIONAL WAIVER AND RELEASE UPON FINAL PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 10 },
			body: "The undersigned has been paid in full for all labor, services, equipment and material furnished to the property or to {{customerName}} on the property of {{ownerName}} located at {{projectAddress}} and does hereby release and the undersigned shall be deemed to waive any notice of lien, any private or public lien, any bond right, any claim for payment and any rights under any similar ordinance, rule or statute related to payment rights that the undersigned has on the property relating to the following work: {{jobDescription}}, except for [disputed claims].",
			fields: ["customerName", "ownerName", "projectAddress", "jobDescription"],
		},
	},
};
