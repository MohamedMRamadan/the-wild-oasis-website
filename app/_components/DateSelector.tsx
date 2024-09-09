"use client";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { FC } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Cabin, Settings } from "../_types/components.type";
import { useReservationContext } from "./ReservationContext";

function isAlreadyBooked(
  range: DateRange | undefined,
  datesArr: Date[]
): boolean {
  return (
    range?.from !== undefined &&
    range?.to !== undefined &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from!, end: range.to! })
    )
  );
}
type Props = {
  settings: Settings;
  cabin: Cabin;
  bookedDates: Date[];
};

const DateSelector: FC<Props> = ({ settings, cabin, bookedDates }) => {
  const { range, setRange, resetRange } = useReservationContext();
  const { regularPrice, discount } = cabin;
  const { minBookingLength, maxBookingLength } = settings;

  // const displayedRange = isAlreadyBooked(range, bookedDates)
  //   ? { from: undefined, to: undefined }
  //   : range;

  const numNights = differenceInDays(range!.to!, range!.from!);

  const selectHandler = (selectedrange: any) => {
    if (!!selectedrange.from && !!selectedrange.to) {
      if (isAlreadyBooked(selectedrange, bookedDates)) {
        resetRange();
      } else {
        setRange(selectedrange);
      }
    } else setRange(selectedrange);
  };
  const cabinPrice = numNights * (regularPrice - discount);

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={selectHandler}
        selected={range}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(currDate) => {
          return (
            isPast(currDate) ||
            bookedDates.some((date) => isSameDay(date, currDate))
          );
        }}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => resetRange()}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default DateSelector;
