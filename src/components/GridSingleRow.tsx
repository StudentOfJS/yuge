import { Fragment, memo } from "react";
import GridCell from "./GridCell";
import { useResizeStore, useGridStore } from "./Grid";

type GridSingleRowProps = {
    rowIndex: number
}

function GridSingleRow({rowIndex}: GridSingleRowProps) {
    const columns = useGridStore(state => state.columns)
    const gridTemplateColumns = useResizeStore(state => state.gridTemplateColumns)
    return (
        <div
            className="grid w-full"
            style={{ gridTemplateColumns }}
        >
            {
                columns.map(col => {
                    return (<Fragment key={col.fieldName}><GridCell column={col} rowIndex={rowIndex} /></Fragment>)
                })
            }
        </div>
    )
}

export default memo<GridSingleRowProps>(GridSingleRow)
