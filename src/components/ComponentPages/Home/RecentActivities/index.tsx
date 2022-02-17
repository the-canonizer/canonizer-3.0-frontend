import { useEffect, useMemo, useState } from "react";
import { Tabs, Typography, List } from "antd";
import styles from "./recentActivities.module.scss";
import { getRecentActivitiesApi } from "../../../../network/api/homePageApi";

const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
  left: <Title level={3}>Recent Activities</Title>,
};

export default function RecentActivities() {
  const [position] = useState(["left", "right"]);
  const [recentActivities, setRecentActivities] = useState();
  const [selectedTab, setSelectedTab] = useState("topics");
  const slot = useMemo(() => {
    if (position.length === 0) return null;

    return position.reduce(
      (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
      {}
    );
  }, [position]);

  useEffect(() => {
    async function linksApiCall() {
      const reqBody = {
        log_type: selectedTab,
        page_number: 1,
        page_size: 20,
      };
      const result = await getRecentActivitiesApi(reqBody);
      setRecentActivities(result);
    }
    linksApiCall();
  }, [selectedTab]);

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
  };

  return (
    <>
      <div className={`${styles.listCard} recentActivities_listWrap`}>
        <Tabs
          className={`${styles.listCardTabs} recentActivities_listCardTabs`}
          defaultActiveKey="topics"
          tabBarExtraContent={slot}
          onChange={handleTabChange}
        >
          <TabPane tab="Topics/Camps" key="topics">
            <List
              className={styles.listWrap}
              footer={
                recentActivities?.length > 0 && (
                  <div className={styles.footer}>
                    <Link href="#" className={styles.viewAll}>
                      <Text>View All Topics</Text>
                      <i className="icon-angle-right"></i>
                    </Link>
                  </div>
                )
              }
              bordered={false}
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item className={styles.listItem}>
                  <Link href={"/"}>
                    <>
                      <Text className={styles.text}>
                        {activity.description}
                      </Text>
                      <Text className={styles.secondary} type="secondary">
                        <i className="icon-calendar"></i>
                        {activity.updated_at}
                      </Text>
                    </>
                  </Link>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Threads" key="threads">
            <List
              className={styles.listWrap}
              footer={
                recentActivities?.length > 0 && (
                  <div className={styles.footer}>
                    <Link href="#" className={styles.viewAll}>
                      <Text>View All Topics</Text>
                      <i className="icon-angle-right"></i>
                    </Link>
                  </div>
                )
              }
              bordered={false}
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item className={styles.listItem}>
                  <Link href={"/"}>
                    <>
                      <Text className={styles.text}>
                        {activity.description}
                      </Text>
                      <Text className={styles.secondary} type="secondary">
                        <i className="icon-calendar"></i>
                        {activity.updated_at}
                      </Text>
                    </>
                  </Link>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
