import { motion } from "framer-motion";
import { Maximize, Move, RotateCw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
// @ts-expect-error: External library type mismatch with esModuleInterop
import SignatureCanvas from "react-signature-canvas";
import {
	getSignaturePreset,
	saveSignaturePreset,
} from "../../../lib/userStore";
import type { WizardData } from "../schema";

export function StepSignature() {
	const {
		register,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<WizardData>();
	const sigCanvas = useRef<SignatureCanvas>(null);
	const [isAdjusting, setIsAdjusting] = useState(false);

	const formData = watch();
	const {
		signature,
		signatureOffsetX,
		signatureOffsetY,
		signatureScale,
		signatureRotation,
		projectState,
		waiverType,
	} = formData;

	useEffect(() => {
		const currentSignature = getValues("signature");
		if (currentSignature && sigCanvas.current) {
			sigCanvas.current.fromDataURL(currentSignature);
		}

		const preset = getSignaturePreset(projectState, waiverType);
		if (preset) {
			setValue("signatureOffsetX", preset.offsetX);
			setValue("signatureOffsetY", preset.offsetY);
			setValue("signatureScale", preset.scale);
			setValue("signatureRotation", preset.rotation);
		}
	}, [getValues, projectState, waiverType, setValue]);

	const clearSignature = () => {
		sigCanvas.current?.clear();
		setValue("signature", "");
		setValue("signatureOffsetX", 0);
		setValue("signatureOffsetY", 0);
		setValue("signatureScale", 1);
		setValue("signatureRotation", 0);
	};

	const saveSignature = () => {
		if (sigCanvas.current) {
			const canvas = sigCanvas.current.getTrimmedCanvas();
			const dataUrl = canvas.toDataURL("image/png");
			setValue("signature", dataUrl);
		}
	};

	const updatePreset = () => {
		saveSignaturePreset(projectState, waiverType, {
			offsetX: signatureOffsetX,
			offsetY: signatureOffsetY,
			scale: signatureScale,
			rotation: signatureRotation,
		});
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

			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<label
						htmlFor="signature-input"
						className="block text-sm font-semibold text-slate-700 underline decoration-blue-500/30 underline-offset-4"
					>
						{signature ? "Adjust Signature" : "Digital Signature"}
					</label>
					<div className="flex gap-2">
						{signature && (
							<button
								type="button"
								onClick={() => setIsAdjusting(!isAdjusting)}
								className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg border shadow-sm flex items-center gap-1.5 ${
									isAdjusting
										? "bg-blue-600 text-white border-blue-700"
										: "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
								}`}
							>
								<Move size={14} />
								{isAdjusting ? "Done" : "Adjust"}
							</button>
						)}
						<button
							type="button"
							onClick={clearSignature}
							className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm flex items-center gap-1.5"
						>
							<Trash2 size={14} />
							Clear
						</button>
					</div>
				</div>

				{!signature ? (
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
				) : !isAdjusting ? (
					<div className="border-2 border-slate-100 rounded-2xl bg-white h-44 flex items-center justify-center relative group overflow-hidden">
						<div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="relative z-10"
						>
							<img
								src={signature}
								alt="Current Signature"
								className="max-h-32 w-auto pointer-events-none drop-shadow-sm transition-transform group-hover:scale-105 duration-500"
							/>
						</motion.div>
						<div className="absolute bottom-3 right-4 text-[10px] font-bold text-blue-500/40 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-blue-500 transition-colors">
							Final Signature
						</div>
					</div>
				) : (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div className="bg-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[260px] border-2 border-dashed border-slate-300">
							<div className="bg-white p-12 rounded-lg shadow-xl border border-slate-200 w-full max-w-[400px]">
								<div className="flex items-baseline gap-2 relative">
									<span className="text-sm font-bold text-slate-800 font-serif whitespace-nowrap">
										By:
									</span>
									<div
										className="relative"
										style={{ width: "190px", height: "60px" }}
									>
										<div className="absolute bottom-0 h-[2px] bg-slate-900 w-full" />

										<motion.div
											drag
											dragMomentum={false}
											onDragEnd={updatePreset}
											style={{
												x: signatureOffsetX,
												y: signatureOffsetY,
												scale: signatureScale,
												rotate: signatureRotation,
											}}
											onUpdate={(latest) => {
												setValue("signatureOffsetX", latest.x as number);
												setValue("signatureOffsetY", latest.y as number);
											}}
											className="absolute left-0 bottom-0 cursor-move flex items-end justify-start origin-bottom-left"
										>
											<img
												src={signature}
												alt="Adjusting Signature"
												style={{ maxHeight: "50px", maxWidth: "190px" }}
												className="pointer-events-none"
											/>
										</motion.div>
									</div>
								</div>
								<div className="mt-1 pl-8">
									<span className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">
										(Signature)
									</span>
								</div>
							</div>

							<div className="absolute top-4 right-6 text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200">
								<Move size={12} className="text-blue-500" /> Drag to align (1px
								= 1pt in PDF)
							</div>
						</div>

						<div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
							<div className="space-y-3">
								<label
									htmlFor="sig-scale"
									className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 cursor-pointer"
								>
									<Maximize size={12} /> Size
								</label>
								<input
									id="sig-scale"
									type="range"
									min="0.5"
									max="2"
									step="0.05"
									value={signatureScale}
									onChange={(e) => {
										const val = parseFloat(e.target.value);
										setValue("signatureScale", val);
										updatePreset();
									}}
									className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
								/>
							</div>
							<div className="space-y-3">
								<label
									htmlFor="sig-rotate"
									className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2 cursor-pointer"
								>
									<RotateCw size={12} /> Rotation
								</label>
								<input
									id="sig-rotate"
									type="range"
									min="-20"
									max="20"
									step="1"
									value={signatureRotation}
									onChange={(e) => {
										const val = parseInt(e.target.value, 10);
										setValue("signatureRotation", val);
										updatePreset();
									}}
									className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
								/>
							</div>
						</div>
					</div>
				)}

				{errors.signature && (
					<p className="text-red-500 text-xs mt-2 font-medium">
						{errors.signature.message}
					</p>
				)}
			</div>

			<div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
				<div className="space-y-1">
					<h4 className="font-bold text-slate-900 flex items-center gap-2">
						Draft Mode
						<span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
							Beta
						</span>
					</h4>
					<p className="text-xs text-slate-500 leading-relaxed">
						Adds a "DRAFT" watermark to the document. Useful for preliminary
						reviews.
					</p>
				</div>
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						{...register("isDraft")}
						className="sr-only peer"
					/>
					<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
				</label>
			</div>

			<p className="text-[10px] text-slate-400 text-center italic leading-tight">
				By signing, you acknowledge the accuracy of the provided information and
				compliance with {formData.projectState} statutory requirements.
			</p>
		</div>
	);
}
