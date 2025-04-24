import { createColumnResizeStore } from "../state/createColumnResizeStore";
import { createGridStore } from "../state/createGridStore";

// storeRegistry.ts
const gridStores = new Map<string, ReturnType<typeof createGridStore>>();
const resizeStores = new Map<string, ReturnType<typeof createColumnResizeStore>>();

export function useGridStores(gridId: string) {
  if (!gridStores.has(gridId)) {
    gridStores.set(gridId, createGridStore());
  }
  
  if (!resizeStores.has(gridId)) {
    resizeStores.set(gridId, createColumnResizeStore());
  }
  
  return {
    useGridStore: gridStores.get(gridId)!,
    useResizeStore: resizeStores.get(gridId)!
  };
}

export function cleanupGridStores(gridId: string) {
  gridStores.delete(gridId);
  resizeStores.delete(gridId);
}