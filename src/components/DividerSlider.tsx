import { useRef, useState, useEffect } from 'react';

type ThumbOnlySliderProps = {
    min: number;
    max: number;
    maxWidth: number;
    defaultValue: number;
    handleUpdate: (value: number) => void
}

const DividerSlider = ({defaultValue, maxWidth, max, min, handleUpdate}: ThumbOnlySliderProps) => {
  const [value, setValue] = useState(defaultValue);
  const rangeRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);
  
  useEffect(() => {
    const rangeElement = rangeRef.current;
    if(!rangeElement) return;
    const handleMouseDown = (event: MouseEvent) => {
      // Calculate the position of the click relative to the input
      const rect = rangeElement.getBoundingClientRect();
      const thumbWidth = 20; // Approximate thumb width - adjust as needed
      
      // Calculate the position where the thumb should be based on current value
      const rangeWidth = rect.width;
      const minimum = parseInt(rangeElement.min, 10);
      const maximum = parseInt(rangeElement.max, 10);
      const thumbPosition = ((value - minimum) / (maximum - minimum)) * rangeWidth + rect.left;
      
      // Only set isDragging to true if the click was on/near the thumb
      isDraggingRef.current = (
        event.clientX >= thumbPosition - thumbWidth && 
        event.clientX <= thumbPosition + thumbWidth
      );
      
      // If not clicking on thumb, prevent default behavior
      if (!isDraggingRef.current) {
        event.preventDefault();
      }
    };
    
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    
    const handleChange = (e: Event) => {
      if (isDraggingRef.current) {
        let val = Number((e.target as HTMLInputElement).value)
        if(val < min) {
            val = min
        }
        if(val > max) {
            val = max
        }
        console.log(val)
        handleUpdate(val)
        setValue(val);
      }
    };
    
    // Add event listeners
    rangeElement.addEventListener('mousedown', handleMouseDown);
    rangeElement.addEventListener('input', handleChange);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup event listeners on unmount
    return () => {
      rangeElement.removeEventListener('mousedown', handleMouseDown);
      rangeElement.removeEventListener('input', handleChange);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [value]);
  
  return (
    <input
        ref={rangeRef}
        type="range"
        min="0"
        max={maxWidth}
        defaultValue={value}
        className="column-divider"
    />
  );
};

export default DividerSlider;