import ReservationList from "@/app/_components/ReservationList";
import ToastSuccess from "@/app/_components/ToastSuccess";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";
import { ExtendedSession } from "@/app/_types/auth.types";
import { useSearchParams } from "next/navigation";

type Props = {};

export const metadata = {
  title: "Your Reservations",
  description: "View and manage your reservations at The Wild Oasis",
  image: "/og-image.jpg",
  url: "/reservations",
  type: "website",
  siteName: "The Wild Oasis",
};
const page = async (props: Props) => {
  // CHANGE
  const session = (await auth()) as ExtendedSession;
  const bookings = await getBookings(session.user.guestId!);
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
      <ToastSuccess />
    </div>
  );
};

export default page;
