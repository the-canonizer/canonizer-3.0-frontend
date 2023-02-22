import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Card, List } from "antd";

import SideBarTimeline from "../Home/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar";
import styles from "./topicDetails.module.scss";
import {
  BackTop,
  Collapse,
} from "antd";
import TimeLine from "../TimeLine";
import { useState } from "react";
const { Panel } = Collapse;
const TopicDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [timelineDescript, setTimelineDescript] = useState("");

 

 

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <TimelineInfoBar />

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBarTimeline  />
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
         
          <>
      <Card
        title="Events"
        className={"activities " + styles.campActivities}
      >
        <h1>{timelineDescript}</h1>
        {/* {loadingIndicator ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={7}
            stylingClass="listSkeleton"
            isButton={false}
          />
        ) : data ? (
          <List
            itemLayout="horizontal"
            className="activeListWrap"
            dataSource={data}
            renderItem={(item) => (
              <List.Item className={styles.activitiesList}>
                <List.Item.Meta
                  avatar={<BellFilled className={styles.bellIcon} />}
                  title={item?.description}
                  description={covertToTime(item?.updated_at)}
                  className={styles.listItem}
                />
              </List.Item>
            )}
          />
        ) : (
          K?.exceptionalMessages?.noRecentActivityFound
        )} */}
      </Card>
    </>
        </aside>
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
