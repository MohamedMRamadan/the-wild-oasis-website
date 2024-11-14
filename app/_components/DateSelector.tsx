"use client";
import {
  addDays,
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
  datesArr: Date[],
): boolean {
  return (
    range?.from !== undefined &&
    range?.to !== undefined &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from!, end: range.to! }),
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

  let numNights, cabinPrice;

  if (range?.to && range.from) {
    numNights = differenceInDays(range.to, range.from);
    cabinPrice = numNights * (regularPrice - discount);
  }
  const selectHandler = (selectedrange: DateRange | undefined) => {
    if (!!selectedrange?.from && !!selectedrange?.to) {
      if (isAlreadyBooked(selectedrange, bookedDates)) {
        resetRange();
      } else {
        setRange(selectedrange);
      }
    } else setRange(selectedrange);
  };

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="place-self-center pt-12"
        mode="range"
        onSelect={selectHandler}
        selected={range}
        min={minBookingLength}
        max={maxBookingLength}
        startMonth={new Date()}
        hidden={[{ before: new Date() }]}
        endMonth={new Date(new Date().getFullYear() + 5, 11)}
        captionLayout="dropdown"
        numberOfMonths={2}
        modifiers={{
          withinRange: { from: range?.from, to: range?.to },
        }}
        modifiersClassNames={{
          withinRange: "rdp-day_inRange",
        }}
        disabled={(currDate) => {
          const isFromDate = currDate.getTime() === range?.from?.getTime();
          return (
            isPast(currDate) ||
            bookedDates.some((date) => isSameDay(date, currDate)) ||
            (!!range?.from &&
              !isFromDate &&
              !(
                currDate >= addDays(range.from, 3) &&
                currDate <= addDays(range.from, 7)
              ))
          );
        }}
      />

      <div className="flex h-[72px] items-center justify-between bg-accent-500 px-8 text-primary-800">
        <div className="flex items-baseline gap-6">
          <p className="flex items-baseline gap-2">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="font-semibold text-primary-700 line-through">
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
            className="border border-primary-800 px-4 py-2 text-sm font-semibold"
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

// <DayPicker
// className="place-self-center pt-12"
// mode="range"
// onSelect={selectHandler}
// selected={range}
// min={minBookingLength + 1}
// max={maxBookingLength + 1}
// fromMonth={new Date()}
// fromDate={new Date()}
// toYear={new Date().getFullYear() + 5}
// captionLayout="dropdown"
// numberOfMonths={2}
// disabled={(currDate) => {
//   return (
//     isPast(currDate) ||
//     bookedDates.some((date) => isSameDay(date, currDate))
//   );
// }}
// />
