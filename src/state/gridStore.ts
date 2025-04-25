import { type InputHTMLAttributes } from "react";

export type GridCellValue = string | boolean | undefined; // date value must be ms since epoch
export type GridCellType = 'date' | 'text' | 'number' | 'select' | 'checkbox';
export type GridColumnInit = {
    displayName: string;
    cellType: GridCellType;
    fieldName: string;
    isEditable?: true;
    isSearchable?: true;
    isSortable?: true;
    selectsRow?: true;
    inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'>
    cellValidator?: (value: string) => boolean
    displayValueTransformer?: (value: string) => string
}
export type GridSortBy<S> = keyof S | null;
export type GridSortDirection = 'asc' | 'dsc' | null;

export class GridStore<T extends Record<string, any>> {
    private cells = new Map<string, GridCellValue>();
    private columnArray: Array<GridColumnInit> = [];
    private rows: Array<number> = [];
    private rowQueryLookup = new Set<string>();
    private preSortCache = new Map<string, Array<number>>();
    private searchQuery = "";
    private selectedRows = new Map<number, boolean>();
    private sortBy: GridSortBy<T> = null;
    private sortDirection: GridSortDirection = null;
    private updateSortCache(fieldName: string): void {
        const column = this.columnArray.find(col => col.fieldName === fieldName);

        if (!column?.isSortable) return;

        // Get the default row indices
        const defaultIndices = this.preSortCache.get('default') || [];

        // Curry column sort function
        const colSort = (cellType: GridCellType, col: string) => (indexA?: number, indexB?: number) => {
            let a = this.cells.get(`${indexA}-${col}`);
            let b = this.cells.get(`${indexB}-${col}`);
            if (!a && !b) return 0;
            if (!a) return -1;
            if (!b) return 1;
            if (cellType === 'number' || cellType === 'date') {
                return Number(a) - Number(b);
            }
            return String(a).localeCompare(String(b));
        }

        // Create new sorted arrays
        let asc: Array<number> = [...defaultIndices].sort(colSort(column.cellType, fieldName));
        let dsc: Array<number> = [...asc].reverse();

        // Update cache
        this.preSortCache.set(`${fieldName}-asc`, asc);
        this.preSortCache.set(`${fieldName}-dsc`, dsc);

        // If we're currently sorting by this column, update the rows too
        if (this.sortBy === fieldName) {
            // Apply current sort and filter
            this.sort(this.sortBy, this.sortDirection);
        }
    }
    constructor() {
    }
    init(columns: Array<GridColumnInit>, data: Array<T>) {
        this.columnArray = columns;
        const defaultIndex: Array<number> = [];
        // add cells, rows with search meta data and selected rows
        data.forEach((item, defaultRowIndex) => {
            defaultIndex.push(defaultRowIndex)
            let search = "";
            this.columnArray.forEach((col) => {
                let cellValue = item[col.fieldName];
                let cellID = `${defaultRowIndex}-${String(col.fieldName)}`;
                if (col.isSearchable) {
                    search = search + String(cellValue).toLowerCase();
                }
                this.selectedRows.set(defaultRowIndex, col?.selectsRow ?? false);
                this.cells.set(cellID, cellValue);
            })
            this.rows.push(defaultRowIndex);
            this.rowQueryLookup.add(search + "-" + defaultRowIndex);
        })
        // create sort cache upfront
        // curry column sort
        const colSort = (cellType: GridCellType, col: string) => (indexA?: number, indexB?: number) => {
            let a = this.cells.get(`${indexA}-${col}`);
            let b = this.cells.get(`${indexB}-${col}`);
            if (!a && !b) return 0;
            if (!a) return -1;
            if (!b) return 1;
            if (cellType === 'number' || cellType === 'date') {
                return Number(a) - Number(b);
            }
            return String(a).localeCompare(String(b));
        }
        this.columnArray.forEach(col => {
            if (col.isSortable) {
                let asc: Array<number> = [...defaultIndex].sort(colSort(col.cellType, col.fieldName));
                let dsc: Array<number> = [...asc].reverse();
                this.preSortCache.set(`${col.fieldName}-asc`, asc);
                this.preSortCache.set(`${col.fieldName}-dsc`, dsc);
            }
        })
        this.preSortCache.set('default', defaultIndex);
    }
    // Search method
    search(query: string) {
        // Get the base sorted rows first
        const sort = (this.sortBy && this.sortDirection) ? `${String(this.sortBy)}-${String(this.sortDirection)}` : 'default';
        const sortedRows = this.preSortCache.get(sort);
        if (!sortedRows) return; // Early return if no rows available

        const normalizedQuery = query?.toLowerCase().trim();
        this.searchQuery = normalizedQuery;

        // Skip filtering if empty query
        if (!normalizedQuery) {
            this.rows = sortedRows;
            return;
        }

        // Find matching rows
        const matches = new Set<number>();
        Array.from(this.rowQueryLookup.values())
            .filter(key => key.includes(normalizedQuery))
            .forEach(term => matches.add(Number(term.slice(term.indexOf("-") + 1))));

        // Apply filter while preserving sort order
        this.rows = sortedRows.filter(rowIndex => matches.has(rowIndex));
    }

