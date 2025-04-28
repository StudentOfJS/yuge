import { type GridColumnInit } from "../state/gridStore"
import GridCellEditor from "./GridCellEditor"
import GridCellTextOnly from "./GridCellTextOnly"

type GridCellProps = {
  column: GridColumnInit
  rowIndex: number
}

// editing for input types only, select and non-editable to be separate
function GridCell({
  column,
  rowIndex
}: GridCellProps) {
  if(column.cellType === 'checkbox'){
    return (<GridCellEditor column={column} rowIndex={rowIndex} />)
  }
  if(column.cellType === 'select'){
    return (<GridCellEditor column={column} rowIndex={rowIndex} />)
  }
  if(column.isEditable){
    return (<GridCellEditor column={column} rowIndex={rowIndex} />)
  }

  return (<GridCellTextOnly column={column} rowIndex={rowIndex} />)
}

export default GridCell
