import { useEffect, useMemo, useRef, useState } from 'react';
import s from './Home.module.css';
import { DEMO_COL_IDS, type DemoColId, type DemoRow } from './types';
import { createTableEngine, type SteTable } from '@/ste';
import { createMemoryAdapter } from '@/app/ste-demo/adapters/memory-adapter';
import { useTableEngineState } from '@/app/hooks/use-table-engine-state';

type DemoRowId = DemoRow['id'];

const DEMO_ROWS: ReadonlyArray<{ id: DemoRowId; data: DemoRow }> = [
  { id: 1, data: { id: 1, name: 'Alex', age: 25 } },
  { id: 2, data: { id: 2, name: 'Maria', age: 31 } },
  { id: 3, data: { id: 3, name: 'John', age: 19 } },
  { id: 4, data: { id: 4, name: 'Kate', age: 27 } },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const Home = () => {
  const table = useMemo<SteTable<DemoRowId, DemoColId, DemoRow>>(
    () => ({
      id: 'demo-table',
      columns: [
        { id: DEMO_COL_IDS.name, title: 'Name', kind: 'data', width: 220, minWidth: 160 },
        { id: DEMO_COL_IDS.age, title: 'Age', kind: 'data', width: 120, minWidth: 100 },
      ],
      rows: DEMO_ROWS.map((x) => ({ id: x.id })),
      state: {
        pagination: { page: 0, pageSize: 10 },
        // columnSizing можно не задавать — появится при первом ресайзе
      },
    }),
    [],
  );

  const adapter = useMemo(
    () =>
      createMemoryAdapter<DemoRowId, DemoColId, DemoRow>({
        rows: DEMO_ROWS,
        getCellValue: ({ row, colId }) => row[colId],
        sort: ({ rows, sorting }) => {
          const dir = sorting.direction === 'asc' ? 1 : -1;
          const colId = sorting.colId;

          return [...rows].sort((a, b) => {
            const va = a.data[colId];
            const vb = b.data[colId];

            if (typeof va === 'number' && typeof vb === 'number') {
              return (va - vb) * dir;
            }
            return String(va).localeCompare(String(vb)) * dir;
          });
        },
      }),
    [],
  );

  const engine = useMemo(
    () =>
      createTableEngine<DemoRowId, DemoColId, DemoRow>({
        table,
        adapter,
      }),
    [table, adapter],
  );

  useTableEngineState(engine);

  const [data, setData] = useState<ReadonlyArray<{ id: DemoRowId; data: DemoRow }>>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);

  const columns = engine.getTable().columns;

  const dragRef = useRef<{
    colId: DemoColId;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const load = async () => {
    const res = await engine.query();
    setData(res.rows);
    setTotal(res.total);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSort = (colId: DemoColId) => {
    const prev = engine.getState().sorting;
    const nextDirection: 'asc' | 'desc' = prev?.colId === colId && prev.direction === 'asc' ? 'desc' : 'asc';

    engine.setSorting({ colId, direction: nextDirection });
    void load();
  };

  const gridTemplateColumns = columns
    .map((c) => {
      const min = Math.max(80, c.minWidth ?? 120);
      const w = engine.getColumnWidth(c.id) ?? c.width ?? min;
      return `${Math.max(min, w)}px`;
    })
    .join(' ');

  const onResizePointerDown = (e: React.PointerEvent<HTMLSpanElement>, colId: DemoColId) => {
    e.preventDefault();
    e.stopPropagation();

    const col = columns.find((x) => x.id === colId);
    const minWidth = Math.max(80, col?.minWidth ?? 120);

    const startWidth = engine.getColumnWidth(colId) ?? col?.width ?? minWidth;

    dragRef.current = {
      colId,
      startX: e.clientX,
      startWidth,
      minWidth,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onResizePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }

    const dx = e.clientX - drag.startX;
    const nextWidth = clamp(drag.startWidth + dx, drag.minWidth, 2000);

    engine.setColumnWidth({
      colId: drag.colId,
      width: nextWidth,
      minWidth: drag.minWidth,
      maxWidth: 2000,
    });
  };

  const onResizePointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div className={s.root}>
      <div className={s.header}>
        <h2 className={s.title}>STE Demo (Grid + Resize)</h2>
        <div className={s.meta}>Total: {total ?? '—'}</div>
      </div>

      <div className={s.gridWrap}>
        <div
          className={s.grid}
          style={{ gridTemplateColumns }}
          role="table"
          aria-rowcount={total ?? data.length}
          aria-colcount={columns.length}
        >
          {/* header */}
          {columns.map((c) => (
            <div key={`h-${String(c.id)}`} className={s.th} role="columnheader">
              <div className={s.thInner}>
                <button type="button" className={s.thButton} onClick={() => onSort(c.id)}>
                  {c.title}
                </button>

                <span
                  className={s.resizeHandle}
                  role="separator"
                  aria-orientation="vertical"
                  aria-label={`Resize ${c.title}`}
                  onPointerDown={(e) => onResizePointerDown(e, c.id)}
                  onPointerMove={onResizePointerMove}
                  onPointerUp={onResizePointerUp}
                  onPointerCancel={onResizePointerUp}
                />
              </div>
            </div>
          ))}

          {/* body */}
          {data.flatMap(({ id, data: row }) =>
            columns.map((c) => (
              <div key={`${String(id)}:${String(c.id)}`} className={s.td} role="cell">
                {String(engine.getCellValue({ row, colId: c.id }))}
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
