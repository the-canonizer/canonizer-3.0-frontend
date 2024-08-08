import { useRouter } from "next/router";
import { Fragment } from "react";

import TimelineFilter from "../../../common/timelineFilter";
import Events from "../../eventLine/Events";

export default function SideBarTimeline({
  onCreateCamp = () => {},
  timelineDescript,
  loadingEvents,
}: any) {
  const router = useRouter();

  return (
    <Fragment>
      <TimelineFilter onCreateCamp={onCreateCamp} />
      {typeof window !== "undefined" &&
        router?.asPath.includes("eventline") && (
          <Fragment>
            {
              <Events
                timelineDescript={timelineDescript}
                loadingEvents={loadingEvents}
              />
            }
          </Fragment>
        )}
    </Fragment>
  );
}
