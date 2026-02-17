import { z } from "zod";
import { SUPPORTED_STATES } from "../../lib/templates";

export const wizardSchema = z
	.object({
		contractorName: z.string().min(2, "Contractor name is required"),
		contractorAddress: z.string().min(5, "Valid address is required"),
		contractorPhone: z.string().min(7, "Valid phone is required"),

		projectName: z.string().min(2, "Project name is required"),
		projectAddress: z.string().min(5, "Project address is required"),
		projectState: z.enum(SUPPORTED_STATES, {
			message: "State is required",
		}),
		ownerName: z.string().min(2, "Owner name is required"),
		customerName: z.string().min(2, "Customer name is required"),

		waiverType: z.enum([
			"conditional_progress",
			"unconditional_progress",
			"conditional_final",
			"unconditional_final",
		]),
		paymentAmount: z
			.string()
			.min(1, "Amount is required")
			.regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format (e.g. 1250.00)"),
		throughDate: z.string().min(1, "Date is required"),

		signature: z.string().min(1, "Signature is required"),

		jobNumber: z.string().optional(),
		maker: z.string().optional(),
		jobDescription: z.string().optional(),
		isDraft: z.boolean().default(false),
	})
	.superRefine((data, ctx) => {
		if (data.projectState === "TX" && !data.jobNumber) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Job Number is required for Texas",
				path: ["jobNumber"],
			});
		}

		if (
			(data.projectState === "TX" || data.projectState === "NV") &&
			!data.jobDescription
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Job Description is required for this state",
				path: ["jobDescription"],
			});
		}

		if (
			(data.projectState === "TX" ||
				data.projectState === "CA" ||
				data.projectState === "NV" ||
				data.projectState === "AZ") &&
			(data.waiverType === "conditional_progress" ||
				data.waiverType === "conditional_final") &&
			!data.maker
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Maker of check is required for conditional waivers in this state",
				path: ["maker"],
			});
		}
	});

export type WizardData = z.infer<typeof wizardSchema>;
