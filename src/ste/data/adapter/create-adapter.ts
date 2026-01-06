import type { SteDataAdapter, SteCellGetter } from './types';
import type { SteId } from '@/ste/core';

export type SteCreateAdapterArgs<RowId extends SteId = SteId, ColId extends SteId = SteId, RowData = unknown> = {
  getRows: SteDataAdapter<RowId, ColId, RowData>['getRows'];
  getCellValue: SteCellGetter<RowData, ColId>;
};

export const createAdapter = <RowId extends SteId = SteId, ColId extends SteId = SteId, RowData = unknown>(
  args: SteCreateAdapterArgs<RowId, ColId, RowData>,
): SteDataAdapter<RowId, ColId, RowData> => {
  return {
    getRows: args.getRows,
    getCellValue: args.getCellValue,
  };
};
