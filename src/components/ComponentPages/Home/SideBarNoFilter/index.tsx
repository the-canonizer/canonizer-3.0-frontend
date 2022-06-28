import { useRouter } from "next/router";
import TopicsFilter from "../../../common/topicsFilter";
import CampRecentActivities from "../CampRecentActivities";
import { Button } from "antd";
import Image from "next/image";

export default function HomeSideBar({ onCreateCamp = () => {} }) {
  const router = useRouter();
  const campRoute = () => {
    router.push("/create/topic");
  };

  return (
    <>
      <div className="leftSideBar_Card noFilter">
        <div className="btnsWrap">
          <Button size="large" className={"btn"} onClick={campRoute}>
            <i className="icon-topic"></i>Create New Topic
          </Button>
        </div>
      </div>
      <div className="text-center">
        <Image
          src="/images/left-sidebar-adv1.jpg"
          width={217}
          height={433}
          alt=""
        />
      </div>
    </>
  );
}
