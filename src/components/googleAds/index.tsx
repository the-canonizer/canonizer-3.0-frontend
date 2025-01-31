import { useEffect } from "react";

function GoogleAd({
  ad_client = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT,
  ad_slot = process.env.NEXT_PUBLIC_GOOGLE_ADS_RIGHT_SLOT,
}) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, []);

  if (isShowAds()) {
    return (
      <div className="ad_area p-4 bg-canGray mb-4">
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
          data-ad-client={ad_client}
          data-ad-slot={ad_slot}
          data-ad-format="auto"
          data-adtest="on"
          data-full-width-responsive="true"
        ></ins>
      </div>
    );
  } else {
    return null;
  }
}

import PropTypes from "prop-types";
import { isShowAds } from "src/utils/generalUtility";

GoogleAd.propTypes = {
  ad_client: PropTypes.string,
  ad_slot: PropTypes.string,
};

export default GoogleAd;
