import { useRouter } from "next/router";
import { BellFilled } from "@ant-design/icons";

import { Card, List } from "antd";
import styles from "./topicDetails.module.scss";
import activityStyle from "../Home/CampRecentActivities/campRecentActivities.module.scss";
const Events = ({ timelineDescript }) => {
  const router = useRouter();

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
            timelineDescript.map((title) => {
              return (
                <>
                  <List.Item className={activityStyle.activitiesList}>
                    <List.Item.Meta
                      avatar={
                        title && (
                          <BellFilled className={activityStyle.bellIcon} />
                        )
                      }
                      title={title}
                      className={styles.listItem}
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
