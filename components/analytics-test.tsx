"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

export default function AnalyticsTest() {
  const [count, setCount] = useState(0);

  // Test event tracking
  const handleTestEvent = () => {
    setCount(count + 1);
    trackEvent('test_button_click', { count: count + 1 });
  };

  return (
    <div className="fixed bottom-16 left-4 z-50 p-4 bg-background border rounded-md shadow-md">
      <h4 className="text-sm font-medium mb-2">Analytics Test</h4>
      <p className="text-xs mb-2">Count: {count}</p>
      <Button size="sm" onClick={handleTestEvent}>
        Track Test Event
      </Button>
    </div>
  );
} 