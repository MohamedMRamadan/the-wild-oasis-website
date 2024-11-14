import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-service";
import { Guest } from "@/app/_types/data-service.type";
import { Session } from "next-auth";
import React from "react";

export const metadata = {
  title: "Update Guest Profile",
  description:
    "Update your guest profile on The Wild Oasis, where you'll find affordable, family-friendly cabins for your next adventure.",
  image: "/og-image.png",
};
const page = async () => {
  const session = (await auth()) as Session;

  const user = session.user;
  const guest = await getGuest(user.email!);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold text-accent-400">
        Update your guest profile
      </h2>

      <p className="mb-8 text-lg text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>
      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
          defaultCountry={guest.nationality}
        />
      </UpdateProfileForm>
    </div>
  );
};

export default page;
