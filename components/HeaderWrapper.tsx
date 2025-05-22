"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

const HeaderWrapper = () => {
  const pathname = usePathname();

  // List of routes or route prefixes where the header should be hidden
  const hideHeaderRoutes = ["/admin-login"];
  const hideHeaderPrefixes = ["/tses-dashboard"];

  const shouldHideHeader =
    hideHeaderRoutes.includes(pathname) ||
    hideHeaderPrefixes.some(prefix => pathname.startsWith(prefix));

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
