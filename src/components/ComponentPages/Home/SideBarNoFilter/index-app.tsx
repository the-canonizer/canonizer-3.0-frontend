import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function HomeSideBar({ isShowBtn = true }: any) {
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
    </>
  );
}
