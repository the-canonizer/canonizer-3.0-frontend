import { Badge, List } from "antd";
import Link from "next/link";
import { BellOutlined } from "@ant-design/icons";
import moment from "moment";

import { getTime } from "src/utils/generalUtility";

export default function NotificationList({
  list,
  isFooter = false,
  LoadMoreTopics = null,
}: any) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={list}
      className=""
      id="list-items"
      locale={{
        emptyText:
          "You don’t have any notifications right now. Enable push notifications to stay updated.",
      }}
      renderItem={(item: any) => (
        <List.Item
          id={"list-item-" + item["id"]}
          key={"list-item-" + item["id"]}
          className=""
        >
          <List.Item.Meta
            avatar={
              <Badge
                dot={item["is_seen"] === 0}
                className="bg-[#5482C833] w-[30px] h-[30px] rounded-full grid items-center justify-center"
              >
                <BellOutlined className="text-white text-lg" />
              </Badge>
            }
            title={
              <Link
                href={{
                  pathname:
                    item?.notification_type?.toLowerCase() === "support"
                      ? item?.url?.replace("/support/", "/topic/")
                      : item["url"]
                          ?.replace("#statement", "")
                          ?.replaceAll(" ", "-"),
                  query: {
                    from: "notify_" + item["id"],
                    n_type: item?.notification_type?.toLowerCase(),
                  },
                }}
              >
                <a className="text-sm text-canBlack break-words whitespace-pre-wrap">{item["message_body"]}</a>
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
        isFooter ? <div className="text-center">{LoadMoreTopics}</div> : null
      }
    />
  );
}
