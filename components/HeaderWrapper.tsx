"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

const HeaderWrapper = () => {
  const pathname = usePathname();

  // Don't show header on /admin-login page
  const hideHeaderRoutes = ["/admin-login"];

  if (hideHeaderRoutes.includes(pathname)) {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
