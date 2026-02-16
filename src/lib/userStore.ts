export interface UserProfile {
	contractorName: string;
	contractorAddress: string;
	contractorPhone: string;
	signature: string; // base64 PNG
}

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
		return JSON.parse(data) as UserProfile;
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
