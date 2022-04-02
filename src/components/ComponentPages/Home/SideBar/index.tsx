import { useRouter } from "next/router";
import TopicsFilter from "../../../common/topicsFilter";
import CampRecentActivities from "../CampRecentActivities";

export default function HomeSideBar() {
  const router = useRouter();
  return (
    <>
      <TopicsFilter />
      {router.asPath.includes("camp-details") && <CampRecentActivities />}
    </>
  );
}
