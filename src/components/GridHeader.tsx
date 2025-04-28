import { useRef } from 'react';
import { useGridStore, useResizeStore } from './Grid';
import { GridColumnInit } from '../state/gridStore';
import { ColumnResizer } from './ColumnResizer';


// Example grid header that uses resizable columns
const GridHeader: React.FC<{ columns: GridColumnInit[] }> = ({ columns }) => {
  const { sortState, sortBy } = useGridStore()
  const headerRef = useRef<HTMLDivElement>(null)
  const gridTemplateColumns = useResizeStore(state => state.gridTemplateColumns)

  return (
    <div
      className={`relative grid items-center border-y border-gray-300 shadow-md`}
      style={{ gridTemplateColumns }}
      ref={headerRef}
    >
      {/* {
        columns.slice(0, columns.length - 1).map(column => (
          <ColumnResizer key={column.fieldName} fieldName={column.fieldName} headerRef={headerRef} />
        ))
      } */}
      {columns.map((column, index) => (
        <div
          key={`header-${index}`}
          className="px-4 py-2 font-semibold text-gray-700 border-x border-gray-300"
        >
          <button
            className="flex items-center font-semibold bg-transparent w-full h-full"
            onClick={() => column.isSortable && sortBy(column.fieldName, sortState.direction === "dsc" ? "asc" : "dsc")}
          >
            <div className="flex-1 truncate">{column.displayName}</div>

            {column.isSortable && (sortState.field === column.fieldName ? (sortState.direction === 'asc' ? '↑' : '↓') : '↓↑')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default GridHeader