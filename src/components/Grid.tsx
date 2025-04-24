import { useMemo, useRef, useEffect } from "react";
import { useGridStores } from "../hooks/useGridStores";

type GridProps = {
    id: string;
    columns: any;
    data?: any;
    optionalEndpoint?: {url:string, options?: RequestInit};
    onResize?: () => void;
}

function Grid({ 
    id, 
    columns, 
    data,
    optionalEndpoint,
    onResize 
  }: GridProps) {
    // Get stores for this grid instance
    const { useGridStore, useResizeStore } = useMemo(
      () => useGridStores(id), 
      [id]
    );
    
    // Use the stores
    const { 
      initializeGrid,
      fetchData
    } = useGridStore();
    
    const { 
      initializeColumns,
      updateContainerWidth
    } = useResizeStore();
    
    // Measure container width
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        updateContainerWidth(width);
      }
    }, [updateContainerWidth]);
    
    // Initialize when data and columns are available
    useEffect(() => {
      if (data && columns) {
        initializeGrid(data, columns);
        initializeColumns(columns, containerRef.current?.clientWidth || 1000);
      }
    }, [data, columns]);
// fetch and initialize data if optionalEndpoint and columns
    useEffect(() => {
        if (optionalEndpoint && columns) {
            fetchData(columns, optionalEndpoint.url, optionalEndpoint.options);
          initializeColumns(columns, containerRef.current?.clientWidth || 1000);
        }
      }, [optionalEndpoint, columns, fetchData]);
    
    // Render grid with both store states
    return (
      <div ref={containerRef}>
        {/* Grid implementation using both store states */}
      </div>
    );
  }

  export default Grid;