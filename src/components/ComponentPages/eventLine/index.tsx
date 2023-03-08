import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { BellFilled } from "@ant-design/icons";

import { Card, List } from "antd";

import SideBarTimeline from "../Home/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar";
import styles from "./topicDetails.module.scss";
import activityStyle from "../Home/CampRecentActivities/campRecentActivities.module.scss";
import { BackTop, Collapse, Typography } from "antd";
import TimeLine from "../TimeLine";
import { useState } from "react";
const { Panel } = Collapse;
const { Title } = Typography;
const TopicDetails = () => {
  const router = useRouter();

  const [timelineDescript, setTimelineDescript] = useState("");

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <TimelineInfoBar />

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBarTimeline />
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
        <aside className={"timelineRightSidebar"}>
          <>
            <Card
              title="Events"
              className={
                "activities evntLineActivity " + activityStyle.campActivities
              }
            >
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
              <List itemLayout="horizontal" className="activeListWrap pl-4">
                <List.Item className={activityStyle.activitiesList}>
                  <List.Item.Meta
                    avatar={
                      timelineDescript && (
                        <BellFilled className={activityStyle.bellIcon} />
                      )
                    }
                    title={timelineDescript}
                    className={styles.listItem}
                  />
                </List.Item>
              </List>
            </Card>
          </>
        </aside>
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
