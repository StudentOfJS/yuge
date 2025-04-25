import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef } from "react";
import { useGridStores } from "../hooks/useGridStores";
import { storeInstanceID } from "./Grid";
import GridSingleRow from "./GridSingleRow";

type GridRowsProps = {
    tableHeight: number
}

function GridRows({ tableHeight }: GridRowsProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const { useGridStore } = useMemo(() => useGridStores(storeInstanceID), [storeInstanceID])
    const { visibleRows } = useGridStore()
    const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getItemKey: (index: number) => visibleRows[index],
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Estimated row height - add way to instantiate this
    overscan: 5, // Number of items to render outside of view - and this
    });

    return (
        <div 
        ref={parentRef}
        className="virtual-table-body"
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
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
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
