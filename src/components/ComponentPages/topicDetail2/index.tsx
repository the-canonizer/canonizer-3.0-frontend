import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TimelineSlider from "./timelineSlider";

import { RootState } from "src/store";
import SideBarTimeline from "../Home/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar";
import styles from "./topicDetails.module.scss";
import {
  BackTop,
  Image,
  Typography,
  message,
  Alert,
  Collapse,
  Popover,
} from "antd";

import { setCurrentTopic } from "../../../store/slices/topicSlice";

import { replaceSpecialCharacters } from "src/utils/generalUtility";
import TimeLine from "../TimeLine";
const { Panel } = Collapse;
const { Link: AntLink } = Typography;

const TopicDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    asof,
    asofdate,
    algorithm,
    newsFeed,
    topicRecord,
    campRecord,
    tree,
    campExist,
    viewThisVersionCheck,
  } = useSelector((state: RootState) => ({
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    newsFeed: state?.topicDetails?.newsFeed,
    asof: state?.filters?.filterObject?.asof,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
  }));

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
          <div className={styles.pageContent + " pageContentWrap"}>
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
                <TimelineSlider />
                <TimeLine />
              </Panel>
            </Collapse>
          </div>
        </>
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
