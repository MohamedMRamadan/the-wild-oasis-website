import { z } from "zod";

// Define the Zod schema
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

const bookingSchema = z.object({
  startDate: z
    .string()
    .regex(isoDateRegex, "Invalid ISO 8601 format for startDate"),
  endDate: z
    .string()
    .regex(isoDateRegex, "Invalid ISO 8601 format for endDate"),
  numNights: z.number().int().positive(),
  cabinPrice: z.number().positive(),
  cabinId: z.number().int().positive(),
  guestId: z.number().int().positive(),
  numGuests: z.number().int().positive(),
  observations: z
    .string()
    .min(3)
    .transform((val) => (val.length > 1000 ? val.slice(0, 1000) : val)),
  hasBreakfast: z.boolean(),
  isPaid: z.boolean(),
  status: z.enum(["unconfirmed", "confirmed", "cancelled"]), // Adjust status values as needed
  extrasPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
});

export default bookingSchema;
