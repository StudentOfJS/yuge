import { ChangeEvent, useMemo, useState } from "react"
import { useFocusWithin } from '@react-aria/interactions'
import { useGridStores } from "../hooks/useGridStores"
import { storeInstanceID } from "./Grid"
import { type GridColumnInit } from "../state/gridStore"

type GridCellEditorProps = {
  column: GridColumnInit
  rowIndex: number
}

// editing for input types only, select and non-editable to be separate
function GridCellEditor({
  column,
  rowIndex,
}: GridCellEditorProps) {
  const { useGridStore } = useMemo(() => useGridStores(storeInstanceID), [storeInstanceID])
  const { getCellValue, updateCell } = useGridStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isValidChange, setIsValidChange] = useState(false)
  const [value, setValue] = useState<string>(() => getCellValue(rowIndex, column.fieldName))
  const [cellStateStyle, setCellStateStyle] = useState<string>("")
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setValue(e.target.value)
    if(e.target.value === getCellValue(rowIndex, column.fieldName)) {
      setCellStateStyle("")
      setIsValidChange(false)
    } else {
      let isValid = column?.cellValidator ? column.cellValidator(value) : true;
      setIsValidChange(isValid)
      setCellStateStyle(isValid ? " outline-none inset-ring-2 inset-ring-lime-600/80" : " inset-ring-2 inset-ring-red-700/50")
    }
  }

  // Focus management
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: () => {
      setIsEditing(true)
    },
    onBlurWithin: () => {
      if (isValidChange) {
        updateCell(rowIndex, column.fieldName, value)
        setCellStateStyle("")
      }
      setIsEditing(false)
    },
  });

  return (
    <div
      {...focusWithinProps}
      tabIndex={0}
      className={"flex-auto w-full h-full rounded-sm"+cellStateStyle}
    >
      {isEditing && (
        <input
          autoFocus
          defaultValue={value}
          onChange={handleChange}
          {...column.inputProps}
        />
      )}
      {!isEditing && (
        <div className={column?.displayClassName ?? "flex items-center gap-8  w-full h-full pl-4"}>
          {column.displayValueTransformer ? column.displayValueTransformer(value) : value}
          <button
            className="size-4"
            aria-label={`Edit ${column.fieldName} for ${rowIndex}`}
            onClick={() => setIsEditing(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="pointer-events-none"
            >
              <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
              <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506zM8 18h1" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default GridCellEditor
