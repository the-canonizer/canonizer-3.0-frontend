// import { useRouter } from "next/router";
import { useState, Fragment, useEffect } from "react";
import { BellFilled } from "@ant-design/icons";
import { Card, Empty, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setViewThisVersion } from "src/store/slices/filtersSlice";
import moment from "moment";
import { setFilterCanonizedTopics } from "../../../../store/slices/filtersSlice";
// import styles from "./topicDetails.module.scss";
import Link from "next/link";
import { RootState } from "src/store";
import activityStyle from "../../Home/CampRecentActivities/campRecentActivities.module.scss";
import CustomSkelton from "../../../common/customSkelton";
const Events = ({ timelineDescript, loadingEvents }: any) => {
  const dispatch = useDispatch();
  const [check, setCheck] = useState(true);
  // const router = useRouter();
  const { viewThisVersion, filterObject, filterByScore } = useSelector(
    (state: RootState) => ({
      viewThisVersion: state?.filters?.viewThisVersionCheck,
      filterObject: state?.filters?.filterObject,
      filterByScore: state.filters?.filterObject?.filterByScore,
      loading: state?.loading?.loading,
    })
  );
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  // const urlPath = (id) => {
  //   let path = router?.asPath.replace("eventline", "topic");
  //   let main = path?.replace(path.split("/")[3], id);
  //   return main;
  // };
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
        {loadingEvents || timelineDescript?.length == 0 ? (
          <>
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="topic-skeleton"
              isButton={false}
            />
          </>
        ) : timelineDescript?.length > 0 ? (
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
                                  ? `${
                                      title?.url
                                    }?score=${filterByScore}&algo=${
                                      filterObject?.algorithm
                                    }&asofdate=${
                                      title?.eventDate
                                    }&asof=bydate&canon=${
                                      filterObject?.namespace_id
                                    }${
                                      viewThisVersion ? "&viewversion=1" : ""
                                    }&is_tree_open=1`
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
          // <h3 className="activeListWrap pl-4">No events found!.</h3>
          <Empty description="No Event Found!" />
        )}
      </Card>
    </>
  );
};

export default Events;
