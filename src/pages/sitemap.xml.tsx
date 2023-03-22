import fs from "fs";

import { getSitemapXML } from "src/network/api/metaTagsAPI";

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const XMLData = await getSitemapXML();
  const data = XMLData.data,
    keys = Object.keys(data);

  let sitemap = "";

  keys.forEach((key) => {
    if (key == "index") {
      sitemap = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="sitemap-css/main-sitemap.xsl"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${data[key]?.map((d: { [x: string]: any; url: any }) =>`<sitemap><loc>${d.url}</loc><lastmod>${d.last_modified}</lastmod></sitemap>`).join("")}</sitemapindex>`;
      res.setHeader("Content-Type", "text/xml");
      res.write(sitemap);
    } else {
      sitemap = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="sitemap-css/main-sitemap.xsl"?><urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${data[key]?.map((d: { [x: string]: any; url: any }) => `<url><loc>${d.url}</loc><lastmod>${d.last_modified}</lastmod></url>`).join("")}</urlset>`;
      fs.writeFileSync(`public/${key}`, sitemap, {encoding:'utf8',flag:'w'});
    }
  });
  
  
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
