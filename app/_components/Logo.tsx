import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Logo: React.FunctionComponent = (props: Props) => {
  return (
    <Link href="/" className="z-10 flex items-center gap-4">
      <Image src="/logo.png" height="60" width="60" alt="The Wild Oasis logo" />
      <span className="text-xl font-semibold text-primary-100">
        The Wild Oasis
      </span>
    </Link>
  );
};

export default Logo;
