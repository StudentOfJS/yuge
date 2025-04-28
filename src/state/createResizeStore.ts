import { create } from 'zustand';
import { type GridColumnInit } from './gridStore';

interface ColumnResizeState {
  defaultGridTemplateColumns: string;
  gridTemplateColumns: string;
  columnLookup: Map<string, string>;
  containerWidth: number
  totalSetWidth: number
  
  // Actions
  initializeColumns: (columns: GridColumnInit[], containerWidth: number) => void;
  resizeColumn: (fieldName: string, deltaWidth: number) => void;
  updateContainerWidth: (width: number) => void;
  resetToInitialSizes: () => void;
}


export const createResizeStore = () => create<ColumnResizeState>((set, get) => ({
  defaultGridTemplateColumns: "",
  gridTemplateColumns: "",
  columnLookup: new Map(),
  containerWidth: 1000,
  totalSetWidth: 0,
  
  initializeColumns: (columns, containerWidth) => {
    let columnLookup = new Map()
    let gridTemplateColumns = ""
    let totalSetWidth = 0
    columns.forEach((col, i) => {
      let isNotLast = i < columns.length - 1
      if(isNotLast) {
        columnLookup.set(col.fieldName, `${col.width ?? 200}px`)
        gridTemplateColumns += `${col.width ?? 200}px `
      } else {
        gridTemplateColumns += "auto"
      }
    })
    console.log(gridTemplateColumns)
    set({
      containerWidth,
      gridTemplateColumns,
      defaultGridTemplateColumns: gridTemplateColumns,
      columnLookup,
      totalSetWidth
    });
  },
  
  resizeColumn: (fieldName: string, width: number) => {
    set(({containerWidth, columnLookup, totalSetWidth}) => {
      const updatedColumnLookup = new Map(columnLookup)
      let diff = width
      if(totalSetWidth + width > containerWidth - 50) {
        diff += containerWidth - 50 - totalSetWidth
      }
      updatedColumnLookup.set(fieldName, `${diff}px`)
      const gridTemplateColumns = [...updatedColumnLookup.values()].join(" ")
      return { columnLookup: updatedColumnLookup, totalSetWidth: totalSetWidth + diff, gridTemplateColumns }
    });
  },
  
  updateContainerWidth: (width: number) => {
    set(({columnLookup, defaultGridTemplateColumns}) => {
      const updatedColumnLookup = new Map(columnLookup)
      const keys = updatedColumnLookup.keys()
      defaultGridTemplateColumns.split(" ").forEach((col) => updatedColumnLookup.set(keys.next(), col))
      return {gridTemplateColumns: defaultGridTemplateColumns, columnLookup: updatedColumnLookup, containerWidth: width}
    })
  },
  
  resetToInitialSizes: () => {
    // Reset to initial column sizes
    const { containerWidth } = get();
    get().updateContainerWidth(containerWidth);
  }
}));