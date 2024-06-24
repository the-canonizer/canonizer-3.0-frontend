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
import Headings from "components/shared/Typography";
import CommonCard from "src/components/shared/Card";

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

  const slot = useMemo(() => {
    if (position.length === 0) return null;
    return position.reduce((acc) => ({ ...acc }), {});
  }, [position]);

  useEffect(() => setUserData(loggedInUser), [loggedInUser]);

  useEffect(() => setIsInternalChecked(isCheckedRecent), [isCheckedRecent]);

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
        <div className="flex justify-end">
          <Link
            href={{ pathname: "/activities", query: { tabName: selectedTab } }}
            as="/activities"
          >
            <a className="font-semibold text-blue flex items-center">
              <Text>{ViewAllName}</Text>
              <i className="icon-angle-right ml-1"></i>
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
        <div className="flex justify-end">
          {pageNumber < recentActivities?.numOfPages && (
            <div className="text-center">
              <Button
                className="font-semibold text-blue flex items-center"
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

  return (
    <Fragment>
      <Row gutter={15} className="mt-5">
        <Col md={12} sm={12} xs={12} className="mb-3">
          <Headings level={5} className="mb-0 text-14 font-bold uppercase">
            Recent activities
          </Headings>
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <Link href="/activities">
            <a className="text-blue hover:text-hblue text-14 font-inter font-medium">
              See More
            </a>
          </Link>
        </Col>
      </Row>
      <div className="">
        <CommonCard className="border-0 h-100 hover:*:bg-gr focus:*:bg-gr">
          {userData?.is_admin &&
          !router?.query?.camp_num &&
          !router?.query?.topic_num ? (
            <Typography.Paragraph className="text-14 flex items-center justify-between">
              <span>Show all user activities</span>
              {isShowAllLoading ? (
                <Spin size="small" />
              ) : (
                <Switch
                  checked={isChecked}
                  className="text-14"
                  size="small"
                  onChange={onChange}
                />
              )}
            </Typography.Paragraph>
          ) : null}
          <div className="bg-white border p-2 rounded-lg">
            <Tabs
              className={`[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav-wrap]:w-full [&_.ant-tabs-nav-wrap]:justify-center [&_.ant-tabs-nav-list]:justify-evenly [&_.ant-tabs-nav-list]:w-full px-2 ${
                router?.query?.camp_num && router?.query?.topic_num
                  ? "hidden"
                  : ""
              }`}
              defaultActiveKey={`${
                router?.query?.tabName ? router?.query?.tabName : "topic/camps"
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
                    footer={
                      !router?.asPath?.includes("/activities")
                        ? ViewAllTopics(true)
                        : LoadMoreTopics("topic/camps")
                    }
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
                        <List.Item className="font-inter text-14 font-medium bg-white w-full px-2">
                          <AntLink
                            href={decodedProperties?.url?.replace(/\s+/g, "-")}
                            className="w-full"
                          >
                            <Fragment>
                              <Text className="text-black text-14 font-normal mb-0">
                                {activity?.activity?.description}{" "}
                                {activity?.activity?.log_name === "support" &&
                                  getProperties(activity?.activity)?.reason && (
                                    <Popover
                                      content={
                                        <div className="w-full">
                                          <ReasonsActivity
                                            CurrentItem={activity?.activity}
                                          />
                                        </div>
                                      }
                                      placement="top"
                                      className="pointer text-greyBr"
                                    >
                                      <i className="icon-info"></i>
                                    </Popover>
                                  )}
                                <br />
                                <Text className="text-blue font-medium">
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
                                </Text>
                              </Text>
                              <Text
                                className="text-balack opacity-[0.5] font-normal font-inter text-[12px] block mt-1"
                                type="secondary"
                              >
                                <i className="icon-calendar mr-1"></i>
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
                    footer={
                      !router?.asPath?.includes("/activities")
                        ? ViewAllTopics(false)
                        : LoadMoreTopics("threads")
                    }
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
                        <List.Item className="font-inter text-14 font-medium bg-white w-full px-2">
                          <Link href={decodeUrlLink(activity)} passHref>
                            <a className="hover:*:hblue w-full">
                              <Text className="text-black text-14 font-normal mb-0 block w-full">
                                {activity?.activity?.description}{" "}
                                <Text className="text-blue font-medium">
                                  <Tooltip
                                    placement={"topLeft"}
                                    title={handleTextOverflow(
                                      decodedProperties?.description
                                    )}
                                  >
                                    {convert(
                                      decodedProperties?.description?.replace(
                                        /<img[^>]*>/gi,
                                        ""
                                      ),
                                      {
                                        wordwrap: 130,
                                      }
                                    )}
                                  </Tooltip>
                                </Text>
                              </Text>
                              <Text
                                className="text-balack opacity-[0.5] font-normal font-inter text-[12px] block mt-1"
                                type="secondary"
                              >
                                <i className="icon-calendar mr-1"></i>
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
      </div>
    </Fragment>
  );
}
