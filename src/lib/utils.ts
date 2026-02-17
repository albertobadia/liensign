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
