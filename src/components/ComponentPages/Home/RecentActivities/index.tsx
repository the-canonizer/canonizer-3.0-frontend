import { useEffect, useMemo, useState, Fragment } from "react";
import {
  Tabs,
  Typography,
  List,
  Button,
  Spin,
  Tooltip,
  Switch,
  Popover,
} from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { convert } from "html-to-text";

import styles from "./recentActivities.module.scss";

import { RootState } from "src/store";
import { getRecentActivitiesApi } from "../../../../network/api/homePageApi";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import CustomSkelton from "../../../common/customSkelton";
import { setIsChecked } from "src/store/slices/recentActivitiesSlice";
import { getTopicActivityLogApi } from "src/network/api/campDetailApi";
// import { getProperties } from "src/utils/generalUtility";
import ReasonsActivity from "src/components/common/SupportReasonActivity";

const antIcon = <LoadingOutlined spin />;

const { TabPane } = Tabs;
const { Title, Link: AntLink, Text } = Typography;

const OperationsSlot = {
  left: (
    <Fragment>
      <Title level={3}>Recent Activities</Title>{" "}
    </Fragment>
  ),
};

export default function RecentActivities() {
  const { topicsData, threadsData, loggedInUser, isCheckedRecent } =
    useSelector((state: RootState) => ({
      topicsData: state?.recentActivities?.topicsData,
      threadsData: state?.recentActivities?.threadsData,
      loggedInUser: state.auth.loggedInUser,
      isCheckedRecent: state.recentActivities.isCheckedAllRecent,
    }));

  const { isUserAuthenticated } = useAuthentication();
  const router = useRouter();
  const dispatch = useDispatch();

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
  const [isChecked, setIsInternalChecked] = useState(isCheckedRecent);
  const [userData, setUserData] = useState(loggedInUser);
  const [isShowAllLoading, setIsShowAllLoading] = useState(false);

  const slot = useMemo(() => {
    if (position.length === 0) return null;
    return position.reduce(
      (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
      {}
    );
  }, [position]);

  useEffect(() => setUserData(loggedInUser), [loggedInUser]);

  useEffect(() => setIsInternalChecked(isCheckedRecent), [isCheckedRecent]);

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
      if (router?.query?.topic_num && router?.query?.camp_num) {
        getTopicActivityLogCall();
      } else {
        linksApiCall();
      }
    } else {
      setGetTopicsLoadingIndicator(true);
      router?.push("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, isChecked]);

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

  async function getTopicActivityLogCall(loadMore = false) {
    setGetTopicsLoadingIndicator(true);
    let pageNo;
    if (loadMore) {
      setTopicPageNumber((prev) => prev + 1);
      pageNo = topicPageNumber + 1;
    } else {
      setTopicPageNumber(1);
      pageNo = 1;
    }
    let reqBody = {
      page: pageNo,
      per_page: 15,
      is_admin_show_all: "all",
      topic_num: router?.query?.topic_num,
      camp_num: router?.query?.camp_num ?? 1,
    };
    let res = await getTopicActivityLogApi(reqBody);
    if (res?.status_code == 200) {
      if (loadMore) {
        let resData = res?.data;

        resData = resData?.items?.map((i: any) => ({ ...i, activity: i }));

        resData = {
          topics: resData,
          numOfPages: res?.data?.last_page,
        };

        resData.topics = resData?.topics?.concat(recentActivities?.topics);

        setRecentActivities(resData);
      } else {
        let resData = res?.data;

        resData = resData?.items?.map((i: any) => ({ ...i, activity: i }));
        resData = { topics: resData, numOfPages: res?.data?.last_page };
        setRecentActivities(resData);
      }
    }
    setLoadMoreIndicator(false);
    setGetTopicsLoadingIndicator(false);
  }

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
      is_admin_show_all: isChecked ? "all" : "",
      camp_num: router?.query?.camp_num,
      topic_num: router?.query?.topic_num,
    };
    await getRecentActivitiesApi(reqBody, loadMore, topicType);
    setLoadMoreIndicator(false);
    setIsShowAllLoading(false);
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
                  if (router?.query?.topic_num && router?.query?.camp_num) {
                    getTopicActivityLogCall(true);
                  } else {
                    getTopicsApiCallWithReqBody(true, topicType);
                  }
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

  const onChange = () => {
    setIsShowAllLoading(true);
    dispatch(setIsChecked(!isChecked));
  };

  const handleTextOverflow = (text) => {
    let str = convert(text?.replace(/<img[^>]*>/gi, ""), {
      wordwrap: 130,
    });
    return str?.length > 90 ? str?.substring(0, 90) + "..." : str;
  };

  return (
    <>
      <div className={`${styles.listCard} recentActivities_listWrap`}>
        {userData?.is_admin &&
        !router?.query?.camp_num &&
        !router?.query?.topic_num ? (
          <Title className={styles.switchButton} level={4}>
            <span>Show all user activities</span>
            {isShowAllLoading ? (
              <Spin size="small" />
            ) : (
              <Switch checked={isChecked} size="small" onChange={onChange} />
            )}
          </Title>
        ) : null}

        <Tabs
          className={`${styles.listCardTabs} ${
            userData?.is_admin ? styles.spaceCardTabs : ""
          } recentActivities_listCardTabs ${
            router?.query?.camp_num && router?.query?.topic_num
              ? styles.hideTabs
              : ""
          }`}
          defaultActiveKey={`${
            router?.query?.tabName ? router?.query?.tabName : "topic/camps"
          }`}
          tabBarExtraContent={slot}
          onChange={handleTabChange}
        >
          <TabPane tab="Topics/Camps" key="topic/camps">
            {getTopicsLoadingIndicator ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={22}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              <List
                className={styles.listWrap}
                footer={
                  !router?.asPath?.includes("/activities")
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
                            {activity?.activity?.description}{" "}
                            
                            {activity?.activity?.log_name === "support" && (
                              <Popover
                                content={
                                  <div className={styles.reasonsText}>
                                    <ReasonsActivity
                                      CurrentItem={activity?.activity}
                                    />
                                  </div>
                                }
                                placement="top"
                                className={styles.algoInfoIcon}
                              >
                                <i className="icon-info"></i>
                              </Popover>
                            )}
                            <br />
                            <Tooltip
                              placement={"topLeft"}
                              title={
                                decodedProperties?.topic_name
                                  ? `Topic: ${decodedProperties?.topic_name}` +
                                    (decodedProperties?.camp_name
                                      ? ` | Camp: ${decodedProperties?.camp_name}`
                                      : "")
                                  : handleTextOverflow(
                                      decodedProperties?.description
                                    )
                              }
                            >
                              {decodedProperties?.topic_name
                                ? `Topic: ${decodedProperties?.topic_name}` +
                                  (decodedProperties?.camp_name
                                    ? ` | Camp: ${decodedProperties?.camp_name}`
                                    : "")
                                : convert(
                                    decodedProperties?.description?.replace(
                                      /<img[^>]*>/gi,
                                      ""
                                    ),
                                    {
                                      wordwrap: 130,
                                    }
                                  )}
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
                      {/* <div className={styles.reasonsText}>
                        <ReasonsActivity CurrentItem={activity?.activity} />
                      </div> */}
                    </List.Item>
                  );
                }}
              />
            )}
          </TabPane>
          <TabPane tab="Threads" key="threads">
            {getTopicsLoadingIndicator ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={22}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              <List
                className={styles.listWrap}
                footer={
                  !router?.asPath?.includes("/activities")
                    ? ViewAllTopics(false)
                    : LoadMoreTopics("threads")
                }
                bordered={false}
                dataSource={recentActivities?.topics}
                renderItem={(activity: any) => {
                  const decodedProperties = JSON.parse(
                    activity?.activity?.properties
                  );

                  return (
                    <List.Item className={styles.listItem}>
                      <Link href={decodeUrlLink(activity)} passHref>
                        <a>
                          <Text className={styles.text}>
                            {activity?.activity?.description}
                            <br />
                            <Tooltip
                              placement={"topLeft"}
                              title={
                                // decodedProperties?.topic_name
                                //   ? `Topic: ${decodedProperties?.topic_name}` +
                                //     (decodedProperties?.camp_name
                                //       ? ` | Camp: ${decodedProperties?.camp_name}`
                                //       : "")
                                //   :

                                handleTextOverflow(
                                  decodedProperties?.description
                                )
                              }
                            >
                              {
                                // decodedProperties?.topic_name
                                //   ? `Topic: ${decodedProperties?.topic_name}` +
                                //     (decodedProperties?.camp_name
                                //       ? ` | Camp: ${decodedProperties?.camp_name}`
                                //       : "")
                                //   :
                                convert(
                                  decodedProperties?.description?.replace(
                                    /<img[^>]*>/gi,
                                    ""
                                  ),
                                  {
                                    wordwrap: 130,
                                  }
                                )
                              }
                            </Tooltip>
                          </Text>
                          <Text className={styles.secondary} type="secondary">
                            <i className="icon-calendar"></i>
                            {covertToTime(activity.updated_at)}
                          </Text>
                        </a>
                      </Link>
                    </List.Item>
                  );
                }}
              />
            )}
          </TabPane>
        </Tabs>
        {/* </Spin> */}
      </div>
    </>
  );
}
