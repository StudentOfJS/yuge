import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useGridStores } from "../hooks/useGridStores";
import { storeInstanceID } from "./Grid";

import { type GridColumnInit } from "../state/gridStore";

type GridHeaderProps = {
    headers: Array<GridColumnInit>
}

function GridHeader({headers}: GridHeaderProps) {
    const { useResizeStore } = useMemo(() => useGridStores(storeInstanceID), [storeInstanceID])
    const { containerWidth } = useResizeStore()

    return (
            <div className="flex w-full" style={{width: containerWidth}}>
            {
            headers.map(header => (
                <Fragment key={header.fieldName}><ColumnHead column={header} /></Fragment>
            ))
            }
        </div>
    )
}

export default GridHeader


  // Column resizable header component
  function ColumnHead({ column }: { column: GridColumnInit }) {
    const [isResizing, setIsResizing] = useState(false);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const { useResizeStore, useGridStore } = useMemo(
        () => useGridStores(storeInstanceID), 
        [storeInstanceID]
    )
    const { sortState, sortBy } = useGridStore()
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
      <button
        className="relative flex items-center px-4 font-semibold border-b border-r border-gray-300 bg-gray-100"
        style={{
          width: columnWidths[column.fieldName],
          height: '100%',
        }}
        onClick={() => column.isSortable && sortBy(column.fieldName, sortState.direction === "dsc" ? "asc" : "dsc")}
      >
        <div className="flex-1 truncate">{column.displayName}</div>

        {column.isSortable && (sortState.field === column.fieldName ? (sortState.direction === 'asc' ? '↑' : '↓'): '↓↑')}
  
        {/* Resize handle */}
        <div
          className={`w-1 absolute right-0 top-0 bottom-0 cursor-col-resize hover:bg-blue-500 ${
            isResizing ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onMouseDown={handleResizeStart}
        />
      </button>
    );
  }