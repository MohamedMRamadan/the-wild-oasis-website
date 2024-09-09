import React from "react";
import SignInButton from "../_components/SignInButton";

type Props = {};
export const metadata = {
  title: "Login",
  description: "Login to access your guest area at The Wild Oasis",
  image: "/og-image.jpg",
  url: "/sign-in",
  type: "website",
  siteName: "The Wild Oasis",
};

const page = (props: Props) => {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">
        Sign in to access your guest area
      </h2>
      <SignInButton />
    </div>
  );
};

export default page;
