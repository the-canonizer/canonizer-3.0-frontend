import { useEffect, useMemo, useState, Fragment } from "react";
import { Tabs, Typography, Button, Spin } from "antd";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { convert } from "html-to-text";

import { RootState } from "src/store";
import { getRecentActivitiesApi } from "src/network/api/homePageApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import { setIsChecked } from "src/store/slices/recentActivitiesSlice";
import { getTopicActivityLogApi } from "src/network/api/campDetailApi";
import CommonCard from "src/components/shared/Card";
import { useIsMobile } from "src/hooks/useIsMobile";
import RecentActivitiesHeader from "./UI/pageHeader";
import TopicCampsTab from "./UI/topicTab";
import ThreadTab from "./UI/threadTab";
import AllActivitiesSwitch from "./UI/allActivitiesSwitch";

const antIcon = <LoadingOutlined spin />;

const { TabPane } = Tabs;
const { Text } = Typography;

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
  const [getTopicsLoadingIndicator, setGetTopicsLoadingIndicator] =
    useState(false);
  const [isChecked, setIsInternalChecked] = useState(isCheckedRecent);
  const [userData, setUserData] = useState(loggedInUser);
  const [isShowAllLoading, setIsShowAllLoading] = useState(false);
  const [checkLogType, setCheckLogType] = useState("");

  const isActivitiesPage = router.asPath?.includes("/activities");
  const hasCampOrTopicNum = router.query?.camp_num || router.query?.topic_num;
  const defaultActiveKey = router.query?.tabName || "topic/camps";
  const isOnlyCamp =
    (router.query?.topic_num && router.query?.camp_num) ||
    router.query?.topic_num;

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
      if (isOnlyCamp) {
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

    const reqBody: any = {
      page: pageNo,
      per_page: isActivitiesPage ? 25 : 5,
      topic_num: router?.query?.topic_num,
      camp_num: router?.query?.camp_num ?? 1,
    };

    if (!isOnlyCamp) {
      reqBody.is_admin_show_all = "all";
    }

    const res = await getTopicActivityLogApi(reqBody);

    if (res?.status_code == 200) {
      let resData = res?.data;
      resData = resData?.items?.map((i: any) => ({ ...i, activity: i }));
      resData = {
        topics: resData,
        numOfPages: res?.data?.last_page,
      };

      if (loadMore) {
        resData.topics = resData?.topics?.concat(recentActivities?.topics);
      }
      console.log("resData---", resData);

      setRecentActivities(resData);
    }
    setGetTopicsLoadingIndicator(false);
  }

  async function getTopicsApiCallWithReqBody(loadMore = false, topicType) {
    setGetTopicsLoadingIndicator(true);
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
      per_page: isActivitiesPage ? 25 : 5,
      is_admin_show_all: isChecked ? "all" : "",
      camp_num: router?.query?.camp_num,
      topic_num: router?.query?.topic_num,
    };

    await getRecentActivitiesApi(reqBody, loadMore, topicType);
    setGetTopicsLoadingIndicator(false);
    setIsShowAllLoading(false);
    setCheckLogType(reqBody?.log_type);
  }

  const covertToTime = (unixTime) => {
    const uTime = new Date(unixTime * 1000);
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(uTime);
    return formattedTime.replace(",", "").replace(" at", ",");
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
                  setGetTopicsLoadingIndicator(true);
                  if (router?.query?.topic_num && router?.query?.camp_num) {
                    getTopicActivityLogCall(true);
                  } else {
                    getTopicsApiCallWithReqBody(true, topicType);
                  }
                }}
              >
                <Text>Load More</Text>
                {!getTopicsLoadingIndicator && (
                  <i className="icon-angle-right ml-1"></i>
                )}
                {getTopicsLoadingIndicator && <Spin indicator={antIcon} />}
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

  const isMobile = useIsMobile();
  // const isMobile = window.matchMedia("(max-width: 991px)").matches;

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

  console.log("isActivitiesPage---", isActivitiesPage, recentActivities);

  return (
    <Fragment>
      <RecentActivitiesHeader
        isActivitiesPage={isActivitiesPage}
        onBackClick={() => router?.back()}
      />
      <div className={isActivitiesPage ? "mx-auto w-full lg:w-8/12" : "w-full"}>
        <CommonCard
          className={`border-0 h-100 !bg-white [&_.ant-card-body]:p-0 [&_.ant-tabs-tab-active]:!border ${
            isActivitiesPage
              ? "[&_.ant-tabs-tab-active]:!border [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col"
              : "[&_.ant-card-body]:lg:p-[24px] lg:!bg-canGray mt-3"
          }`}
        >
          ssss
          <AllActivitiesSwitch
            userData={userData}
            hasCampOrTopicNum={hasCampOrTopicNum}
            isShowAllLoading={isShowAllLoading}
            isChecked={isChecked}
            onChange={onChange}
            className={isActivitiesPage ? "inline-flex gap-4 ml-auto" : ""}
          />
          {isActivitiesPage ? (
            <Tabs
              tabPosition={!isMobile ? "left" : "top"}
              className={`custom-tabs [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav-wrap]:w-full [&_.ant-tabs-nav-wrap]:justify-center [&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-tab-btn]:text-canBlack [&_.ant-tabs-tab-active]:!text-canBlue  [&_.ant-tabs-tab-btn]:!px-0 [&_.ant-tabs-ink-bar]:!h-[3px] [&_.ant-tabs-tab]:!px-0 [&_.ant-tabs-tab-btn]:text-base  [&_.ant-tabs-tab-btn]:font-semibold [&_.ant-tabs-tab-btn]:!pr-8 lg:[&_.ant-tabs-tab-btn]:!mr-28 [&_.ant-tabs-content-holder]:!border [&_.ant-tabs-content-holder]:!border-canGrey2 [&_.ant-tabs-content-holder]:!rounded-xl [&_.ant-tabs-content-holder]:!py-4 lg:[&_.ant-tabs-content-holder]:!px-8 [&_.ant-tabs-tabpane]:!p-0 [&_.ant-tabs-tab-btn]:!py-2.5 [&_.ant-tabs-ink-bar]:!hidden [&_.ant-list-item]:!border-b [&_.ant-list-item]:!border-canDarkBlack [&_.ant-list-item]:!border-opacity-10 [&_.ant-tabs-content-holder]:!px-4 [&_.ant-tabs-content-holder]:relative ${
                isOnlyCamp ? "[&_.ant-tabs-nav]:hidden" : ""
              }`}
              defaultActiveKey={`${defaultActiveKey}`}
              tabBarExtraContent={slot}
              onChange={handleTabChange}
            >
              {!isOnlyCamp && (
                <TabPane tab="Camps" key="topic/camps">
                  <TopicCampsTab
                    getTopicsLoadingIndicator={getTopicsLoadingIndicator}
                    recentActivities={recentActivities}
                    handleTextOverflow={handleTextOverflow}
                    getTopicCampName={getTopicCampName}
                    covertToTime={covertToTime}
                    bodyCount={15}
                  />
                </TabPane>
              )}
              {
                <TabPane tab="Threads" key="threads">
                  <ThreadTab
                    getTopicsLoadingIndicator={getTopicsLoadingIndicator}
                    recentActivities={recentActivities}
                    decodeUrlLink={decodeUrlLink}
                    handleTextOverflow={handleTextOverflow}
                    covertToTime={covertToTime}
                    bodyCount={15}
                  />
                </TabPane>
              }
            </Tabs>
          ) : (
            <div className="bg-white border p-2 rounded-lg min-h-80">
              <Tabs
                className={`[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav-wrap]:w-full [&_.ant-tabs-nav-wrap]:justify-center [&_.ant-tabs-nav-list]:w-full px-2 [&_.ant-tabs-tab-btn]:!text-canBlue [&_.ant-tabs-tab-btn]:!px-4 [&_.ant-tabs-ink-bar]:!h-[3px] ${
                  router?.query?.camp_num && router?.query?.topic_num
                    ? "hidden"
                    : ""
                }`}
                defaultActiveKey={`${defaultActiveKey}`}
                tabBarExtraContent={slot}
                onChange={handleTabChange}
              >
                <TabPane tab="Camps" key="topic/camps">
                  <TopicCampsTab
                    getTopicsLoadingIndicator={getTopicsLoadingIndicator}
                    recentActivities={recentActivities}
                    handleTextOverflow={handleTextOverflow}
                    getTopicCampName={getTopicCampName}
                    covertToTime={covertToTime}
                  />
                </TabPane>
                <TabPane tab="Threads" key="threads">
                  <ThreadTab
                    getTopicsLoadingIndicator={getTopicsLoadingIndicator}
                    recentActivities={recentActivities}
                    decodeUrlLink={decodeUrlLink}
                    handleTextOverflow={handleTextOverflow}
                    covertToTime={covertToTime}
                  />
                </TabPane>
              </Tabs>
            </div>
          )}
        </CommonCard>
        {isActivitiesPage && (
          <div className="lg:ml-[206px] mt-5">
            {checkLogType === "topic/camps"
              ? LoadMoreTopics("topic/camps")
              : LoadMoreTopics("threads")}
          </div>
        )}
      </div>
    </Fragment>
  );
}
