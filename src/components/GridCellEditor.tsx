import { ChangeEvent, useState, useCallback, useMemo } from "react" // Added useCallback and useMemo
import { useFocusWithin } from '@react-aria/interactions'
import { useGridStore } from "./Grid"

import { type GridColumnInit, type GridCellValue } from "../state/gridStore" // Import GridCellValue
type GridCellEditorProps = {
  column: GridColumnInit
  rowIndex: number
}

// editing for input types only, select and non-editable to be separate
function GridCellEditor({
  column,
  rowIndex,
}: GridCellEditorProps) {

  const getCellValue = useGridStore(state => state.getCellValue)
  const updateCell = useGridStore(state => state.updateCell)

  // --- Checkbox Implementation ---
  if (column.cellType === 'checkbox') {
    const initialValue = getCellValue(rowIndex, column.fieldName);
    // Handle boolean or string representation
    const initialChecked = initialValue === true || String(initialValue).toLowerCase() === 'true';

    const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const newCheckedState = e.target.checked;
      // Assuming updateCell handles boolean. Convert if store requires string: String(newCheckedState)
      updateCell(rowIndex, column.fieldName, newCheckedState);
    }, [updateCell, rowIndex, column.fieldName]);

    return (
      <div className="flex items-center justify-center w-full h-full"> {/* Centering wrapper */}
        <input
          type="checkbox"
          // Basic accessible Tailwind styling - adjust as needed
          className="appearance-none size-4 border border-gray-400 rounded-sm bg-white checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer"
          checked={initialChecked}
          onChange={handleCheckboxChange}
          aria-label={`Toggle ${column.fieldName} for row ${rowIndex}`}
        />
      </div>
    );
  }
  // --- End Checkbox Implementation ---

  // --- Select Implementation ---
  else if (column.cellType === 'select') {
    const initialValue = useMemo(() => getCellValue(rowIndex, column.fieldName), [getCellValue, rowIndex, column.fieldName]);
    const [isEditing, setIsEditing] = useState(false);
    const [isValidChange, setIsValidChange] = useState(false);
    // Ensure value is treated as string for select comparison, handle potential boolean/undefined
    const [value, setValue] = useState<string>(String(initialValue ?? ''));
    const [cellStateStyle, setCellStateStyle] = useState<string>(""); // For visual feedback if needed

    const handleSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (newValue !== String(initialValue ?? '')) {
        setIsValidChange(true);
        // Optional: Add visual feedback for pending change
        setCellStateStyle(" outline-none ring-2 ring-lime-600/80");
      } else {
        setIsValidChange(false);
        setCellStateStyle("");
      }
    }, [initialValue]);

    // Focus management
    const { focusWithinProps } = useFocusWithin({
      onFocusWithin: () => setIsEditing(true),
      onBlurWithin: () => {
        if (isValidChange) {
          // Find the original type if needed, though select values are usually strings
          // For simplicity, we'll update with the string value from the select
          updateCell(rowIndex, column.fieldName, value);
          setCellStateStyle(""); // Reset visual feedback
        }
        setIsValidChange(false); // Reset validity check
        setIsEditing(false);
      },
    });

    // Find the display label for the current value
    const displayLabel = useMemo(() => {
      const selectedOption = column.selectOptions?.find(opt => String(opt.value) === value);
      return selectedOption?.label ?? String(value); // Fallback to value if label not found
    }, [value, column.selectOptions]);

    return (
      <div
        {...focusWithinProps}
        tabIndex={0}
        className={"w-full h-full rounded-sm ring-inset" + cellStateStyle} // Apply state style
      >
        {isEditing ? (
          <select
            autoFocus
            value={value}
            onChange={handleSelectChange}
            aria-label={`Select ${column.fieldName} for row ${rowIndex}`}
            // Basic accessible Tailwind styling - adjust as needed
            className="w-full h-full px-2 py-1 border border-gray-300 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer"
          >
            {/* Optional: Add a placeholder or default empty option if needed */}
            {/* <option value="" disabled={!allowEmpty}>Select...</option> */}
            {column.selectOptions?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          // Display mode: Show label and edit button
          <div className={column?.displayClassName ?? "flex items-center justify-between gap-2 w-full h-full px-2"}>
            <span className="truncate flex-grow">
              {displayLabel}
            </span>
            <button
              className="flex-shrink-0 size-5 p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
              aria-label={`Edit ${column.fieldName} for row ${rowIndex}`}
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} // Prevent div focus trigger
            >
              {/* SVG Icon (copied from input logic) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none size-full">
                <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506zM8 18h1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }
  // --- End Select Implementation ---

  // --- Existing Input Logic (runs only if not checkbox or select) ---
  else { // Wrap existing input logic in an else block
    const initialValue = useMemo(() => getCellValue(rowIndex, column.fieldName), [getCellValue, rowIndex, column.fieldName]);
    const [isEditing, setIsEditing] = useState(false)
    const [isValidChange, setIsValidChange] = useState(false)
    // Ensure value is string for input, handle potential boolean/undefined
    const [value, setValue] = useState<string>(String(initialValue ?? ''))
    const [cellStateStyle, setCellStateStyle] = useState<string>("")

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const newValue = e.target.value;
      setValue(newValue)
      if (newValue === String(initialValue ?? '')) {
        setCellStateStyle("")
        setIsValidChange(false)
      } else {
        // Pass the current input value to the validator
        let isValid = column?.cellValidator ? column.cellValidator(newValue) : true;
        setIsValidChange(isValid)
        setCellStateStyle(isValid ? " outline-none ring-2 ring-lime-600/80" : " ring-2 ring-red-700/50") // Updated ring style
      }
    }, [initialValue, column, setValue, setIsValidChange, setCellStateStyle]); // Added dependencies

    // Focus management
    const { focusWithinProps } = useFocusWithin({
      onFocusWithin: () => {
        setIsEditing(true)
      },
      onBlurWithin: () => {
        if (isValidChange) {
          // Attempt to convert back to original type if necessary (e.g., number)
          let finalValue: GridCellValue = value;
          if (column.cellType === 'number' && !isNaN(Number(value))) {
            finalValue = Number(value);
          }
          // Add other type conversions if needed (e.g., date)
          updateCell(rowIndex, column.fieldName, finalValue)
          setCellStateStyle("")
        }
        setIsValidChange(false); // Reset validity
        setIsEditing(false)
      },
    });

    return (
      <div
        {...focusWithinProps}
        tabIndex={0}
        // Added ring-inset for better visual appearance with rings
        className={"w-full h-full rounded-sm ring-inset" + cellStateStyle}
      >
        {isEditing ? ( // Use ternary for consistency
          <input
            autoFocus
            value={value} // Use value for controlled input
            onChange={handleChange}
            // Added basic input styling
            className="w-full h-full px-2 py-1 border-none outline-none bg-transparent"
            type={column.cellType} // Use cellType for input type attribute
            {...column.inputProps}
          />
        ) : (
          // Adjusted padding and alignment
          <div className={column?.displayClassName ?? "flex items-center justify-between gap-2 w-full h-full px-2"}>
            <span className="truncate flex-grow"> {/* Added span with truncate */}
              {/* Ensure value passed to transformer is string */}
              {column.displayValueTransformer ? column.displayValueTransformer(String(value)) : String(value)}
            </span>
            <button
              // Adjusted button styling for visibility and spacing
              className="flex-shrink-0 size-5 p-0.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
              aria-label={`Edit ${column.fieldName} for row ${rowIndex}`}
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} // Prevent div focus trigger
            >
              {/* SVG Icon (copied) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none size-full">
                 <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                 <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506zM8 18h1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    )
  } // Close the else block for input logic
}

export default GridCellEditor
