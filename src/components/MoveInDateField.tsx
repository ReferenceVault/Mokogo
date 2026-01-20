import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface MoveInDateFieldProps {
  value?: string;
  onChange?: (date: string) => void;
  min?: string;
  hideLabel?: boolean; // Hide internal label when external label is provided
  className?: string; // Allow custom className for different contexts
  numberOfMonths?: number; // Number of months to show (default 2)
}

export function MoveInDateField({ value, onChange, min, hideLabel = false, className = "", numberOfMonths = 2 }: MoveInDateFieldProps) {
  const [open, setOpen] = useState(false);
  const [positionReady, setPositionReady] = useState(false);
  
  // Helper to parse date string as local date (not UTC)
  const parseLocalDate = (dateString: string): Date => {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }
    return new Date(dateString);
  };

  // Helper to format date as local YYYY-MM-DD (not UTC)
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState<Date | undefined>(
    value ? parseLocalDate(value) : undefined
  );
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Calculate position before opening
  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 8,
        left: rect.left
      };
    }
    return { top: 0, left: 0 };
  };

  // sync with controlled value
  useEffect(() => {
    if (value) setDate(parseLocalDate(value));
    else setDate(undefined);
  }, [value]);

  // Update position on scroll/resize to keep it aligned
  useEffect(() => {
    if (open && positionReady) {
      const updatePosition = () => {
        const newPosition = calculatePosition();
        setPosition(newPosition);
      };
      
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, positionReady]);

  // Close on click outside (but allow scrolling)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        wrapperRef.current?.contains(target) ||
        calendarRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    if (open) {
      // Use a small delay to prevent immediate close on open
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    const dateString = formatLocalDate(selectedDate);
    onChange?.(dateString);
    setOpen(false);
    setPositionReady(false);
  };

  const label = date
    ? date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Add date";

  // minimum date: today by default (parse min as local date)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = min ? parseLocalDate(min) : today;
  return (
    <>
      <div ref={wrapperRef} className="relative">
        {/* Airbnb-style fake input */}
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!open) {
              // Calculate position BEFORE opening to prevent flicker
              const newPosition = calculatePosition();
              setPosition(newPosition);
              setPositionReady(false);
              setOpen(true);
              // Use requestAnimationFrame to ensure position is set before showing
              requestAnimationFrame(() => {
                setPositionReady(true);
              });
            } else {
              setOpen(false);
              setPositionReady(false);
            }
          }}
          className={`flex ${hideLabel ? 'items-center px-3.5' : 'flex-col justify-center px-4'} py-2 
                     ${hideLabel 
                       ? 'bg-white w-full border border-mokogo-gray hover:border-mokogo-primary focus:outline-none focus:ring-2 focus:ring-mokogo-primary' 
                       : 'bg-[rgba(255,255,255,0.72)] backdrop-blur-md min-w-[200px] border border-[#DED8D1] hover:border-[#E58C4A]'}
                     transition
                     text-left
                     ${hideLabel ? 'h-[52px] rounded-xl' : 'h-[56px] rounded-2xl'}
                     ${className}`}
        >
          {!hideLabel && (
            <span className="text-[12px] font-medium text-[#7A746E]">
              Move-in date
            </span>
          )}
          <span
            className={`text-[14px] ${
              date ? "text-[#2B2B2B]" : "text-[#7A746E]"
            }`}
          >
            {label}
          </span>
        </button>
      </div>

      {/* Floating calendar panel */}
      {typeof document !== "undefined" &&
        open &&
        createPortal(
          <div
            ref={calendarRef}
            className="fixed z-[9999] transition-opacity duration-200"
            style={{ 
              top: `${position.top}px`,
              left: `${position.left}px`,
              opacity: positionReady ? 1 : 0,
              pointerEvents: positionReady ? 'auto' : 'none'
            }}
          >
            <div
              className={`${numberOfMonths === 1 ? 'w-[min(90vw,360px)]' : 'w-[min(90vw,720px)]'} p-6 rounded-3xl
                         bg-[rgba(255,255,255,0.96)] backdrop-blur-2xl
                         border border-[rgba(255,255,255,0.35)]
                         shadow-[0_24px_60px_rgba(0,0,0,0.18)]`}
            >
              {/* header like Airbnb */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#2B2B2B]">
                    Move-in date
                  </span>
                  <span className="text-xs text-[#7A746E]">
                    Choose your preferred move-in date
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs text-[#7A746E] hover:text-[#2B2B2B]"
                >
                  Close
                </button>
              </div>

              <DayPicker
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(d) => d < minDate}
                defaultMonth={date || minDate}
                numberOfMonths={numberOfMonths}
                weekStartsOn={1}
                className="rdp-root text-[#2B2B2B]"
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
