import Head from "next/head";

import React from "react";

type HeadContentProps = {
  description: string;
  title: string;
  route: string;
  author: string;
};

function HeadContent({
  description,
  title,
  route,
  author,
}: HeadContentProps) {
  const url = process.env.NEXT_PUBLIC_SITE_NAME;
  const image_url = `${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/canonizer_preview.jpg`;
  return (
    <Head>
      <script
        async
        src={`Https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}`}
      ></script>

      {/* Meta tags for browser link preview  */}
      <title>{title}</title>
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
      <meta property="og:url" content={url + route} />
      <meta property="og:image" content={image_url} />
      <meta property="og:image:alt" content="canonizer" />
      <meta
        property="fb:app_id"
        content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
      />
      {/* Meta tags for twitter link preview  */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={url + route} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image_url} />
    </Head>
  );
}

export default HeadContent;
