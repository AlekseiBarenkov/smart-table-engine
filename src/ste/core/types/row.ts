import type { SteId, SteMeta } from './meta';

export type SteRow<RowId extends SteId = SteId> = {
  id: RowId;
  meta?: SteMeta;
};
