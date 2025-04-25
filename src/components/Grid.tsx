import { useMemo, useRef, useEffect, ReactElement } from "react";
import { useGridStores } from "../hooks/useGridStores";
import { type GridColumnInit } from "../state/gridStore";
import { type ColumnConfig } from "../state/columnResizeManager";
import { idGenerator } from "../utils";

type GridProps = {
    children: ReactElement
    columns: Array<ColumnConfig>;
    headers: Array<GridColumnInit>;
    data?: any;
    optionalEndpoint?: {url:string, options?: RequestInit};
}

export const storeInstanceID = idGenerator.generate();

function Grid({
    children,
    columns,
    headers,
    data,
    optionalEndpoint,
  }: GridProps) {
    // Get stores for this grid instances
    const { useGridStore, useResizeStore } = useMemo(
      () => useGridStores(storeInstanceID), 
      [storeInstanceID]
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
    
    // Initialize when data and headers are available
    useEffect(() => {
      if (data && headers) {
        initializeGrid(headers, data);
      }
    }, [data, headers]);

    // Fetch and initialize data if optionalEndpoint and headers are available
    useEffect(() => {
        if (optionalEndpoint && headers) {
            fetchData(headers, optionalEndpoint.url, optionalEndpoint.options);
        }
      }, [optionalEndpoint, headers, fetchData]);

      // Setup column widths
      useEffect(() => {
        if (columns) {
          initializeColumns(columns, containerRef.current?.clientWidth || 1000);
        }
      }, [columns, initializeColumns]);
    
    return (
      <div
        className="w-full"
        ref={containerRef}
      >
        {children}
        {/* <label htmlFor={storeInstanceID+"search"}>Search</label>
        <GridSearch />
        <GridHeader headers={headers} />
        <GridRows tableHeight={tableHeight} />
        <GridFooter /> */}
      </div>
    );
  }

  export default Grid;