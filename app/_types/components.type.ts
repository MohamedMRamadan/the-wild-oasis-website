import { Metadata } from "next";

export type GenerateMetadataType<T> = (Object: T) => Promise<Metadata>;

export interface Cabin {
  id: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
}
export interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: string;
  observations?: string;
  hasBreakfast?: boolean;
  extrasPrice?: number;
  status?: "confirmed" | "unconfirmed" | "cancelled";
  cabinPrice: number;
  cabins: {
    name: string;
    image: string;
  };
}
export type Settings = {
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
};
