// components/GoogleAnalytics.jsx
'use client';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GA_TRACKING_ID = 'G-W82L36K240';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    if (typeof window.gtag === 'function' && GA_TRACKING_ID) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Don't render script if ID is missing
  if (!GA_TRACKING_ID) {
    return null;
  }

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        id="google-analytics-init" // Use a unique ID
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                        page_path: window.location.pathname,
                    });
                `,
        }}
      />
    </>
  );
}
