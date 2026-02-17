import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";
import { getProfile, saveProfile, type UserProfile } from "../../lib/userStore";

export function MyInfoForm() {
	const sigPad = useRef<SignatureCanvas>(null);
	const [profile, setProfile] = useState<UserProfile>({
		contractorName: "",
		contractorAddress: "",
		contractorPhone: "",
		signature: "",
	});

	useEffect(() => {
		const saved = getProfile();
		if (saved) {
			setProfile(saved);
			if (sigPad.current && saved.signature) {
				sigPad.current.fromDataURL(saved.signature);
			}
		}
	}, []);

	const handleSave = () => {
		if (
			!profile.contractorName ||
			!profile.contractorAddress ||
			!profile.contractorPhone
		) {
			toast.error("Please fill in all contractor details.");
			return;
		}

		const signature = sigPad.current?.isEmpty()
			? profile.signature
			: sigPad.current?.getTrimmedCanvas().toDataURL("image/png");

		if (!signature) {
			toast.error("Please provide a digital signature.");
			return;
		}

		const newProfile = { ...profile, signature };
		saveProfile(newProfile);
		setProfile(newProfile);
		toast.success(
			"Profile saved successfully! These details will pre-fill in the wizard.",
		);
	};

	const clearSignature = () => {
		sigPad.current?.clear();
		setProfile((prev) => ({ ...prev, signature: "" }));
	};

	return (
		<div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
			<div className="p-8 space-y-8">
				<div>
					<h2 className="text-3xl font-bold font-serif text-slate-900 mb-2 underline decoration-blue-500 underline-offset-8">
						My Information
					</h2>
					<p className="text-slate-600">
						Configure your details (company or individual) once. These will be
						automatically filled when you generate a new lien waiver.
					</p>
				</div>

				<div className="space-y-4">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label
								htmlFor="contractorName"
								className="block text-sm font-semibold text-slate-700 mb-1"
							>
								Claimant / Company Name
							</label>
							<input
								id="contractorName"
								type="text"
								value={profile.contractorName}
								onChange={(e) =>
									setProfile((p) => ({ ...p, contractorName: e.target.value }))
								}
								placeholder="e.g. Acme Construction LLC or John Doe"
								className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
							/>
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
								type="text"
								value={profile.contractorAddress}
								onChange={(e) =>
									setProfile((p) => ({
										...p,
										contractorAddress: e.target.value,
									}))
								}
								placeholder="Street, City, State, Zip"
								className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
							/>
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
								type="text"
								value={profile.contractorPhone}
								onChange={(e) =>
									setProfile((p) => ({ ...p, contractorPhone: e.target.value }))
								}
								placeholder="(555) 000-0000"
								className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
							/>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-700 mb-1">
							Digital Signature
						</h3>
						<div
							className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 overflow-hidden relative group"
							role="application"
							aria-label="Signature Pad"
						>
							<SignatureCanvas
								ref={sigPad}
								penColor="black"
								canvasProps={{
									className: "w-full h-40 cursor-crosshair",
									title: "Signature Pad",
								}}
							/>
							<button
								type="button"
								onClick={clearSignature}
								className="absolute top-2 right-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm"
							>
								Clear
							</button>
						</div>
					</div>
				</div>

				<button
					type="button"
					onClick={handleSave}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
				>
					Save My Information
				</button>
			</div>
		</div>
	);
}
