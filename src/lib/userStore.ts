import { z } from "zod";

const userProfileSchema = z.object({
	contractorName: z.string(),
	contractorAddress: z.string(),
	contractorPhone: z.string(),
	signature: z.string(),
	emailTemplate: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

const STORAGE_KEY = "liensign_user_profile";

export function saveProfile(profile: UserProfile): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getProfile(): UserProfile | null {
	if (typeof window === "undefined") return null;
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) return null;
	try {
		const parsed = userProfileSchema.safeParse(JSON.parse(data));
		if (!parsed.success) {
			console.error("Invalid user profile data", parsed.error.flatten());
			return null;
		}
		return parsed.data;
	} catch (e) {
		console.error("Failed to parse user profile", e);
		return null;
	}
}

export function clearProfile(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(STORAGE_KEY);
}

export function hasProfile(): boolean {
	return getProfile() !== null;
}
