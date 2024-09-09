import { Session } from "next-auth";

export type ExtendedSession = Omit<Session, "user"> & {
  user: Session["user"] & {
    guestId?: number;
  };
};
