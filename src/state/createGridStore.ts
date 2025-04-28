import { create } from 'zustand';
import { type GridColumnInit, type GridSortBy, type GridSortDirection, GridStore } from './gridStore';

// Store state
interface GridState<T extends Record<string, any>> {
  allSelected: boolean;
  columns: GridColumnInit[];
  totalRows: number;
  gridStore: GridStore<T>;
  visibleRows: number[];
  selectedRows: number[];
  sortState: { field: GridSortBy<T>, direction: GridSortDirection }; 
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  initializeGrid: (columns: GridColumnInit[], data: T[]) => void;
  updateCell: (rowIndex: number, fieldName: string, value: any) => void;
  sortBy: (field: string, direction: 'asc' | 'dsc' | null) => void;
  search: (query: string) => void;
  selectRow: (rowIndex: number, selected: boolean) => void;
  toggleRowSelection: (rowIndex?: number) => void;
  getCellValue: (rowIndex: number, fieldName: string) => any;
  fetchData: <R = T>(
    columns: GridColumnInit[], 
    url: string, 
    options?: RequestInit,
    transformer?: (data: any) => R[]
  ) => Promise<void>;
}

export const createGridStore = <T extends Record<string, any>>() => {
  const gridStoreInstance = new GridStore<T>();
  return create<GridState<T>>((set, get) => ({
    allSelected: false,
    columns: [],
    totalRows: 0,
    gridStore: gridStoreInstance,
    visibleRows: [],
    selectedRows: [],
    sortState: { field: null, direction: null },
    isLoading: false,
    isReady: false,
    error: null,

    initializeGrid: (columns, data) => {
        const { gridStore } = get();
        gridStore.init(columns, data);
        
        set({
          isReady: true,
          columns,
          totalRows: data.length,
          visibleRows: gridStore.getVisibleRows(),
          selectedRows: gridStore.getSelectedRows(),
          sortState: gridStore.getSortState(),
          error: null
        });
      },

    updateCell: (rowIndex, fieldName, value) => {
      const { gridStore } = get();
      gridStore.updateCell(rowIndex, fieldName, value);
      
      set({
        visibleRows: gridStore.getVisibleRows()
      });
    },
    
    sortBy: (field, direction) => {
      const { gridStore } = get();
      gridStore.sort(field as any, direction);
      
      set({
        visibleRows: gridStore.getVisibleRows(),
        sortState: gridStore.getSortState()
      });
    },
    
    search: (query) => {
      const { gridStore } = get();
      gridStore.search(query);
      set({
        visibleRows: gridStore.getVisibleRows()
      });
    },
    
    selectRow: (rowIndex, selected) => {
      const { gridStore } = get();
      gridStore.selectRow(rowIndex, selected);
      
      set({
        selectedRows: gridStore.getSelectedRows()
      });
    },
    
    toggleRowSelection: (rowIndex) => {
      const { allSelected, gridStore, selectedRows, visibleRows } = get();
      if(rowIndex) {
        gridStore.toggleRowSelection(rowIndex);
      } else {
        gridStore.selectAllVisible(!allSelected)
      }

      set({
        allSelected: selectedRows.length === visibleRows.length,
        selectedRows: gridStore.getSelectedRows()
      });
    },
    
    getCellValue: (rowIndex, fieldName) => {
      return get().gridStore.getCellValue(rowIndex, fieldName);
    },
    fetchData: async(columns, url, options, transformer) => {
        try {
            set({ isLoading: true, error: null });
            
            const response = await fetch(url, options);
            
            if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
            }
            
            const rawData = await response.json();
            
            // Transform data if transformer provided, otherwise use raw data
            const processedData = transformer ? transformer(rawData) : rawData;
            
            // Initialize the grid with the processed data
            get().initializeGrid(columns, processedData);
            
            set({ isLoading: false });
        } catch (error) {
            set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
  }));
};
