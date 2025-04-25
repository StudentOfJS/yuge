import { memo, useMemo } from "react"
import { useGridStores } from "../hooks/useGridStores"
import { storeInstanceID } from "./Grid"

type GridCellTextOnlyProps = {
  fieldName: string
  rowIndex: number
  displayValueTransformer?: (value: string) => string
}

function GridCellTextOnly({
  fieldName,
  rowIndex,
  displayValueTransformer,
}: GridCellTextOnlyProps) {
  const { useGridStore } = useMemo(() => useGridStores(storeInstanceID), [storeInstanceID])
  const { getCellValue } = useGridStore()
  const value = getCellValue(rowIndex, fieldName);
  return (
    <div tabIndex={0} className="flex-auto flex items-center w-full h-full p-4">
      <p className="overflow-hidden text-ellipsis leading-none">{displayValueTransformer ? displayValueTransformer(value) : value}</p>
    </div>
  )
}

export default memo<GridCellTextOnlyProps>(GridCellTextOnly)
