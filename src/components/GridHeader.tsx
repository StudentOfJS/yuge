import { useEffect, useMemo, useRef, useState } from "react";
import { useGridStores } from "../hooks/useGridStores";
import { type GridColumnInit } from "../state/gridStore";

type GridHeaderProps = {
    id: string;
    headers: Array<GridColumnInit>
}

function GridHeader({id, headers}: GridHeaderProps) {
    // Get stores for this grid instances
    const { useResizeStore, useGridStore } = useMemo(
        () => useGridStores(id), 
        [id]
    )

    const {
        containerWidth,
        columnWidths,
        resizeColumn,
    } = useResizeStore()

    const { sortState, sortBy } = useGridStore()

    return (
            <div className="relative" style={{width: containerWidth}}>
            {
            headers.map(header => (
                <button 
                    key={header.fieldName}
                    className={`header-cell ${sortState.field === header.fieldName ? 'sorted-' + sortState.direction : ''}`}
                    onClick={() => header.isSortable && sortBy(header.fieldName, sortState.direction === "dsc" ? "asc" : "dsc")}
                    style={{ width: columnWidths[header.fieldName] }}
                >
                    {header.displayName} {sortState.field === header.fieldName && (sortState.direction === 'asc' ? '↑' : '↓')}
                </button>
            ))
            }
        </div>
    )
}

export default GridHeader


  // Column resizable header component
  function ColumnResize({
    column,
    id,
  }: {
    column: GridColumnInit;
    id: string;
  }) {
    const [isResizing, setIsResizing] = useState(false);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const { useResizeStore } = useMemo(
        () => useGridStores(id), 
        [id]
    )

    const {
        columnWidths,
        resizeColumn,
    } = useResizeStore()
  
    const handleResizeStart = (e: React.MouseEvent) => {
      setIsResizing(true);
      startX.current = e.clientX;
      startWidth.current = columnWidths[column.fieldName];
      e.preventDefault();
    };
  
    const handleResizeEnd = () => {
      setIsResizing(false);
    };
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const diff = e.clientX - startX.current;
        const newWidth = Math.max(50, startWidth.current + diff); // Minimum width of 50px
        if (column.isSortable) {
            resizeColumn(column.fieldName, newWidth);
        }
      };
  
      if (isResizing) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleResizeEnd);
      }
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }, [isResizing, column.fieldName, resizeColumn]);
  
    return (
      <div
        className="absolute top-0 flex items-center px-4 font-semibold border-b border-r border-gray-300 bg-gray-100"
        style={{
          width: columnWidths[column.fieldName],
          left: columnOffsets[index] + 1.5,
          height: '100%',
        }}
      >
        <div className="flex-1 truncate">{column.displayName}</div>
  
        {/* Resize handle */}
        <div
          className={`w-1 absolute right-0 top-0 h-full cursor-col-resize hover:bg-blue-500 ${
            isResizing ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onMouseDown={handleResizeStart}
        />
      </div>
    );
  }