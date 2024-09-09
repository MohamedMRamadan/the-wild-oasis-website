"use server";

import { revalidatePath } from "next/cache";
import { ExtendedSession } from "../_types/auth.types";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase";
import { getBooking, getSettings } from "./data-service";
import { Booking } from "../_types/components.type";
import { redirect } from "next/navigation";
import bookingSchema from "../_schemas/bookingValidation";
import { ZodError } from "zod";
import stripe from "../_utils/stripe-server";

const isGuestAuhtenticated = async () => {
  const session = await auth();
  if (!session) throw new Error("Yout must be logged in");
  else return session as ExtendedSession;
};
const createBookingData = async (bookingData: any, formData: FormData) => {
  if (!bookingData.startDate || !bookingData.endDate)
    throw new Error("Please choose your range to complete your reservation.");
  const session = await isGuestAuhtenticated();
  const settings = await getSettings();

  const { numGuests, observations, hasBreakfast, image, payment } =
    Object.fromEntries(formData.entries());

  const newBookingData = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: +numGuests,
    observations,
    hasBreakfast: !!(hasBreakfast === "on"),
    isPaid: false,
    status: "unconfirmed",
  };

  if (hasBreakfast === "on") {
    newBookingData.extrasPrice =
      +numGuests * bookingData.numNights * settings.breakfastPrice;
    newBookingData.totalPrice =
      bookingData.cabinPrice + newBookingData.extrasPrice;
  } else {
    newBookingData.extrasPrice = 0;
    newBookingData.totalPrice = bookingData.cabinPrice;
  }
  return newBookingData;
};
export const createCheckoutSession = async (
  image: string,
  bookingData: any,
  formData: FormData
) => {
  const newBookingData = await createBookingData(bookingData, formData);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking for Cabin ${newBookingData.cabinId}`,
              images: [image],
            },
            unit_amount: newBookingData.totalPrice * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      //http://localhost:3000/cabins/153
      success_url: `http://localhost:3000/account/reservations`,
      cancel_url: `http://localhost:3000/`,
      payment_intent_data: {
        metadata: {
          ...newBookingData,
        },
      },
    });
    return session.id;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Could not create checkout session");
  }
};

export const createBooking = async (bookingData: any, formData: FormData) => {
  const newBookingData = await createBookingData(bookingData, formData);
  try {
    bookingSchema.parse(newBookingData);
    const { error } = await supabase.from("bookings").insert([newBookingData]);
    if (error) throw new Error("Booking could not be created");
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errors = error.errors
        .map((e) => `${e.path[0]}: ${e.message}`)
        .join(",");
      throw new Error(errors);
    } else throw new Error((error as string) || "Un expected error occuered!");
  }
  revalidatePath("/account/reservations");
  redirect("/account/reservations");
};

export const deleteBooking = async (bookingId: number) => {
  const session = (await auth()) as ExtendedSession;
  if (!session) throw new Error("Yout must be logged in");

  const booking = await getBooking(bookingId);
  if (booking.guestId !== session.user.guestId)
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");
  revalidatePath("/account/reservations");
};
export const updateBooking = async (formData: FormData) => {
  const numGuests = +formData.get("numGuests")! as number;
  const observations = formData.get("observations")?.slice(0, 1000);
  const bookingId = +formData.get("bookingId")! as number;

  const booking = (await getBooking(bookingId)) as Booking;
  const settings = await getSettings();
  const session = (await auth()) as ExtendedSession;

  if (session.user.guestId !== booking.guestId)
    throw new Error("you are not allowed to update this reservation");

  let totalPrice;
  let extrasPrice;
  if (booking.hasBreakfast) {
    extrasPrice = booking.numNights * settings.breakfastPrice * numGuests;
    totalPrice = booking.cabinPrice + extrasPrice;
  } else {
    totalPrice = booking.totalPrice;
    extrasPrice = booking.extrasPrice;
  }

  const updatedFields = {
    numGuests,
    observations,
    totalPrice,
    extrasPrice,
  };

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated");

  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect("/account/reservations");
};
export async function updateProfile(formData: FormData) {
  const session = (await auth()) as ExtendedSession;
  // as they will be catched by the closest error bounday(error.ts)
  // we can create local error boundary located at the folder route (ex: inside profile/ or account/)
  if (!session) throw new Error("Yout must be logged in");
  // formData is web Api works also on the browser

  // ***************** Creating the Data *****************
  const nationalID = formData.get("nationalID")! as string;
  const [nationality, countryFlag] = (
    formData.get("nationality") as string
  ).split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Provide a valid national ID.");
  const updateData = { nationalID, nationality, countryFlag };

  //**************** Update *****************
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");
  revalidatePath("/account/profile");
}
export async function signInAction() {
  return await signIn("google", {
    redirectTo: "/account",
  });
}
export async function signOutAction() {
  return await signOut({
    redirectTo: "/",
  });
}
