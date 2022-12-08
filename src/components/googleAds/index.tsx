import { useEffect } from "react";

function GoogleAd({
  ad_client = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT,
  ad_slot,
  style = {},
}) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={
        style || {
          display: "block",
          width: "100%",
          height: "auto",
          border: "none",
          maxWidth: "100%",
        }
      }
      data-ad-client={ad_client}
      data-ad-slot={ad_slot}
      data-ad-format="auto"
      data-adtest="on"
      data-full-width-responsive="true"
    ></ins>
  );
}

export default GoogleAd;
