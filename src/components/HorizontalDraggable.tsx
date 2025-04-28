import { useState, useRef, ReactNode } from 'react';

interface HorizontalDraggableProps {
    children: ReactNode;
    fieldName: string;
    className?: string;
    initialLeft?: number;
    minLeft?: number;
    maxLeft?: number;
    onDragStart?: (position: number) => void;
    onDragEnd?: (position: number) => void;
    onPositionChange?: (position: number) => void;
    headerRef: React.RefObject<HTMLDivElement | null>
}

const HorizontalDraggable: React.FC<HorizontalDraggableProps> = ({
    children,
    fieldName,
    className = '',
    initialLeft = 0,
    minLeft = -Infinity,
    maxLeft = Infinity,
    onDragStart,
    onDragEnd,
    onPositionChange,
    headerRef
}) => {
    const [position, setPosition] = useState<number>(initialLeft);
    const elementRef = useRef<HTMLButtonElement>(null);
    const dragStartXRef = useRef<number>(0);
    const dragStartLeftRef = useRef<number>(0);


    // Handle position boundaries
    const constrainPosition = (pos: number): number => {
        return Math.min(Math.max(pos, minLeft), maxLeft);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dragStartXRef.current = e.clientX;
        dragStartLeftRef.current = position;
        onDragStart?.(position);
        const controller = new AbortController();
        const handleMouseUp = () => {
            onDragEnd?.(position);
            controller.abort()
        };
        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - dragStartXRef.current;
            const pos = dragStartLeftRef.current + deltaX
            const newPosition = constrainPosition(pos);
            console.log(fieldName, deltaX, pos, newPosition)
            setPosition(pos);
            
            onPositionChange?.(pos);
            // if (pos <= minLeft || pos >= maxLeft) {
            //     controller.abort()
            // }
        };
        headerRef.current?.addEventListener('mousemove', handleMouseMove, { signal: controller.signal, passive: true });
        document.addEventListener('mouseup', handleMouseUp, { signal: controller.signal, passive: true });
        headerRef.current?.addEventListener('mouseleave', handleMouseUp, { signal: controller.signal, passive: true });
    };

    // @todo add touch controlls
    return (
        <button
            key={fieldName}
            ref={elementRef}
            className={`absolute top-0 bottom-0 cursor-col-resize ${className}`}
            style={{
                left: `${position}px`,
                cursor: 'grab',
                userSelect: 'none',
                touchAction: 'none',
            }}
            onMouseDown={handleMouseDown}
            draggable={true}
        >
            {children}
        </button>
    );
};

export default HorizontalDraggable;