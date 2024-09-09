"use client";
import { differenceInDays } from "date-fns";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { createBooking, createCheckoutSession } from "../_lib/actions";
import { Cabin, Settings } from "../_types/components.type";
import { useReservationContext } from "./ReservationContext";
import SubmitButton from "./SubmitButton";
import { BanknotesIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const paymentMethods = [
  {
    paymentMethod: "cache",
    label: "On site",
    icon: <BanknotesIcon className="h-5 text-green-600" />,
  },
  {
    paymentMethod: "card",
    label: "By Card",
    icon: <CreditCardIcon className="h-5 text-yellow-500" />,
  },
];

type Props = {
  cabin: Cabin;
  session: Session;
  settings: Settings;
};

const ReservationForm: FC<Props> = ({ cabin, session: { user }, settings }) => {
  // CHANGE
  const { maxCapacity, regularPrice, discount, id: cabinId, image } = cabin;
  const [numGuests, setNumGuest] = useState(0);
  const { range, resetRange } = useReservationContext();
  const [paymentOption, setPaymentOption] = useState("");
  const router = useRouter();

  const startDate = range?.from;
  const endDate = range?.to;

  const numNights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const cabinPrice = numNights * (regularPrice - discount);

  const isRanged = !(!startDate || !endDate);
  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId,
  };
  const extrasPrice = numNights * numGuests * settings.breakfastPrice;
  const totalPrice = cabinPrice + extrasPrice;

  const submitHandler = async (formData: FormData) => {
    if (paymentOption === "cache") {
      await createBooking.bind(null, bookingData)(formData);
      resetRange();
      toast.success("Thank you for your reservation");
    } else if (paymentOption === "card") {
      let checkoutId = await createCheckoutSession(
        image,
        bookingData,
        formData
      );
      const stripe = (await stripePromise)!;
      sessionStorage.setItem("paymentInitiated", "true");
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutId,
      });
      if (error) {
        sessionStorage.removeItem("paymentInitiated");
        throw new Error("Error redirecting to Checkout");
      }
    } else {
      toast.error("Payment method not selected");
    }
  };
  return (
    <div className="scale-[1.01] flex flex-col">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as {user?.name}</p>
      </div>
      <form
        action={submitHandler}
        // action={createBooking.bind(null, bookingData)}
        className="bg-primary-900 pt-10 pb-7 flex-1 px-16 text-lg flex gap-5 flex-col"
      >
        <input type="text" hidden name="image" value={image} />
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            onChange={(e) => setNumGuest(parseInt(e.target.value))}
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>
        <div className="flex items-center gap-5">
          <label htmlFor="hasBreakfast">
            Do you wanna breakfast?{" "}
            {!!totalPrice && `${totalPrice} (${cabinPrice} + ${extrasPrice})`}
          </label>
          <input
            className="w-4 aspect-square text-accent-600 bg-gray-100 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 checked:bg-accent-500  checked:ring-offset-2 transition duration-200 cursor-pointer"
            type="checkbox"
            name="hasBreakfast"
            id="hasBreakfast"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="payment">Choose your Payment:</label>
          <div className="flex items-center justify-around">
            {paymentMethods.map((payment) => {
              return (
                <div
                  className="flex items-center gap-2"
                  key={payment.paymentMethod}
                >
                  <input
                    className="w-4 aspect-square text-accent-600 bg-gray-100 border-2 border-gray-300  focus:ring-2 focus:ring-accent-500 focus:border-accent-500 checked:bg-accent-500  checked:ring-offset-2 transition duration-200 cursor-pointer "
                    type="radio"
                    name="payment"
                    value={payment.paymentMethod}
                    id={payment.paymentMethod}
                    onChange={(e) => setPaymentOption(e.target.value)}
                  />
                  <label
                    className="flex items-center gap-2"
                    htmlFor={payment.paymentMethod}
                  >
                    {payment.label}
                    <span>{payment.icon}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`flex ${"justify-end"} items-center gap-6`}>
          {isRanged && (
            <>
              <p className="text-primary-300 text-base">
                Start by selecting dates
              </p>

              <SubmitButton pendingContent="reserving" spinner={true}>
                Reserve now
              </SubmitButton>
            </>
          )}
        </div>
      </form>
      {!isRanged && (
        <p className="flex items-center justify-center font-bold space px-8 bg-primary-800 text-primary-300 h-[72px]">
          Fill the fields to complete your reservation.
        </p>
      )}
    </div>
  );
};

export default ReservationForm;
