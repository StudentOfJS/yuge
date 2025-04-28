import { memo } from 'react';
import { useResizeStore } from './Grid';
import HorizontalDraggable from './HorizontalDraggable';

interface ColumnResizerProps {
    fieldName: string;
    className?: string;
    headerRef: React.RefObject<HTMLDivElement | null>
}

export const ColumnResizer: React.FC<ColumnResizerProps> = memo(({
    fieldName,
    className, 
    headerRef
}) => {
    const resizeColumn = useResizeStore(state => state.resizeColumn);
    const widthRegister = useResizeStore(state => state.widthRegister);
    // const changeRegister = useResizeStore(state => state.changeRegister);
    const { columnWidth, position, min, next  } = widthRegister.get(fieldName)!
    let growthPotential = 0;
    if(next) {
        const { min: minNext, columnWidth } = widthRegister.get(next)!
        growthPotential += (columnWidth - minNext);
    }
    return (
        <HorizontalDraggable
            fieldName={fieldName}
            initialLeft={position}
            minLeft={min}
            maxLeft={growthPotential}
            onPositionChange={(pos) => {
                resizeColumn(fieldName, pos)
            }}
            className={`z-10 py-1.5`}
            headerRef={headerRef}
        >
            <div
                className={className ?? `w-1 h-full rounded-sm bg-gray-500`}
            >
            </div>
        </HorizontalDraggable>
    );
});