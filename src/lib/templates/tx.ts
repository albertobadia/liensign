import type { StateTemplates } from "./types";

export const TX: StateTemplates = {
	name: "Texas",
	statute: "Texas Property Code § 53.284",
	lastVerified: "Feb 15, 2026",
	sourceUrl: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.53.htm",
	forms: {
		conditional_progress: {
			title: "CONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			body: `Project: {{projectName}}
Job No.: {{jobNumber}}
 
On receipt by the signer of this document of a check from {{maker}} in the sum of $ {{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic's lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any claim for payment, and any rights under any similar ordinance, rule, or statute related to claim or payment rights for persons in the signer's position that the signer has on the property of {{ownerName}} located at {{projectAddress}} to the following extent: {{jobDescription}}.
 
This release covers a progress payment for all labor, services, equipment, or materials furnished to the property or to {{customerName}} as indicated in the attached statement(s) or progress payment request(s), except for unpaid retention, pending modifications and changes, or other items furnished.
 
Before any recipient of this document relies on this document, the recipient should verify evidence of payment to the signer.
 
The signer warrants that the signer has already paid or will use the funds received from this progress payment to promptly pay in full all of the signer's laborers, subcontractors, materialmen, and suppliers for all work, materials, equipment, or services provided for or to the above referenced project in regard to the attached statement(s) or progress payment request(s).`,
			fields: [
				"projectName",
				"jobNumber",
				"maker",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
				"jobDescription",
				"customerName",
			],
		},
		unconditional_progress: {
			title: "UNCONDITIONAL WAIVER AND RELEASE ON PROGRESS PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. IT IS PROHIBITED FOR A PERSON TO REQUIRE YOU TO SIGN THIS DOCUMENT IF YOU HAVE NOT BEEN PAID THE PAYMENT AMOUNT SET FORTH BELOW. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 11 },
			body: `Project: {{projectName}}
Job No.: {{jobNumber}}

The signer of this document has been paid and has received a progress payment in the sum of $ {{paymentAmount}} for all labor, services, equipment, or materials furnished to the property or to {{customerName}} as indicated in the attached statement(s) or progress payment request(s), except for unpaid retention, pending modifications and changes, or other items furnished. The signer warrants that the signer has already paid or will use the funds received from this progress payment to promptly pay in full all of the signer's laborers, subcontractors, materialmen, and suppliers for all work, materials, equipment, or services provided for or to the above referenced project in regard to the attached statement(s) or progress payment request(s).

The signer waives and releases any mechanic's lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any claim for payment, and any rights under any similar ordinance, rule, or statute related to claim or payment rights for persons in the signer's position that the signer has on the property of {{ownerName}} located at {{projectAddress}} to the following extent: {{jobDescription}}.`,
			fields: [
				"projectName",
				"jobNumber",
				"paymentAmount",
				"customerName",
				"ownerName",
				"projectAddress",
				"jobDescription",
			],
		},
		conditional_final: {
			title: "CONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT",
			body: `Project: {{projectName}}
Job No.: {{jobNumber}}

On receipt by the signer of this document of a check from {{maker}} in the sum of $ {{paymentAmount}} payable to {{contractorName}} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document becomes effective to release any mechanic's lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any claim for payment, and any rights under any similar ordinance, rule, or statute related to claim or payment rights for persons in the signer's position that the signer has on the property of {{ownerName}} located at {{projectAddress}} to the following extent: {{jobDescription}}.

This release covers the final payment to the signer for all labor, services, equipment, or materials furnished to the property or to {{customerName}}, except for unpaid retention, pending modifications and changes, or other items furnished.

Before any recipient of this document relies on this document, the recipient should verify evidence of payment to the signer.

The signer warrants that the signer has already paid or will use the funds received from this final payment to promptly pay in full all of the signer's laborers, subcontractors, materialmen, and suppliers for all work, materials, equipment, or services provided for or to the above referenced project in regard to the attached statement(s) or progress payment request(s).`,
			fields: [
				"projectName",
				"jobNumber",
				"maker",
				"paymentAmount",
				"contractorName",
				"ownerName",
				"projectAddress",
				"customerName",
				"jobDescription",
			],
		},
		unconditional_final: {
			title: "UNCONDITIONAL WAIVER AND RELEASE ON FINAL PAYMENT",
			notice:
				"NOTICE: THIS DOCUMENT WAIVES RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. IT IS PROHIBITED FOR A PERSON TO REQUIRE YOU TO SIGN THIS DOCUMENT IF YOU HAVE NOT BEEN PAID THE PAYMENT AMOUNT SET FORTH BELOW. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL RELEASE FORM.",
			noticeStyle: { isBold: true, fontSize: 11 },
			body: `Project: {{projectName}}
Job No.: {{jobNumber}}

The signer of this document has been paid in full for all labor, services, equipment, or materials furnished to the property or to {{customerName}} as indicated in the attached statement(s) or progress payment request(s), except for unpaid retention, pending modifications and changes, or other items furnished. The signer warrants that the signer has already paid or will use the funds received from this final payment to promptly pay in full all of the signer's laborers, subcontractors, materialmen, and suppliers for all work, materials, equipment, or services provided for or to the above referenced project in regard to the attached statement(s) or progress payment request(s).

The signer waives and releases any mechanic's lien right, any right arising from a payment bond that complies with a state or federal statute, any common law payment bond right, any claim for payment, and any rights under any similar ordinance, rule, or statute related to claim or payment rights for persons in the signer's position that the signer has on the property of {{ownerName}} located at {{projectAddress}} to the following extent: {{jobDescription}}.`,
			fields: [
				"projectName",
				"jobNumber",
				"customerName",
				"ownerName",
				"projectAddress",
				"jobDescription",
			],
		},
	},
};
