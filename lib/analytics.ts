// Analytics integration for Google Analytics, Microsoft Clarity, and Mixpanel
// These are initialized based on environment variables

import Clarity from '@microsoft/clarity';
import mixpanel from 'mixpanel-browser';

// Helper to check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Initialize Google Analytics
export const initGoogleAnalytics = () => {
  if (!isBrowser) return;
  
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', gaId);
};

// Initialize Microsoft Clarity using the official package
export const initMicrosoftClarity = () => {
  if (!isBrowser) return;
  
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!clarityId) return;

  Clarity.init(clarityId);
};

// Initialize Mixpanel with the official SDK
export const initMixpanel = () => {
  if (!isBrowser) return;
  
  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is missing! Check your .env file.');
    return;
  }
  
  mixpanel.init(MIXPANEL_TOKEN, { autocapture: true });
};

// Initialize all analytics services
export const initAnalytics = () => {
  initGoogleAnalytics();
  initMicrosoftClarity();
  initMixpanel();
};

// Track page views
export const trackPageView = (url: string) => {
  if (!isBrowser) return;
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  }
  
  // Mixpanel
  mixpanel.track('Page View', { url });
};

// Custom event tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isBrowser) return;
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Mixpanel
  mixpanel.track(eventName, properties);
};

// Add global type definitions for analytics in window
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
} 