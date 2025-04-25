import { useMemo } from "react"
import { useGridStores } from "../hooks/useGridStores"
import { storeInstanceID } from "./Grid"
// @todo think about data to display and display options
function GridFooter() {
    const { useGridStore } = useMemo(() => useGridStores(storeInstanceID), [storeInstanceID])
    const { selectedRows, visibleRows, totalRows } = useGridStore()
    return (
        <div className="table-footer">
            {visibleRows.length} of {totalRows} items
        </div>
    )
}

export default GridFooter
