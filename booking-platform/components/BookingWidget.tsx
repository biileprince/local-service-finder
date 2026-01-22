"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/store/booking";

interface TimeSlot {
  time: string;
  available: boolean;
  isFastest?: boolean;
}

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  onSelectTime: (time: string) => void;
  selectedTime: string | null;
}

export function TimeSlotSelector({
  slots,
  onSelectTime,
  selectedTime,
}: TimeSlotSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.time}
          disabled={!slot.available}
          onClick={() => onSelectTime(slot.time)}
          className={cn(
            "relative py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all",
            !slot.available &&
              "cursor-not-allowed text-gray-400 bg-gray-50 border-gray-200",
            slot.available &&
              selectedTime !== slot.time &&
              "hover:border-primary-500 hover:bg-primary-50 border-gray-300 text-gray-900",
            selectedTime === slot.time &&
              "border-[#f97316] bg-[#f97316] text-white shadow-lg",
          )}
        >
          {slot.time}
          {!slot.available && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-[80%] h-[1px] bg-gray-300 rotate-12" />
            </span>
          )}
          {slot.isFastest && selectedTime === slot.time && (
            <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 h-auto py-0.5">
              Fastest
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}

interface DateSelectorProps {
  dates: string[];
  onSelectDate: (date: string) => void;
  selectedDate: string | null;
}

export function DateSelector({
  dates,
  onSelectDate,
  selectedDate,
}: DateSelectorProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = dayNames[date.getDay()];
    const dayNum = date.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const isToday = compareDate.getTime() === today.getTime();

    return { day, dayNum, isToday };
  };

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {dates.map((date) => {
        const { day, dayNum, isToday } = formatDate(date);
        const isSelected = selectedDate === date;

        return (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={cn(
              "flex flex-col items-center justify-center w-14 h-20 rounded-2xl border-2 transition-all shrink-0",
              isSelected
                ? "bg-[#f97316] text-white border-[#f97316] shadow-lg shadow-[#f97316]/30"
                : "border-gray-300 hover:border-[#f97316] bg-white hover:shadow-sm text-gray-900",
            )}
          >
            <span
              className={cn(
                "text-xs mb-1 font-semibold",
                isSelected ? "text-white" : "text-gray-500",
              )}
            >
              {day}
            </span>
            <span
              className={cn(
                "text-lg font-bold",
                isSelected ? "text-white" : "text-gray-900",
              )}
            >
              {dayNum}
            </span>
            {isToday && (
              <span
                className={cn(
                  "text-[10px] mt-1 px-1.5 rounded-full font-medium",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-[#fff7ed] text-[#f97316]",
                )}
              >
                Today
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface BookingWidgetProps {
  providerId: string;
  availability: {
    date: string;
    times: TimeSlot[];
  }[];
  onBookClick: () => void;
}

export function BookingWidget({
  availability,
  onBookClick,
}: BookingWidgetProps) {
  const { selectedDate, selectedTime, setSelectedDate, setSelectedTime } =
    useBookingStore();

  // Auto-select first available date if none selected
  useEffect(() => {
    if (!selectedDate && availability.length > 0) {
      setSelectedDate(availability[0].date);
    }
  }, [availability, selectedDate, setSelectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const currentSlots = availability.find((a) => a.date === selectedDate);
  const availableDates = availability.map((a) => a.date);

  return (
    <Card className="p-6 sticky top-6">
      <h3 className="font-display font-bold text-xl mb-6">Book Appointment</h3>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="text-sm font-semibold mb-3 block">Select Date</label>
        <DateSelector
          dates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />
      </div>

      {/* Time Selection */}
      {selectedDate && currentSlots && currentSlots.times.length > 0 && (
        <div className="mb-6">
          <label className="text-sm font-semibold mb-3 block">
            Select Time
          </label>
          <TimeSlotSelector
            slots={currentSlots.times}
            selectedTime={selectedTime}
            onSelectTime={handleTimeSelect}
          />
        </div>
      )}

      {selectedDate && (!currentSlots || currentSlots.times.length === 0) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800 font-medium">
            No available time slots for this date. Please select another date.
          </p>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={onBookClick}
        disabled={!selectedDate || !selectedTime}
        className={cn(
          "w-full h-14 rounded-xl font-bold transition-all text-base shadow-lg",
          selectedDate && selectedTime
            ? "bg-[#f97316] text-white hover:bg-[#ea580c] shadow-[#f97316]/25 active:scale-[0.98]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed",
        )}
      >
        {!selectedDate
          ? "Select a Date"
          : !selectedTime
            ? "Select a Time"
            : "Continue to Checkout"}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        You won&apos;t be charged yet
      </p>
    </Card>
  );
}
