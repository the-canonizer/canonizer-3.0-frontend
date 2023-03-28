import fs from "fs";

import { Fragment, useEffect } from "react";
import { Card, Typography } from "antd";
import { useRouter } from "next/router";

import GetStartedLayout from "src/hoc/getStartedLayout";

import { getSitemapXML } from "src/network/api/metaTagsAPI";

const { Text } = Typography;

const SitemapPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sitemap.xml");
  }, []);

  return (
    <Fragment>
      <GetStartedLayout initialProps={undefined} initialState={undefined}>
        <Card bordered={false} style={{ height: "50vh", textAlign: "center" }}>
          <Text>
            This page is generating sitemap.xml file in every 15 days interval.
          </Text>
        </Card>
      </GetStartedLayout>
    </Fragment>
  );
};

export const getStaticProps = async () => {
  const XMLData = await getSitemapXML();
  const data = XMLData?.data,
    keys = Object.keys(data);

  let sitemap = "";

  keys.forEach((key) => {
    if (key == "index") {
      sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <?xml-stylesheet type="text/xsl" href="sitemap-css/main-sitemap.xsl"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${data[key]
          ?.map(
            (d: { [x: string]: any; url: any }) => `
        <sitemap>
          <loc>
            ${d.url}
          </loc>
          <lastmod>
            ${d.last_modified}
          </lastmod>
        </sitemap>
        `
          )
          .join("")}
      </sitemapindex>
      `;
      fs.writeFileSync(`public/sitemap.xml`, sitemap, {
        encoding: "utf8",
        flag: "w",
      });
    } else {
      sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <?xml-stylesheet type="text/xsl" href="sitemap-css/main-sitemap.xsl"?>
      <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${data[key]
          ?.map(
            (d: { [x: string]: any; url: any }) => `
        <url>
          <loc>
            ${d.url}
          </loc>
          <lastmod>
            ${d.last_modified}
          </lastmod>
        </url>
        `
          )
          .join("")}
      </urlset>
      `;
      fs.writeFileSync(`public/${key}`, sitemap, {
        encoding: "utf8",
        flag: "w",
      });
    }
  });

  if (!XMLData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
    revalidate: 1296000,
  };
};

SitemapPage.displayName = "SitemapPage";

export default SitemapPage;
