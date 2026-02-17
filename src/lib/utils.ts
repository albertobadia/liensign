import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function sanitizeFilename(name: string): string {
	return (
		name
			.trim()
			// biome-ignore lint/suspicious/noControlCharactersInRegex: Sanitizing filenames requires removing control characters
			.replace(/[<>:"/\\|?*\x00-\x1F\x7F]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^[.-]+|[.-]+$/g, "")
			.substring(0, 255) || "document"
	);
}

export function createPdfBlob(pdfBytes: Uint8Array): Blob {
	return new Blob([pdfBytes as unknown as BlobPart], {
		type: "application/pdf",
	});
}

export function downloadPdf(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function previewPdf(blob: Blob): string {
	const url = URL.createObjectURL(blob);
	window.open(url, "_blank");
	return url;
}
