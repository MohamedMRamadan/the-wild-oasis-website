// app/api/webhook/stripe/route.ts

import supabase from "@/app/_lib/supabase";
import stripe from "@/app/_utils/stripe-server";
import { formatISO, fromUnixTime } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Define the Stripe signing secret from your environment variables
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const createPaidBooking = async (paymentIntent: any) => {
  const bookingData = {
    guestId: +paymentIntent.metadata.guestId,
    cabinId: +paymentIntent.metadata.cabinId,
    totalPrice: +paymentIntent.metadata.totalPrice,
    numGuests: +paymentIntent.metadata.numGuests,
    extrasPrice: +paymentIntent.metadata.extrasPrice,
    cabinPrice: +paymentIntent.metadata.cabinPrice,
    numNights: +paymentIntent.metadata.numNights,
    startDate: formatISO(
      fromUnixTime(Number(paymentIntent.metadata.startDate))
    ),
    endDate: formatISO(fromUnixTime(Number(paymentIntent.metadata.endDate))),
    observations: "asdasd",
    isPaid: true,
    status: "confirmed",
    hasBreakfast: paymentIntent.metadata.hasBreakfast === "true" ? true : false,
  };
  const { error } = await supabase.from("bookings").insert([bookingData]);
  if (error) throw new Error("Booking could not be created");
};

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text(); // Read the raw request body as a string

  let event: Stripe.Event;

  try {
    // Verify the event signature and parse the event data
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error: Invalid signature", {
      status: 400,
    });
  }

  // Handle the event based on its type
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("PaymentIntent was successful!", paymentIntent);
      await createPaidBooking(paymentIntent);
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error("PaymentIntent failed:", failedPaymentIntent);
      // Handle the failed payment intent here
      break;

    // Handle other event types
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
