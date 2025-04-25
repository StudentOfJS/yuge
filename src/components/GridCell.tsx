import { type GridColumnInit } from "../state/gridStore"
import GridCellEditor from "./GridCellEditor"
import GridCellTextOnly from "./GridCellTextOnly"

type GridCellProps = {
  cellClassName: string
  column: GridColumnInit
  maxWidth: string | number
  rowIndex: number
}

// editing for input types only, select and non-editable to be separate
function GridCell({
  cellClassName,
  column,
  maxWidth,
  rowIndex
}: GridCellProps) {
  if(column.cellType === 'checkbox'){
    return (
      <div className={cellClassName} style={{maxWidth}}>
        <GridCellEditor column={column} rowIndex={rowIndex} />
      </div>
    )
  }
  if(column.cellType === 'select'){
    return (
      <div className={cellClassName} style={{maxWidth}}>
        <GridCellEditor column={column} rowIndex={rowIndex} />
      </div>
    )
  }
  if(column.isEditable){
    return (
      <div className={cellClassName} style={{maxWidth}}>
        <GridCellEditor column={column} rowIndex={rowIndex} />
      </div>
    )
  }

  return (
    <div className={cellClassName} style={{maxWidth}}>
      <GridCellTextOnly fieldName={column.fieldName} rowIndex={rowIndex} />
    </div>
  )
}

export default GridCell
