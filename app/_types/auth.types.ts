import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      guestId?: number;
    } & DefaultSession["user"];
  }
}

// import NextAuth from "next-auth";
// export type ExtendedSession = Omit<Session, "user"> & {
//   user: Session["user"] & {
//     guestId?: number;
//   };
// };
