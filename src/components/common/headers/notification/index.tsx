import { Fragment } from "react";
import { Dropdown, Badge, Card, Typography, List } from "antd";
import Link from "next/link";

import styles from "../siteHeader.module.scss";
import { BellOutlined } from "@ant-design/icons";

const Notifications = ({}) => {
  const data = [
    {
      title: "Rohit has made the following post to the Camp Agreement forum",
      time: "Today 11:56",
    },
    {
      title:
        "Vikram has just added their support to this camp: Software Development Team",
      time: "Today 11:56",
    },
    {
      title:
        "Sunil has just removed their support from this camp: Software Development Team",
      time: "Today 11:56",
    },
    {
      title:
        "Reena has just added their support to this camp: Scalability Architecture / Server Ar...",
      time: "Today 11:56",
    },
  ];

  const notificationDropdown = (
    <Card
      className={styles.notificationCard}
      title={
        <Typography.Title className={styles.notTitle} level={4}>
          notifications
        </Typography.Title>
      }
      actions={[
        <Link href="#" passHref key="view_all">
          <a>View All</a>
        </Link>,
      ]}
    >
      <List
        itemLayout="horizontal"
        dataSource={data} className={styles.list}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className={styles.avatarBell}>
                  <BellOutlined />
                </div>
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.time}
            />
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <Fragment>
      <Dropdown
        overlay={notificationDropdown}
        trigger={["click"]}
        placement="bottomRight"
        arrow
      >
        <Badge count={5} color="orange" size="small">
          <BellOutlined className={styles.bellIcon} />
        </Badge>
      </Dropdown>
    </Fragment>
  );
};

export default Notifications;
