import { useState, Fragment, useEffect } from "react";
import { BellFilled } from "@ant-design/icons";
import { Card, List } from "antd";
import activityStyle from "../Home/CampRecentActivities/campRecentActivities.module.scss";
const Events = ({ timelineDescript }) => {
  const [check, setCheck] = useState(true);
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
                      title={title}
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
