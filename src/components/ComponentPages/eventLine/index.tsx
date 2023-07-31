import { useRouter } from "next/router";
import SideBarTimeline from "../Home/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar/index";
import styles from "./topicDetails.module.scss";
import { BackTop, Collapse, Typography } from "antd";
import TimeLine from "../TimeLine";
import { useState } from "react";
const { Panel } = Collapse;
const { Title } = Typography;
const TopicDetails = () => {
  const router = useRouter();

  const [timelineDescript, setTimelineDescript] = useState([]);

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <TimelineInfoBar />

        <aside
          className={
            styles.miniSide +
            " leftSideBar miniSideBar topicPageNewLayoutSidebar"
          }
        >
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
              <Panel disabled header={<h3>Consensus Tree Race</h3>} key="1">
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
