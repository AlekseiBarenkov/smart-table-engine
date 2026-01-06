import { useSyncExternalStore } from 'react';

import type { SteTableEngine } from '@/ste';

export const useTableEngineState = <RowId extends string | number, ColId extends string | number, RowData>(
  engine: SteTableEngine<RowId, ColId, RowData>,
) => {
  const subscribe = (onStoreChange: () => void) =>
    engine.subscribe(() => {
      onStoreChange();
    });

  const getSnapshot = () => engine.getState();

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
