import React, { useRef, useCallback, useEffect } from 'react';
import throttle from 'lodash.throttle';
import { useResizeStore } from './Grid'; // Assuming Grid exports the store hook

const MIN_COLUMN_WIDTH = 50; // px
const KEYBOARD_STEP_SMALL = 5; // px
const KEYBOARD_STEP_LARGE = 20; // px
const THROTTLE_WAIT = 50; // ms

interface ColumnResizerProps {
  col1FieldName: string; // Field name of the column to the left
  col2FieldName: string; // Field name of the column to the right
  // headerRef: React.RefObject<HTMLDivElement>; // Potentially needed for positioning or bounds
}

export const ColumnResizer: React.FC<ColumnResizerProps> = ({
  col1FieldName,
  col2FieldName,
}) => {
  const resizerRef = useRef<HTMLDivElement>(null);
  // Select state pieces individually to prevent unnecessary re-renders
  const columns = useResizeStore(state => state.columns);
  const updateColumnWidths = useResizeStore(state => state.updateColumnWidths);
  const setIsResizing = useResizeStore(state => state.setIsResizing);

  // Refs to store values during drag operation, avoiding state updates on every move
  const dragStateRef = useRef<{
    startX: number;
    col1InitialWidth: number;
    col2InitialWidth: number;
  } | null>(null);

  const getColumnWidth = useCallback((fieldName: string): number => {
    // Ensure columns array is available before trying to find
    return columns?.find(col => col.fieldName === fieldName)?.width ?? 0;
  }, [columns]);

  const handleMouseMove = useCallback(throttle((event: MouseEvent) => {
    if (!dragStateRef.current) return;

    const { startX, col1InitialWidth, col2InitialWidth } = dragStateRef.current;
    const currentX = event.clientX;
    let deltaX = currentX - startX;

    let newCol1Width = col1InitialWidth + deltaX;
    let newCol2Width = col2InitialWidth - deltaX;

    // Apply minimum width constraints and adjust deltaX accordingly
    if (newCol1Width < MIN_COLUMN_WIDTH) {
      deltaX = MIN_COLUMN_WIDTH - col1InitialWidth; // Adjust delta based on col1 hitting min
      newCol1Width = MIN_COLUMN_WIDTH;
      newCol2Width = col2InitialWidth - deltaX; // Recalculate col2 width
    }
    // Check col2 min width *after* adjusting for col1 potentially hitting min
    if (newCol2Width < MIN_COLUMN_WIDTH) {
      deltaX = col2InitialWidth - MIN_COLUMN_WIDTH; // Adjust delta based on col2 hitting min
      newCol2Width = MIN_COLUMN_WIDTH;
      newCol1Width = col1InitialWidth + deltaX; // Recalculate col1 width
      // Final check on col1 after adjusting for col2 (important if both are near min)
      if (newCol1Width < MIN_COLUMN_WIDTH) {
          newCol1Width = MIN_COLUMN_WIDTH;
      }
    }

    updateColumnWidths(col1FieldName, newCol1Width, col2FieldName, newCol2Width);
  }, THROTTLE_WAIT, { leading: true, trailing: true }), [col1FieldName, col2FieldName, updateColumnWidths]); // Dependencies for useCallback

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    dragStateRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    // Optional: Add class to body to reset cursor globally if needed
    document.body.style.cursor = '';
    // Ensure throttle cleanup
    handleMouseMove.cancel();
  }, [handleMouseMove, setIsResizing]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent text selection
    const col1InitialWidth = getColumnWidth(col1FieldName);
    const col2InitialWidth = getColumnWidth(col2FieldName);

    if (col1InitialWidth === 0 || col2InitialWidth === 0) {
        console.error("Could not find initial widths for columns:", col1FieldName, col2FieldName);
        return; // Don't start drag if widths aren't found
    }


    dragStateRef.current = {
      startX: event.clientX,
      col1InitialWidth,
      col2InitialWidth,
    };

    setIsResizing(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    // Optional: Add class to body to set cursor globally
    document.body.style.cursor = 'col-resize';
  }, [col1FieldName, col2FieldName, getColumnWidth, handleMouseMove, handleMouseUp, setIsResizing]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key, shiftKey } = event;
    let delta = 0;

    if (key === 'ArrowLeft') {
      delta = -(shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP_SMALL);
    } else if (key === 'ArrowRight') {
      delta = shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP_SMALL;
    } else {
      return; // Ignore other keys
    }

    event.preventDefault(); // Prevent page scrolling

    const col1InitialWidth = getColumnWidth(col1FieldName);
    const col2InitialWidth = getColumnWidth(col2FieldName);

    let newCol1Width = col1InitialWidth + delta;
    let newCol2Width = col2InitialWidth - delta;

    // Apply constraints similar to mouse move
    if (newCol1Width < MIN_COLUMN_WIDTH) {
        delta = MIN_COLUMN_WIDTH - col1InitialWidth;
        newCol1Width = MIN_COLUMN_WIDTH;
        newCol2Width = col2InitialWidth - delta;
    }
     if (newCol2Width < MIN_COLUMN_WIDTH) {
        delta = col2InitialWidth - MIN_COLUMN_WIDTH;
        newCol2Width = MIN_COLUMN_WIDTH;
        newCol1Width = col1InitialWidth + delta;
         if (newCol1Width < MIN_COLUMN_WIDTH) {
             newCol1Width = MIN_COLUMN_WIDTH;
         }
    }

    updateColumnWidths(col1FieldName, newCol1Width, col2FieldName, newCol2Width);

  }, [col1FieldName, col2FieldName, getColumnWidth, updateColumnWidths]);

  // Cleanup listeners on unmount
  useEffect(() => {
    // Ensure listeners are removed if component unmounts unexpectedly during drag
    return () => {
      if (dragStateRef.current) {
          handleMouseUp(); // Call mouseUp logic to clean up
      }
    };
  }, [handleMouseUp]); // Dependency on handleMouseUp ensures the correct version is used

  // Get current widths for ARIA attributes
  const currentWidthCol1 = getColumnWidth(col1FieldName);
  // Ensure columns array is available before trying to find
  const col1DisplayName = columns?.find(c => c.fieldName === col1FieldName)?.displayName ?? col1FieldName;


  return (
    <div
      ref={resizerRef}
      className="absolute top-0 right-0 h-full w-2 cursor-col-resize bg-gray-300 hover:bg-blue-500 active:bg-blue-600 z-10 touch-none" // Added touch-none for touch devices
      style={{ transform: 'translateX(50%)' }} // Center the handle visually on the border
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make it focusable
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${col1DisplayName} column`}
      aria-controls={col1FieldName} // Assuming header cell might have ID matching fieldName
      aria-valuenow={currentWidthCol1}
      aria-valuemin={MIN_COLUMN_WIDTH}
    />
  );
};