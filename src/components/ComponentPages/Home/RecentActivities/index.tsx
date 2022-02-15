import { useEffect, useMemo, useState } from "react";
import { Tabs, Typography, List } from "antd";
import styles from "./recentActivities.module.scss";
import { getRecentActivitiesApi } from "src/network/api/homePageApi";

const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
  left: <Title level={3}>Recent Activities</Title>,
};

export default function RecentActivities() {
  const [position] = useState(["left", "right"]);
  const [recentActivities, setRecentActivities] = useState();
  const slot = useMemo(() => {
    if (position.length === 0) return null;

    return position.reduce(
      (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
      {}
    );
  }, [position]);

  useEffect(() => {
    async function linksApiCall() {
      const result = await getRecentActivitiesApi();
      setRecentActivities(result);
    }
    linksApiCall();
  }, []);
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
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item className={styles.listItem}>
                  <Link href={item.link}>
                    <>
                      <Text className={styles.text}>
                        {item.shortDescription}
                      </Text>
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
