import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackFajarPageview } from "../lib/digiatAnalytics";

/** Rendered inside BrowserRouter to capture the initial page and SPA navigation. */
export default function FajarAnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackFajarPageview(pathname);
  }, [pathname]);
  return null;
}
