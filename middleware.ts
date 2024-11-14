// import { NextRequest, NextResponse } from "next/server";

// export const middleware = (req: NextRequest) => {
//   return NextResponse.redirect(new URL("/account", req.url));
// };

export { auth as middleware } from "./app/_lib/auth";

export const config = {
  matcher: ["/account"],
};
