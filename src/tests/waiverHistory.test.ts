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
	signatureOffsetX: 0,
	signatureOffsetY: 0,
	signatureScale: 1,
	signatureRotation: 0,
	isDraft: false,
};

// Mock IDB store and operations
const mockStore = new Map<string, unknown>();
vi.mock("../lib/db", () => ({
	openDB: vi.fn(),
	getAll: vi.fn(async () => Array.from(mockStore.values())),
	getOne: vi.fn(async (_name, id) => mockStore.get(id)),
	putOne: vi.fn(async (_name, data) => {
		// biome-ignore lint/suspicious/noExplicitAny: Mocking simplified storage
		mockStore.set((data as any).id, data);
	}),
	deleteOne: vi.fn(async (_name, id) => {
		mockStore.delete(id);
	}),
}));

describe("waiverHistory", () => {
	beforeEach(() => {
		mockStore.clear();
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

	it("should save a waiver and return its ID", async () => {
		const id = await saveWaiver(mockWaiverData);
		expect(id).toBe("mock-uuid");
		const stored = mockStore.get("mock-uuid");
		// biome-ignore lint/suspicious/noExplicitAny: Simple test assertion
		expect((stored as any).data.projectName).toBe("Project X");
	});

	it("should get all waivers", async () => {
		const mockRecord = {
			id: "1",
			createdAt: new Date().toISOString(),
			data: { ...mockWaiverData, projectName: "P1" },
		};
		mockStore.set("1", mockRecord);

		const waivers = await getWaivers();
		expect(waivers).toHaveLength(1);
		expect(waivers[0].data.projectName).toBe("P1");
	});

	it("should get a single waiver by ID", async () => {
		const mockRecord = { id: "1", createdAt: "...", data: mockWaiverData };
		mockStore.set("1", mockRecord);

		const waiver = await getWaiver("1");
		expect(waiver?.data.projectName).toBe("Project X");
	});

	it("should delete a waiver", async () => {
		mockStore.set("1", { id: "1", data: mockWaiverData });

		await deleteWaiver("1");
		expect(mockStore.size).toBe(0);
	});

	it("should update a waiver", async () => {
		mockStore.set("1", { id: "1", createdAt: "...", data: mockWaiverData });

		await updateWaiver("1", { ...mockWaiverData, projectName: "Updated" });
		const updated = mockStore.get("1");
		// biome-ignore lint/suspicious/noExplicitAny: Simple test assertion
		expect((updated as any).data.projectName).toBe("Updated");
	});
});
