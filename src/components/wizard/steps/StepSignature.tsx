import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import type { WizardData } from "../schema";

export function StepSignature() {
	const { watch, setValue, getValues } = useFormContext<WizardData>();
	const sigCanvas = useRef<SignatureCanvas>(null);

	const formData = watch();

	useEffect(() => {
		const currentSignature = getValues("signature");
		if (currentSignature && sigCanvas.current) {
			sigCanvas.current.fromDataURL(currentSignature);
		}
	}, [getValues]);

	const clearSignature = () => {
		sigCanvas.current?.clear();
		setValue("signature", "");
	};

	const saveSignature = () => {
		if (sigCanvas.current) {
			const dataUrl = sigCanvas.current
				.getTrimmedCanvas()
				.toDataURL("image/png");
			setValue("signature", dataUrl);
		}
	};

	return (
		<div className="space-y-8 text-left">
			<div className="text-left">
				<h3 className="text-2xl font-bold text-slate-900 font-serif">
					Review & Sign
				</h3>
				<p className="text-slate-600 mt-1">
					Check the details below and provide your digital signature.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 relative overflow-hidden">
					<div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-widest uppercase">
						{formData.projectState} Law
					</div>
					<div>
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
							Contractor
						</span>
						<p className="text-sm font-semibold text-slate-800">
							{formData.contractorName}
						</p>
						<p className="text-xs text-slate-500">
							{formData.contractorAddress}
						</p>
						<p className="text-xs text-slate-500">{formData.contractorPhone}</p>
					</div>
					<div className="pt-2 border-t border-slate-200">
						<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
							Project & Owner
						</span>
						<p className="text-sm font-semibold text-slate-800">
							{formData.projectName}
						</p>
						<p className="text-xs text-slate-500">{formData.projectAddress}</p>
						<p className="text-xs text-slate-500 mt-1">
							<span className="font-medium">Owner:</span> {formData.ownerName}
						</p>
					</div>
				</div>

				<div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-4">
					<div>
						<span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
							Waiver Type
						</span>
						<p className="text-sm font-bold text-blue-900 uppercase">
							{formData.waiverType?.replace(/_/g, " ")}
						</p>
					</div>
					<div className="pt-2 border-t border-blue-100">
						<span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
							Payment Details
						</span>
						<p className="text-2xl font-black text-blue-600">
							${formData.paymentAmount}
						</p>
						<p className="text-xs text-blue-700 mt-1">
							<span className="font-medium">Through Date:</span>{" "}
							{formData.throughDate}
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<label
						htmlFor="signature-input"
						className="block text-sm font-semibold text-slate-700"
					>
						Digital Signature
					</label>
					<button
						type="button"
						onClick={clearSignature}
						className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-bold"
					>
						<Trash2 size={14} />
						Clear
					</button>
				</div>
				<div className="border-2 border-slate-200 rounded-2xl bg-white overflow-hidden touch-none h-40 relative group">
					<SignatureCanvas
						ref={sigCanvas}
						onEnd={saveSignature}
						penColor="#1e293b"
						canvasProps={{
							id: "signature-input",
							className: "w-full h-full cursor-crosshair",
							title: "Signature Pad",
						}}
					/>
					<div className="absolute bottom-2 right-4 pointer-events-none text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:hidden transition-opacity">
						Sign Here
					</div>
				</div>
			</div>

			<p className="text-[10px] text-slate-400 text-center italic">
				By signing, you acknowledge the accuracy of the provided information and
				compliance with {formData.projectState} statutory requirements.
			</p>
		</div>
	);
}
