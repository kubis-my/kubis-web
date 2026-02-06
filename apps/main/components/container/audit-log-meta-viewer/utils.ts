import { AuditLogMetaDataEntry } from "@repo/commons/types/audit-service-schema.type";

export interface DiffEntryData {
    key: string;
    before?: string;
    after?: string;
}

export function buildDiffEntries(
    before?: AuditLogMetaDataEntry[] | null,
    after?: AuditLogMetaDataEntry[] | null,
): DiffEntryData[] {
    const beforeMap = new Map(
        (before ?? []).map((e) => [e.key, e.value]),
    );
    const afterMap = new Map(
        (after ?? []).map((e) => [e.key, e.value]),
    );

    const allKeys = new Set([...beforeMap.keys(), ...afterMap.keys()]);
    const entries: DiffEntryData[] = [];

    for (const key of allKeys) {
        const b = beforeMap.get(key);
        const a = afterMap.get(key);
        if (b !== a) {
            entries.push({ key, before: b, after: a });
        }
    }

    return entries;
}
