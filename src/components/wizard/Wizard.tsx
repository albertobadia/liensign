import { zodResolver } from "@hookform/resolvers/zod";

import { AnimatePresence, motion } from "framer-motion";
import {
	Banknote,
	Building,
	Check,
	ChevronLeft,
	ChevronRight,
	Eye,
	FileText,
	Loader2,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateWaiverPDF } from "../../lib/pdf";
import { SUPPORTED_STATES } from "../../lib/templates";
import { getProfile } from "../../lib/userStore";
import { cn } from "../../lib/utils";
import { type WizardData, wizardSchema } from "./schema";
import { StepContractor } from "./steps/StepContractor";
import { StepFinancials } from "./steps/StepFinancials";
import { StepProject } from "./steps/StepProject";
import { StepSignature } from "./steps/StepSignature";

const STEPS = [
	{
		id: "contractor",
		title: "Contractor",
		icon: Building,
		component: StepContractor,
	},
	{ id: "project", title: "Project", icon: User, component: StepProject },
	{
		id: "details",
		title: "Financials",
		icon: Banknote,
		component: StepFinancials,
	},
	{
		id: "signature",
		title: "Review",
		icon: FileText,
		component: StepSignature,
	},
];

export function Wizard() {
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const methods = useForm<WizardData>({
		// @ts-expect-error: Zod 4 compatibility with hookform resolvers v3/v5 metadata check
		resolver: zodResolver(wizardSchema),
		defaultValues: {
			waiverType: "conditional_progress",
		},
		mode: "onChange",
	});

	const { trigger, handleSubmit, setValue } = methods;

	useEffect(() => {
		const profile = getProfile();
		if (profile) {
			setValue("contractorName", profile.contractorName);
			setValue("contractorAddress", profile.contractorAddress);
			setValue("contractorPhone", profile.contractorPhone);
			setValue("signature", profile.signature);
		}

		const params = new URLSearchParams(window.location.search);
		const state = params.get("state")?.toUpperCase();
		const type = params.get("type");

		if (state && SUPPORTED_STATES.includes(state)) {
			setValue("projectState", state as WizardData["projectState"]);
		}

		if (
			type &&
			[
				"conditional_progress",
				"unconditional_progress",
				"conditional_final",
				"unconditional_final",
			].includes(type)
		) {
			setValue("waiverType", type as WizardData["waiverType"]);
		}
	}, [setValue]);

	const handleNext = async () => {
		const fields = getFieldsForStep(currentStep);
		const isStepValid = await trigger(fields as Array<keyof WizardData>);

		if (isStepValid && currentStep < STEPS.length - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const getFieldsForStep = (step: number): string[] => {
		const fields: Record<number, string[]> = {
			0: ["contractorName", "contractorAddress", "contractorPhone"],
			1: ["projectName", "projectAddress", "projectState", "ownerName"],
			2: ["waiverType", "paymentAmount", "throughDate"],
			3: ["signature"],
		};
		return fields[step] || [];
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const onPreview = async () => {
		const data = methods.getValues();
		const isStepValid = await trigger();

		if (!isStepValid) {
			toast.error("Please fix errors before previewing.");
			return;
		}

		if (!data.signature) {
			toast.error("Please sign the document before previewing.");
			return;
		}

		setIsSubmitting(true);
		try {
			const pdfBytes = await generateWaiverPDF(
				data.projectState,
				data.waiverType,
				data,
				data.signature,
			);

			const blob = new Blob([pdfBytes as BlobPart], {
				type: "application/pdf",
			});
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank");
			toast.success("Document preview opened in a new tab.");
		} catch (error: unknown) {
			console.error("Preview error:", error);
			toast.error("Failed to generate preview.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmit = async (data: WizardData) => {
		setIsSubmitting(true);

		try {
			const pdfBytes = await generateWaiverPDF(
				data.projectState,
				data.waiverType,
				data,
				data.signature,
			);

			const blob = new Blob([pdfBytes as BlobPart], {
				type: "application/pdf",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `LienWaiver-${data.projectName.replace(/\s+/g, "-")}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast.success("Success! Your waiver has been generated and downloaded.");
		} catch (error: unknown) {
			console.error("Generation error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to generate document";
			toast.error(`Error: ${errorMessage}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const CurrentStepComponent = STEPS[currentStep].component;

	return (
		<FormProvider {...methods}>
			<div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
				<div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-6">
					<div className="flex items-center justify-between relative">
						<div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-slate-200 -z-0" />

						{STEPS.map((step, idx) => {
							const Icon = step.icon;
							const isComplete = idx < currentStep;
							const isActive = idx === currentStep;

							return (
								<div
									key={step.id}
									className="flex flex-col items-center gap-2 relative z-10"
								>
									<div
										className={cn(
											"h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
											isComplete ? "bg-green-500 text-white" : "",
											isActive
												? "bg-blue-600 text-white ring-4 ring-blue-100"
												: "",
											!isComplete && !isActive
												? "bg-slate-200 text-slate-500"
												: "",
										)}
									>
										{isComplete ? <Check size={20} /> : <Icon size={20} />}
									</div>
									<span
										className={cn(
											"text-[10px] sm:text-xs font-bold uppercase tracking-wider",
											isActive ? "text-blue-600" : "text-slate-400",
										)}
									>
										{step.title}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-4 sm:p-8 min-h-[450px]"
				>
					{!getProfile() && currentStep === 0 && (
						<div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
							<div className="mt-1 p-2 bg-blue-600 rounded-lg text-white">
								<User size={16} />
							</div>
							<div>
								<h4 className="text-sm font-bold text-blue-900">
									Pro Tip: Save your info!
								</h4>
								<p className="text-xs text-blue-700 mt-1 leading-relaxed">
									You can save your contractor details and signature in{" "}
									<a
										href="/my-info"
										className="underline font-bold hover:text-blue-900"
									>
										My Info
									</a>{" "}
									to skip this step in the future.
								</p>
							</div>
						</div>
					)}
					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3 }}
						>
							<CurrentStepComponent />
						</motion.div>
					</AnimatePresence>
				</form>

				<div className="bg-slate-50 border-t border-slate-200 px-8 py-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{currentStep === STEPS.length - 1 && (
							<button
								type="button"
								onClick={onPreview}
								disabled={isSubmitting}
								className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50"
							>
								<Eye size={18} />
								Preview
							</button>
						)}
						<button
							type="button"
							onClick={handleBack}
							disabled={currentStep === 0 || isSubmitting}
							className={cn(
								"flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
								currentStep === 0 || isSubmitting
									? "text-slate-300 pointer-events-none"
									: "text-slate-600 hover:bg-slate-100",
							)}
						>
							<ChevronLeft size={18} />
							Back
						</button>
					</div>

					<button
						type="button"
						onClick={
							currentStep === STEPS.length - 1
								? handleSubmit(onSubmit)
								: handleNext
						}
						disabled={isSubmitting}
						className={cn(
							"flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95",
							isSubmitting
								? "bg-slate-400 cursor-not-allowed text-white"
								: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
						)}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="animate-spin" size={18} />
								Generating...
							</>
						) : (
							<>
								{currentStep === STEPS.length - 1
									? "Finish & Generate"
									: "Continue"}
								<ChevronRight size={18} />
							</>
						)}
					</button>
				</div>
			</div>
		</FormProvider>
	);
}
