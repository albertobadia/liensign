import { useFormContext } from "react-hook-form";
import type { WizardData } from "../schema";

export function StepContractor() {
	const {
		register,
		formState: { errors },
	} = useFormContext<WizardData>();

	return (
		<div className="space-y-6">
			<div className="text-left">
				<h3 className="text-2xl font-bold text-slate-900 font-serif">
					Contractor Information
				</h3>
				<p className="text-slate-600 mt-1">
					Enter your company details as they appear on the contract.
				</p>
			</div>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="contractorName"
						className="block text-sm font-semibold text-slate-700 mb-1"
					>
						Company Name
					</label>
					<input
						id="contractorName"
						{...register("contractorName")}
						placeholder="e.g. Acme Construction LLC"
						className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
					{errors.contractorName && (
						<p className="text-red-500 text-xs mt-1">
							{errors.contractorName.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="contractorAddress"
						className="block text-sm font-semibold text-slate-700 mb-1"
					>
						Full Address
					</label>
					<input
						id="contractorAddress"
						{...register("contractorAddress")}
						placeholder="Street, City, State, Zip"
						className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
					{errors.contractorAddress && (
						<p className="text-red-500 text-xs mt-1">
							{errors.contractorAddress.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="contractorPhone"
						className="block text-sm font-semibold text-slate-700 mb-1"
					>
						Phone Number
					</label>
					<input
						id="contractorPhone"
						{...register("contractorPhone")}
						placeholder="(555) 000-0000"
						className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
					{errors.contractorPhone && (
						<p className="text-red-500 text-xs mt-1">
							{errors.contractorPhone.message}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
