import type { SteId, SteTableState } from '@/ste/core';

export const resetSelection = <RowId extends SteId = SteId, ColId extends SteId = SteId>(args: {
  state: SteTableState<RowId, ColId>;
}): { prev: SteTableState<RowId, ColId>; next: SteTableState<RowId, ColId> } => {
  const prev = args.state;

  if (!prev.selection) {
    return { prev, next: prev };
  }

  const next: SteTableState<RowId, ColId> = {
    ...prev,
    selection: { ...prev.selection, selectedRowIds: new Set<RowId>() },
  };

  return { prev, next };
};
