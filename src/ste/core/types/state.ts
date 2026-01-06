import type { SteId } from './meta';

export type SteSortingDirection = 'asc' | 'desc';

export type SteSorting<ColId extends SteId = SteId> = {
  colId: ColId;
  direction: SteSortingDirection;
};

export type StePagination = {
  page: number;
  pageSize: number;
};

export type SteSelection<RowId extends SteId = SteId> = {
  mode: 'none' | 'single' | 'multiple';
  selectedRowIds: ReadonlySet<RowId>;
};

export type SteColumnSizing<ColId extends SteId = SteId> = ReadonlyMap<ColId, number>;

export type SteTableState<RowId extends SteId = SteId, ColId extends SteId = SteId> = {
  sorting?: SteSorting<ColId>;
  pagination?: StePagination;
  selection?: SteSelection<RowId>;
  columnSizing?: SteColumnSizing<ColId>;
};
