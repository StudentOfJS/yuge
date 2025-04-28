import { useGridStore } from "./Grid"

function GridFooter() {
    // const selectedRows = useGridStore(state => state.selectedRows)
    const visibleRows = useGridStore(state => state.visibleRows)
    const totalRows = useGridStore(state => state.totalRows)
    return (
        <div className="table-footer">
            {visibleRows.length} of {totalRows} items
        </div>
    )
}

export default GridFooter
