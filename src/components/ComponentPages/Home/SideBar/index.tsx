import { useRouter } from "next/router";
import TopicsFilter from "../../../common/topicsFilter";
import CampRecentActivities from "../CampRecentActivities";

export default function HomeSideBar({ onCreateCamp = () => {} }) {
  const router = useRouter();
  return (
    <>
      <TopicsFilter onCreateCamp={onCreateCamp} />
      {router.asPath.includes("topic") && <CampRecentActivities />}
    </>
  );
}
