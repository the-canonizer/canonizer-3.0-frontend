import { useEffect, useMemo, useState } from "react";
import { Tabs, Typography, List, Button, Spin } from "antd";
import styles from "./recentActivities.module.scss";
import { getRecentActivitiesApi } from "../../../../network/api/homePageApi";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import useAuthentication from "../../../../hooks/isUserAuthenticated";

const antIcon = <LoadingOutlined spin />;
const { TabPane } = Tabs;
const { Title, Link, Text } = Typography;

const OperationsSlot = {
  left: <Title level={3}>Recent Activities</Title>,
};

export default function RecentActivities() {
  const { topicsData, threadsData } = useSelector((state: RootState) => ({
    topicsData: state?.recentActivities?.topicsData,
    threadsData: state?.recentActivities?.threadsData,
  }));

  const isLogin = useAuthentication();
  const [position] = useState(["left", "right"]);
  const [recentActivities, setRecentActivities] = useState(topicsData);
  const [topicPageNumber, setTopicPageNumber] = useState(1);
  const [threadPageNumber, setThreadPageNumber] = useState(1);
  const [selectedTab, setSelectedTab] = useState("topic/camps");
  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const [getTopicsLoadingIndicator, setGetTopicsLoadingIndicator] =
    useState(false);
  const router = useRouter();
  const slot = useMemo(() => {
    if (position.length === 0) return null;
    return position.reduce(
      (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
      {}
    );
  }, [position]);

  useEffect(() => {
    setRecentActivities(topicsData);
  }, [topicsData?.topics]);

  useEffect(() => {
    setRecentActivities(threadsData);
  }, [threadsData?.topics]);

  useEffect(() => {
    async function linksApiCall() {
      setGetTopicsLoadingIndicator(true);
      await getTopicsApiCallWithReqBody(false, selectedTab);
      setGetTopicsLoadingIndicator(false);
    }
    if (isLogin) {
      linksApiCall();
    } else {
      setGetTopicsLoadingIndicator(true);
      router.push("/login");
    }
  }, [selectedTab]);

  const handleTabChange = (key: string) => {
    if (key == "threads") {
      setRecentActivities(threadsData);
      setThreadPageNumber(1);
    } else {
      setRecentActivities(topicsData);
      setTopicPageNumber(1);
    }
    setSelectedTab(key);
  };

  async function getTopicsApiCallWithReqBody(loadMore = false, topicType) {
    let pageNo;
    if (topicType == "topic/camps") {
      if (loadMore) {
        setTopicPageNumber((prev) => prev + 1);
        pageNo = topicPageNumber + 1;
      } else {
        setTopicPageNumber(1);
        pageNo = 1;
      }
    } else {
      if (loadMore) {
        setThreadPageNumber((prev) => prev + 1);
        pageNo = threadPageNumber + 1;
      } else {
        setThreadPageNumber(1);
        pageNo = 1;
      }
    }

    const reqBody = {
      log_type: topicType,
      page: pageNo,
      per_page: 15,
    };
    await getRecentActivitiesApi(reqBody, loadMore, topicType);
    setLoadMoreIndicator(false);
  }

  const ViewAllTopics = (isTopic) => {
    const ViewAllName = isTopic ? "View All Topics" : "View All Threads";
    return (
      recentActivities?.topics?.length > 0 && (
        <div className={styles.footer}>
          <Link href="/activities" className={styles.viewAll}>
            <Text>{ViewAllName}</Text>
            <i className="icon-angle-right"></i>
          </Link>
        </div>
      )
    );
  };

  const LoadMoreTopics = (topicType) => {
    const pageNumber =
      topicType == "topic/camps" ? topicPageNumber : threadPageNumber;
    return (
      recentActivities?.topics?.length > 0 && (
        <div className={styles.footer}>
          {pageNumber < recentActivities?.numOfPages && (
            <div className="text-center">
              <Button
                className={styles.viewAll}
                onClick={() => {
                  setLoadMoreIndicator(true);
                  getTopicsApiCallWithReqBody(true, topicType);
                }}
              >
                <Text>Load More topics !</Text>
                {!loadMoreIndicator && <i className="icon-angle-right"></i>}
                {loadMoreIndicator && <Spin indicator={antIcon} />}
              </Button>
            </div>
          )}
        </div>
      )
    );
  };

  return (
    <>
      <div className={`${styles.listCard} recentActivities_listWrap`}>
        <Spin spinning={getTopicsLoadingIndicator} size="large">
          <Tabs
            className={`${styles.listCardTabs} recentActivities_listCardTabs`}
            defaultActiveKey="topic/camps"
            tabBarExtraContent={slot}
            onChange={handleTabChange}
          >
            <TabPane tab="Topics/Camps" key="topic/camps">
              <List
                className={styles.listWrap}
                footer={
                  router.asPath !== "/activities"
                    ? ViewAllTopics(true)
                    : LoadMoreTopics("topic/camps")
                }
                bordered={false}
                dataSource={recentActivities?.topics}
                renderItem={(activity) => (
                  <List.Item className={styles.listItem}>
                    <Link href={"/"}>
                      <>
                        <Text className={styles.text}>
                          {activity?.activity?.description}
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
                    ? ViewAllTopics(false)
                    : LoadMoreTopics("threads")
                }
                bordered={false}
                dataSource={recentActivities?.topics}
                renderItem={(activity) => (
                  <List.Item className={styles.listItem}>
                    <Link href={"/"}>
                      <>
                        <Text className={styles.text}>
                          {activity?.activity?.description}
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
        </Spin>
      </div>
    </>
  );
}
