import fs from "fs";

import { getSitemapXML } from "src/network/api/metaTagsAPI";

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const XMLData = await getSitemapXML();
  const data = XMLData.data,
    keys = Object.keys(data);

  const head =
      '<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet version="2.0" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/> <xsl:template match="/"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <title>XML Sitemap</title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <style type="text/css"> body { font-family: "Asap", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important; font-size: 13px; color: #545353; } table { border: none; border-collapse: collapse; } #sitemap tr:nth-child(odd) td { background-color: #eee !important; } #sitemap tbody tr:hover td { background-color: #ccc; } #sitemap tbody tr:hover td, #sitemap tbody tr:hover td a { color: #000; } #content { margin: 0 auto; width: 1000px; } .expl { margin: 18px 3px; line-height: 1.2em; } .expl a { color: #da3114; font-weight: 600; } .expl a:visited { color: #da3114; } a { color: #000; text-decoration: none; } a:visited { color: #777; } a:hover { text-decoration: underline; } td { font-size:11px; } th { text-align:left; padding-right:30px; font-size:11px; } thead th { border-bottom: 1px solid #000; } </style> </head> <body>',
    footer = "</body></html></xsl:template></xsl:stylesheet>";

  let sitemap = "";

  keys.forEach((key) => {
    console.log("XMLData", data[key]);
    if (key == "index") {
      sitemap = `${head}<div id="content"><h1>XML Sitemap</h1><p class="expl">This is XML Sitemaps.</p><table id="sitemap" cellpadding="3"><thead><tr><th width="75%">Sitemap</th><th width="25%">Last Modified</th></tr></thead><tbody>
                        ${data[key]
                          ?.map(
                            (d: { [x: string]: any; url: any }) =>
                              `<tr><td><a href="${d.url}"><xsl:value-of select="sitemap:${d.url}"/>${d.url}</a></td><td><xsl:value-of select="concat(${d["Last Modified"]})"/><lastmod>${d["Last Modified"]}</lastmod></td></tr>`
                          )
                          .join("")}
                    </tbody></table></div>${footer}`;
      res.setHeader("Content-Type", "text/xml");
      res.write(sitemap);
    } else {
      sitemap = `${head}<div id="content"><h1>XML Sitemap</h1><p class="expl">This XML Sitemap contains<xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs. </p> <table id="sitemap" cellpadding="3"> <thead> <tr> <th width="80%">URL</th><th title="Last Modification Time" width="15%">Last Mod.</th></tr></thead><tbody>
        ${data[key]
          ?.map(
            (d: { [x: string]: any; url: any }) =>
              `<tr><td><a href="${d.url}"><xsl:value-of select="sitemap:${d.url}"/>${d.url}</a></td><td><xsl:value-of select="concat(${d["Last Modified"]})"/><lastmod>${d["Last Modified"]}</lastmod></td></tr>`
          )
          .join("")}</tbody></table></div>${footer}`;
      fs.appendFile(`public/${key}`, sitemap, () => {});
    }
  });

  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
