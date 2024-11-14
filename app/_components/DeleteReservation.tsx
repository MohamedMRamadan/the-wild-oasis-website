"use client";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

type Props = {
  bookingId: number;
  onDelete: (bookingId: number) => void;
};

const DeleteReservation: React.FC<Props> = ({ bookingId, onDelete }) => {
  const [pending, startTransation] = useTransition();
  const deleteReservationHandler = () => {
    if (confirm("Are you sure you want to delete this reservation?"))
      startTransation(() => onDelete(bookingId));
  };
  return (
    <button
      onClick={deleteReservationHandler}
      className="group flex flex-grow items-center gap-2 px-3 text-xs font-bold uppercase text-primary-300 transition-colors hover:bg-accent-600 hover:text-primary-900"
    >
      {!pending ? (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 transition-colors group-hover:text-primary-800" />
          <span className="mt-1">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
};

export default DeleteReservation;
