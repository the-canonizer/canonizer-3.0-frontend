import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import CampRecentActivities from "@/components/ComponentPages/Home/CampRecentActivities";

import { RootState } from "src/store";
import SideBarTimeline from "../Home/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar";
import styles from "./topicDetails.module.scss";
import {
  BackTop,
  Collapse,
} from "antd";

import { setCurrentTopic } from "../../../store/slices/topicSlice";

import { replaceSpecialCharacters } from "src/utils/generalUtility";
import TimeLine from "../TimeLine";
import { useState } from "react";
const { Panel } = Collapse;
const TopicDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    topicRecord,
    campRecord,
  } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
   
  }));

  const [timelineDescript, setTimelineDescript] = useState("");

  const setCurrentTopics = (data) => dispatch(setCurrentTopic(data));

  const onCreateCamp = () => {
    // const queryParams = router.query;

    const data = {
      message: null,
      topic_num: topicRecord?.topic_num,
      topic_name: topicRecord?.topic_name,
      camp_name: topicRecord?.camp_name,
      parent_camp_num: topicRecord?.camp_num,
    };

    const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    const campName = campRecord?.camp_name?.replaceAll(" ", "-");

    router.push({
      pathname: `/camp/create/${
        topicRecord?.topic_num
      }-${replaceSpecialCharacters(topicName, "-")}/${
        campRecord?.camp_num
      }-${replaceSpecialCharacters(campName, "-")}`,
    });

    setCurrentTopics(data);
  };

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <TimelineInfoBar />

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBarTimeline onCreateCamp={onCreateCamp} />
        </aside>

        <>
          <div
            className={styles.pageContent + " pageContentWrap timelineContent"}
          >
            {" "}
            <Collapse
              defaultActiveKey={["1"]}
              expandIconPosition="right"
              className="topicDetailsCollapse"
            >
              <Panel
                disabled
                header={<h3>Canonizer Sorted Camp Race</h3>}
                key="1"
              >
                <TimeLine
                  timelineDescript={timelineDescript}
                  setTimelineDescript={setTimelineDescript}
                />
              </Panel>
            </Collapse>
          </div>
        </>
        <aside className={"timelineRightSidebar"}>
          <CampRecentActivities timelineDescript={timelineDescript} />
        </aside>
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
