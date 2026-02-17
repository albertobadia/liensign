import { useFormContext } from "react-hook-form";
import { WAIVER_TEMPLATES } from "../../../lib/templates";
import { cn } from "../../../lib/utils";
import type { WizardData } from "../schema";

const STATES = Object.entries(WAIVER_TEMPLATES).map(([id, data]) => ({
	id,
	name: data.name,
	statute: data.statute,
}));

export function StepProject() {
	const {
		register,
		formState: { errors },
		watch,
	} = useFormContext<WizardData>();
	const selectedState = watch("projectState");

	return (
		<div className="space-y-6">
			<div className="text-left">
				<h3 className="text-2xl font-bold text-slate-900 font-serif">
					Project Information
				</h3>
				<p className="text-slate-600 mt-1">
					Details about the specific property or job site.
				</p>
			</div>

			<div className="space-y-6">
				<div>
					<span className="block text-sm font-semibold text-slate-700 mb-3">
						Project State (Governing Law)
					</span>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
						{STATES.map((state) => (
							<label
								key={state.id}
								className={cn(
									"relative flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all",
									selectedState === state.id
										? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
										: "border-slate-100 bg-slate-50 hover:border-slate-300",
								)}
							>
								<input
									id={`state-${state.id}`}
									type="radio"
									value={state.id}
									{...register("projectState")}
									className="sr-only"
								/>
								<span
									className={cn(
										"font-bold text-lg",
										selectedState === state.id
											? "text-blue-700"
											: "text-slate-600",
									)}
								>
									{state.id}
								</span>
								<span className="text-[10px] text-slate-400 font-medium uppercase truncate w-full text-center">
									{state.name}
								</span>
							</label>
						))}
					</div>
					{errors.projectState && (
						<p className="text-red-500 text-xs mt-2 font-bold">
							{errors.projectState.message}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="md:col-span-2">
						<label
							htmlFor="projectName"
							className="block text-sm font-semibold text-slate-700 mb-1"
						>
							Project Name / Description
						</label>
						<input
							id="projectName"
							{...register("projectName")}
							placeholder="e.g. Smith Residence Renovation"
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						{errors.projectName && (
							<p className="text-red-500 text-xs mt-1">
								{errors.projectName.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="projectAddress"
							className="block text-sm font-semibold text-slate-700 mb-1"
						>
							Project Address
						</label>
						<input
							id="projectAddress"
							{...register("projectAddress")}
							placeholder="Job site address"
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						{errors.projectAddress && (
							<p className="text-red-500 text-xs mt-1">
								{errors.projectAddress.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="ownerName"
							className="block text-sm font-semibold text-slate-700 mb-1"
						>
							Owner Name
						</label>
						<input
							id="ownerName"
							{...register("ownerName")}
							placeholder="Property Owner"
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						{errors.ownerName && (
							<p className="text-red-500 text-xs mt-1">
								{errors.ownerName.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="customerName"
							className="block text-sm font-semibold text-slate-700 mb-1"
						>
							Customer Name (Hired By)
						</label>
						<input
							id="customerName"
							{...register("customerName")}
							placeholder="The entity that hired you"
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						{errors.customerName && (
							<p className="text-red-500 text-xs mt-1">
								{errors.customerName.message}
							</p>
						)}
					</div>

					<div className="md:col-span-2">
						<label
							htmlFor="jobNumber"
							className="block text-sm font-semibold text-slate-700 mb-1"
						>
							Job / Project Number{" "}
							{selectedState === "TX" ? "(Required)" : "(Optional)"}
						</label>
						<input
							id="jobNumber"
							{...register("jobNumber")}
							placeholder="e.g. 2024-001"
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						{errors.jobNumber && (
							<p className="text-red-500 text-xs mt-1">
								{errors.jobNumber.message}
							</p>
						)}
					</div>

					{(selectedState === "TX" || selectedState === "NV") && (
						<div className="md:col-span-2">
							<label
								htmlFor="jobDescription"
								className="block text-sm font-semibold text-slate-700 mb-1"
							>
								Job Description (Statutory Requirement)
							</label>
							<textarea
								id="jobDescription"
								{...register("jobDescription")}
								placeholder="Describe the labor or materials furnished..."
								className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								rows={2}
							/>
							{errors.jobDescription && (
								<p className="text-red-500 text-xs mt-1">
									{errors.jobDescription.message}
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
