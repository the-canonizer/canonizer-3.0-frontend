import { useEffect } from "react";

function GoogleAd() {
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
      style={{
        display: "block",
        border: "2px solid green",
        width: "200px",
        height: "635px",
      }}
      data-ad-client="ca-pub-6971863585610170"
      data-ad-slot="4564205621"
      data-ad-format="auto"
      data-adtest="on"
      data-full-width-responsive="true"
    ></ins>
  );
}

export default GoogleAd;
