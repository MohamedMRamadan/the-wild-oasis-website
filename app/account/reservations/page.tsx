import ReservationList from "@/app/_components/ReservationList";
import ToastSuccess from "@/app/_components/ToastSuccess";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";
import { Session } from "next-auth";

export const metadata = {
  title: "Your Reservations",
  description: "View and manage your reservations at The Wild Oasis",
  image: "/og-image.jpg",
  url: "/reservations",
  type: "website",
  siteName: "The Wild Oasis",
};
const page = async () => {
  // CHANGE
  const session = (await auth()) as Session;
  const bookings = await getBookings(session.user.guestId!);
  return (
    <div>
      <h2 className="mb-7 text-2xl font-semibold text-accent-400">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="text-accent-500 underline" href="/cabins">
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
