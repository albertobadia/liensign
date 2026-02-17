const DB_NAME = "LienSignDB";
const STORE_NAME = "waivers";
const DB_VERSION = 1;

export async function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id" });
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getAll<T>(storeName: string): Promise<T[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, "readonly");
		const store = transaction.objectStore(storeName);
		const request = store.getAll();

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getOne<T>(
	storeName: string,
	id: string,
): Promise<T | null> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, "readonly");
		const store = transaction.objectStore(storeName);
		const request = store.get(id);

		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);
	});
}

export async function putOne<T>(storeName: string, data: T): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, "readwrite");
		const store = transaction.objectStore(storeName);
		const request = store.put(data);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function deleteOne(storeName: string, id: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, "readwrite");
		const store = transaction.objectStore(storeName);
		const request = store.delete(id);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}
