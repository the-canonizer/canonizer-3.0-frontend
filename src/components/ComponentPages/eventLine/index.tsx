// import { useRouter } from "next/router";
import SideBarTimeline from "../Home-old/SideBarTimeline";
import TimelineInfoBar from "./TimelineInfoBar/index";
import styles from "./topicDetails.module.scss";
import { BackTop, Collapse } from "antd";
import TimeLine from "../TimeLine";
import { useState } from "react";
import { useRouter } from "next/router";
import DataNotFound from "../DataNotFound/dataNotFound";
const { Panel } = Collapse;
const EventLine = () => {
  const router = useRouter();

  const [timelineDescript, setTimelineDescript] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  return (
    <>
      {router?.asPath.includes("history") ? (
        <DataNotFound
          name={"Page"}
          message={`${"Page"} not found`}
          backURL={"/"}
          goBack={true}
        />
      ) : (
        <>
          <TimelineInfoBar />
          <div className="eventline-content-wrap">
            <div className="eventline-algo-content">
              <SideBarTimeline
                timelineDescript={timelineDescript}
                loadingEvents={loadingEvents}
              />
            </div>

            <>
              <div
                className={
                  styles.pageContent +
                  " pageContentWrap timelineContent eventline-audio-wrapper"
                }
              >
                {/* <Collapse
                  defaultActiveKey={["1"]}
                  expandIconPosition="right"
                  className="topicDetailsCollapse"
                >
                  <Panel disabled header={<h3>Consensus Tree Race</h3>} key="1"> */}
                <TimeLine
                  setTimelineDescript={setTimelineDescript}
                  loadingEvents={loadingEvents}
                  setLoadingEvents={setLoadingEvents}
                />
                {/* </Panel>
                </Collapse> */}
              </div>
            </>
            {/* <aside className={"timelineRightSidebar"}>
              <Events timelineDescript={timelineDescript} />
            </aside> */}
          </div>
        </>
      )}

      <BackTop />
    </>
  );
};

export default EventLine;
