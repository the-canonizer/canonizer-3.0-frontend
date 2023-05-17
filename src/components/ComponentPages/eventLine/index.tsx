import SideBarTimeline from "../Home/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar";
import styles from "./topicDetails.module.scss";
import { BackTop, Collapse } from "antd";
import TimeLine from "../TimeLine";
import { useState } from "react";
const { Panel } = Collapse;
const TopicDetails = () => {
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
