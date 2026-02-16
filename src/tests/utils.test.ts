import { describe, expect, it } from "vitest";
import { cn } from "../lib/utils";

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
