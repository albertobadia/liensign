import { describe, expect, it } from "vitest";
import { cn, sanitizeFilename } from "../lib/utils";

describe("Utility: cn", () => {
	it("should merge class names correctly", () => {
		expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
	});

	it("should handle conditional classes", () => {
		expect(cn("base", true && "active", false && "inactive")).toBe(
			"base active",
		);
	});

	it("should merge tailwind classes (twMerge)", () => {
		expect(cn("p-4 p-8")).toBe("p-8");
	});
});

describe("Utility: sanitizeFilename", () => {
	it("should remove prohibited characters", () => {
		expect(sanitizeFilename('Project / \\ < > : " | ? * Name')).toBe(
			"Project-Name",
		);
	});

	it("should replace spaces with dashes", () => {
		expect(sanitizeFilename("My Cool Project")).toBe("My-Cool-Project");
	});

	it("should collapse multiple dashes", () => {
		expect(sanitizeFilename("Project   --- Name")).toBe("Project-Name");
	});

	it("should trim leading and trailing dots/dashes", () => {
		expect(sanitizeFilename("...-Project Name-...")).toBe("Project-Name");
	});

	it("should return a default name if empty after sanitization", () => {
		expect(sanitizeFilename(' / \\ < > : " | ? * ')).toBe("document");
	});

	it("should truncate long names", () => {
		const longName = "a".repeat(300);
		expect(sanitizeFilename(longName).length).toBe(255);
	});
});
