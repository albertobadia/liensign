import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearProfile, getProfile, hasProfile, saveProfile, type UserProfile } from "../lib/userStore";

const mockProfile: UserProfile = {
    contractorName: "Test Builder",
    contractorAddress: "123 Test St",
    contractorPhone: "555-0000",
    signature: "data:image/png;base64,mocksignature",
};

describe("userStore: localStorage persistence", () => {
    beforeEach(() => {
        // Mock window and localStorage
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
        vi.mocked(localStorage.getItem).mockImplementation((key) => store[key] || null);

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
        expect(localStorage.removeItem).toHaveBeenCalledWith("liensign_user_profile");
    });

    it("should handle JSON parsing errors gracefully", () => {
        vi.mocked(localStorage.getItem).mockReturnValue("not-json");
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });

        expect(getProfile()).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
