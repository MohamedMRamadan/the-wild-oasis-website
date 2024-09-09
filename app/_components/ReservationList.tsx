"use client";
import React, { FC, useOptimistic } from "react";
import { Booking } from "../_types/components.type";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "../_lib/actions";

type Props = {
  bookings: Booking[];
};

const ReservationList: FC<Props> = ({ bookings }) => {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currBooking, bookingId: number): Booking[] => {
      return currBooking.filter((booking) => booking.id !== bookingId);
    }
  );
  const sortedOptimsticBookings = optimisticBookings.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const deleteHandler = async (bookingId: number) => {
    optimisticDelete(bookingId);
    deleteBooking(bookingId);
  };
  return (
    <ul className="space-y-6">
      {sortedOptimsticBookings.map((booking) => {
        return (
          <ReservationCard
            booking={booking}
            key={booking.id}
            onDelete={deleteHandler}
          />
        );
      })}
    </ul>
  );
};

export default ReservationList;
