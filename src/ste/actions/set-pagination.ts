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

  const next: SteTableState<RowId, ColId> = args.pagination
    ? {
        ...prev,
        pagination: {
          page: Math.max(0, args.pagination.page),
          pageSize: Math.max(1, args.pagination.pageSize),
        },
      }
    : (() => {
        const { pagination: _pagination, ...rest } = prev;
        return rest;
      })();

  return { prev, next };
};
