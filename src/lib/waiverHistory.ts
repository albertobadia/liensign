import { z } from "zod";
import { wizardSchema } from "../components/wizard/schema";
import { deleteOne, getAll, getOne, putOne } from "./db";

const waiverRecordSchema = z.object({
	id: z.string(),
	createdAt: z.string(),
	data: wizardSchema,
});

export type WaiverRecord = z.infer<typeof waiverRecordSchema>;

const STORE_NAME = "waivers";
const LEGACY_STORAGE_KEY = "liensign_waiver_history";
const MIGRATION_KEY = "liensign_indexeddb_migrated";

async function ensureMigration() {
	if (typeof window === "undefined") return;
	if (localStorage.getItem(MIGRATION_KEY)) return;

	const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
	if (raw) {
		try {
			const parsed = z.array(waiverRecordSchema).safeParse(JSON.parse(raw));
			if (parsed.success) {
				for (const record of parsed.data) {
					await putOne(STORE_NAME, record);
				}
				// We keep the old data for safety for now, but mark migration as done
				localStorage.setItem(MIGRATION_KEY, "true");
			}
		} catch (e) {
			console.error("Migration failed:", e);
		}
	} else {
		localStorage.setItem(MIGRATION_KEY, "true");
	}
}

export async function saveWaiver(
	data: z.infer<typeof wizardSchema>,
): Promise<string> {
	await ensureMigration();
	const id = crypto.randomUUID();
	const record: WaiverRecord = {
		id,
		createdAt: new Date().toISOString(),
		data,
	};
	await putOne(STORE_NAME, record);
	return id;
}

export async function getWaivers(): Promise<WaiverRecord[]> {
	await ensureMigration();
	const records = await getAll<WaiverRecord>(STORE_NAME);
	return records.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
}

export async function getWaiver(id: string): Promise<WaiverRecord | null> {
	await ensureMigration();
	return await getOne<WaiverRecord>(STORE_NAME, id);
}

export async function updateWaiver(
	id: string,
	data: z.infer<typeof wizardSchema>,
): Promise<void> {
	await ensureMigration();
	const record = await getOne<WaiverRecord>(STORE_NAME, id);
	if (!record) return;

	const updatedRecord: WaiverRecord = {
		...record,
		data,
		createdAt: new Date().toISOString(),
	};
	await putOne(STORE_NAME, updatedRecord);
}

export async function deleteWaiver(id: string): Promise<void> {
	await ensureMigration();
	await deleteOne(STORE_NAME, id);
}
