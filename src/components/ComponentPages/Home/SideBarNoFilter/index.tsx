import { useRouter } from "next/router";
import { Button } from "antd";

import GoogleAd from "../../../googleAds";

export default function HomeSideBar({
  onCreateCamp = () => {},
  isShowBtn = true,
}) {
  const router = useRouter();
  const campRoute = () => {
    router.push("/create/topic");
  };

  return (
    <>
      <div
        className="leftSideBar_Card noFilter"
        style={{
          padding: !isShowBtn ? "0" : "",
          border: !isShowBtn ? "none" : "",
        }}
      >
        {isShowBtn && (
          <div className="btnsWrap">
            <Button size="large" className={"btn"} onClick={campRoute}>
              <i className="icon-topic"></i>Create New Topic
            </Button>
          </div>
        )}
      </div>
      <div className="text-center">
        <GoogleAd
          ad_client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT}
          ad_slot={process.env.NEXT_PUBLIC_GOOGLE_ADS_LEFT_SLOT}
        />
      </div>
    </>
  );
}
