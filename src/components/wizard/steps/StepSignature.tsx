import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import type { WizardData } from "../schema";

export function StepSignature() {
	const { watch, setValue } = useFormContext<WizardData>();
	const sigCanvas = useRef<SignatureCanvas>(null);

	const formData = watch();

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
			<div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
				{/* State Badge Overlay */}
				<div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl text-[10px] font-bold tracking-widest uppercase">
					{formData.projectState} Law
				</div>

				<div className="space-y-1">
					<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
						Contractor
					</span>
					<p className="text-sm font-semibold text-slate-800">
						{formData.contractorName}
					</p>
					<p className="text-xs text-slate-500">{formData.contractorAddress}</p>
				</div>
				<div className="space-y-1">
					<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
						Project
					</span>
					<p className="text-sm font-semibold text-slate-800">
						{formData.projectName}
					</p>
					<p className="text-xs text-slate-500 truncate">
						{formData.projectAddress}
					</p>
				</div>
				<div className="space-y-1">
					<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
						Payment
					</span>
					<p className="text-lg font-bold text-blue-600">
						${formData.paymentAmount}
					</p>
				</div>
				<div className="space-y-1">
					<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
						Type
					</span>
					<p className="text-sm font-semibold text-slate-800 uppercase">
						{formData.waiverType?.replace("_", " ")}
					</p>
				</div>
			</div>
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
			<div className="border-2 border-slate-200 rounded-2xl bg-white overflow-hidden touch-none h-48 relative">
				<SignatureCanvas
					ref={sigCanvas}
					onEnd={saveSignature}
					penColor="#1e293b"
					canvasProps={{
						className: "w-full h-full",
					}}
				/>
				<div className="absolute bottom-2 right-4 pointer-events-none text-[10px] font-bold text-slate-300 uppercase tracking-widest">
					Sign Here
				</div>
			</div>
			<p className="text-[10px] text-slate-400 text-center italic">
				By signing, you acknowledge the accuracy of the provided information and
				compliance with {formData.projectState} statutory requirements.
			</p>
		</div>
	);
}
