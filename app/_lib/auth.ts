import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { ExtendedSession } from "./../_types/auth.types";
import { createGuest, getGuest } from "./data-service";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [Google],
  callbacks: {
    authorized: ({ auth, request }) => {
      return !!auth?.user;
    },
    // runs before actual signup happens
    async signIn({ user }) {
      try {
        if (user.email) {
          const isGuestExist = await getGuest(user.email);
          if (!isGuestExist) {
            await createGuest({
              fullName: user.name ?? "undefined",
              email: user.email,
            });
          }
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    // runs after signin callback, and also each time the session is checkedout
    async session({ session }: { session: ExtendedSession }) {
      if (session.user.email) {
        const guest = await getGuest(session.user.email);
        session.user.guestId = guest.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
