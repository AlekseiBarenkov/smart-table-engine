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

  if (!args.sorting) {
    if (!prev.sorting) {
      return { prev, next: prev };
    }

    const next: SteTableState<RowId, ColId> = { ...prev };
    delete (next as { sorting?: unknown }).sorting;

    return { prev, next };
  }

  const next: SteTableState<RowId, ColId> = {
    ...prev,
    sorting: {
      colId: args.sorting.colId,
      direction: args.sorting.direction,
    },
  };

  return { prev, next };
};
