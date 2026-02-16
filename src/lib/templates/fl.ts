import type { StateTemplates } from "./types";

export const FL: StateTemplates = {
	name: "Florida",
	statute: "Florida Statutes § 713.20",
	lastVerified: "Feb 15, 2026",
	sourceUrl:
		"http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL=0700-0799/0713/Sections/0713.20.html",
	baseFontSize: 10,
	forms: {
		conditional_progress: {
			title: "WAIVER AND RELEASE OF LIEN UPON PROGRESS PAYMENT",
			body: "The undersigned lienor, in consideration of the sum of ${{paymentAmount}}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished through {{throughDate}} to {{customerName}} on the job of {{ownerName}} to the following property: {{projectAddress}}. This waiver and release does not cover any retention or labor, services, or materials furnished after the date specified. THIS WAIVER AND RELEASE IS CONDITIONAL AND EFFECTIVE ONLY UPON FULL AND ACTUAL RECEIPT OF PAYMENT AS AUTHORIZED BY S. 713.20(7), FLORIDA STATUTES.",
			fields: [
				"paymentAmount",
				"throughDate",
				"customerName",
				"ownerName",
				"projectAddress",
			],
		},
		unconditional_progress: {
			title: "WAIVER AND RELEASE OF LIEN UPON PROGRESS PAYMENT",
			body: "The undersigned lienor, in consideration of the sum of ${{paymentAmount}}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished through {{throughDate}} to {{customerName}} on the job of {{ownerName}} to the following property: {{projectAddress}}. This waiver and release does not cover any retention or labor, services, or materials furnished after the date specified.",
			fields: [
				"paymentAmount",
				"throughDate",
				"customerName",
				"ownerName",
				"projectAddress",
			],
		},
		conditional_final: {
			title: "WAIVER AND RELEASE OF LIEN UPON FINAL PAYMENT",
			body: "The undersigned lienor, in consideration of the final payment in the amount of ${{paymentAmount}}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished to {{customerName}} on the job of {{ownerName}} to the following described property: {{projectAddress}}. THIS WAIVER AND RELEASE IS CONDITIONAL AND EFFECTIVE ONLY UPON FULL AND ACTUAL RECEIPT OF PAYMENT AS AUTHORIZED BY S. 713.20(7), FLORIDA STATUTES.",
			fields: ["paymentAmount", "customerName", "ownerName", "projectAddress"],
		},
		unconditional_final: {
			title: "WAIVER AND RELEASE OF LIEN UPON FINAL PAYMENT",
			body: "The undersigned lienor, in consideration of the final payment in the amount of ${{paymentAmount}}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished to {{customerName}} on the job of {{ownerName}} to the following described property: {{projectAddress}}.",
			fields: ["paymentAmount", "customerName", "ownerName", "projectAddress"],
		},
	},
};
