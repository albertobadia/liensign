import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateWaiverPDF } from "../../lib/pdf";
import { SUPPORTED_STATES } from "../../lib/templates";
import { getProfile } from "../../lib/userStore";
import { sanitizeFilename } from "../../lib/utils";
import { getWaiver, saveWaiver, updateWaiver } from "../../lib/waiverHistory";
import type { STEPS } from "./config";
import { type WizardData, wizardSchema } from "./schema";

export function useWizard(steps: typeof STEPS) {
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	const methods = useForm<WizardData>({
		resolver: zodResolver(wizardSchema),
		defaultValues: {
			waiverType: "conditional_progress",
			signatureOffsetX: 0,
			signatureOffsetY: 0,
			signatureScale: 1,
			signatureRotation: 0,
		},
		mode: "onChange",
	});

	const { trigger, handleSubmit, setValue, getValues, reset } = methods;

	useEffect(() => {
		const initForm = async () => {
			const params = new URLSearchParams(window.location.search);
			const editId = params.get("edit");
			const state = params.get("state")?.toUpperCase();
			const type = params.get("type");

			if (editId) {
				const record = await getWaiver(editId);
				if (record) {
					setEditingId(editId);
					for (const [key, value] of Object.entries(record.data)) {
						setValue(key as keyof WizardData, value);
					}
					return;
				}
			}

			const profile = getProfile();
			if (profile) {
				setValue("contractorName", profile.contractorName);
				setValue("contractorAddress", profile.contractorAddress);
				setValue("contractorPhone", profile.contractorPhone);
				setValue("signature", profile.signature);
			}

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
		};

		initForm();
	}, [setValue]);

	const handleNext = async () => {
		const fields = steps[currentStep].validationFields;
		const isStepValid = await trigger(fields);

		if (isStepValid && currentStep < steps.length - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const onPreview = async () => {
		const data = getValues();
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
		const toastId = toast.loading("Generating preview...");
		try {
			const pdfBytes = await generateWaiverPDF(
				data.projectState,
				data.waiverType,
				data,
				data.signature,
				data.isDraft ? "DRAFT" : undefined,
			);

			const blob = new Blob([pdfBytes as BlobPart], {
				type: "application/pdf",
			});
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank");
			toast.success("Document preview opened in a new tab.", { id: toastId });
		} catch (error: unknown) {
			console.error("Preview error:", error);
			toast.error("Failed to generate preview.", { id: toastId });
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFormSubmit = async (data: WizardData) => {
		setIsSubmitting(true);
		const toastId = toast.loading("Generating and downloading waiver...");

		try {
			const pdfBytes = await generateWaiverPDF(
				data.projectState,
				data.waiverType,
				data,
				data.signature,
				data.isDraft ? "DRAFT" : undefined,
			);

			const blob = new Blob([pdfBytes as BlobPart], {
				type: "application/pdf",
			});
			const url = URL.createObjectURL(blob);
			const fileName = `LienWaiver-${sanitizeFilename(data.projectName)}.pdf`;
			const link = document.createElement("a");
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			if (editingId) {
				await updateWaiver(editingId, data);
			} else {
				await saveWaiver(data);
			}
			setIsComplete(true);
			toast.success("Waiver generated successfully!", { id: toastId });
		} catch (error: unknown) {
			console.error("Generation error:", error);
			toast.error("Failed to generate document.", { id: toastId });
		} finally {
			setIsSubmitting(false);
		}
	};

	const onEmail = async () => {
		const data = getValues();
		const isStepValid = await trigger();
		if (!isStepValid) {
			toast.error("Please fix errors before sending.");
			return;
		}

		if (!data.signature) {
			toast.error("Please sign the document before sending.");
			return;
		}

		setIsSubmitting(true);
		const toastId = toast.loading("Preparing document for sharing...");

		try {
			const pdfBytes = await generateWaiverPDF(
				data.projectState,
				data.waiverType,
				data,
				data.signature,
				data.isDraft ? "DRAFT" : undefined,
			);

			const fileName = `LienWaiver-${sanitizeFilename(data.projectName)}.pdf`;
			const file = new File([pdfBytes as BlobPart], fileName, {
				type: "application/pdf",
			});

			const profile = getProfile();
			const defaultTemplate = `Hi,\n\nPlease find attached the lien waiver for ${data.projectName}.\n\nBest regards,\n${data.contractorName}`;
			const template = profile?.emailTemplate || defaultTemplate;

			if (
				navigator.share &&
				navigator.canShare &&
				navigator.canShare({ files: [file] })
			) {
				await navigator.share({
					files: [file],
					title: `Lien Waiver - ${data.projectName}`,
					text: template,
				});
				toast.success("Share menu opened!", { id: toastId });
			} else {
				const subject = encodeURIComponent(`Lien Waiver - ${data.projectName}`);
				const body = encodeURIComponent(template);
				window.location.href = `mailto:?subject=${subject}&body=${body}`;
				toast.warning(
					"Your browser doesn't support direct attachments. Opening email client with message only.",
					{ id: toastId, duration: 6000 },
				);
			}

			if (editingId) {
				await updateWaiver(editingId, data);
			} else {
				await saveWaiver(data);
			}
		} catch (error: unknown) {
			console.error("Sharing error:", error);
			toast.error("Failed to prepare document for sharing.", { id: toastId });
		} finally {
			setIsSubmitting(false);
		}
	};

	const onInvalid = () => {
		toast.error("Please fix errors in previous steps before continuing.");
	};

	const handleCreateAnother = () => {
		reset({ waiverType: "conditional_progress" });
		setCurrentStep(0);
		setIsComplete(false);
	};

	return {
		currentStep,
		isSubmitting,
		isComplete,
		methods,
		handleNext,
		handleBack,
		onPreview,
		onSubmit: handleSubmit(handleFormSubmit, onInvalid),
		onEmail,
		handleCreateAnother,
	};
}
