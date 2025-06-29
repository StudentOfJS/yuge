import { useRef } from 'react';
import { useGridStore, useResizeStore } from './Grid';
// Use the type from the resize store which guarantees width exists
// Assuming GridColumn type is exported from createResizeStore, otherwise adjust import
import { ColumnResizer } from './ColumnResizer';

const GridHeader = () => {
  const { sortState, sortBy } = useGridStore()
  const headerRef = useRef<HTMLDivElement>(null)
  // Select state pieces individually to prevent unnecessary re-renders
  const columns = useResizeStore(state => state.columns);
  const gridTemplateColumns = useResizeStore(state => state.gridTemplateColumns);
  const isResizing = useResizeStore(state => state.isResizing);

  return (
    <div
      className={`relative grid items-center border-y border-gray-300 shadow-md ${isResizing ? 'select-none' : ''}`} // Prevent text selection during resize
      style={{ gridTemplateColumns }}
      ref={headerRef}
    >
      {/* Remove the old commented out block */}
      {columns.map((column, index) => (
        <div
          key={`header-${column.fieldName}`} // Use fieldName for a more stable key
          // Add relative positioning context for the absolute resizer and manage borders
          className="relative px-4 py-2 font-semibold text-gray-700 border-r border-gray-300 last:border-r-0" // Use border-r for consistency
          // Add ID for ARIA accessibility
          id={column.fieldName}
        >
          <button
            className="flex items-center font-semibold bg-transparent w-full h-full"
            onClick={() => column.isSortable && sortBy(column.fieldName, sortState.direction === "dsc" ? "asc" : "dsc")}
            disabled={isResizing} // Disable sorting while resizing
          >
            <div className="flex-1 truncate">{column.displayName}</div>

            {column.isSortable && (sortState.field === column.fieldName ? (sortState.direction === 'asc' ? '↑' : '↓') : '↓↑')}
          </button>

          {/* Render resizer for all columns except the last one */}
          {index < columns.length - 1 && (
            <ColumnResizer
              key={`resizer-${column.fieldName}`}
              col1FieldName={column.fieldName}
              col2FieldName={columns[index + 1].fieldName}
              // headerRef={headerRef} // Pass if needed later
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default GridHeader;