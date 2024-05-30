// import { useRouter } from "next/router";
// import { Button } from "antd";

// import GoogleAd from "../../../googleAds";

export default function HomeSideBar({ isShowBtn = true }: any) {
  // const router = useRouter();
  // const campRoute = () => {
  //   router?.push("/create/topic");
  // };

  return (
    <>
      <div
        className={"topicPageNewLayoutSidebar leftSideBar miniSideBar noFilter"}
        style={{
          padding: !isShowBtn ? "0" : "",
          border: !isShowBtn ? "none" : "",
        }}
      >
        {isShowBtn && (
          <div className="btnsWrap">
            {/* <Button size="large" className={"btn"} onClick={campRoute}>
              <i className="icon-topic"></i>Create Topic
            </Button> */}
          </div>
        )}
      </div>
    </>
  );
}
