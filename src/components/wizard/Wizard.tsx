import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	ChevronLeft,
	ChevronRight,
	CircleCheckBig,
	Download,
	Eye,
	History,
	Loader2,
	Mail,
	Plus,
	User,
} from "lucide-react";
import { FormProvider } from "react-hook-form";
import { getProfile } from "../../lib/userStore";
import { cn } from "../../lib/utils";
import { STEPS } from "./config";
import { useWizard } from "./useWizard";

export function Wizard() {
	const {
		currentStep,
		isSubmitting,
		isComplete,
		methods,
		handleNext,
		handleBack,
		onPreview,
		onSubmit,
		onEmail,
		handleCreateAnother,
	} = useWizard(STEPS);

	const CurrentStepComponent = STEPS[currentStep].component;

	if (isComplete) {
		return (
			<div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
				<div className="p-8 sm:p-12 flex flex-col items-center text-center space-y-6">
					<div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
						<CircleCheckBig size={40} className="text-green-600" />
					</div>
					<div className="space-y-2">
						<h2 className="text-2xl font-bold text-slate-900 font-serif">
							Waiver Downloaded!
						</h2>
						<p className="text-slate-600 max-w-md">
							Your lien waiver has been generated and saved to your downloads
							folder.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						<button
							type="button"
							onClick={handleCreateAnother}
							className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
						>
							<Plus size={18} />
							Create Another
						</button>
						<a
							href="/history"
							className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
						>
							<History size={18} />
							View History
						</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={onSubmit}
				className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
			>
				<div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-6">
					<div className="flex items-center justify-between relative">
						<div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-slate-200 -z-0" />

						{STEPS.map((step, idx) => {
							const Icon = step.icon;
							const stepComplete = idx < currentStep;
							const isActive = idx === currentStep;

							return (
								<div
									key={step.id}
									className="flex flex-col items-center gap-2 relative z-10"
								>
									<div
										className={cn(
											"h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
											stepComplete ? "bg-green-500 text-white" : "",
											isActive
												? "bg-blue-600 text-white ring-4 ring-blue-100"
												: "",
											!stepComplete && !isActive
												? "bg-slate-200 text-slate-500"
												: "",
										)}
									>
										{stepComplete ? <Check size={20} /> : <Icon size={20} />}
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

				<div className="p-4 sm:p-8 min-h-[450px]">
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
				</div>

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

					{currentStep === STEPS.length - 1 ? (
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={onEmail}
								disabled={isSubmitting}
								className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
							>
								<Mail size={18} />
								Email
							</button>
							<button
								type="submit"
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
										<Download size={18} />
										Download
									</>
								)}
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={handleNext}
							disabled={isSubmitting}
							className={cn(
								"flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95",
								isSubmitting
									? "bg-slate-400 cursor-not-allowed text-white"
									: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
							)}
						>
							Continue
							<ChevronRight size={18} />
						</button>
					)}
				</div>
			</form>
		</FormProvider>
	);
}
