import Link from "next/link";
import React from "react";
import { auth } from "../_lib/auth";
import { ExtendedSession } from "../_types/auth.types";
import Image from "next/image";

type Props = {};

export default async function Navigation(props: Props) {
  const session = await auth();
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4"
            >
              <div className="h-8 aspect-square relative">
                <Image
                  className="rounded-full object-cover"
                  fill
                  src={session.user.image}
                  alt={session.user.name ?? "userImage"}
                />
              </div>
              <span>Guest area</span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors"
            >
              Guest area
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
