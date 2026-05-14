/**
 * Ingestion jobs for public-sector datasets (AICTE, AISHE, state CET cells, etc.).
 */
export type GovSyncParams = {
  agency: string;
  externalId?: string;
};

export async function syncGovernmentDataset(_params: GovSyncParams): Promise<void> {
  await Promise.resolve();
}
