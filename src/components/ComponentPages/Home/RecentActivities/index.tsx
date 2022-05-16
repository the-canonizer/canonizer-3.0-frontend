import { useEffect, useMemo, useState } from "react";
import { Tabs, Typography, List } from "antd";
import styles from "./recentActivities.module.scss";
import { getRecentActivitiesApi } from "../../../../network/api/homePageApi";
import { useRouter } from "next/router";

const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
  left: <Title level={3}>Recent Activities</Title>,
};

export default function RecentActivities() {
  const [position] = useState(["left", "right"]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedTab, setSelectedTab] = useState("topics");
  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const router = useRouter();
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
  console.log("position ", position);
  console.log("recent Acticvities ", recentActivities);
  console.log("seletedTab ", selectedTab);
  console.log("slot ", slot);

  const ViewAllTopics = recentActivities?.length > 0 && (
    <div className={styles.footer}>
      <Link href="/activities" className={styles.viewAll}>
        <Text>View All Topics</Text>
        <i className="icon-angle-right"></i>
      </Link>
    </div>
  );

  const LoadMoreTopics = recentActivities?.length > 0 && (
    <div className={styles.footer}>
      <div className="text-center">
        <Link href="/#" className={styles.viewAll}>
          <Text>Load More ! </Text>
          <i className="icon-angle-right"></i>
        </Link>
      </div>
    </div>
  );

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
                router.asPath !== "/activities" ? ViewAllTopics : LoadMoreTopics

                // ? recentActivities?.length > 0 && (
                //     <div className={styles.footer}>
                //       <Link href="/activities" className={styles.viewAll}>
                //         <Text>View All Topics</Text>
                //         <i className="icon-angle-right"></i>
                //       </Link>
                //     </div>
                //   )
                // : recentActivities?.length > 0 && (
                //     <div className={styles.footer}>
                //       <Link href="/activities" className={styles.viewAll}>
                //         <Text>Load More ! </Text>
                //         <i className="icon-angle-right"></i>
                //       </Link>
                //     </div>
                //   )
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
                router.asPath !== "/activities"
                  ? recentActivities?.length > 0 && (
                      <div className={styles.footer}>
                        <Link href="/#" className={styles.viewAll}>
                          <Text>View All Threads</Text>
                          <i className="icon-angle-right"></i>
                        </Link>
                      </div>
                    )
                  : recentActivities?.length > 0 && (
                      <div className={styles.footer}>
                        <div className="text-center">
                          <Link href="/#" className={styles.viewAll}>
                            <Text>Load More ! </Text>
                            <i className="icon-angle-right"></i>
                          </Link>
                        </div>
                      </div>
                    )
                // recentActivities?.length > 0 && (
                //   <div className={styles.footer}>
                //     <Link href="#" className={styles.viewAll}>
                //       <Text>View All Threads</Text>
                //       <i className="icon-angle-right"></i>
                //     </Link>
                //   </div>
                // )
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
