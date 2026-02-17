import { Banknote, Building, FileText, User } from "lucide-react";
import type { WizardData } from "./schema";
import { StepContractor } from "./steps/StepContractor";
import { StepFinancials } from "./steps/StepFinancials";
import { StepProject } from "./steps/StepProject";
import { StepSignature } from "./steps/StepSignature";

export const STEPS = [
	{
		id: "contractor",
		title: "Contractor",
		icon: Building,
		component: StepContractor,
		validationFields: [
			"contractorName",
			"contractorAddress",
			"contractorPhone",
		] as Array<keyof WizardData>,
	},
	{
		id: "project",
		title: "Project",
		icon: User,
		component: StepProject,
		validationFields: [
			"projectName",
			"projectAddress",
			"projectState",
			"ownerName",
			"customerName",
		] as Array<keyof WizardData>,
	},
	{
		id: "financials",
		title: "Financials",
		icon: Banknote,
		component: StepFinancials,
		validationFields: ["waiverType", "paymentAmount", "throughDate"] as Array<
			keyof WizardData
		>,
	},
	{
		id: "signature",
		title: "Review",
		icon: FileText,
		component: StepSignature,
		validationFields: ["signature"] as Array<keyof WizardData>,
	},
];
