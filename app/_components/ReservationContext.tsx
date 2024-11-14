"use client";
import { createContext, FC, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

const defaultValues = {
  range: { from: undefined, to: undefined },
  setRange() {},
  resetRange() {},
};

type ReservationContextType = {
  range: DateRange | undefined;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  resetRange: () => void;
};

const ReservationContext = createContext<ReservationContextType>(defaultValues);

type Props = {
  children: React.ReactNode;
};
const initialState = {
  from: undefined,
  to: undefined,
};
const ReservationProvider: FC<Props> = ({ children }) => {
  const [range, setRange] = useState<DateRange | undefined>(initialState);
  const resetRange = () => setRange(initialState);
  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservationContext = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx)
    throw new Error(
      "useReservationContext must be used within a ReservationProvider",
    );
  return ctx;
};
export default ReservationProvider;
