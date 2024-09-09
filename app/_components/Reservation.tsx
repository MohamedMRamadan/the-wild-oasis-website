import { FC } from "react";
import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import LoginMessage from "./LoginMessage";
import { Cabin } from "../_types/components.type";

type Props = {
  cabin: Cabin;
};

const Reservation: FC<Props> = async ({ cabin }) => {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-700 min-h-[570px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} session={session} settings={settings} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
};

export default Reservation;
