import { z } from "zod";
import { wizardSchema } from "../components/wizard/schema";

const waiverRecordSchema = z.object({
	id: z.string(),
	createdAt: z.string(),
	data: wizardSchema,
});

export type WaiverRecord = z.infer<typeof waiverRecordSchema>;

const STORAGE_KEY = "liensign_waiver_history";

function readAll(): WaiverRecord[] {
	if (typeof window === "undefined") return [];
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		const parsed = z.array(waiverRecordSchema).safeParse(JSON.parse(raw));
		if (!parsed.success) {
			console.error("Invalid waiver history data", parsed.error.flatten());
			return [];
		}
		return parsed.data;
	} catch (e) {
		console.error("Failed to parse waiver history", e);
		return [];
	}
}

function writeAll(records: WaiverRecord[]): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function saveWaiver(data: z.infer<typeof wizardSchema>): string {
	const id = crypto.randomUUID();
	const record: WaiverRecord = {
		id,
		createdAt: new Date().toISOString(),
		data,
	};
	const records = readAll();
	records.unshift(record);
	writeAll(records);
	return id;
}

export function getWaivers(): WaiverRecord[] {
	return readAll();
}

export function getWaiver(id: string): WaiverRecord | null {
	return readAll().find((r) => r.id === id) ?? null;
}

export function updateWaiver(
	id: string,
	data: z.infer<typeof wizardSchema>,
): void {
	const records = readAll();
	const index = records.findIndex((r) => r.id === id);
	if (index === -1) return;
	records[index] = {
		...records[index],
		data,
		createdAt: new Date().toISOString(),
	};
	writeAll(records);
}

export function deleteWaiver(id: string): void {
	writeAll(readAll().filter((r) => r.id !== id));
}
