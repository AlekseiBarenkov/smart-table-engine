import type { SteId, SteMeta } from './meta';

export const STE_COLUMN_KINDS = {
  data: 'data',
  computed: 'computed',
} as const;

export type SteColumnKind = (typeof STE_COLUMN_KINDS)[keyof typeof STE_COLUMN_KINDS];

export type SteColumn<ColId extends SteId = SteId> = {
  id: ColId;
  title: string;

  kind?: SteColumnKind;

  /**
   * Optional hints for rendering / formatting.
   * Core doesn't interpret these, UI layer may.
   */
  meta?: SteMeta;
};
