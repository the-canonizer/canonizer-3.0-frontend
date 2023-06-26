import * as React from "react";
import Script from "next/script";
import * as gtag from "./gtag";
import { useRouter } from "next/router";
import { useEffect } from "react";

const GoogleAnalyticScripts = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router?.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router?.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router?.events]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
    </>
  );
};

export default GoogleAnalyticScripts;
