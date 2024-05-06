import { useState, useEffect, useRef, Fragment } from "react";
import { Button, Popover, Spin, Tooltip, Typography, Dropdown, Menu } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { DoubleRightOutlined, DoubleLeftOutlined, HeartOutlined, FileTextOutlined, MoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";

import styles from "../topicDetails.module.scss";

import { RootState } from "src/store";
import CustomSkelton from "src/components/common/customSkelton";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import { getCampBreadCrumbApi, getTreesApi, subscribeToCampApi } from "src/network/api/campDetailApi";
import { getCookies, replaceSpecialCharacters } from "src/utils/generalUtility";
import SocialShareUI from "../../../common/socialShare";
import {
  isServer,
} from "../../../../utils/generalUtility";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import K from "src/constants";
import GenerateModal from "src/components/common/generateScript";

const CodeIcon = () => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#000000"
  >
    <rect x="8" y="12" width="48" height="40" />
    <polyline points="40 40 48 32 40 24" />
    <polyline points="24 24 16 32 24 40" />
    <line x1="34" y1="22" x2="30" y2="42" />
  </svg>
);


const TimelineInfoBar = ({
  payload = null,
  isTopicPage = false,
  isTopicHistoryPage = false,
  isForumPage = false,
  getCheckSupportStatus = null,
}: any) => {
  const { isUserAuthenticated } = useAuthentication();
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [payloadData, setPayloadData] = useState(payload);
  const [breadCrumbRes, setBreadCrumbRes] = useState({
    topic_name: "",
    bread_crumb: [],
  });
  const didMount = useRef(false);
  const router = useRouter();

  const {
    topicRecord,
    campRecord,
    is_admin,
    asofdate,
    asof,
    viewThisVersion,
    filterObject,
    campScoreValue,
    changeGoneLive,
    algorithm,
  } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    is_admin: state?.auth?.loggedInUser?.is_admin,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state?.filters?.filterObject?.asof,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    filterObject: state?.filters?.filterObject,
    campScoreValue: state?.filters?.campWithScoreValue,
    changeGoneLive: state?.topicDetails?.changeGoneLive,
    algorithm: state.filters?.filterObject?.algorithm,
  }));

  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );

  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );

  const handleClickSupportCheck = () => {
    dispatch(setManageSupportStatusCheck(true));
  };

  useEffect(() => {
    if (isTopicPage) {
      if (didMount.current) {
        setCampSubscriptionID(campRecord?.subscriptionId);
        setTopicSubscriptionID(topicRecord?.topicSubscriptionId);
      } else didMount.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campRecord?.subscriptionId, topicRecord?.topicSubscriptionId]);

  useEffect(() => {
    if (isTopicPage) {
      dispatch(setManageSupportStatusCheck(false));
      breadCrumbRes;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCampForumClick = () => {
    const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    const campName = campRecord?.camp_name?.replaceAll(" ", "-");
    router?.push({
      pathname: `/forum/${topicRecord?.topic_num}-${replaceSpecialCharacters(
        topicName,
        "-"
      )}/${campRecord?.camp_num}-${replaceSpecialCharacters(
        campName,
        "-"
      )}/threads`,
    });
  };

  const eventLinePath = () => {
    router?.push(router?.asPath.replace("topic", "eventline"));
  };
  const eventLinePath2 = () => {
    router.push(router.asPath.replace("support", "eventline"));
  };

  const objectToQueryString = (obj) => {
    const keys = Object.keys(obj);
    const keyValuePairs = keys.map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    });
    return keyValuePairs.join("&");
  };

  const getQueryParams = () => {
    const filterByScore = filterObject?.filterByScore,
      algorithm = filterObject?.algorithm,
      asof = filterObject?.asof,
      asofdate = filterObject?.asofdate,
      namespace_id = filterObject?.namespace_id,
      viewversion = viewThisVersion;

    let returnQuery = "",
      query: any = {
        score: filterByScore,
        algo: algorithm,
        canon: namespace_id,
        asof: asof,
        filter: campScoreValue || "10",
      };

    if (asof === "bydate") {
      query.asofdate = asofdate;
    }

    if (viewversion) {
      query.viewversion = "1";
    }

    if (asof !== "bydate") {
      delete query.asofdate;
    }

    if (String(filterByScore) === "0") {
      delete query.score;
    }

    if (String(namespace_id) === "1") {
      delete query.canon;
    }

    if (query.canon === "") {
      delete query.canon;
    }

    if (asof === "default") {
      delete query.asof;
    }

    if (algorithm === "blind_popularity") {
      delete query.algo;
    }

    if (String(campScoreValue) === "10") {
      delete query.filter;
    }

    if (
      query?.filter === "undefined" ||
      query?.filter === undefined ||
      query?.filter === "null" ||
      query?.filter === null
    ) {
      delete query.filter;
    }

    if (
      router?.query?.is_tree_open == "0" ||
      router?.query?.is_tree_open == "1"
    ) {
      query.is_tree_open = router?.query?.is_tree_open;
    }
    returnQuery = objectToQueryString(query);
    return { returnQuery, query };
  };

  useEffect(() => {
    setPayloadData(payload);

    async function getBreadCrumbApiCall() {
      setLoadingIndicator(true);
      let reqBody = {
        topic_num: payload?.topic_num,
        camp_num: payload?.camp_num,
        as_of: router?.pathname == "/topic/[...camp]" ? asof : "default",
        as_of_date:
          asof == "default" || asof == "review"
            ? Date.now() / 1000
            : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
      };

      let res = await getCampBreadCrumbApi(reqBody);
      if (res?.status_code == 200 && router?.pathname == "/topic/[...camp]") {
        let breadTopicId = res?.data?.bread_crumb?.at(
          res?.data?.bread_crumb?.length - 1
        )?.topic_num;
        let breadCampId = res?.data?.bread_crumb?.at(
          res?.data?.bread_crumb?.length - 1
        )?.camp_num;
        let breadCampName = res?.data?.bread_crumb?.at(
          res?.data?.bread_crumb?.length - 1
        )?.camp_name;
        let breadTopicName = res?.data?.topic_name;

        let query = getQueryParams()?.query;
        query.camp = [
          `${breadTopicId}-${replaceSpecialCharacters(breadTopicName, "-")}`,

          breadCampId
            ? `${breadCampId}-${replaceSpecialCharacters(breadCampName, "-")}`
            : "1-Agreement",
        ];
        // router.query = { ...router?.query, ...query };
        // router.replace(router, null, { shallow: true });
      }
      setBreadCrumbRes(res?.data);
      setLoadingIndicator(false);
    }

    if (
      (payload && Object.keys(payload).length > 0,
        !!(getCookies() as any)?.loginToken)
    ) {
      getBreadCrumbApiCall();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    router?.asPath || filterObject,
    !!(getCookies() as any)?.loginToken,
    changeGoneLive,
  ]);

  const campOrTopicScribe = async (isTopic: Boolean) => {
    const reqBodyForService = {
      topic_num: +router?.query?.camp?.[0]?.split("-")[0],
      camp_num: +(router?.query?.camp?.[1]?.split("-")[0] ?? 1),
      asOf: asof,
      asofdate:
        asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
    };
    const reqBody = {
      topic_num: campRecord.topic_num ?? payload?.topic_num,
      camp_num: isTopic ? 0 : campRecord.camp_num,
      checked: isTopic ? !topicSubscriptionID : !campSubscriptionID,
      subscription_id: isTopic ? topicSubscriptionID : campSubscriptionID,
    };
    let result = await subscribeToCampApi(reqBody, isTopic);
    if (result?.status_code === 200) {
      getTreesApi(reqBodyForService);
    }
  };

  return (
    <>
      <div
        className={
          styles.topicDetailContentHead + " printHIde " + styles.info_bar_n
        }
      >
        <Spin spinning={false}>
          <div className={styles.topicDetailContentHead_Left}>
            {isForumPage ? (
              <Popover
                content="Back to camp forum page"
                key="back_button"
                placement="topLeft"
              >
                <Button
                  onClick={() => {
                    router.push({
                      pathname:
                        "/forum/" +
                        router?.query?.topic +
                        "/" +
                        router?.query?.camp +
                        "/threads",
                    });
                  }}
                  className={styles.backButton}
                >
                  <DoubleLeftOutlined />
                  {/* Back */}
                </Button>
              </Popover>
            ) : (
              ""
            )}
            <Typography.Paragraph
              className={
                "mb-0 " +
                `${loadingIndicator
                  ? styles.topicTitleSkeleton
                  : styles.topicTitleStyle
                }`
              }
            >
              <span className="normal">Topic : </span>
              {loadingIndicator ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="topic-skeleton"
                  isButton={false}
                />
              ) : isTopicHistoryPage ? (
                <Link
                  href={`/topic/${payload?.topic_num
                    }-${replaceSpecialCharacters(
                      breadCrumbRes?.topic_name,
                      "-"
                    )}/1-Agreement?${getQueryParams()?.returnQuery}`}
                >
                  <a className={styles.boldBreadcrumb}>
                    {breadCrumbRes?.topic_name}
                  </a>
                </Link>
              ) : breadCrumbRes ? (
                <span className={styles.boldBreadcrumb}>
                  {breadCrumbRes?.topic_name}
                </span>
              ) : (
                "N/A"
              )}
              {breadCrumbRes && !!topicSubscriptionID && (
                <Tooltip
                  title="You have subscribed to the entire topic."
                  key="camp_subscribed_icon"
                >
                  <small style={{ alignSelf: "center", marginLeft: "10px" }}>
                    <i className="icon-subscribe text-primary"></i>
                  </small>
                </Tooltip>
              )}
            </Typography.Paragraph>
            <div className={styles.breadcrumbLinks}>
              <Typography.Paragraph
                className={"mb-0 " + styles.topicTitleStyle}
              >
                <span className="normal">
                  {!isTopicHistoryPage ? "Camp :" : ""}
                </span>
                {loadingIndicator ? (
                  <CustomSkelton
                    skeltonFor="list"
                    bodyCount={1}
                    stylingClass="topic-skeleton"
                    isButton={false}
                  />
                ) : !isTopicHistoryPage ? (
                  breadCrumbRes ? (
                    breadCrumbRes?.bread_crumb?.map((camp, index) => {
                      return (
                        <Link
                          href={`/topic/${payloadData?.topic_num
                            }-${replaceSpecialCharacters(
                              breadCrumbRes?.topic_name,
                              "-"
                            )}/${camp?.camp_num}-${replaceSpecialCharacters(
                              camp?.camp_name,
                              "-"
                            )}?${getQueryParams()?.returnQuery}`}
                          key={index}
                        >
                          <a>
                            <span className={styles.slashStyle}>
                              {index !== 0 && <DoubleRightOutlined />}
                            </span>
                            <span
                              className={
                                breadCrumbRes?.bread_crumb.length - 1 == index
                                  ? styles.greenIndicateText
                                  : styles.boldBreadcrumb
                              }
                            >{`${camp?.camp_name}`}</span>
                          </a>
                        </Link>
                      );
                    })
                  ) : (
                    "N/A"
                  )
                ) : null}
                {breadCrumbRes &&
                  !!campSubscriptionID &&
                  !isTopicHistoryPage && (
                    <Tooltip
                      title="You have subscribed to this camp."
                      key="camp_subscribed_icon"
                    >
                      <small
                        style={{ alignSelf: "center", marginLeft: "10px" }}
                      >
                        <i className="icon-subscribe text-primary"></i>
                      </small>
                    </Tooltip>
                  )}
              </Typography.Paragraph>
            </div>
          </div>

          {/* <div className={styles.topicDetailContentHead_Right}>
            <Typography.Paragraph
              className={"mb-0 campInfoRight " + styles.topicTitleStyle}
            >
              {isTopicPage && (
                <Fragment>
                  {loadingIndicator ? (
                    <CustomSkelton
                      skeltonFor="list"
                      bodyCount={1}
                      stylingClass="header-skeleton-btn"
                      // stylingClass="skeleton-item"
                      isButton={false}
                    />
                  ) : (
                    <>
                      {
                        router.pathname != "/support/[...manageSupport]" ?
                          <Button
                            type="primary"
                            onClick={eventLinePath}
                            className={styles.btnCampForum}
                            id="camp-forum-btn"
                          >
                            Event Line
                          </Button> : null
                      }
                    </>
                  )}
                </Fragment>
              )}
            </Typography.Paragraph>
          </div> */}
        </Spin>
      </div>
    </>
  );
};

export default TimelineInfoBar;
