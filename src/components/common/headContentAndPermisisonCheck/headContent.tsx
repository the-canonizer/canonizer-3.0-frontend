import React from "react";
import Head from "next/head";

import schemaGet, { schemas } from "./schemaContent";

type HeadContentProps = {
  description: string;
  title: string;
  route: string;
  author: string;
  componentName: string;
  canonical: string;
};

declare global {
  interface Window {
    dataLayer: any;
  }
}

export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GA_TRACKING_ID || "G-HKYLGCPPDC";

function HeadContent({
  description,
  title,
  route,
  author,
  componentName,
  canonical,
}: HeadContentProps) {
  const image_url = `${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/canonizer_logo.jpg`;
  return (
    <Head>
      <script
        async
        src={`Https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}`}
      ></script>
      {/* Meta tags for browser link preview  */}
      <title>{title}</title>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            schemaGet(componentName, title, route) || schemas[componentName],
        }}
      ></script>

      <meta charSet="utf-8" />
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width,minimum-scale=1, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <meta name="author" content={author} />
      <meta name="type" content="website" />
      {/* <meta name="url" rel="canonical" content={url + route} /> */}
      <meta name="image" content={image_url} />
      <link rel="shortcut icon" href="/images/canonizer-fav.png" />

      {/* Meta tags for social media link preview  */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={route} />
      <meta property="og:image" content={image_url} />
      <meta property="og:image:alt" content="canonizer" />
      <meta
        property="fb:app_id"
        content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
      />
      {/* Meta tags for twitter link preview  */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={process.env.NEXT_PUBLIC_SITE_NAME} />
      <meta name="twitter:url" content={route} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image_url} />

      {/* canonical url */}
      <link rel="canonical" href={canonical || "https://canonizer.com/"} />

      {/* GTM Code */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_TRACKING_ID}');`,
        }}
      />
    </Head>
  );
}

export default HeadContent;
