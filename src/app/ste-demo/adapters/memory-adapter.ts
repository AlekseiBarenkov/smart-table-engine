import type { SteDataAdapter, SteDataPage, SteDataRequest } from '@/ste';
import { createAdapter } from '@/ste/data/adapter/create-adapter';
import type { SteId } from '@/ste/core';

export type SteMemoryAdapterArgs<RowId extends SteId = SteId, ColId extends SteId = SteId, RowData = unknown> = {
  rows: ReadonlyArray<{ id: RowId; data: RowData }>;
  getCellValue: SteDataAdapter<RowId, ColId, RowData>['getCellValue'];
  sort?: (args: {
    rows: ReadonlyArray<{ id: RowId; data: RowData }>;
    sorting: NonNullable<SteDataRequest<ColId>['sorting']>;
  }) => ReadonlyArray<{ id: RowId; data: RowData }>;
};

const applyPagination = <RowId extends SteId, RowData>(
  rows: ReadonlyArray<{ id: RowId; data: RowData }>,
  pagination: SteDataRequest<SteId>['pagination'],
): ReadonlyArray<{ id: RowId; data: RowData }> => {
  if (!pagination) {
    return rows;
  }

  const { page, pageSize } = pagination;
  const start = Math.max(0, page) * Math.max(1, pageSize);
  return rows.slice(start, start + pageSize);
};

export const createMemoryAdapter = <RowId extends SteId = SteId, ColId extends SteId = SteId, RowData = unknown>(
  args: SteMemoryAdapterArgs<RowId, ColId, RowData>,
): SteDataAdapter<RowId, ColId, RowData> => {
  const getRows = async (req: SteDataRequest<ColId>): Promise<SteDataPage<RowId, RowData>> => {
    const total = args.rows.length;

    const sorted = req.sorting && args.sort ? args.sort({ rows: args.rows, sorting: req.sorting }) : args.rows;

    const pageRows = applyPagination(sorted, req.pagination);

    return { rows: pageRows, total };
  };

  return createAdapter<RowId, ColId, RowData>({
    getRows,
    getCellValue: args.getCellValue,
  });
};
