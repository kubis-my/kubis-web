import type { ThreadPageInfo } from '@repo/commons/types/forge-service-schema.type';
import type { Message } from './types';

type CachedMessage = Omit<Message, 'timestamp' | 'deletedAt'> & {
    timestamp: string;
    deletedAt?: string;
};

type CacheEntry = {
    messages: CachedMessage[];
    pageInfo: ThreadPageInfo;
};

const DB_NAME = 'forge-cache';
const STORE_NAME = 'threads';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            req.result.createObjectStore(STORE_NAME);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function serialize(msg: Message): CachedMessage {
    return {
        ...msg,
        timestamp: msg.timestamp.toISOString(),
        deletedAt: msg.deletedAt?.toISOString(),
    };
}

function deserialize(msg: CachedMessage): Message {
    return {
        ...msg,
        timestamp: new Date(msg.timestamp),
        deletedAt: msg.deletedAt ? new Date(msg.deletedAt) : undefined,
    };
}

export async function getThreadCache(
    projectId: string,
): Promise<{ messages: Message[]; pageInfo: ThreadPageInfo } | null> {
    try {
        const db = await openDb();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(projectId);
            req.onsuccess = () => {
                const entry: CacheEntry | undefined = req.result;
                if (!entry) {
                    resolve(null);
                    return;
                }
                resolve({
                    messages: entry.messages.map(deserialize),
                    pageInfo: entry.pageInfo,
                });
            };
            req.onerror = () => resolve(null);
        });
    } catch {
        return null;
    }
}

export async function setThreadCache(
    projectId: string,
    messages: Message[],
    pageInfo: ThreadPageInfo,
): Promise<void> {
    try {
        const db = await openDb();
        await new Promise<void>((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const entry: CacheEntry = { messages: messages.map(serialize), pageInfo };
            tx.objectStore(STORE_NAME).put(entry, projectId);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        });
    } catch {
        // non-fatal
    }
}
