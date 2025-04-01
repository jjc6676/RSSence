"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackPageView } from "@/lib/analytics";

// Separate component to handle the search params
function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Track page views when the route changes
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  useEffect(() => {
    // Initialize analytics on first mount
    initAnalytics();
  }, []);

  // This component doesn't render anything visible
  return (
    <Suspense fallback={null}>
      <AnalyticsPageTracker />
    </Suspense>
  );
} 