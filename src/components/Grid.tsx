import { useRef, useEffect, ReactElement } from "react";

import { type GridColumnInit } from "../state/gridStore";
import "../style/index.css"
import { createResizeStore } from "../state/createResizeStore";
import { createGridStore } from "../state/createGridStore";

type GridProps = {
    children: ReactElement | Array<ReactElement>
    columns: Array<GridColumnInit>;
    data?: Record<string, any>[];
    optionalEndpoint?: {url:string, options?: RequestInit};
    className?: string
}

export const useResizeStore = createResizeStore()
export const useGridStore = createGridStore()

function Grid({
    children,
    columns,
    data,
    optionalEndpoint,
    className
  }: GridProps) {
    // Use the stores
    const isReady = useGridStore(state => state.isReady)
    const initializeGrid = useGridStore(state => state.initializeGrid)
    const fetchData = useGridStore(state => state.fetchData)
    const initializeColumns = useResizeStore(state => state.initializeColumns);
    const updateContainerWidth = useResizeStore(state => state.updateContainerWidth);
    
    // Measure container width
    const gridRef = useRef<HTMLDivElement>(null);

    // Initialize when data and columns are available
    useEffect(() => {
      if (data && columns) {
        initializeGrid(columns, data);
      }
    }, [data, columns]);

    // Fetch and initialize data if optionalEndpoint and columns are available
    useEffect(() => {
        if (optionalEndpoint && columns) {
            fetchData(columns, optionalEndpoint.url, optionalEndpoint.options);
        }
      }, [optionalEndpoint, columns, fetchData]);

      // Initialize columns on mount and when container size changes
      useEffect(() => {
        if (gridRef.current) {
          const { width } = gridRef.current.getBoundingClientRect();
          initializeColumns(columns, width);
          
          // Set up resize observer
          const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            updateContainerWidth(width);
          });
          
          resizeObserver.observe(gridRef.current);
          return () => resizeObserver.disconnect();
        }
      }, [columns]);

    
    return (
      <div
        className={className ?? "w-full overflow-auto p-6"}
        ref={gridRef}
      >
        {
          isReady && children
        }
      </div>
    );
  }

  export default Grid;