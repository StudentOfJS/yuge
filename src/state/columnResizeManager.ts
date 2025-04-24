type ColumnSize = {
    width: number;
    minWidth: number;
    maxWidth?: number;
    flex?: number; // For proportional distribution of extra space
  };

  export type ColumnConfig = ColumnSize & {
    fieldName: string;
  }
  
export class ColumnResizeManager {
    private columnSizes = new Map<string, ColumnSize>();
    private containerWidth: number;
    private columnOrder: string[] = [];
    
    constructor(options: {
      containerWidth: number;
      columns: Array<ColumnConfig>;
    }) {
      this.containerWidth = options.containerWidth;
      
      // Initialize columns with defaults
      options.columns.forEach(col => {
        this.columnOrder.push(col.fieldName);
        this.columnSizes.set(col.fieldName, {
          width: col.width || 150,
          minWidth: col.minWidth || 50,
          maxWidth: col.maxWidth,
          flex: col.flex || 0
        });
      });
      
      // Do initial distribution
      this.redistributeWidths();
    }
    
    // Get current width
    getColumnWidth(fieldName: string): number {
      return this.columnSizes.get(fieldName)?.width || 0;
    }
    
    // Update container width (when window resizes)
    setContainerWidth(width: number): void {
      this.containerWidth = width;
      this.redistributeWidths();
    }
    
    // Handle manual column resize
    resizeColumn(fieldName: string, newWidth: number): void {
      const column = this.columnSizes.get(fieldName);
      if (!column) return;
      
      // Constrain to min/max
      const constrainedWidth = Math.max(
        column.minWidth,
        column.maxWidth ? Math.min(newWidth, column.maxWidth) : newWidth
      );
      
      // Calculate difference from previous width
      const widthDifference = constrainedWidth - column.width;
      
      // Update the width
      column.width = constrainedWidth;
      
      // Find other flexible columns to absorb the width change
      if (widthDifference !== 0) {
        this.distributeWidthChange(fieldName, -widthDifference);
      }
    }
    
    // Distribute width change among other columns
    private distributeWidthChange(excludeField: string, widthToDistribute: number): void {
      // Only process if there's width to distribute
      if (Math.abs(widthToDistribute) < 0.5) return;
      
      // Get flex columns for distribution
      const flexColumns = this.columnOrder
        .filter(field => field !== excludeField)
        .map(field => ({
          field,
          size: this.columnSizes.get(field)!
        }))
        .filter(col => col.size.flex && col.size.flex > 0);
      
      // If no flex columns, try to distribute among all columns proportionally
      if (flexColumns.length === 0) {
        // Fall back to distributing among all other columns
        const otherColumns = this.columnOrder
          .filter(field => field !== excludeField)
          .map(field => ({
            field,
            size: this.columnSizes.get(field)!
          }));
        
        if (otherColumns.length === 0) return;
        
        // Calculate proportional distribution
        const perColumnChange = widthToDistribute / otherColumns.length;
        
        otherColumns.forEach(col => {
          const newWidth = col.size.width + perColumnChange;
          
          // Respect min/max constraints
          col.size.width = Math.max(
            col.size.minWidth,
            col.size.maxWidth ? Math.min(newWidth, col.size.maxWidth) : newWidth
          );
        });
        
        return;
      }
      
      // Calculate total flex units
      const totalFlex = flexColumns.reduce((sum, col) => sum + (col.size.flex || 0), 0);
      
      // Distribute width based on flex proportion
      flexColumns.forEach(col => {
        const flexProportion = (col.size.flex || 0) / totalFlex;
        const widthChange = widthToDistribute * flexProportion;
        const newWidth = col.size.width + widthChange;
        
        // Respect min/max constraints
        col.size.width = Math.max(
          col.size.minWidth,
          col.size.maxWidth ? Math.min(newWidth, col.size.maxWidth) : newWidth
        );
      });
    }
    
    // Recalculate all widths to fit container
    private redistributeWidths(): void {
      // Calculate total current width
      const totalCurrentWidth = this.columnOrder.reduce(
        (sum, field) => sum + (this.columnSizes.get(field)?.width || 0),
        0
      );
      
      // Determine width difference
      const widthDifference = this.containerWidth - totalCurrentWidth;
      
      if (Math.abs(widthDifference) > 0.5) {
        // Distribute the difference
        this.distributeWidthChange('', widthDifference);
      }
    }
    
    // Get all column widths
    getAllWidths(): Record<string, number> {
      const result: Record<string, number> = {};
      this.columnOrder.forEach(field => {
        result[field] = this.columnSizes.get(field)?.width || 0;
      });
      return result;
    }
  }