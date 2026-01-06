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

  if (!args.selection) {
    if (!prev.selection) {
      return { prev, next: prev };
    }

    const next: SteTableState<RowId, ColId> = { ...prev };
    delete (next as { selection?: unknown }).selection;

    return { prev, next };
  }

  const next: SteTableState<RowId, ColId> = {
    ...prev,
    selection: {
      mode: args.selection.mode,
      selectedRowIds: args.selection.selectedRowIds,
    },
  };

  return { prev, next };
};
