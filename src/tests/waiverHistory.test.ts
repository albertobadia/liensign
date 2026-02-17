import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WizardData } from "../components/wizard/schema";
import {
	deleteWaiver,
	getWaiver,
	getWaivers,
	saveWaiver,
	updateWaiver,
} from "../lib/waiverHistory";

const mockWaiverData: WizardData = {
	contractorName: "John Doe",
	contractorAddress: "123 Main St",
	contractorPhone: "555-1234",
	projectName: "Project X",
	projectAddress: "456 Oak Ave",
	projectState: "FL",
	ownerName: "Jane Smith",
	customerName: "Customer Inc",
	waiverType: "unconditional_final",
	paymentAmount: "1000.00",
	throughDate: "2024-01-01",
	signature: "data:image/png;base64,mock",
};

describe("waiverHistory", () => {
	beforeEach(() => {
		vi.stubGlobal("window", {});
		vi.stubGlobal("localStorage", {
			getItem: vi.fn(),
			setItem: vi.fn(),
			clear: vi.fn(),
		});
		vi.stubGlobal("crypto", {
			randomUUID: () => "mock-uuid",
		});
	});

	it("should save a waiver and return its ID", () => {
		const id = saveWaiver(mockWaiverData);
		expect(id).toBe("mock-uuid");
		expect(localStorage.setItem).toHaveBeenCalledWith(
			"liensign_waiver_history",
			expect.stringContaining("Project X"),
		);
	});

	it("should get all waivers", () => {
		const mockRecords = [
			{
				id: "1",
				createdAt: new Date().toISOString(),
				data: { ...mockWaiverData, projectName: "P1" },
			},
		];
		vi.mocked(localStorage.getItem).mockReturnValue(
			JSON.stringify(mockRecords),
		);

		const waivers = getWaivers();
		expect(waivers).toHaveLength(1);
		expect(waivers[0].data.projectName).toBe("P1");
	});

	it("should get a single waiver by ID", () => {
		const mockRecords = [{ id: "1", createdAt: "...", data: mockWaiverData }];
		vi.mocked(localStorage.getItem).mockReturnValue(
			JSON.stringify(mockRecords),
		);

		const waiver = getWaiver("1");
		expect(waiver?.data.projectName).toBe("Project X");
	});

	it("should delete a waiver", () => {
		const mockRecords = [{ id: "1", createdAt: "...", data: mockWaiverData }];
		vi.mocked(localStorage.getItem).mockReturnValue(
			JSON.stringify(mockRecords),
		);

		deleteWaiver("1");
		expect(localStorage.setItem).toHaveBeenCalledWith(
			"liensign_waiver_history",
			"[]",
		);
	});

	it("should update a waiver", () => {
		const mockRecords = [{ id: "1", createdAt: "...", data: mockWaiverData }];
		vi.mocked(localStorage.getItem).mockReturnValue(
			JSON.stringify(mockRecords),
		);

		updateWaiver("1", { ...mockWaiverData, projectName: "Updated" });
		expect(localStorage.setItem).toHaveBeenCalledWith(
			"liensign_waiver_history",
			expect.stringContaining("Updated"),
		);
	});
});
