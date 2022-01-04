import Head from "next/head";

import React from "react";

import { withUserAgent } from "next-useragent";

function HeadContent({ description, title, route, image_url }) {
  const url = process.env.SITE_NAME;

  return (
    <Head>
      {/* Meta tags for browser link preview  */}
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={description} />
      <meta
        name="viewport"
        content="width=device-width,minimum-scale=1, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <meta name="type" content="website" />
      <meta name="url" rel="canonical" content={url + route} />
      <meta
        name="image"
        content={
          image_url != undefined && image_url != null
            ? image_url
            : `${process.env.IMAGES_BASE_URL}/static-content/Landing+Page+Banner+.png`
        }
      />
      <link
        // href={`${process.env.IMAGES_BASE_URL}/static-content/canonizerLogo.png.webp`}
        rel="shortcut icon"
      ></link>
      {process.env.NODE_ENV !== "production" && (
        <link
          rel="stylesheet"
          type="text/css"
          // href={"/_next/static/css/styles.chunk.css?v=" + Date.now()}
        />
      )}

      {/* Meta tags for social media link preview  */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url + route} />
      <meta
        property="og:image"
        content={
          image_url != undefined && image_url != null
            ? image_url
            : `${process.env.IMAGES_BASE_URL}/static-content/Landing+Page+Banner+.png`
        }
      />
      <meta property="fb:app_id" content={process.env.Facebook_APP_ID} />
      {/* Meta tags for twitter link preview  */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={url + route} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={
          image_url != undefined && image_url != null
            ? image_url
            : `${process.env.IMAGES_BASE_URL}/static-content/Landing+Page+Banner+.png`
        }
      />
    </Head>
  );
}

export default withUserAgent(HeadContent);
