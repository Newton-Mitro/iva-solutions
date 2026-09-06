export type LocalRecord = Record<string, unknown> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LocalCollection =
  | "automationAccounts"
  | "ivacApplications"
  | "webfiles";

type StoredRecords = Record<string, LocalRecord>;

const storageKey = (userId: string, collection: LocalCollection) =>
  `ivac:${userId}:${collection}`;

const readRecords = async (userId: string, collection: LocalCollection) => {
  const result = await chrome.storage.local.get(storageKey(userId, collection));
  return (result[storageKey(userId, collection)] ?? {}) as StoredRecords;
};

const writeRecords = async (
  userId: string,
  collection: LocalCollection,
  records: StoredRecords,
) => chrome.storage.local.set({ [storageKey(userId, collection)]: records });

const now = () => new Date().toISOString();

export const listLocalRecords = async (
  userId: string,
  collection: LocalCollection,
) => Object.values(await readRecords(userId, collection));

export const createLocalRecord = async (
  userId: string,
  collection: LocalCollection,
  record: LocalRecord,
) => {
  const id = crypto.randomUUID();
  const records = await readRecords(userId, collection);
  const saved = { ...record, id, createdAt: now(), updatedAt: now() };
  await writeRecords(userId, collection, { ...records, [id]: saved });
  return saved;
};

export const updateLocalRecord = async (
  userId: string,
  collection: LocalCollection,
  recordId: string,
  record: LocalRecord,
) => {
  const records = await readRecords(userId, collection);
  if (!records[recordId]) throw new Error("Record no longer exists.");
  const saved = {
    ...records[recordId],
    ...record,
    id: recordId,
    updatedAt: now(),
  };
  await writeRecords(userId, collection, { ...records, [recordId]: saved });
  return saved;
};

export const deleteLocalRecord = async (
  userId: string,
  collection: LocalCollection,
  recordId: string,
) => {
  const records = await readRecords(userId, collection);
  delete records[recordId];
  await writeRecords(userId, collection, records);
};

export const subscribeToLocalRecords = (
  userId: string,
  collection: LocalCollection,
  listener: (records: LocalRecord[]) => void,
) => {
  const key = storageKey(userId, collection);
  void listLocalRecords(userId, collection).then(listener);
  const onChanged = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    if (changes[key]) void listLocalRecords(userId, collection).then(listener);
  };
  chrome.storage.onChanged.addListener(onChanged);
  return () => chrome.storage.onChanged.removeListener(onChanged);
};

const filesDb = "ivac-files";
const filesStore = "documents";

const openFilesDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(filesDb, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore(filesStore);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveLocalFile = async (recordId: string, file: File) => {
  const database = await openFilesDb();
  await new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(filesStore, "readwrite")
      .objectStore(filesStore)
      .put(file, recordId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  database.close();
};

export const getLocalFile = async (recordId: string): Promise<File | null> => {
  const database = await openFilesDb();
  const file = await new Promise<File | undefined>((resolve, reject) => {
    const request = database
      .transaction(filesStore, "readonly")
      .objectStore(filesStore)
      .get(recordId);
    request.onsuccess = () => resolve(request.result as File | undefined);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return file ?? null;
};

export const deleteLocalFile = async (recordId: string) => {
  const database = await openFilesDb();
  await new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(filesStore, "readwrite")
      .objectStore(filesStore)
      .delete(recordId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  database.close();
};
