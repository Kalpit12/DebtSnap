import { readStorage } from '@/lib/storage';
import type { StorageSchema } from '@/lib/storage/schema';

export interface ExportPayload {
  exportedAt: string;
  version: number;
  data: StorageSchema;
}

export async function buildExportPayload(): Promise<ExportPayload> {
  const data = await readStorage();
  return {
    exportedAt: new Date().toISOString(),
    version: data.version,
    data,
  };
}

export function serializeExportPayload(payload: ExportPayload): string {
  return JSON.stringify(payload, null, 2);
}
