import fs from "fs";

import { Fragment, useEffect, useState } from "react";
import { Card, Typography } from "antd";
import { useRouter } from "next/router";

import Layout from "src/hoc/layout";

import { getSitemapXML } from "src/network/api/metaTagsAPI";
import CustomSkelton from "src/components/common/customSkelton";

const { Text } = Typography;

const SitemapPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const navigateToSitemap = async () => {
      await router.replace("/sitemap.xml");
      setIsLoading(false);
    };

    navigateToSitemap();
  }, [router]);

  if (isLoading) {
    return (
      <Layout initialProps={undefined} initialState={undefined}>
        <Card
          bordered={false}
          style={{ height: "50vh", textAlign: "center", width: "100%" }}
        >
          <CustomSkelton
            skeltonFor="list"
            bodyCount={5}
            stylingClass="listSkeleton"
            isButton={false}
          />
        </Card>
      </Layout>
    );
  }

  return (
    <Fragment>
      <Layout initialProps={undefined} initialState={undefined}>
        <Card
          bordered={false}
          style={{ height: "50vh", textAlign: "center", width: "100%" }}
        >
          {isLoading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={5}
              stylingClass="listSkeleton"
              isButton={false}
            />
          ) : (
            <Text>
              This page generates a sitemap.xml file in every 15 days.
            </Text>
          )}
        </Card>
      </Layout>
    </Fragment>
  );
};

// export const getServerSideProps = async () => {
export const getStaticProps = async () => {
  try {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
      const XMLData = await getSitemapXML();
      const data = XMLData?.data || {},
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
            ${process.env.NEXT_PUBLIC_BASE_URL + d.url}
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
        return { notFound: true };
      }
    }

    return {
      props: {},
      revalidate: 1296000,
    };
  } catch (error) {
    // eslint-disable-next-line
    console.error("Error generating sitemap:", error);
    return { notFound: true };
  }
};

SitemapPage.displayName = "SitemapPage";

export default SitemapPage;
