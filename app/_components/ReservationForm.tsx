"use client";
import { BanknotesIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { differenceInDays, formatISO } from "date-fns";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { createBooking, createCheckoutSession } from "../_lib/actions";
import { Cabin, Settings } from "../_types/components.type";
import { useReservationContext } from "./ReservationContext";
import SubmitButton from "./SubmitButton";
import { format } from "date-fns";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
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
  settings: Settings;
};

const ReservationForm: FC<Props> = ({ cabin, settings }) => {
  // CHANGE
  const { maxCapacity, regularPrice, discount, id: cabinId, image } = cabin;
  const [numGuests, setNumGuest] = useState(0);
  const { range, resetRange } = useReservationContext();
  const [paymentOption, setPaymentOption] = useState("");
  // const router = useRouter();

  const startDate = range?.from;
  const endDate = range?.to;

  const numNights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const cabinPrice = numNights * (regularPrice - discount);

  const isRanged = !!(startDate && endDate);

  const bookingData = {
    startDate: startDate
      ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss")
      : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
    numNights,
    cabinPrice,
    cabinId,
  };
  const extrasPrice = numNights * numGuests * settings.breakfastPrice;
  const totalPrice = cabinPrice + extrasPrice;

  const submitHandler = async (formData: FormData) => {
    try {
      if (paymentOption === "cache") {
        await createBooking.bind(null, bookingData)(formData);
        // return;
        toast.success("Thank you for your reservation");
      } else if (paymentOption === "card") {
        let checkoutId = await createCheckoutSession(
          image,
          bookingData,
          formData,
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
      } else throw new Error("Payment method not selected");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      resetRange();
    }
  };
  return (
    <div className="flex flex-col">
      <form
        action={submitHandler}
        // action={createBooking.bind(null, bookingData)}
        className="flex flex-1 flex-col gap-5 bg-primary-900 px-16 pb-7 pt-10 text-lg"
      >
        <input type="text" hidden name="image" value={image} />
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
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
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>
        <div className="flex items-center gap-5">
          <label htmlFor="hasBreakfast">
            Do you wanna breakfast?{" "}
            {!!totalPrice && `${totalPrice} (${cabinPrice} + ${extrasPrice})`}
          </label>
          <input
            className="aspect-square w-4 cursor-pointer rounded-sm border-2 border-gray-300 bg-gray-100 text-accent-600 transition duration-200 checked:bg-accent-500 checked:ring-offset-2 focus:border-accent-500 focus:ring-2 focus:ring-accent-500"
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
                    className="aspect-square w-4 cursor-pointer border-2 border-gray-300 bg-gray-100 text-accent-600 transition duration-200 checked:bg-accent-500 checked:ring-offset-2 focus:border-accent-500 focus:ring-2 focus:ring-accent-500"
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

        {isRanged && (
          <div className={`flex flex-1 items-center justify-end gap-6`}>
            <>
              <p className="text-base text-primary-300">
                Start by selecting dates
              </p>

              <SubmitButton pendingContent="reserving" spinner={true}>
                Reserve now
              </SubmitButton>
            </>
          </div>
        )}
      </form>
      {!isRanged && (
        <p className="space flex h-[72px] items-center justify-center bg-primary-800 px-8 font-bold text-primary-300">
          Fill the fields to complete your reservation.
        </p>
      )}
    </div>
  );
};

export default ReservationForm;
