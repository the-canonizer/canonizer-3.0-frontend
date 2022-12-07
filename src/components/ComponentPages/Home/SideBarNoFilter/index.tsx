import { useRouter } from "next/router";
import { Button } from "antd";
import Script from "next/script";

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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6646446076038181"
        ></Script>

        <Script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
      </div>
    </>
  );
}
