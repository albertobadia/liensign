import type { StateTemplates } from "./types";

export const CA: StateTemplates = {
	name: "California",
	statute: "California Civil Code § 8132-8138",
	lastVerified: "Feb 15, 2026",
	sourceUrl:
		"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=8132",
	forms: {
		conditional_progress: {
			title: "CONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.",
			body: `Identifying Information
Name of Claimant: {{contractorName}}
Name of Customer: {{customerName}}
Job Location: {{projectAddress}}
Owner: {{ownerName}}
Through Date: {{throughDate}}

Conditional Waiver and Release
This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for labor and service provided, and equipment and material delivered, to the customer on this job through the Through Date of this document.Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below.This document is effective only on the claimant's receipt of payment from the financial institution on which the following check is drawn:
Maker of Check: {{maker}}
Amount of Check: \${{paymentAmount}}
Check Payable to: {{contractorName}}

Exceptions
This document does not affect any of the following:
(1) Retentions.
(2) Extras for which the claimant has not received payment.
(3) The following progress payments for which the claimant has previously given a conditional waiver and release but has not received payment:
Date(s) of waiver and release:
Amount(s) of unpaid progress payment(s): $
(4) Contract rights, including (A) a right based on rescission, abandonment, or breach of contract, and (B) the right to recover compensation for work not compensated by the payment.`,
			fields: [
				"contractorName",
				"customerName",
				"projectAddress",
				"ownerName",
				"throughDate",
				"maker",
				"paymentAmount",
			],
		},
		unconditional_progress: {
			title: "UNCONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			notice:
				"NOTICE TO CLAIMANT: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 11 },
			body: `Identifying Information
Name of Claimant: {{contractorName}}
Name of Customer: {{customerName}}
Job Location: {{projectAddress}}
Owner: {{ownerName}}
Through Date: {{throughDate}}

Unconditional Waiver and Release
This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for labor and service provided, and equipment and material delivered, to the customer on this job through the Through Date of this document.Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below.The claimant has received the following progress payment: \${{paymentAmount}}.

Exceptions
This document does not affect any of the following:
(1) Retentions.
(2) Extras for which the claimant has not received payment.
(3) Contract rights, including(A) a right based on rescission, abandonment, or breach of contract, and(B) the right to recover compensation for work not compensated by the payment.`,
			fields: [
				"contractorName",
				"customerName",
				"projectAddress",
				"ownerName",
				"throughDate",
				"paymentAmount",
			],
		},
		conditional_final: {
			title: "CONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.",
			body: `Identifying Information
Name of Claimant: {{contractorName}}
Name of Customer: {{customerName}}
Job Location: {{projectAddress}}
Owner: {{ownerName}}

Conditional Waiver and Release
This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for all labor and service provided, and equipment and material delivered, to the customer on this job.Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below.This document is effective only on the claimant's receipt of payment from the financial institution on which the following check is drawn:
Maker of Check: {{maker}}
Amount of Check: \${{paymentAmount}}
Check Payable to: {{contractorName}}

Exceptions
This document does not affect any of the following:
(1) Retentions.
(2) Extras for which the claimant has not received payment.
(3) Contract rights, including(A) a right based on rescission, abandonment, or breach of contract, and(B) the right to recover compensation for work not compensated by the payment.`,
			fields: [
				"contractorName",
				"customerName",
				"projectAddress",
				"ownerName",
				"maker",
				"paymentAmount",
			],
		},
		unconditional_final: {
			title: "UNCONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT",
			notice:
				"NOTICE TO CLAIMANT: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 11 },
			body: `Identifying Information
Name of Claimant: {{contractorName}}
Name of Customer: {{customerName}}
Job Location: {{projectAddress}}
Owner: {{ownerName}}

Unconditional Waiver and Release
This document waives and releases lien, stop payment notice, and payment bond rights the claimant has for all labor and service provided, and equipment and material delivered, to the customer on this job.Rights based upon labor or service provided, or equipment or material delivered, pursuant to a written change order that has been fully executed by the parties prior to the date that this document is signed by the claimant, are waived and released by this document, unless listed as an Exception below.The claimant has been paid in full.

	Exceptions
This document does not affect any of the following:
(1) Retentions.
(2) Extras for which the claimant has not received payment.
(3) Contract rights, including(A) a right based on rescission, abandonment, or breach of contract, and(B) the right to recover compensation for work not compensated by the payment.`,
			fields: ["contractorName", "customerName", "projectAddress", "ownerName"],
		},
	},
};
