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
import activityStyle from "../../Home/CampRecentActivities/campRecentActivities.module.scss";
const Events = ({ timelineDescript }) => {
  const dispatch = useDispatch();
  const [check, setCheck] = useState(true);
  const router = useRouter();
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  const handleEvents = (goLiveTime) => {
    dispatch(setViewThisVersion(true));
    dispatch(
      setFilterCanonizedTopics({
        asofdate: goLiveTime,
        asof: "bydate",
      })
    );
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
        <List itemLayout="horizontal" className="activeListWrap pl-4">
          {timelineDescript &&
            timelineDescript.map((title, key) => {
              return (
                <>
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
                        <div onClick={() => handleEvents(title.eventDate)}>
                          <Link
                            href={{
                              pathname: router.asPath.replace(
                                "eventline",
                                "topic"
                              ),
                            }}
                          >
                            {title?.message}
                          </Link>
                        </div>
                      }
                      description={covertToTime(title?.eventDate)}
                      // className={styles.listItem}
                    />
                  </List.Item>
                </>
              );
            })}
        </List>
      </Card>
    </>
  );
};

export default Events;
