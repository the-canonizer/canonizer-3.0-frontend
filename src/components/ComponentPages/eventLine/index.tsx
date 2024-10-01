// import { useRouter } from "next/router";
import { BackTop, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataNotFound from "../DataNotFound/dataNotFound";
import SideBarTimeline from "../Home-old/SideBarTimeline";
import TimeLine from "../TimeLine";
// import TimelineInfoBar from "./TimelineInfoBar/index";
// import TimelineInfoBar from "../TopicDetails/CampInfoBar";
import Events from "./Events";
import { getCurrentTopicRecordApi } from "src/network/api/campDetailApi";
import moment from "moment";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import CommanBreadcrumbs from "../Breadcrumbs/commanBreadcrumbs";
const { Title } = Typography;

const EventLine = () => {
  const router = useRouter();
  const [timelineDescript, setTimelineDescript] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isEventLine, setIsEventLine] = useState(true);

  const { asof, asofdate, topicRecord } = useSelector((state: RootState) => ({
    asof: state?.filters?.filterObject?.asof,
    asofdate: state.filters?.filterObject?.asofdate,
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));

  // useEffect(() => {
  //   const fetchTopicRecord = async () => {
  //     const isDefaultOrReview = asof === "default" || asof === "review";
  //     const reqBody = {
  //       topic_num: parseInt(router?.query?.camp?.at(0)?.split("-")?.at(0), 10),
  //       camp_num:
  //         parseInt(router?.query?.camp?.at(1)?.split("-")?.at(0), 10) || 1,
  //       as_of: asof,
  //       as_of_date: isDefaultOrReview
  //         ? Math.floor(Date.now() / 1000)
  //         : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
  //     };

  //     await getCurrentTopicRecordApi(reqBody);
  //   };
  //   if (topicRecord == null) {
  //     fetchTopicRecord();
  //   }
  // }, []);

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
          {/* <TimelineInfoBar isEventLine={isEventLine} /> */}
          <CommanBreadcrumbs 
          isEventLine={isEventLine}
        />
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
