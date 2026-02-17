import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	clearProfile,
	getProfile,
	getSignaturePreset,
	hasProfile,
	saveProfile,
	type UserProfile,
} from "../lib/userStore";

const mockProfile: UserProfile = {
	contractorName: "Test Builder",
	contractorAddress: "123 Test St",
	contractorPhone: "555-0000",
	signature: "data:image/png;base64,mocksignature",
};

describe("userStore: localStorage persistence", () => {
	beforeEach(() => {
		vi.stubGlobal("window", {});
		vi.stubGlobal("localStorage", {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should save and retrieve the profile correctly", () => {
		const store: Record<string, string> = {};
		vi.mocked(localStorage.setItem).mockImplementation((key, val) => {
			store[key] = val;
		});
		vi.mocked(localStorage.getItem).mockImplementation(
			(key) => store[key] || null,
		);

		saveProfile(mockProfile);
		expect(localStorage.setItem).toHaveBeenCalledWith(
			"liensign_user_profile",
			JSON.stringify(mockProfile),
		);

		const retrieved = getProfile();
		expect(retrieved).toEqual(mockProfile);
	});

	it("should return null if no profile exists", () => {
		vi.mocked(localStorage.getItem).mockReturnValue(null);
		expect(getProfile()).toBeNull();
		expect(hasProfile()).toBe(false);
	});

	it("should clear the profile", () => {
		clearProfile();
		expect(localStorage.removeItem).toHaveBeenCalledWith(
			"liensign_user_profile",
		);
	});

	it("should handle JSON parsing errors gracefully", () => {
		vi.mocked(localStorage.getItem).mockReturnValue("not-json");
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		expect(getProfile()).toBeNull();
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("should validate signature preset data", () => {
		// Valid data
		const validData = JSON.stringify({
			offsetX: 10,
			offsetY: 20,
			scale: 1,
			rotation: 0,
		});
		vi.mocked(localStorage.getItem).mockReturnValue(validData);
		expect(getSignaturePreset("CA", "conditional_progress")).toEqual({
			offsetX: 10,
			offsetY: 20,
			scale: 1,
			rotation: 0,
		});

		// Invalid schema (missing fields)
		const invalidData = JSON.stringify({ foo: "bar" });
		vi.mocked(localStorage.getItem).mockReturnValue(invalidData);
		expect(getSignaturePreset("CA", "conditional_progress")).toBeNull();

		// Invalid JSON
		vi.mocked(localStorage.getItem).mockReturnValue("{invalid json");
		expect(getSignaturePreset("CA", "conditional_progress")).toBeNull();
	});
});
