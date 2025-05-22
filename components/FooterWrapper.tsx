"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const FooterWrapper = () => {
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

  return <Footer />;
};

export default FooterWrapper;
