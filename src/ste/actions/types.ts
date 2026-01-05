import type { SteId, SteTableState } from '@/ste/core';

export type SteActionResult<State> = {
  prev: State;
  next: State;
};

export type SteStateAction<RowId extends SteId = SteId, ColId extends SteId = SteId> = (args: {
  state: SteTableState<RowId, ColId>;
}) => SteActionResult<SteTableState<RowId, ColId>>;
