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
}

export function MoveInDateField({ value, onChange, min, hideLabel = false, className = "" }: MoveInDateFieldProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [top, setTop] = useState(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // sync with controlled value
  useEffect(() => {
    if (value) setDate(new Date(value));
    else setDate(undefined);
  }, [value]);

  // position calendar under the search bar (Airbnb-like)
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTop(rect.bottom + 8); // 8px gap
    }
  }, [open]);

  // Close on click outside
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

    function handleScroll() {
      setOpen(false);
    }

    function handleResize() {
      setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    const dateString = selectedDate.toISOString().split("T")[0];
    onChange?.(dateString);
    setOpen(false);
  };

  const label = date
    ? date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Add date";

  // minimum date: tomorrow by default
  const minDate = min ? new Date(min) : new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <>
      <div ref={wrapperRef} className="relative">
        {/* Airbnb-style fake input */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
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

      {/* Airbnb-like floating calendar panel (centered, 2 months) */}
      {typeof document !== "undefined" &&
        open &&
        createPortal(
          <div
            ref={calendarRef}
            className="fixed z-[9999] flex justify-center w-full"
            style={{ top }}
          >
            <div
              className="w-[min(90vw,720px)] p-6 rounded-3xl
                         bg-[rgba(255,255,255,0.96)] backdrop-blur-2xl
                         border border-[rgba(255,255,255,0.35)]
                         shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
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
                numberOfMonths={2} // Airbnb-style double calendar
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
