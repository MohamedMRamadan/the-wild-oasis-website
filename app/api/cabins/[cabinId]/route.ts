import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";
import { NextRequest as req, NextResponse as res } from "next/server";

export async function GET(_: req, { params }: { params: { cabinId: string } }) {
  const { cabinId } = params;
  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch (err) {
    return res.json({ message: "Cabin not found" });
  }
}
