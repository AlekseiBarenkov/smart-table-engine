import type { SteId, SteTableState } from '@/ste/core';

export type SteSetSortingArgs<ColId extends SteId = SteId> = {
  colId: ColId;
  direction: 'asc' | 'desc';
};

export const setSorting = <RowId extends SteId = SteId, ColId extends SteId = SteId>(args: {
  state: SteTableState<RowId, ColId>;
  sorting: SteSetSortingArgs<ColId> | null;
}): { prev: SteTableState<RowId, ColId>; next: SteTableState<RowId, ColId> } => {
  const prev = args.state;

  const next: SteTableState<RowId, ColId> = args.sorting
    ? { ...prev, sorting: { colId: args.sorting.colId, direction: args.sorting.direction } }
    : (() => {
        const { sorting: _sorting, ...rest } = prev;
        return rest;
      })();

  return { prev, next };
};
