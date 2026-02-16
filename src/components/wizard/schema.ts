import { z } from "zod";

export const wizardSchema = z.object({
	contractorName: z.string().min(2, "Contractor name is required"),
	contractorAddress: z.string().min(5, "Valid address is required"),
	contractorPhone: z.string().min(7, "Valid phone is required"),
	taxId: z
		.string()
		.transform((val) => val.replace(/\D/g, ""))
		.refine((val) => val.length === 9, {
			message: "Tax ID must be exactly 9 digits",
		}),

	projectName: z.string().min(2, "Project name is required"),
	projectAddress: z.string().min(5, "Project address is required"),
	projectState: z.enum(
		["TX", "CA", "FL", "GA", "MI", "NY", "AZ", "NV", "UT", "OTHER"],
		{
			message: "State is required",
		},
	),
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

	// Optional specialized fields for specific states
	jobNumber: z.string().optional(),
	maker: z.string().optional(),
	jobDescription: z.string().optional(),
});

export type WizardData = z.infer<typeof wizardSchema>;
