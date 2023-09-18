import { useRouter } from "next/router";
import { useState, Fragment, useEffect } from "react";
import { BellFilled } from "@ant-design/icons";
import { Card, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setViewThisVersion } from "src/store/slices/filtersSlice";
import moment from "moment";
import { setFilterCanonizedTopics } from "../../../../store/slices/filtersSlice";
import styles from "./topicDetails.module.scss";
import Link from "next/link";
import { RootState } from "src/store";
import activityStyle from "../../Home/CampRecentActivities/campRecentActivities.module.scss";
const Events = ({ timelineDescript }) => {
  const dispatch = useDispatch();
  const [check, setCheck] = useState(true);
  const router = useRouter();
  const { viewThisVersion, filterObject, filterByScore } = useSelector(
    (state: RootState) => ({
      viewThisVersion: state?.filters?.viewThisVersionCheck,
      filterObject: state?.filters?.filterObject,
      filterByScore: state.filters?.filterObject?.filterByScore,
    })
  );
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  const urlPath = (id) => {
    let path = router?.asPath.replace("eventline", "topic");
    let main = path?.replace(path.split("/")[3], id);
    return main;
  };
  const handleEvents = (goLiveTime, url) => {
    let isTopicPage = url.split("/")[1];
    if (isTopicPage == "topic") {
      dispatch(setViewThisVersion(true));
      dispatch(
        setFilterCanonizedTopics({
          asofdate: goLiveTime,
          asof: "bydate",
        })
      );
    }
  };

  const getQueryParams = () => {
    let isbool = false;
    let params = "?";
    if (filterObject?.filterByScore != 0) {
      params = params + `score=${filterObject?.filterByScore}&`;
      isbool = true;
    }
    if (filterObject?.algorithm != "blind_popularity") {
      params = params + `algo=${filterObject?.algorithm}&`;
      isbool = true;
    }
    if (filterObject?.asof != "default") {
      params = params + `asof=${filterObject?.asof}&`;
      isbool = true;
    }
    if (filterObject?.asof == "bydate") {
      params = params + `asofdate=${filterObject?.asofdate}&`;
      isbool = true;
    }
    if (filterObject?.namespace_id != 1) {
      params = params + `canon=${filterObject?.namespace_id}&`;
      isbool = true;
    }
    if (viewThisVersion) {
      params = params + `viewversion=1&`;
      isbool = true;
    }
    params = params.slice(0, -1);
    return params;
  };

  useEffect(() => {
    setCheck(true);
    setTimeout(() => {
      setCheck(false);
    }, 500);
  }, [timelineDescript]);

  return (
    <>
      <Card
        title="Events"
        className={
          "activities evntLineActivity " + activityStyle.campActivities
        }
      >
        {timelineDescript.length > 0 ? (
          <List itemLayout="horizontal" className="activeListWrap pl-4">
            {timelineDescript &&
              timelineDescript.map((title, key) => {
                return (
                  <Fragment key={key}>
                    <List.Item
                      className={
                        activityStyle.activitiesList +
                        ` ${key == 0 && check ? "animatedText" : ""}`
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          title && (
                            <BellFilled className={activityStyle.bellIcon} />
                          )
                        }
                        className={
                          activityStyle.activitiesList +
                          ` ${key == 0 ? "animatedText" : ""}`
                        }
                        title={
                          <div
                            onClick={() =>
                              handleEvents(title?.eventDate, title?.url)
                            }
                          >
                            <Link
                              href={
                                title?.url?.split("/")[1] == "topic"
                                  ? `${title?.url}${getQueryParams()}`
                                  : title?.url
                              }
                            >
                              {title?.message}
                            </Link>
                          </div>
                        }
                        description={covertToTime(title?.eventDate)}
                        // className={styles.listItem}
                      />
                    </List.Item>
                  </Fragment>
                );
              })}
          </List>
        ) : (
          <h3 className="activeListWrap pl-4">No events found!</h3>
        )}
      </Card>
    </>
  );
};

export default Events;
