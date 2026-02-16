import { useFormContext } from "react-hook-form";
import type { WizardData } from "../schema";

const WAIVER_TYPES = [
	{
		id: "conditional_progress",
		label: "Conditional Progress",
		desc: "For work-in-progress payments, conditioned on funds clearing.",
	},
	{
		id: "unconditional_progress",
		label: "Unconditional Progress",
		desc: "For work-in-progress payments already received.",
	},
	{
		id: "conditional_final",
		label: "Conditional Final",
		desc: "For the final payment of the project, conditioned on clearing.",
	},
	{
		id: "unconditional_final",
		label: "Unconditional Final",
		desc: "The project is fully paid and finished.",
	},
];

export function StepFinancials() {
	const {
		register,
		formState: { errors },
		watch,
	} = useFormContext<WizardData>();
	const projectState = watch("projectState");
	const waiverType = watch("waiverType");

	return (
		<div className="space-y-6">
			<div className="text-left">
				<h3 className="text-2xl font-bold text-slate-900 font-serif">
					Financial Details
				</h3>
				<p className="text-slate-600 mt-1">
					Select the waiver type and enter the payment terms.
				</p>
			</div>
			{projectState === "NY" && (
				<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
					<div className="flex">
						<div className="ml-3">
							<p className="text-sm text-blue-700">
								<span className="font-bold">Lien Law § 34 Compliance:</span> We
								automatically include the required clauses to ensure your waiver
								is valid in New York (conditioned on receipt of funds).
							</p>
						</div>
					</div>
				</div>
			)}
			{projectState === "OTHER" && (
				<div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r-lg">
					<div className="flex">
						<div className="ml-3">
							<p className="text-sm text-amber-700">
								<span className="font-bold">Recommendation:</span> For states
								without statutory forms, we recommend using{" "}
								<strong>Conditional</strong> waivers to avoid waiving rights
								before payment.
							</p>
						</div>
					</div>
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{WAIVER_TYPES.map((type) => (
					<label
						key={type.id}
						className="relative flex flex-col p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50"
					>
						<input
							id={`type-${type.id}`}
							type="radio"
							value={type.id}
							{...register("waiverType")}
							className="absolute right-4 top-4 h-4 w-4 text-blue-600 focus:ring-blue-500"
						/>
						<span className="font-bold text-slate-900 pr-8">{type.label}</span>
						<span className="text-xs text-slate-500 mt-1">{type.desc}</span>
					</label>
				))}
			</div>
			{errors.waiverType && (
				<p className="text-red-500 text-xs">{errors.waiverType.message}</p>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label
						htmlFor="paymentAmount"
						className="block text-sm font-semibold text-slate-700 mb-1"
					>
						Payment Amount ($)
					</label>
					<input
						id="paymentAmount"
						{...register("paymentAmount")}
						type="text"
						placeholder="0.00"
						className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
					{errors.paymentAmount && (
						<p className="text-red-500 text-xs mt-1">
							{errors.paymentAmount.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="throughDate"
						className="block text-sm font-semibold text-slate-700 mb-1"
					>
						Through Date
					</label>
					<input
						id="throughDate"
						{...register("throughDate")}
						type="date"
						className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
					{errors.throughDate && (
						<p className="text-red-500 text-xs mt-1">
							{errors.throughDate.message}
						</p>
					)}
				</div>
			</div>

			{/* Statutory Specific Field: Maker of Check (Required for Conditional in some states) */}
			{(projectState === "CA" ||
				projectState === "AZ" ||
				projectState === "NV" ||
				projectState === "TX") &&
				(waiverType === "conditional_progress" ||
					waiverType === "conditional_final") && (
					<div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
						<label
							htmlFor="maker"
							className="block text-sm font-semibold text-slate-700 mb-1"
						>
							Maker of Check (Person/Entity writing the check)
						</label>
						<input
							id="maker"
							{...register("maker")}
							placeholder="Full Name / Company"
							className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						<p className="text-[10px] text-slate-400 mt-2 italic">
							* Required or recommended for statutory compliance in conditional
							waivers for this state.
						</p>
					</div>
				)}
		</div>
	);
}
