import { Fragment } from "react";
import { Card, Typography, List, Button, Spin } from "antd";
import Link from "next/link";
import { BellFilled, LoadingOutlined } from "@ant-design/icons";

import styles from "./Notifications.module.scss";

import SideBar from "../../CampForum/UI/sidebar";

const { Title, Text } = Typography;

const NotificationsListUI = ({ list, isLoading, page, onViewMoreClick }) => {
  const LoadMoreTopics = (
    <div className="text-center">
      {/* page < list?.numOfPages && */}
      {
        <Button className={styles.viewAll} onClick={onViewMoreClick}>
          <Text>View More</Text>
          {isLoading && <Spin indicator={<LoadingOutlined spin />} />}
        </Button>
      }
    </div>
  );

  return (
    <Fragment>
      <SideBar />
      <div className="pageContentWrap">
        <Card
          title={
            <Title level={3} className={styles.cardTitle}>
              Notifications
            </Title>
          }
          className={styles.notify_card}
          id="card-title"
        >
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
                  title={<Link href="#">{item["title"]}</Link>}
                  description={item["time"]}
                />
              </List.Item>
            )}
            footer={<div className={styles.footer}>{LoadMoreTopics}</div>}
          />
        </Card>
      </div>
    </Fragment>
  );
};

export default NotificationsListUI;
