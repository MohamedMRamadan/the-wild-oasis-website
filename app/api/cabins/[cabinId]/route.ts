import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";
import { NextRequest as req, NextResponse as res } from "next/server";

export async function GET(_: req, { params }: { params: { cabinId: string } }) {
  const { cabinId } = params;
  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    return res.json({ cabin, bookedDates }, { status: 200 });
  } catch (err) {
    return res.json({ message: "Cabin not found" }, { status: 404 });
  }
}
