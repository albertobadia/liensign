import {
	Building2,
	Calendar,
	Clock,
	Download,
	Edit,
	FileText,
	MapPin,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateWaiverPDF } from "../../lib/pdf";
import {
	deleteWaiver,
	getWaivers,
	type WaiverRecord,
} from "../../lib/waiverHistory";

export function WaiverHistory() {
	const [waivers, setWaivers] = useState<WaiverRecord[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isGenerating, setIsGenerating] = useState<string | null>(null);

	useEffect(() => {
		setWaivers(getWaivers());
	}, []);

	const handleDelete = (id: string, name: string) => {
		if (confirm(`Are you sure you want to delete the waiver for "${name}"?`)) {
			deleteWaiver(id);
			setWaivers(getWaivers());
			toast.success("Waiver deleted from history");
		}
	};

	const handleDownload = async (record: WaiverRecord) => {
		setIsGenerating(record.id);
		try {
			const pdfBytes = await generateWaiverPDF(
				record.data.projectState,
				record.data.waiverType,
				record.data,
				record.data.signature,
			);

			const blob = new Blob([pdfBytes as BlobPart], {
				type: "application/pdf",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `LienWaiver-${record.data.projectName.replace(/\s+/g, "-")}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Waiver downloaded successfully");
		} catch (error) {
			console.error("Download error:", error);
			toast.error("Failed to generate PDF");
		} finally {
			setIsGenerating(null);
		}
	};

	const handleEdit = (id: string) => {
		window.location.href = `/wizard?edit=${id}`;
	};

	const filteredWaivers = waivers.filter(
		(w) =>
			w.data.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			w.data.contractorName.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (waivers.length === 0) {
		return (
			<div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12 text-center space-y-6">
				<div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
					<FileText size={40} className="text-slate-300" />
				</div>
				<div className="space-y-2">
					<h2 className="text-2xl font-bold text-slate-900 font-serif">
						No waivers found
					</h2>
					<p className="text-slate-600 max-w-sm mx-auto">
						You haven't generated any waivers yet. Your waiver history will
						appear here automatically.
					</p>
				</div>
				<a
					href="/wizard"
					className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95 mx-auto"
				>
					<Plus size={18} />
					Create Your First Waiver
				</a>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="relative flex-1 max-w-md">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						size={18}
					/>
					<input
						type="text"
						placeholder="Search by project or contractor..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
				</div>
				<div className="text-xs text-slate-500 font-medium">
					Showing {filteredWaivers.length} of {waivers.length} waivers
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{filteredWaivers.map((record) => (
					<div
						key={record.id}
						className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
					>
						<div className="p-5 flex-1 space-y-4">
							<div className="flex items-start justify-between gap-2">
								<div className="space-y-1">
									<h3 className="font-bold text-slate-900 leading-tight">
										{record.data.projectName}
									</h3>
									<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-md">
										<MapPin size={10} />
										{record.data.projectState} Waiver
									</div>
								</div>
								<div className="text-[10px] items-end flex flex-col text-slate-400 font-medium">
									<div className="flex items-center gap-1">
										<Calendar size={10} />
										{new Date(record.createdAt).toLocaleDateString()}
									</div>
									<div className="flex items-center gap-1 mt-0.5">
										<Clock size={10} />
										{new Date(record.createdAt).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-y-3 gap-x-4">
								<div className="space-y-0.5">
									<span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
										Contractor
									</span>
									<div className="text-xs font-semibold text-slate-700 truncate flex items-center gap-1.5">
										<Building2 size={12} className="text-slate-400" />
										{record.data.contractorName}
									</div>
								</div>
								<div className="space-y-0.5">
									<span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
										Amount
									</span>
									<div className="text-xs font-bold text-slate-900">
										${record.data.paymentAmount}
									</div>
								</div>
								<div className="space-y-0.5 col-span-2">
									<span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
										Type
									</span>
									<div className="text-[11px] font-medium text-slate-600 capitalize italic">
										{record.data.waiverType.replace(/_/g, " ")}
									</div>
								</div>
							</div>
						</div>

						<div className="bg-slate-50 border-t border-slate-100 p-3 flex items-center justify-between gap-2">
							<button
								type="button"
								onClick={() => handleEdit(record.id)}
								className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
							>
								<Edit size={14} />
								Edit
							</button>
							<button
								type="button"
								onClick={() => handleDownload(record)}
								disabled={isGenerating === record.id}
								className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
							>
								{isGenerating === record.id ? (
									<Clock size={14} className="animate-spin" />
								) : (
									<Download size={14} />
								)}
								Download
							</button>
							<button
								type="button"
								onClick={() => handleDelete(record.id, record.data.projectName)}
								className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
								title="Delete from history"
							>
								<Trash2 size={14} />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
