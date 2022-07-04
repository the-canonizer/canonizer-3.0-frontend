import { List } from "antd";
import Link from "next/link";
import { BellFilled } from "@ant-design/icons";
import moment from "moment";

import styles from "./Notifications.module.scss";

import { getTime } from "../../../../utils/generalUtility";

export default function NotificationList({
  list,
  isFooter = false,
  LoadMoreTopics = null,
}) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={list}
      className={styles.list}
      id="list-items"
      renderItem={(item) => (
        <List.Item id={"list-item-" + item["id"]} key={item["id"]}>
          <List.Item.Meta
            avatar={
              <div className={styles.avatarBell}>
                <BellFilled />
              </div>
            }
            title={
              <Link href="#">
                <a
                  style={{
                    color: item["is_read"] === 1 ? "#566f8f" : "#0f2a4d",
                    fontWeight: item["is_read"] === 1 ? "500" : "600",
                  }}
                >
                  {item["message_body"]}
                </a>
              </Link>
            }
            description={moment(getTime(item["created_at"]))
              .local()
              .startOf("seconds")
              .fromNow()}
          />
        </List.Item>
      )}
      footer={
        isFooter ? <div className={styles.footer}>{LoadMoreTopics}</div> : null
      }
    />
  );
}
