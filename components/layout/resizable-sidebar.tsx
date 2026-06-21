"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ResizableSidebarProps = {
  defaultWidth: number;
  minWidth?: number;
  maxWidth?: number;
  children: React.ReactNode;
  className?: string;
};

export function ResizableSidebar({
  defaultWidth,
  minWidth = 200,
  maxWidth = 600,
  children,
  className,
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const isResizing = useRef(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      setWidth((w) => Math.min(Math.max(w + e.movementX, minWidth), maxWidth));
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [maxWidth, minWidth]);

  return (
    <div style={{ width: `${width}px` }} className={cn("relative shrink-0 flex flex-col", className)}>
      {children}
      {/* WAI-ARIA separator pattern requires this element be focusable and keyboard-operable when it resizes adjoining panels: https://www.w3.org/WAI/ARIA/apg/patterns/separator/ */}
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panel"
        aria-valuenow={width}
        aria-valuetext={`${width} pixels`}
        aria-valuemin={minWidth}
        aria-valuemax={maxWidth}
        tabIndex={0}
        className="absolute -right-1 inset-y-0 z-10 w-2 cursor-col-resize outline-none hover:bg-border/50 focus-visible:bg-ring/50"
        onMouseDown={startResizing}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setWidth((w) => Math.max(w - 10, minWidth));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setWidth((w) => Math.min(w + 10, maxWidth));
          }
        }}
      />
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
    </div>
  );
}
