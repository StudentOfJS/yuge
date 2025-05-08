import { create } from 'zustand';
import { type GridColumnInit } from './gridStore';

// Export the type for use in other components
export type GridColumn = Omit<GridColumnInit, 'width'> & {
  width: number; // Width in pixels
  initialWidth: number; // Store initial width for reset
};

interface ColumnResizeState {
  columns: GridColumn[]; // Use an array to store column state
  gridTemplateColumns: string; // CSS grid-template-columns string
  containerWidth: number;
  isResizing: boolean; // Track if a resize is in progress

  // Actions
  initializeColumns: (columns: GridColumnInit[], containerWidth: number) => void;
  // New action for resizing adjacent columns
  updateColumnWidths: (col1FieldName: string, col1Width: number, col2FieldName: string, col2Width: number) => void;
  updateContainerWidth: (width: number) => void;
  resetToInitialSizes: () => void;
  setIsResizing: (isResizing: boolean) => void; // Action to set resizing state
}

// Default minimum width
const MIN_COLUMN_WIDTH = 50; // px

// Helper to calculate the grid-template-columns string
const calculateGridTemplateColumns = (columns: GridColumn[]): string => {
  // Manage all columns explicitly for now.
   return columns.map(col => `${col.width}px`).join(' ');
};


export const createResizeStore = () => create<ColumnResizeState>((set, get) => ({
  columns: [],
  gridTemplateColumns: "",
  containerWidth: 0,
  isResizing: false,

  initializeColumns: (initialColumns, containerWidth) => {
    let totalExplicitWidth = 0;
    let columnsWithoutWidthCount = 0;

    // First pass: assign explicit widths and count columns without width
    const tempColumns = initialColumns.map(col => {
      const width = col.width ?? 0; // Use 0 as placeholder if undefined
      if (width > 0) {
        totalExplicitWidth += Math.max(width, MIN_COLUMN_WIDTH); // Ensure min width
      } else {
        columnsWithoutWidthCount++;
      }
      // Ensure initial width respects minimum
      const initialWidth = Math.max(col.width ?? 0, MIN_COLUMN_WIDTH);
      return {
        ...col,
        width: initialWidth, // Apply min width here too
        initialWidth: initialWidth // Store initial for reset
      };
    });

    // Calculate available width for distribution
    // Ensure availableWidth is not negative
    const availableWidth = Math.max(0, containerWidth - totalExplicitWidth);
    const widthPerColumn = columnsWithoutWidthCount > 0
      ? Math.max(MIN_COLUMN_WIDTH, Math.floor(availableWidth / columnsWithoutWidthCount))
      : MIN_COLUMN_WIDTH; // Fallback if no columns need auto-sizing

    // Second pass: assign calculated widths to columns without explicit width
    const finalColumns = tempColumns.map(col => {
      // If width was not explicitly set (or was below min) and needs auto-sizing
      if (col.width <= MIN_COLUMN_WIDTH && !initialColumns.find(c => c.fieldName === col.fieldName)?.width) {
          return { ...col, width: widthPerColumn, initialWidth: widthPerColumn };
      }
      return col; // Keep explicitly set (and potentially min-adjusted) widths
    }) as GridColumn[]; // Assert type after processing

    // Adjust total width if it doesn't match containerWidth due to rounding/min width enforcement
    let currentTotalWidth = finalColumns.reduce((sum, col) => sum + col.width, 0);
    let remainingWidth = containerWidth - currentTotalWidth;

    // Distribute remaining width or deficit proportionally among columns that were auto-sized or had initial width
    const adjustableColumns = finalColumns.filter(col => !initialColumns.find(c => c.fieldName === col.fieldName)?.width || col.initialWidth > MIN_COLUMN_WIDTH);

    if (remainingWidth !== 0 && adjustableColumns.length > 0) {
        const widthPerAdjustableColumn = remainingWidth / adjustableColumns.length;
        adjustableColumns.forEach(col => {
            const newWidth = col.width + widthPerAdjustableColumn;
            // Find the column in finalColumns and update its width, ensuring minimum
            const index = finalColumns.findIndex(fc => fc.fieldName === col.fieldName);
            if (index !== -1) {
                 finalColumns[index].width = Math.max(MIN_COLUMN_WIDTH, Math.round(newWidth));
            }
        });

        // Recalculate total and make minor adjustment to the last column if necessary
        currentTotalWidth = finalColumns.reduce((sum, col) => sum + col.width, 0);
        remainingWidth = containerWidth - currentTotalWidth;
        if (remainingWidth !== 0 && finalColumns.length > 0) {
            const lastColIndex = finalColumns.length - 1;
            finalColumns[lastColIndex].width = Math.max(MIN_COLUMN_WIDTH, finalColumns[lastColIndex].width + remainingWidth);
        }
    } else if (remainingWidth !== 0 && finalColumns.length > 0) {
        // If no adjustable columns, adjust the last column
        const lastColIndex = finalColumns.length - 1;
        finalColumns[lastColIndex].width = Math.max(MIN_COLUMN_WIDTH, finalColumns[lastColIndex].width + remainingWidth);
    }


    set({
      containerWidth,
      columns: finalColumns,
      gridTemplateColumns: calculateGridTemplateColumns(finalColumns),
    });
  },

  // New action implementation
  updateColumnWidths: (col1FieldName, col1Width, col2FieldName, col2Width) => {
    set(state => {
      const newColumns = state.columns.map(col => {
        if (col.fieldName === col1FieldName) {
          // Ensure width doesn't go below minimum
          return { ...col, width: Math.max(MIN_COLUMN_WIDTH, col1Width) };
        }
        if (col.fieldName === col2FieldName) {
          // Ensure width doesn't go below minimum
          return { ...col, width: Math.max(MIN_COLUMN_WIDTH, col2Width) };
        }
        return col;
      });

      return {
        columns: newColumns,
        gridTemplateColumns: calculateGridTemplateColumns(newColumns),
      };
    });
  },

  updateContainerWidth: (newWidth) => {
    set(state => {
        const oldWidth = state.containerWidth;
        if (oldWidth === 0 || oldWidth === newWidth) {
             return { containerWidth: newWidth }; // No change needed or initial load
        }

        const scaleFactor = newWidth / oldWidth;
        let scaledTotalWidth = 0;
        const newColumns = state.columns.map(col => {
            const newScaledWidth = Math.max(MIN_COLUMN_WIDTH, Math.round(col.width * scaleFactor));
            scaledTotalWidth += newScaledWidth;
            return {
                ...col,
                width: newScaledWidth
            };
        });

        // Distribute difference caused by scaling/rounding/min-width enforcement
        let remainingWidth = newWidth - scaledTotalWidth;
        if (remainingWidth !== 0 && newColumns.length > 0) {
             // Distribute proportionally to current widths
             const totalWidthBeforeAdjustment = newColumns.reduce((sum, col) => sum + col.width, 0); // Use already scaled widths
             if (totalWidthBeforeAdjustment > 0) { // Avoid division by zero
                newColumns.forEach(col => {
                    const proportion = col.width / totalWidthBeforeAdjustment;
                    const adjustment = remainingWidth * proportion;
                    col.width = Math.max(MIN_COLUMN_WIDTH, Math.round(col.width + adjustment));
                });

                // Final check and adjustment for the last column due to rounding
                const finalTotalWidth = newColumns.reduce((sum, col) => sum + col.width, 0);
                const finalDiff = newWidth - finalTotalWidth;
                if (finalDiff !== 0) {
                    const lastColIndex = newColumns.length - 1;
                    newColumns[lastColIndex].width = Math.max(MIN_COLUMN_WIDTH, newColumns[lastColIndex].width + finalDiff);
                }
             } else {
                 // If total width is 0 (e.g., all columns were min width and scaled down), distribute equally
                 const widthPerColumn = Math.max(MIN_COLUMN_WIDTH, Math.round(newWidth / newColumns.length));
                 newColumns.forEach(col => col.width = widthPerColumn);
                 // Adjust last column for rounding
                 const finalTotalWidth = newColumns.reduce((sum, col) => sum + col.width, 0);
                 const finalDiff = newWidth - finalTotalWidth;
                 if (finalDiff !== 0) {
                    const lastColIndex = newColumns.length - 1;
                    newColumns[lastColIndex].width = Math.max(MIN_COLUMN_WIDTH, newColumns[lastColIndex].width + finalDiff);
                 }
             }
        }


        return {
            containerWidth: newWidth,
            columns: newColumns,
            gridTemplateColumns: calculateGridTemplateColumns(newColumns)
        };
    });
},


  resetToInitialSizes: () => {
    set(state => {
      // Re-run initialization logic with stored initial widths
      const initialColumnsForReset = state.columns.map(col => ({
          ...col, // Keep other properties like fieldName, displayName etc.
          width: col.initialWidth // Use the stored initial width
      }));

      // Reuse the logic from initializeColumns to distribute width correctly
      let totalExplicitWidth = 0;
      let columnsWithoutWidthCount = 0; // Should be 0 if initialWidth was always set

      const tempColumns = initialColumnsForReset.map(col => {
          const width = col.width; // Already set to initialWidth
          totalExplicitWidth += width; // Assuming initialWidth >= MIN_COLUMN_WIDTH
          return { ...col }; // Create a copy
      });

      // Adjust total width if it doesn't match containerWidth
      let currentTotalWidth = tempColumns.reduce((sum, col) => sum + col.width, 0);
      let remainingWidth = state.containerWidth - currentTotalWidth;

      if (remainingWidth !== 0 && tempColumns.length > 0) {
          // Distribute remaining width proportionally among all columns
          const widthPerColumnAdjustment = remainingWidth / tempColumns.length;
          tempColumns.forEach(col => {
              const newWidth = col.width + widthPerColumnAdjustment;
              col.width = Math.max(MIN_COLUMN_WIDTH, Math.round(newWidth));
          });

          // Recalculate total and make minor adjustment to the last column if necessary
          currentTotalWidth = tempColumns.reduce((sum, col) => sum + col.width, 0);
          remainingWidth = state.containerWidth - currentTotalWidth;
          if (remainingWidth !== 0) {
              const lastColIndex = tempColumns.length - 1;
              tempColumns[lastColIndex].width = Math.max(MIN_COLUMN_WIDTH, tempColumns[lastColIndex].width + remainingWidth);
          }
      }

      return {
        columns: tempColumns,
        gridTemplateColumns: calculateGridTemplateColumns(tempColumns),
      };
    });
  },

  setIsResizing: (isResizing) => set({ isResizing }),

}));