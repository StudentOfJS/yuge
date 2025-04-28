import { memo, useMemo } from "react"
import { useGridStore } from "./Grid"

import { type GridColumnInit } from "../state/gridStore"


type GridCellTextOnlyProps = {
  column: GridColumnInit
  rowIndex: number
}

function GridCellTextOnly({
  column,
  rowIndex
}: GridCellTextOnlyProps) {

  const getCellValue = useGridStore(state => state.getCellValue)
  const value = useMemo(() => getCellValue(rowIndex, column.fieldName), [rowIndex, column.fieldName]);
  return (
    <div tabIndex={0} className={column?.displayClassName ?? "flex-auto flex items-center w-full h-full p-4"}>
      <p className="overflow-hidden text-ellipsis leading-none">{column?.displayValueTransformer ? column?.displayValueTransformer(value) : value}</p>
    </div>
  )
}

export default memo<GridCellTextOnlyProps>(GridCellTextOnly)
