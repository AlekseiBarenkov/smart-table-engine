import type { SteId, SteMeta } from './meta';

export type SteCellValue = unknown;

export type SteCell<RowId extends SteId = SteId, ColId extends SteId = SteId> = {
  rowId: RowId;
  colId: ColId;
  value: SteCellValue;
  meta?: SteMeta;
};
