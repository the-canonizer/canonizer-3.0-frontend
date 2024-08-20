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
  Row,
  Col,
} from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { convert } from "html-to-text";

import { RootState } from "src/store";
import { getRecentActivitiesApi } from "src/network/api/homePageApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import CustomSkelton from "src/components/common/customSkelton";
import { setIsChecked } from "src/store/slices/recentActivitiesSlice";
import { getTopicActivityLogApi } from "src/network/api/campDetailApi";
import { getProperties } from "src/utils/generalUtility";
import ReasonsActivity from "src/components/common/SupportReasonActivity";
import CommonCard from "src/components/shared/Card";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import Image from "next/image";

const antIcon = <LoadingOutlined spin />;

const { TabPane } = Tabs;
const { Link: AntLink, Text } = Typography;

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

  const [position] = useState(["left"]);
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
  const [checkLogType, setCheckLogType] = useState("");

  const slot = useMemo(() => {
    if (position.length === 0) return null;
    return position.reduce((acc) => ({ ...acc }), {});
  }, [position]);

  useEffect(() => setUserData(loggedInUser), [loggedInUser]);

  useEffect(() => setIsInternalChecked(isCheckedRecent), [isCheckedRecent]);

  useEffect(() => {
    setRecentActivities(topicsData);
    // eslint-disable-next-line
  }, [topicsData?.topics]);

  useEffect(() => {
    setRecentActivities(threadsData);
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
      per_page: 5,
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
      per_page: 5,
      is_admin_show_all: isChecked ? "all" : "",
      camp_num: router?.query?.camp_num,
      topic_num: router?.query?.topic_num,
    };

    await getRecentActivitiesApi(reqBody, loadMore, topicType);
    setLoadMoreIndicator(false);
    setIsShowAllLoading(false);
    setCheckLogType(reqBody?.log_type);
  }

  const covertToTime = (unixTime) => {
    // let uTime = new Date(unixTime * 1000);
    // var year = uTime.getFullYear();
    // var month = uTime.toDateString().split(" ")[1];
    // var date = uTime.getDate();
    // var time = uTime.toLocaleTimeString();
    // var convertedTime = month + " " + date + ", " + year + ", " + time;
    // return " " + convertedTime;

    let uTime = new Date(unixTime * 1000);
    let formattedTime = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(uTime);
    return formattedTime.replace(",", "").replace(" at", ",");
  };

  // eslint-disable-next-line
  const ViewAllTopics = (_isTopic) => {
    return null;
    // const ViewAllName = isTopic ? "View All Topics" : "View All Threads";
    // return (
    //   recentActivities?.topics?.length > 0 && (
    //     <div className="flex justify-end">
    //       <Link
    //         href={{ pathname: "/activities", query: { tabName: selectedTab } }}
    //         as="/activities"
    //       >
    //         <a className="font-semibold text-canBlue flex items-center">
    //           <Text>{ViewAllName}</Text>
    //           <i className="icon-angle-right ml-1"></i>
    //         </a>
    //       </Link>
    //     </div>
    //   )
    // );
  };

  const LoadMoreTopics = (topicType) => {
    const pageNumber =
      topicType == "topic/camps" ? topicPageNumber : threadPageNumber;
    return (
      recentActivities?.topics?.length > 0 && (
        <div className="flex justify-start">
          {pageNumber < recentActivities?.numOfPages && (
            <div className="text-center">
              <Button
                className="font-medium text-canBlue flex gap-2.5 items-center border-[1px] py-3 rounded-lg border-canBlue bg-[#98B7E61A]  px-3 "
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
                {!loadMoreIndicator && (
                  <i className="icon-angle-right ml-1"></i>
                )}
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
  const isMobile = window.matchMedia("(max-width: 991px)").matches;

  const getTopicCampName = (activity, decodedProperties) => {
    const subjectType = activity?.activity?.subject_type;

    const subjectTypeMap = {
      "App\\Models\\Camp": decodedProperties?.camp_name,
      "App\\Models\\Topic": decodedProperties?.topic_name,
    };

    const result =
      subjectTypeMap[subjectType] ||
      convert(decodedProperties?.description?.replace(/<img[^>]*>/gi, ""), {
        wordwrap: 130,
      });

    return result;
  };

  const isActivitiesPage = router.asPath === "/activities";
  const hasCampOrTopicNum = router.query?.camp_num || router.query?.topic_num;
  const defaultActiveKey = router.query?.tabName || "topic/camps";

  return (
    <>
      {isActivitiesPage ? (
        <Fragment>
          <Row gutter={15}>
            <Col md={24} sm={24} xs={24}>
              <div
                className="flex items-center gap-3.5 lg:!mb-10 mt-5 "
                onClick={() => router?.back()}
              >
                <Image
                  className="cursor-pointer"
                  src="/images/recent-activiity-arrow.svg"
                  width={16}
                  height={24}
                  alt="icon"
                />
                <SectionHeading
                  title={"Recent activities"}
                  infoContent=""
                  icon={null}
                  className={
                    router?.asPath == "/activities" &&
                    "lg:!text-3xl !text-2xl !font-medium capitalize flex items-center !m-0"
                  }
                />
              </div>
            </Col>
          </Row>

          <div className="mt-3">
            <CommonCard className="border-0 h-100  !bg-white [&_.ant-card-body]:p-0  [&_.ant-tabs-tab-active]:!border">
              {userData?.is_admin && !hasCampOrTopicNum && (
                <Typography.Paragraph className="text-sm flex items-center justify-between">
                  <span>Show all user activities</span>
                  {isShowAllLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Switch
                      checked={isChecked}
                      className="text-sm"
                      size="small"
                      onChange={onChange}
                    />
                  )}
                </Typography.Paragraph>
              )}
              <div className="">
                <Tabs
                  tabPosition={!isMobile ? "left" : "top"}
                  className={`custom-tabs [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav-wrap]:w-full [&_.ant-tabs-nav-wrap]:justify-center [&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-tab-btn]:text-canBlack [&_.ant-tabs-tab-active]:!text-canBlue  [&_.ant-tabs-tab-btn]:!px-0 [&_.ant-tabs-ink-bar]:!h-[3px] [&_.ant-tabs-tab]:!px-0 [&_.ant-tabs-tab-btn]:text-base  [&_.ant-tabs-tab-btn]:font-semibold [&_.ant-tabs-tab-btn]:!pr-8 lg:[&_.ant-tabs-tab-btn]:!mr-28 [&_.ant-tabs-content-holder]:!border [&_.ant-tabs-content-holder]:!border-canGrey2 [&_.ant-tabs-content-holder]:!rounded-xl [&_.ant-tabs-content-holder]:!py-4 lg:[&_.ant-tabs-content-holder]:!px-8 [&_.ant-tabs-tabpane]:!p-0 [&_.ant-tabs-tab-btn]:!py-2.5 [&_.ant-tabs-ink-bar]:!hidden [&_.ant-list-item]:!border-b [&_.ant-list-item]:!border-canDarkBlack [&_.ant-list-item]:!border-opacity-10 [&_.ant-tabs-content-holder]:!px-4 [&_.ant-tabs-content-holder]:relative ${
                    router?.query?.camp_num && router?.query?.topic_num
                      ? "hidden"
                      : ""
                  }`}
                  defaultActiveKey={`${
                    router?.query?.tabName
                      ? router?.query?.tabName
                      : "topic/camps"
                  }`}
                  tabBarExtraContent={slot}
                  onChange={handleTabChange}
                >
                  <TabPane tab="Camps" key="topic/camps">
                    {getTopicsLoadingIndicator ? (
                      <CustomSkelton
                        skeltonFor="list"
                        bodyCount={22}
                        stylingClass="listSkeleton"
                        isButton={false}
                      />
                    ) : (
                      <List
                        className="rounded-lg  relative"
                        bordered={false}
                        locale={{
                          emptyText:
                            "You don't have any recent activity right now.",
                        }}
                        dataSource={recentActivities?.topics}
                        renderItem={(activity: any) => {
                          const decodedProperties = JSON.parse(
                            activity?.activity?.properties
                          );
                          return (
                            <List.Item className=" font-medium w-full  first:!pt-0 py-8 last:!pb-0 last:!border-none  ">
                              <AntLink
                                href={decodedProperties?.url?.replace(
                                  /\s+/g,
                                  "-"
                                )}
                                className="w-full !text-canBlue hover:!text-canHoverBlue"
                              >
                                <Fragment>
                                  <Text className="text-canBlack text-xs font-normal mb-0 py-10">
                                    {activity?.activity?.description}{" "}
                                    {activity?.activity?.log_name ===
                                      "support" &&
                                      getProperties(activity?.activity)
                                        ?.reason && (
                                        <Popover
                                          content={
                                            <div className="w-full">
                                              <ReasonsActivity
                                                CurrentItem={activity?.activity}
                                              />
                                            </div>
                                          }
                                          placement="top"
                                          className="pointer text-canGrey2"
                                        >
                                          <i className="icon-info"></i>
                                        </Popover>
                                      )}
                                    <Text className="text-canBlue font-medium text-xs capitalize">
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
                                        {getTopicCampName(
                                          activity,
                                          decodedProperties
                                        )}
                                      </Tooltip>
                                    </Text>
                                  </Text>
                                  <Text
                                    className="!text-canBlack !text-opacity-50 font-normal font-inter !text-[10px] block mt-2.5"
                                    type="secondary"
                                  >
                                    {covertToTime(activity.updated_at)}
                                  </Text>
                                </Fragment>
                              </AntLink>
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
                        className="rounded-lg"
                        // footer={
                        //   !router?.asPath?.includes("/activities")
                        //     ? ViewAllTopics(false)
                        //     : LoadMoreTopics("threads")
                        // }
                        bordered={false}
                        locale={{
                          emptyText:
                            "You don't have any recent activity right now.",
                        }}
                        dataSource={recentActivities?.topics}
                        renderItem={(activity: any) => {
                          const decodedProperties = JSON.parse(
                            activity?.activity?.properties
                          );

                          return (
                            <List.Item className="!text-base font-medium w-full  first:!pt-0 py-5 last:!pb-0 last:!border-none ">
                              <Link href={decodeUrlLink(activity)} passHref>
                                <a className="w-full !text-canBlue hover:!text-canHoverBlue">
                                  <Text className="text-canBlack text-base font-normal mb-0 block w-full">
                                    {activity?.activity?.description}{" "}
                                    <Text className="text-canBlue font-medium text-base capitalize">
                                      <Tooltip
                                        placement={"topLeft"}
                                        title={handleTextOverflow(
                                          decodedProperties?.description
                                        )}
                                      >
                                        {handleTextOverflow(
                                          convert(
                                            decodedProperties?.description?.replace(
                                              /<img[^>]*>/gi,
                                              ""
                                            ),
                                            {
                                              wordwrap: 130,
                                            }
                                          )
                                        )}
                                      </Tooltip>
                                    </Text>
                                  </Text>
                                  <Text
                                    className="!text-canBlack !text-opacity-50 font-normal font-inter text-xs block mt-2.5"
                                    type="secondary"
                                  >
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
              </div>
            </CommonCard>
            <div className="lg:ml-[206px] mt-5">
              {!isActivitiesPage && checkLogType === "topic/camps"
                ? ViewAllTopics(true)
                : !isActivitiesPage && checkLogType === "threads"
                ? ViewAllTopics(false)
                : checkLogType === "topic/camps"
                ? LoadMoreTopics("topic/camps")
                : LoadMoreTopics("threads")}
            </div>
            {/* <div className="lg:ml-[206px] mt-5 ">
              {!router?.asPath?.includes("/activities") &&
              checkLogType == "topic/camps"
                ? ViewAllTopics(true)
                : !router?.asPath?.includes("/activities") &&
                  checkLogType == "threads"
                ? ViewAllTopics(false)
                : checkLogType == "topic/camps"
                ? LoadMoreTopics("topic/camps")
                : LoadMoreTopics("threads")}
            </div> */}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <Row gutter={15}>
            <Col md={12} sm={12} xs={12}>
              <SectionHeading
                title="Recent activities"
                infoContent=""
                icon={null}
              />
            </Col>
            <Col md={12} sm={12} xs={12} className="text-right">
              <SeeMoreLInk href="/activities" />
            </Col>
          </Row>
          <div className="mt-3">
            <CommonCard className="border-0 h-100 hocus:!bg-canGray !bg-white [&_.ant-card-body]:p-0 [&_.ant-card-body]:lg:p-[24px] lg:!bg-canGray">
              {userData?.is_admin && !hasCampOrTopicNum && (
                <Typography.Paragraph className="text-sm flex items-center justify-between">
                  <span>Show all user activities</span>
                  {isShowAllLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Switch
                      checked={isChecked}
                      className="text-sm"
                      size="small"
                      onChange={onChange}
                    />
                  )}
                </Typography.Paragraph>
              )}
              {/* {userData?.is_admin &&
              !router?.query?.camp_num &&
              !router?.query?.topic_num ? (
                <Typography.Paragraph className="text-sm flex items-center justify-between">
                  <span>Show all user activities</span>
                  {isShowAllLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Switch
                      checked={isChecked}
                      className="text-sm"
                      size="small"
                      onChange={onChange}
                    />
                  )}
                </Typography.Paragraph>
              ) : null} */}
              <div className="bg-white border p-2 rounded-lg">
                {/* {renderTabs()} */}
                <Tabs
                  className={`[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav-wrap]:w-full [&_.ant-tabs-nav-wrap]:justify-center [&_.ant-tabs-nav-list]:w-full px-2 [&_.ant-tabs-tab-btn]:!text-canBlue [&_.ant-tabs-tab-btn]:!px-4 [&_.ant-tabs-ink-bar]:!h-[3px] ${
                    router?.query?.camp_num && router?.query?.topic_num
                      ? "hidden"
                      : ""
                  }`}
                  defaultActiveKey={`${
                    router?.query?.tabName
                      ? router?.query?.tabName
                      : "topic/camps"
                  }`}
                  tabBarExtraContent={slot}
                  onChange={handleTabChange}
                >
                  <TabPane tab="Camps" key="topic/camps">
                    {getTopicsLoadingIndicator ? (
                      <CustomSkelton
                        skeltonFor="list"
                        bodyCount={22}
                        stylingClass="listSkeleton"
                        isButton={false}
                      />
                    ) : (
                      <List
                        className="rounded-lg"
                        // footer={
                        //   !router?.asPath?.includes("/activities")
                        //     ? ViewAllTopics(true)
                        //     : LoadMoreTopics("topic/camps")
                        // }
                        bordered={false}
                        locale={{
                          emptyText:
                            "You don't have any recent activity right now.",
                        }}
                        dataSource={recentActivities?.topics}
                        renderItem={(activity: any) => {
                          const decodedProperties = JSON.parse(
                            activity?.activity?.properties
                          );

                          return (
                            <List.Item className="font-inter text-sm font-medium bg-white w-full px-2">
                              <AntLink
                                href={decodedProperties?.url?.replace(
                                  /\s+/g,
                                  "-"
                                )}
                                className="w-full !text-canBlue hover:!text-canHoverBlue"
                              >
                                <Fragment>
                                  <Text className="text-canBlack text-sm font-normal mb-0">
                                    {activity?.activity?.description}{" "}
                                    {activity?.activity?.log_name ===
                                      "support" &&
                                      getProperties(activity?.activity)
                                        ?.reason && (
                                        <Popover
                                          content={
                                            <div className="w-full">
                                              <ReasonsActivity
                                                CurrentItem={activity?.activity}
                                              />
                                            </div>
                                          }
                                          placement="top"
                                          className="pointer text-canGrey2"
                                        >
                                          <i className="icon-info"></i>
                                        </Popover>
                                      )}
                                    <Text className="text-canBlue font-medium">
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
                                        {getTopicCampName(
                                          activity,
                                          decodedProperties
                                        )}
                                      </Tooltip>
                                    </Text>
                                  </Text>
                                  <Text
                                    className="text-canBlack opacity-[0.5] font-normal font-inter text-[10px] block mt-1"
                                    type="secondary"
                                  >
                                    {covertToTime(activity.updated_at)}
                                  </Text>
                                </Fragment>
                              </AntLink>
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
                        className="rounded-lg"
                        // footer={
                        //   !router?.asPath?.includes("/activities")
                        //     ? ViewAllTopics(false)
                        //     : LoadMoreTopics("threads")
                        // }
                        bordered={false}
                        locale={{
                          emptyText:
                            "You don't have any recent activity right now.",
                        }}
                        dataSource={recentActivities?.topics}
                        renderItem={(activity: any) => {
                          const decodedProperties = JSON.parse(
                            activity?.activity?.properties
                          );

                          return (
                            <List.Item className="font-inter text-sm font-medium bg-white w-full px-2">
                              <Link href={decodeUrlLink(activity)} passHref>
                                <a className="w-full !text-canBlue hover:!text-canHoverBlue">
                                  <Text className="text-canBlack text-sm font-normal mb-0 block w-full">
                                    {activity?.activity?.description}{" "}
                                    <Text className="text-canBlue font-medium">
                                      <Tooltip
                                        placement={"topLeft"}
                                        title={handleTextOverflow(
                                          decodedProperties?.description
                                        )}
                                      >
                                        {handleTextOverflow(
                                          convert(
                                            decodedProperties?.description?.replace(
                                              /<img[^>]*>/gi,
                                              ""
                                            ),
                                            {
                                              wordwrap: 130,
                                            }
                                          )
                                        )}
                                      </Tooltip>
                                    </Text>
                                  </Text>
                                  <Text
                                    className="text-canBlack opacity-[0.5] font-normal font-inter text-[10px] block mt-1"
                                    type="secondary"
                                  >
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
              </div>
            </CommonCard>
            {!isActivitiesPage && checkLogType === "topic/camps"
              ? ViewAllTopics(true)
              : !isActivitiesPage && checkLogType === "threads"
              ? ViewAllTopics(false)
              : checkLogType === "topic/camps"
              ? LoadMoreTopics("topic/camps")
              : LoadMoreTopics("threads")}
            {/* {!router?.asPath?.includes("/activities") &&
            checkLogType == "topic/camps"
              ? ViewAllTopics(true)
              : !router?.asPath?.includes("/activities") &&
                checkLogType == "threads"
              ? ViewAllTopics(false)
              : checkLogType == "topic/camps"
              ? LoadMoreTopics("topic/camps")
              : LoadMoreTopics("threads")} */}
          </div>
        </Fragment>
      )}
    </>
  );
}
