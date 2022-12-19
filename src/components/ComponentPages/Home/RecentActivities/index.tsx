import { useEffect, useMemo, useState } from "react";
import { Tabs, Typography, List, Button, Spin, Tooltip } from "antd";
import styles from "./recentActivities.module.scss";
import { getRecentActivitiesApi } from "../../../../network/api/homePageApi";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import Link from "next/link";

const antIcon = <LoadingOutlined spin />;
const { TabPane } = Tabs;
const { Title, Link: AntLink, Text } = Typography;

const OperationsSlot = {
  left: <Title level={3}>Recent Activities</Title>,
};

export default function RecentActivities() {
  const { topicsData, threadsData } = useSelector((state: RootState) => ({
    topicsData: state?.recentActivities?.topicsData,
    threadsData: state?.recentActivities?.threadsData,
  }));

  const { isUserAuthenticated } = useAuthentication();
  const router = useRouter();
  const [position] = useState(["left", "right"]);
  const [recentActivities, setRecentActivities] = useState(topicsData);
  const [topicPageNumber, setTopicPageNumber] = useState(1);
  const [threadPageNumber, setThreadPageNumber] = useState(1);
  const [selectedTab, setSelectedTab] = useState(
    router?.query?.tabName || "topic/camps"
  );
  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const [getTopicsLoadingIndicator, setGetTopicsLoadingIndicator] =
    useState(false);

  const slot = useMemo(() => {
    if (position.length === 0) return null;
    return position.reduce(
      (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
      {}
    );
  }, [position]);

  useEffect(() => {
    setRecentActivities(topicsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsData?.topics]);

  useEffect(() => {
    setRecentActivities(threadsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadsData?.topics]);

  useEffect(() => {
    async function linksApiCall() {
      setGetTopicsLoadingIndicator(true);
      await getTopicsApiCallWithReqBody(false, selectedTab);
      setGetTopicsLoadingIndicator(false);
    }
    if (isUserAuthenticated) {
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
  const decodeUrlLink = (threadData) => {
    return JSON.parse(threadData?.activity?.properties)?.url?.replace(
      /\s+/g,
      "-"
    );
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

  const covertToTime = (unixTime) => {
    let uTime = new Date(unixTime * 1000);
    var year = uTime.getFullYear();
    var month = uTime.toDateString().split(" ")[1];
    var date = uTime.getDate();
    var time = uTime.toLocaleTimeString();
    var convertedTime = month + " " + date + ", " + year + ", " + time;
    return " " + convertedTime;
  };

  const ViewAllTopics = (isTopic) => {
    const ViewAllName = isTopic ? "View All Topics" : "View All Threads";
    return (
      recentActivities?.topics?.length > 0 && (
        <div className={styles.footer}>
          <Link
            href={{ pathname: "/activities", query: { tabName: selectedTab } }}
            as="/activities"
          >
            <a className={styles.viewAll}>
              <Text>{ViewAllName}</Text>
              <i className="icon-angle-right"></i>
            </a>
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
                <Text>Load More</Text>
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
            defaultActiveKey={`${
              router?.query?.tabName ? router?.query?.tabName : "topic/camps"
            }`}
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
                renderItem={(activity: any) => {
                  const decodedProperties = JSON.parse(
                    activity?.activity?.properties
                  );
                  return (
                    <List.Item className={styles.listItem}>
                      <AntLink
                        href={decodedProperties?.url?.replace(/\s+/g, "-")}
                      >
                        <>
                          <Text className={styles.text}>
                            {activity?.activity?.description}
                            <br />
                            <Tooltip
                              title={
                                decodedProperties?.description?.substring(
                                  0,
                                  90
                                ) + "..."
                              }
                            >
                              {decodedProperties?.description}
                            </Tooltip>
                            {/* {decodedProperties?.description?.length > 100 ? (
                                <Tooltip title={decodedProperties?.description}>
                                  {decodedProperties?.description?.substring(
                                    0,
                                    97
                                  ) + "..."}
                                </Tooltip>
                              ) : (
                                decodedProperties?.description
                              )} */}
                          </Text>
                          <Text className={styles.secondary} type="secondary">
                            <i className="icon-calendar"></i>
                            {covertToTime(activity.updated_at)}
                          </Text>
                        </>
                      </AntLink>
                    </List.Item>
                  );
                }}
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
                renderItem={(activity: any) => (
                  <List.Item className={styles.listItem}>
                    <Link
                      href={{
                        pathname: decodeUrlLink(activity),
                        query: { from: router?.asPath },
                      }}
                      passHref
                    >
                      <a>
                        <Text className={styles.text}>
                          {activity?.activity?.description}
                        </Text>
                        <Text className={styles.secondary} type="secondary">
                          <i className="icon-calendar"></i>
                          {covertToTime(activity.updated_at)}
                        </Text>
                      </a>
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
