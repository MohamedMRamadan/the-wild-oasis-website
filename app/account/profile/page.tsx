import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-service";
import { Guest } from "@/app/_types/data-service.type";
import { Session } from "next-auth";
import React from "react";

type Props = {};

export const metadata = {
  title: "Update Guest Profile",
  description:
    "Update your guest profile on The Wild Oasis, where you'll find affordable, family-friendly cabins for your next adventure.",
  image: "/og-image.png",
};
const page = async (props: Props) => {
  const session = await auth()!;

  const user = (session as Session).user!;
  const guest: Guest = await getGuest(user.email!);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>
      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={guest.nationality}
        />
      </UpdateProfileForm>
    </div>
  );
};

export default page;
