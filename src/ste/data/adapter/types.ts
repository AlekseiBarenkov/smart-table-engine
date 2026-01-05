import type { SteId } from '@/ste/core';

export type SteDataRequest<ColId extends SteId = SteId> = {
  tableId: SteId;
  sorting?: { colId: ColId; direction: 'asc' | 'desc' };
  pagination?: { page: number; pageSize: number };
};

export type SteDataPage<RowId extends SteId = SteId, RowData = unknown> = {
  rows: ReadonlyArray<{ id: RowId; data: RowData }>;
  total?: number;
};

export type SteCellGetter<RowData, ColId extends SteId = SteId> = (args: {
  row: RowData;
  colId: ColId;
}) => unknown;

export type SteDataAdapter<
  RowId extends SteId = SteId,
  ColId extends SteId = SteId,
  RowData = unknown,
> = {
  getRows: (req: SteDataRequest<ColId>) => Promise<SteDataPage<RowId, RowData>>;

  getCellValue: SteCellGetter<RowData, ColId>;
};
