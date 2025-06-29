import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import GridSingleRow from "./GridSingleRow";
import { useGridStore } from "./Grid";

type GridRowsProps = {
    rowHeight?: number
    rowOverscan?: number
    tableHeight: number
}

function GridRows({ rowHeight, rowOverscan, tableHeight }: GridRowsProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const visibleRows = useGridStore(state => state.visibleRows)
    const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getItemKey: (index: number) => visibleRows[index],
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight ?? 60, // Estimated row height - add way to instantiate this
    overscan: rowOverscan ?? 5, // Number of items to render outside of view - and this
    });

    return (
        <div 
        ref={parentRef}
        className="w-full"
        style={{
          height: tableHeight, // Fixed height container
          overflow: 'auto', // Enable scrolling
        }}
      >
        {/* Total size div */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Virtualized rows */}
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            return (
              <div
                className="flex w-full absolute top-0 left-0 border-collapse border border-gray-400"
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <GridSingleRow rowIndex={Number(virtualRow.key)} />
              </div>
            );
          })}
        </div>
      </div>      
    )
}

export default GridRows
