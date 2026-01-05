import type { SteId, SteTableState } from '@/ste/core';

export type SteSelectionMode = 'none' | 'single' | 'multiple';

export type SteSetSelectionArgs<RowId extends SteId = SteId> = {
  mode: SteSelectionMode;
  selectedRowIds: ReadonlySet<RowId>;
};

export const setSelection = <RowId extends SteId = SteId, ColId extends SteId = SteId>(args: {
  state: SteTableState<RowId, ColId>;
  selection: SteSetSelectionArgs<RowId> | null;
}): { prev: SteTableState<RowId, ColId>; next: SteTableState<RowId, ColId> } => {
  const prev = args.state;

  const next: SteTableState<RowId, ColId> = args.selection
    ? {
        ...prev,
        selection: {
          mode: args.selection.mode,
          selectedRowIds: args.selection.selectedRowIds,
        },
      }
    : (() => {
        const { selection: _selection, ...rest } = prev;
        return rest;
      })();

  return { prev, next };
};
