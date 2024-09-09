import Link from "next/link";
import React from "react";
import SideNavigation from "../_components/SideNavigation";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <SideNavigation />
      <div className="p-1">{children}</div>
    </div>
  );
};

export default Layout;
