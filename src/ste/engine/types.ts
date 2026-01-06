import type { SteId, SteTable, SteTableState } from '@/ste/core';
import type { SteDataAdapter, SteDataPage, SteDataRequest } from '@/ste/data';

export type SteEngineQueryResult<RowId extends SteId = SteId, RowData = unknown> = {
  rows: SteDataPage<RowId, RowData>['rows'];
  total?: number;
};

export type SteUnsubscribe = () => void;

export type SteTableEngine<RowId extends SteId = SteId, ColId extends SteId = SteId, RowData = unknown> = {
  getTable: () => SteTable<RowId, ColId, RowData>;
  getState: () => SteTableState<RowId, ColId>;

  setState: (next: SteTableState<RowId, ColId>) => void;

  setSorting: (next: SteDataRequest<ColId>['sorting'] | null) => void;
  setPagination: (next: SteDataRequest<ColId>['pagination'] | null) => void;

  getColumnWidth: (colId: ColId) => number | undefined;
  setColumnWidth: (args: { colId: ColId; width: number; minWidth?: number; maxWidth?: number }) => void;

  query: () => Promise<SteEngineQueryResult<RowId, RowData>>;
  getCellValue: (args: { row: RowData; colId: ColId }) => unknown;

  subscribe: (
    listener: (next: SteTableState<RowId, ColId>, prev: SteTableState<RowId, ColId>) => void,
  ) => SteUnsubscribe;

  adapter: SteDataAdapter<RowId, ColId, RowData>;
};