    // Get visible rows (for virtualization)
    getVisibleRows(): Array<number> {
        return [...this.rows];
    }

    // Get all columns
    getColumns(): Array<GridColumnInit> {
        return [...this.columnArray];
    }

    // Get current sort state
    getSortState(): { field: GridSortBy<T>, direction: GridSortDirection } {
        return { field: this.sortBy, direction: this.sortDirection };
    }

    // Get cell value by row index and field name
    getCellValue(rowIndex: number, fieldName: string): GridCellValue {
        return this.cells.get(`${rowIndex}-${fieldName}`);
    }

    // Update cell value (for editable cells)
    updateCell(rowIndex: number, fieldName: string, value: GridCellValue): void {
        const cellId = `${rowIndex}-${fieldName}`;
        this.cells.set(cellId, value);

        // Update search index if searchable column
        const column = this.columnArray.find(col => col.fieldName === fieldName);
        if (column?.isSearchable) {
            // Remove old entry
            const oldEntries = Array.from(this.rowQueryLookup)
                .filter(entry => entry.endsWith(`-${rowIndex}`));

            if (oldEntries.length) {
                this.rowQueryLookup.delete(oldEntries[0]);
            }

            // Build new search text for this row
            let searchText = "";
            this.columnArray.forEach(col => {
                if (col.isSearchable) {
                    const cellValue = col.fieldName === fieldName
                        ? value
                        : this.cells.get(`${rowIndex}-${col.fieldName}`);
                    searchText += String(cellValue || "").toLowerCase();
                }
            });

            // Add new entry
            this.rowQueryLookup.add(searchText + "-" + rowIndex);

            // Re-apply search if there's an active query
            if (this.searchQuery) {
                this.search(this.searchQuery);
            }
        }
        if (column?.isSortable) {
            this.updateSortCache(fieldName);
        }
    }

    // Row selection methods
    selectRow(rowIndex: number, selected: boolean = true): void {
        this.selectedRows.set(rowIndex, selected);
    }

    toggleRowSelection(rowIndex: number): void {
        const currentState = this.selectedRows.get(rowIndex) || false;
        this.selectedRows.set(rowIndex, !currentState);
    }

    getSelectedRows(): Array<number> {
        return Array.from(this.selectedRows.entries())
            .filter(([_, selected]) => selected)
            .map(([rowIndex]) => rowIndex);
    }

    // Select all visible rows
    selectAllVisible(selected: boolean = true): void {
        this.rows.forEach(rowIndex => {
            this.selectedRows.set(rowIndex, selected);
        });
    }

    // Get row data as object (useful for export or displaying full row)
    getRowData(rowIndex: number): Partial<T> {
        const result: Partial<T> = {};
        this.columnArray.forEach(column => {
            const fieldName = column.fieldName;
            const value = this.getCellValue(rowIndex, fieldName);
            result[fieldName as keyof T] = value as any;
        });
        return result;
    }

    // Sort method
    sort(field: GridSortBy<T>, direction: GridSortDirection): void {
        this.sortBy = field;
        this.sortDirection = direction;

        if (!field || !direction) {
            // Reset to default order
            if (this.searchQuery) {
                this.search(this.searchQuery); // Re-apply search with default order
            } else {
                this.rows = this.preSortCache.get('default') || [];
            }
            return;
        }

        const sortKey = `${String(field)}-${direction}`;
        const sortedRows = this.preSortCache.get(sortKey);

        if (sortedRows) {
            // Apply sort but maintain search filter if any
            if (this.searchQuery) {
                const matches = new Set<number>();
                Array.from(this.rowQueryLookup.values())
                    .filter(key => key.includes(this.searchQuery))
                    .forEach(term => matches.add(Number(term.slice(term.indexOf("-") + 1))));

                this.rows = sortedRows.filter(rowId => matches.has(rowId));
            } else {
                this.rows = sortedRows;
            }
        }
    }
}