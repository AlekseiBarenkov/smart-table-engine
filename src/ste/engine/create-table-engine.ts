import type { SteId, SteTable, SteTableState } from '@/ste/core';
import type { SteDataAdapter, SteDataRequest } from '@/ste/data';
import { setSorting, setPagination, setColumnWidth } from '@/ste/actions';
import type { SteTableEngine } from './types';

export type SteCreateTableEngineArgs<RowId extends SteId = SteId, ColId extends SteId = SteId, RowData = unknown> = {
  table: SteTable<RowId, ColId, RowData>;
  adapter: SteDataAdapter<RowId, ColId, RowData>;

  onStateChange?: (next: SteTableState<RowId, ColId>, prev: SteTableState<RowId, ColId>) => void;
};

export const createTableEngine = <RowId extends SteId = SteId, ColId extends SteId = SteId, RowData = unknown>(
  args: SteCreateTableEngineArgs<RowId, ColId, RowData>,
): SteTableEngine<RowId, ColId, RowData> => {
  let table = args.table;

  const listeners = new Set<(next: SteTableState<RowId, ColId>, prev: SteTableState<RowId, ColId>) => void>();

  const subscribe = (listener: (next: SteTableState<RowId, ColId>, prev: SteTableState<RowId, ColId>) => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const getTable = () => table;
  const getState = () => table.state;

  const setState = (next: SteTableState<RowId, ColId>) => {
    const prev = table.state;
    if (Object.is(prev, next)) {
      return;
    }

    table = { ...table, state: next };
    args.onStateChange?.(next, prev);

    for (const l of listeners) {
      l(next, prev);
    }
  };

  const setSortingPublic = (nextSorting: SteDataRequest<ColId>['sorting'] | null) => {
    const { next } = setSorting<RowId, ColId>({
      state: table.state,
      sorting: nextSorting ? { colId: nextSorting.colId, direction: nextSorting.direction } : null,
    });
    setState(next);
  };

  const setPaginationPublic = (nextPagination: SteDataRequest<ColId>['pagination'] | null) => {
    const { next } = setPagination<RowId, ColId>({
      state: table.state,
      pagination: nextPagination ? { page: nextPagination.page, pageSize: nextPagination.pageSize } : null,
    });
    setState(next);
  };

  const query = async () => {
    const state = table.state;

    const req: SteDataRequest<ColId> = {
      tableId: table.id,
      sorting: state.sorting ? { colId: state.sorting.colId, direction: state.sorting.direction } : undefined,
      pagination: state.pagination ? { page: state.pagination.page, pageSize: state.pagination.pageSize } : undefined,
    };

    const page = await args.adapter.getRows(req);
    return { rows: page.rows, total: page.total };
  };

  const getCellValue = (x: { row: RowData; colId: ColId }) => args.adapter.getCellValue(x);

  const getColumnWidth = (colId: ColId) => table.state.columnSizing?.get(colId);

  const setColumnWidthPublic = (x: { colId: ColId; width: number; minWidth?: number; maxWidth?: number }) => {
    const { next } = setColumnWidth<RowId, ColId>({
      state: table.state,
      columnWidth: { colId: x.colId, width: x.width, minWidth: x.minWidth, maxWidth: x.maxWidth },
    });
    setState(next);
  };

  return {
    getTable,
    getState,
    setState,
    setSorting: setSortingPublic,
    setPagination: setPaginationPublic,
    query,
    getCellValue,
    getColumnWidth,
    setColumnWidth: setColumnWidthPublic,
    subscribe,
    adapter: args.adapter,
  };
};
