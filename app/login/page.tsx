import React from "react";
import SignInButton from "../_components/SignInButton";

export const metadata = {
  title: "Login",
  description: "Login to access your guest area at The Wild Oasis",
  image: "/og-image.jpg",
  url: "/sign-in",
  type: "website",
  siteName: "The Wild Oasis",
};

const page = () => {
  return (
    <div className="mt-10 flex flex-col items-center gap-10">
      <h2 className="text-3xl font-semibold">
        Sign in to access your guest area
      </h2>
      <SignInButton />
    </div>
  );
};

export default page;
