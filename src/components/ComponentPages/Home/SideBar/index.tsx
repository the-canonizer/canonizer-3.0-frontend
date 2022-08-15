import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import TopicsFilter from "../../../common/topicsFilter";
import CampRecentActivities from "../CampRecentActivities";
import NewsFeedsCard from "../../TopicDetails/NewsFeedsCard";
export default function HomeSideBar({ onCreateCamp = () => {} }) {
  const router = useRouter();
  const { newsFeed } = useSelector((state: RootState) => ({
    newsFeed: state?.topicDetails?.newsFeed,
  }));

  return (
    <>
      <TopicsFilter onCreateCamp={onCreateCamp} />
      {typeof window !== "undefined" && window.innerWidth > 767 && (
        <>
          {router.asPath.includes("topic") && <CampRecentActivities />}
          {!!newsFeed?.length && <NewsFeedsCard newsFeed={newsFeed} />}
        </>
      )}
    </>
  );
}
