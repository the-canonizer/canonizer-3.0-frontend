import React, { useState } from "react";
import { Tabs, Typography, List } from "antd";
import styles from "./recentActivities.module.scss";

const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
  left: <Title level={3}>Recent Activities</Title>,
};

const mockData = [
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 1,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 2,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 3,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 4,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 5,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 6,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 7,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 8,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 9,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 10,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 11,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 12,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 13,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 14,
  },
  {
    link: "/",
    shortDescription: "More Intelligence Better",
    date: " Jun 23, 2012, 2:25:02 AM",
    id: 15,
  },
];

export default function RecentActivities() {
  const [position] = useState(["left", "right"]);

  const slot = React.useMemo(() => {
    if (position.length === 0) return null;

    return position.reduce(
      (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
      {}
    );
  }, [position]);
  return (
    <>
      <div className={`${styles.listCard} recentActivities_listWrap`}>
        <Tabs
          className={`${styles.listCardTabs} recentActivities_listCardTabs`}
          defaultActiveKey="1"
          tabBarExtraContent={slot}
        >
          <TabPane tab="Topics/Camps" key="1">
            <List
              className={styles.listWrap}
              footer={
                <div className={styles.footer}>
                  <Link href="#" className={styles.viewAll}>
                    <Text>View All Topics</Text>
                    <i className="icon-angle-right"></i>
                  </Link>
                </div>
              }
              bordered={false}
              dataSource={mockData}
              renderItem={(item) => (
                <List.Item className={styles.listItem}>
                   <Link href={item.link}>
          <>
            <Text className={styles.text}>{item.shortDescription}</Text>
            <Text className={styles.secondary} type="secondary">
              <i className="icon-calendar"></i>
              {item.date}
            </Text>
          </>
        </Link>  
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Threads" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}