// import { useRouter } from "next/router";
import { BackTop, Typography } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import DataNotFound from "../DataNotFound/dataNotFound";
import SideBarTimeline from "../Home-old/SideBarTimeline";
import TimeLine from "../TimeLine";
// import TimelineInfoBar from "./TimelineInfoBar/index";
import TimelineInfoBar from "../TopicDetails/CampInfoBar";
import Events from "./Events";
const { Title } = Typography;

const EventLine = () => {
  const router = useRouter();
  const [timelineDescript, setTimelineDescript] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isEventLine, setIsEventLine] = useState(true);

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
          {/* <TimelineInfoBar /> */}
          <TimelineInfoBar isEventLine={isEventLine} />
          <div className="eventline-content-wrap">
            <div className="eventline-algo-content">
              <SideBarTimeline
                timelineDescript={timelineDescript}
                loadingEvents={loadingEvents}
              />
            </div>

            <div className="eventline-audio-wrapper">
              <Title level={5} className="uppercase">
                Event line
              </Title>

              <TimeLine
                setTimelineDescript={setTimelineDescript}
                loadingEvents={loadingEvents}
                setLoadingEvents={setLoadingEvents}
              />
            </div>
            <div className="lg:hidden">
              <Events
                timelineDescript={timelineDescript}
                loadingEvents={loadingEvents}
              />
            </div>
          </div>
        </>
      )}

      <BackTop />
    </>
  );
};

export default EventLine;
