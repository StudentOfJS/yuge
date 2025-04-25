import { memo, useMemo } from "react";
import { useGridStores } from "../hooks/useGridStores";
import { storeInstanceID } from "./Grid";
import GridCell from "./GridCell";

type GridSingleRowProps = {
    rowIndex: number
}

function GridSingleRow({rowIndex}: GridSingleRowProps) {
    const { useGridStore, useResizeStore } = useMemo(
        () => useGridStores(storeInstanceID), 
        [storeInstanceID]
    );
    // Use the stores
    const { columns } = useGridStore();
    const { columnWidths } = useResizeStore();
    return (
        <>
            {
                columns.map(col => {
                    let maxWidth = columnWidths[col.fieldName] ?? '100%'
                    let className = columnWidths[col.fieldName] ? 'w-full' : 'flex-grow'
                    return (<GridCell cellClassName={className} column={col} maxWidth={maxWidth} rowIndex={rowIndex} />)
                })
            }
        </>
    )
}

export default memo<GridSingleRowProps>(GridSingleRow)
