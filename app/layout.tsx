import { Toaster } from "react-hot-toast";
import Header from "./_components/Header";
import ReservationProvider from "./_components/ReservationContext";
import "./_styles/globals.css";
// import "react-day-picker/style.css";
import { Josefin_Sans } from "next/font/google";
import { FC } from "react";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "%s | The wild Oasis",
    default: "Welcome | The Wild Oasis",
  },
  description: "Generated by Next.js",
};

type RootType = {
  children: React.ReactNode;
};
const RootLayout: FC<RootType> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${josefinSans.className} flex min-h-screen flex-col bg-primary-950 text-primary-100`}
      >
        <Header />
        <div className="grid flex-1 px-8 py-12">
          <main className="mx-auto w-full max-w-7xl">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
        <Toaster
          position="top-center" // Customize position
          reverseOrder={false} // Reverse order of toasts
          toastOptions={{
            // Custom styles and behavior
            success: {
              duration: 3000,
              style: {
                background: "#4caf50",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#f44336",
                color: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
};
export default RootLayout;
