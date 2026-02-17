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

export interface SignaturePreset {
	offsetX: number;
	offsetY: number;
	scale: number;
	rotation: number;
}

const PRESET_KEY_PREFIX = "liensign_sig_preset_";

export function saveSignaturePreset(
	stateCode: string,
	waiverType: string,
	preset: SignaturePreset,
): void {
	if (typeof window === "undefined") return;
	const key = `${PRESET_KEY_PREFIX}${stateCode}_${waiverType}`;
	localStorage.setItem(key, JSON.stringify(preset));
}

export function getSignaturePreset(
	stateCode: string,
	waiverType: string,
): SignaturePreset | null {
	if (typeof window === "undefined") return null;
	const key = `${PRESET_KEY_PREFIX}${stateCode}_${waiverType}`;
	const data = localStorage.getItem(key);
	if (!data) return null;
	try {
		return JSON.parse(data) as SignaturePreset;
	} catch {
		return null;
	}
}
