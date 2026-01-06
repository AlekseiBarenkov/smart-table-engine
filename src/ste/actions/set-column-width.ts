import type { SteId, SteTableState } from '@/ste/core';

export type SteSetColumnWidthArgs<ColId extends SteId = SteId> = {
  colId: ColId;
  width: number;
  minWidth?: number;
  maxWidth?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const setColumnWidth = <RowId extends SteId = SteId, ColId extends SteId = SteId>(args: {
  state: SteTableState<RowId, ColId>;
  columnWidth: SteSetColumnWidthArgs<ColId> | null;
}): { prev: SteTableState<RowId, ColId>; next: SteTableState<RowId, ColId> } => {
  const prev = args.state;

  if (!args.columnWidth) {
    if (!prev.columnSizing) {
      return { prev, next: prev };
    }

    const next: SteTableState<RowId, ColId> = { ...prev };
    delete (next as { columnSizing?: unknown }).columnSizing;

    return { prev, next };
  }

  const min = Math.max(0, args.columnWidth.minWidth ?? 0);
  const max = Math.max(min, args.columnWidth.maxWidth ?? Number.POSITIVE_INFINITY);
  const nextWidth = clamp(args.columnWidth.width, min, max);

  const nextMap = new Map(prev.columnSizing ?? []);
  nextMap.set(args.columnWidth.colId, nextWidth);

  const next: SteTableState<RowId, ColId> = {
    ...prev,
    columnSizing: nextMap,
  };

  return { prev, next };
};
