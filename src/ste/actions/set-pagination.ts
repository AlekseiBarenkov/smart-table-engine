import type { SteId, SteTableState } from '@/ste/core';

export type SteSetPaginationArgs = {
  page: number;
  pageSize: number;
};

export const setPagination = <RowId extends SteId = SteId, ColId extends SteId = SteId>(args: {
  state: SteTableState<RowId, ColId>;
  pagination: SteSetPaginationArgs | null;
}): { prev: SteTableState<RowId, ColId>; next: SteTableState<RowId, ColId> } => {
  const prev = args.state;

  if (!args.pagination) {
    if (!prev.pagination) {
      return { prev, next: prev };
    }

    const next: SteTableState<RowId, ColId> = { ...prev };
    delete (next as { pagination?: unknown }).pagination;

    return { prev, next };
  }

  const next: SteTableState<RowId, ColId> = {
    ...prev,
    pagination: {
      page: Math.max(0, args.pagination.page),
      pageSize: Math.max(1, args.pagination.pageSize),
    },
  };

  return { prev, next };
};
