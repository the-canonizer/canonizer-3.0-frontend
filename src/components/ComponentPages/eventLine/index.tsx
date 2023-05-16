import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { BellFilled } from "@ant-design/icons";

import { Card, List } from "antd";

import SideBarTimeline from "../Home/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar/index";
import styles from "./topicDetails.module.scss";
import activityStyle from "../Home/CampRecentActivities/campRecentActivities.module.scss";
import { BackTop, Collapse, Typography } from "antd";
import TimeLine from "../TimeLine";
import { useState } from "react";
import Events from "./Events";
const { Panel } = Collapse;
const { Title } = Typography;
const TopicDetails = () => {
  const router = useRouter();

  const [timelineDescript, setTimelineDescript] = useState([]);

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <TimelineInfoBar />

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBarTimeline timelineDescript={timelineDescript} />
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
                <TimeLine setTimelineDescript={setTimelineDescript} />
              </Panel>
            </Collapse>
          </div>
        </>
        {/* <aside className={"timelineRightSidebar"}>
          <Events timelineDescript={timelineDescript} />
        </aside> */}
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
