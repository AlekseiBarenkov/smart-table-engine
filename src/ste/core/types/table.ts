import type { SteId, SteMeta } from './meta';
import type { SteColumn } from './column';
import type { SteRow } from './row';
import type { SteTableState } from './state';

export type SteTable<
  RowId extends SteId = SteId,
  ColId extends SteId = SteId,
  RowData = unknown,
> = {
  id: SteId;

  columns: ReadonlyArray<SteColumn<ColId>>;

  /**
   * Row list is kept minimal; data is stored separately in the adapter.
   */
  rows: ReadonlyArray<SteRow<RowId>>;

  /**
   * Optional row payload map (in-memory scenarios).
   * Data adapter may ignore this and provide its own accessors.
   */
  rowDataById?: ReadonlyMap<RowId, RowData>;

  state: SteTableState<RowId, ColId>;

  meta?: SteMeta;
};
