import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function slugify(text: string) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "_")
		.replace(/[^\w-]+/g, "")
		.replace(/__+/g, "_");
}
