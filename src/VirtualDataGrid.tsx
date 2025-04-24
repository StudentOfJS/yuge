// @todo - move virtualizer to Grid with latest store implementation
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';


function VirtualDataGrid({ 
  headers,
  tableHeight = 500,
}: { 
  headers: Array<{ key: keyof V, label: string, sortable: boolean, filterable: boolean, defaultWidth: number }>,
  tableHeight?: number,
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const filterableKeys = headers.filter(header => header.filterable).map(header => header.key);
  const {
    filteredKeys,
    searchQuery,
    handleSearch,
    sortColumn,
    sortDirection,
    handleSort
  } = useDataFilter(
    dataStore,
    filterableKeys,
    defaultFilterBy ?? filterableKeys[0],
    defaultSortDirection
  );
  
  const rowVirtualizer = useVirtualizer({
    count: filteredKeys.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // Estimated row height
    overscan: 5, // Number of items to render outside of view
  });
  
  return (
    <div className="data-grid-container">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
      </div>
      
      <div className="table-header">
        {
          headers.map(header => (
            <button 
              key={header.key as string}
              className={`header-cell ${sortColumn === header.key ? 'sorted-' + sortDirection : ''}`}
              onClick={() => header.sortable && handleSort(header.key)}
              style={{ width: header.defaultWidth }}
            >
              {header.label} {sortColumn === header.key && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          ))
        }
      </div>
      
      {/* Virtual list container */}
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
            const key = filteredKeys[virtualRow.index];
            const row = dataStore.get(key);
            
            if (!row) return null;
            
            return (
              <div
                key={key as string}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className={`table-row ${dataStore.isSelected(key) ? 'selected' : ''} ${dataStore.isChanged(key) ? 'changed' : ''}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() => dataStore.markSelected(key, !dataStore.isSelected(key))}
              >
                <div className="table-cell">{row.name}</div>
                <div className="table-cell">{row.status}</div>
                {/* More cells */}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="table-footer">
        Showing {filteredKeys.length} of {dataStore.size} items
      </div>
    </div>
  );
}

export default VirtualDataGrid;