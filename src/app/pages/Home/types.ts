export type DemoRow = {
  id: number;
  name: string;
  age: number;
};

export const DEMO_COL_IDS = {
  name: 'name',
  age: 'age',
} as const;

export type DemoColId = (typeof DEMO_COL_IDS)[keyof typeof DEMO_COL_IDS];
