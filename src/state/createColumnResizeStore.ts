// columnResizeStore.ts
import { create } from 'zustand';
import { type ColumnConfig, ColumnResizeManager } from './columnResizeManager';

interface ColumnResizeState {
  columnWidths: Record<string, number>;
  containerWidth: number;
  
  // Actions
  initializeColumns: (columns: Array<ColumnConfig>, containerWidth: number) => void;
  resizeColumn: (fieldName: string, width: number) => void;
  updateContainerWidth: (width: number) => void;
}

export const createColumnResizeStore = () => {
  let resizeManager: ColumnResizeManager | null = null;
  
  return create<ColumnResizeState>((set) => ({
    columnWidths: {},
    containerWidth: 1000,
    
    initializeColumns: (columns, containerWidth) => {
      resizeManager = new ColumnResizeManager({
        containerWidth,
        columns: columns.map(col => ({
          fieldName: col.fieldName,
          width: col.width || 150,
          minWidth: col.minWidth || 50,
          maxWidth: col.maxWidth,
          flex: col.flex || 0
        }))
      });
      
      set({ 
        columnWidths: resizeManager.getAllWidths(),
        containerWidth
      });
    },
    
    resizeColumn: (fieldName, width) => {
      if (!resizeManager) return;
      
      resizeManager.resizeColumn(fieldName, width);
      set({ columnWidths: resizeManager.getAllWidths() });
    },
    
    updateContainerWidth: (width) => {
      if (!resizeManager) return;
      
      resizeManager.setContainerWidth(width);
      set({ 
        columnWidths: resizeManager.getAllWidths(),
        containerWidth: width
      });
    }
  }));
};