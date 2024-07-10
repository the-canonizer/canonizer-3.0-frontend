import { useState, useEffect, useRef, Fragment } from "react";
import {
  Button,
  Popover,
  Spin,
  Tooltip,
  Typography,
  Dropdown,
  Menu,
  Row,
  Col,
} from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  HeartOutlined,
  FileTextOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";

import styles from "../topicDetails.module.scss";

import { RootState } from "src/store";
import CustomSkelton from "src/components/common/customSkelton";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import {
  getCampBreadCrumbApi,
  getTreesApi,
  subscribeToCampApi,
} from "src/network/api/campDetailApi";
import {
  changeSlashToArrow,
  getCookies,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import SocialShareUI from "../../../common/socialShare";
import { isServer } from "../../../../utils/generalUtility";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import K from "src/constants";
import GenerateModal from "src/components/common/generateScript";
import CustomButton from "../../../common/button";

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
    campStatement,
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
    campStatement: state?.topicDetails?.campStatement,
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

  const isMobile = window.matchMedia("(min-width: 1024.98px)").matches;
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

  // const eventLinePath = () => {
  //   router?.push(router?.asPath.replace("topic", "eventline"));
  // };
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

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  const title = (
    <div className="popover_header">
      <span className="text-xs text-[#8992A6] mb-[5px] font-normal">Topic name :</span>
      <p className="font-bold mb-[20px] text-base text-[#242B37]"> {topicRecord && topicRecord?.topic_name}</p>
    </div>
  );
  const content = (
    <div className="popoverParent">
      <Row gutter={1}>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span>Author</span>
          <span className="text-[#5482c8] text-base font-semibold underline">
            {topicRecord?.submitter_nick_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Submitted On : </span>
          <span className="text-base text-black">
            {" "}
            {topicRecord && covertToTime(topicRecord?.submit_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Submitted By</span>
          <span className="text-[#000] text-base font-semibold">
          {topicRecord?.submitter_nick_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Go Live Time : </span>
          <span className="text-base text-black">
            {" "}
            {topicRecord && covertToTime(topicRecord?.go_live_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="d-flex flex-col">
          <span className="text-xs text-[#777f93]">Canon : </span>
          <span className="text-base text-black">
            {" "}
            {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
          </span>
        </Col>
      </Row>

      <hr className="horizontal_line my-[20px]" />
      <CustomButton className="customButton-popover mx-auto bg-[#5482c8] text-white flex items-center justify-center py-[12px] px-[29px] rounded-[10px] text-base font-medium gap-[10px] h-[44px] ">
        {isTopicPage && (
          <Link
            href={`/topic/history/${replaceSpecialCharacters(
              router?.query?.camp
                ? router?.query?.camp[0]
                : router?.query?.manageSupport?.at(0),
              "-"
            )}`}
          >
            <a className="flex items-center justify-center gap-3 text-base font-medium leading-[]">
              {K?.exceptionalMessages?.manageTopicButton}
              <Image
                src="/images/manage-btn-icon.svg"
                alt="svg"
                className="icon-topic"
                height={24}
                width={24}
              />
            </a>
          </Link>
        )}
      </CustomButton>
    </div>
  );
  const title2 = (
    <div className="popover_header">
      <span className="text-xs text-[#8992A6] mb-[5px]">Camp name :</span>
      <p className="font-bold mb-[20px] text-base text-[#242B37]"> {campRecord && campRecord?.camp_name}</p>
    </div>
  );
  const contentForCamp = (
    <div className="popoverParent">
      <Row gutter={5}>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Submitter</span>
          <span className="author-name">{campRecord?.submitter_nick_name}</span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Submitted On : </span>
          <span className="text-base text-black">
            {campRecord && covertToTime(campRecord?.submit_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Camp about nickname : </span>
          <span className="text-base text-black">
            {campRecord && campRecord.camp_about_nick_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Camp about URL : </span>
          <span className="text-base text-black">
            {campRecord && campRecord.camp_about_url}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">
            Single level camps only :{" "}
          </span>
          <span className="text-base text-black">
            {campRecord && campRecord.is_one_level == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">
            Disable aditional sub camps:{" "}
          </span>
          <span className="text-base text-black">
            {campRecord && campRecord.is_disabled == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Camp archive:</span>
          <span className="text-base text-black">
            {" "}
            {campRecord && campRecord.is_archive == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 d-flex flex-col">
          <span className="text-xs text-[#777f93]">Go live time:</span>
          <span className="text-base text-black">
            {" "}
            {campRecord && covertToTime(campRecord?.go_live_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" d-flex flex-col">
          <span className="text-xs text-[#777f93]">canon:</span>
          <span className="text-base text-black">
            {" "}
            {campRecord && campRecord.is_archive}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" d-flex flex-col">
          <span className="text-xs text-[#777f93]">Topic :</span>
          <span className="text-base text-black">
            {campRecord && campRecord.topic_num}
          </span>
        </Col>
      </Row>

      <hr className="horizontal_line my-[20px]" />
      <CustomButton className="customButton-popover customButton-popover mx-auto bg-[#5482c8] text-white flex items-center justify-center py-[12px] px-[29px] rounded-[10px] text-base font-medium gap-[10px] h-[44px] ">
        {isTopicPage && (
          <Link
            href={`/topic/history/${replaceSpecialCharacters(
              router?.query?.camp
                ? router?.query?.camp[0]
                : router?.query?.manageSupport?.at(0),
              "-"
            )}`}
          >
            <a className="flex items-center justify-center gap-3 text-base font-medium">
              {K?.exceptionalMessages?.manageCampButton}
              <Image
                src="/images/manage-btn-icon.svg"
                alt="svg"
                className="icon-topic"
                height={24}
                width={24}
              />
            </a>
          </Link>
        )}
      </CustomButton>
    </div>
  );
  return (
    <>
      {/* <div
        className={
          styles.topicDetailContentHead + " printHIde " + styles.info_bar_n
        }
      > */}
      <div className="bg-[#F4F5FA]  pt-[12px] pb-[12px] lg:px-[22px] lg:rounded-[12px] mb-[30px] ">
        <Spin spinning={false} >
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

            {isMobile ? (
              <div className="d-flex desktop-view">
                <Typography.Paragraph
                  className={
                    "mb-0 " +
                    `${
                      loadingIndicator
                        ? styles.topicTitleSkeleton
                        : styles.topicTitleStyle
                    }`
                  }
                >
                  <span className="flex items-center lg:gap-[20px] gap-[5px]">
                    <Image
                      src="/images/home-icon.svg"
                      alt="svg"
                      height={21}
                      width={17}
                    />
                    <Image
                      src="/images/arrow-bread.svg"
                      alt="svg"
                      height={12}
                      width={6}
                    />
                    (Canon) General{" "}
                    <Image
                      src="/images/arrow-bread.svg"
                      alt="svg"
                      height={12}
                      width={6}
                    />
                  </span>
                  <Popover
                    content={content}
                    title={title}
                    className="title-popover"
                  >
                    <div className="flex  items-center gap-[5px] ">
                      <span className="font- text-base text-[#242B37]">
                        Topic :
                      </span>

                      {loadingIndicator ? (
                        <CustomSkelton
                          skeltonFor="list"
                          bodyCount={1}
                          stylingClass="topic-skeleton"
                          isButton={false}
                        />
                      ) : isTopicHistoryPage ? (
                        <Link
                          href={`/topic/${
                            payload?.topic_num
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
                      <span className="d-flex">
                        {" "}
                        <Image
                          src="/images/circle-info-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={16}
                          width={16}
                        />
                      </span>
                    </div>
                  </Popover>

                  {breadCrumbRes && !!topicSubscriptionID && (
                    <Tooltip
                      title="You have subscribed to the entire topic."
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
                <div className={ styles.breadcrumbLinks}>
                  <Typography.Paragraph
                    className={"mb-0 ml-[20px] " + styles.topicTitleStyle}
                  >
                    <Image
                      src="/images/arrow-bread.svg"
                      alt="svg"
                      className="icon-topic"
                      height={12}
                      width={6}
                    />

                    <div className="flex items-center gap-1">
                      <span className="font-bold text-base text-[#242B37]">
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
                                href={`/topic/${
                                  payloadData?.topic_num
                                }-${replaceSpecialCharacters(
                                  breadCrumbRes?.topic_name,
                                  "-"
                                )}/${camp?.camp_num}-${replaceSpecialCharacters(
                                  camp?.camp_name,
                                  "-"
                                )}?${getQueryParams()?.returnQuery}`}
                                key={index}
                              >
                                <a className="">
                                  <span className={styles.slashStyle}>
                                    {index !== 0 && <DoubleRightOutlined />}
                                  </span>
                                  <span
                                    className={
                                      breadCrumbRes?.bread_crumb.length - 1 ==
                                      index
                                        ? styles.greenIndicateText
                                        : styles.boldBreadcrumb
                                    }
                                  >
                                    <Popover
                                      content={contentForCamp}
                                      title={title2}
                                    >{`${camp?.camp_name}`}</Popover>
                                  </span>
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
                              style={{
                                alignSelf: "center",
                                marginLeft: "10px",
                              }}
                            >
                              <i className="icon-subscribe text-primary"></i>
                            </small>
                          </Tooltip>
                        )}
                      <span className="d-flex">
                        {" "}
                        <Image
                          src="/images/circle-info-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={16}
                          width={16}
                        />
                      </span>
                    </div>
                  </Typography.Paragraph>
                </div>
              </div>
            ) : (
              <div className="d-flex mobile-view gap-5px items-center">
                <Typography.Paragraph
                  className={
                    "mb-0 " +
                    `${
                      loadingIndicator
                        ? styles.topicTitleSkeleton
                        : styles.topicTitleStyle
                    }`
                  }
                >
                  <span className="flex items-center lg:gap-2 gap-1">
                    <Image
                      src="/images/home-icon.svg"
                      alt="svg"
                      height={21}
                      width={17}
                    />
                    <Image
                      src="/images/arrow-bread.svg"
                      alt="svg"
                      height={12}
                      width={6}
                    />
                    <span className="home-link text-[#777F93] text-xs font-normal leading-[18px] whitespace-nowrap">
                      {" "}
                      General
                    </span>
                    <Image
                      src="/images/arrow-bread.svg"
                      alt="svg"
                      height={12}
                      width={6}
                    />
                  </span>
                  <Popover
                    content={content}
                    title={title}
                    className="title-popover"
                  >
                    <div className="flex  items-center gap-[5px] ">
                      <span className="font- text-base text-[#242B37] whitespace-nowrap">
                        Topic :
                      </span>

                      {loadingIndicator ? (
                        <CustomSkelton
                          skeltonFor="list"
                          bodyCount={1}
                          stylingClass="topic-skeleton"
                          isButton={false}
                        />
                      ) : isTopicHistoryPage ? (
                        <Link
                          href={`/topic/${
                            payload?.topic_num
                          }-${replaceSpecialCharacters(
                            breadCrumbRes?.topic_name,
                            "-"
                          )}/1-Agreement?${getQueryParams()?.returnQuery}`}
                        >
                          <a className="normal text-[#777F93] text-[12px] leading-[18px] font-normal text-ellipsis w-[50px] truncate">
                            {breadCrumbRes?.topic_name}
                          </a>
                        </Link>
                      ) : breadCrumbRes ? (
                        <span className="text-[17px] font-bold text-ellipsis w-[80px] lg:w-auto truncate ">
                          {breadCrumbRes?.topic_name}
                        </span>
                      ) : (
                        "N/A"
                      )}
                      {/* <span className="d-flex">
                      {" "}
                      <Image
                        src="/images/circle-info-bread.svg"
                        alt="svg"
                        className="icon-topic"
                        height={16}
                        width={16}
                      />
                    </span> */}
                    </div>
                  </Popover>

                  {breadCrumbRes && !!topicSubscriptionID && (
                    <Tooltip
                      title="You have subscribed to the entire topic."
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
                <div className={styles.breadcrumbLinks}>
                  <Typography.Paragraph
                    className={"mb-0 " + styles.topicTitleStyle}
                  >
                    <Image
                      src="/images/arrow-bread.svg"
                      alt="svg"
                      className="icon-topic"
                      height={12}
                      width={6}
                    />

                    <div className="flex items-center">
                      <span className="normal text-[#4EB966]">
                        {isTopicHistoryPage ? "Camp :" : ""}
                      </span>
                      {loadingIndicator ? (
                        <CustomSkelton
                          skeltonFor="list"
                          bodyCount={1}
                          stylingClass="topic-skeleton"
                          isButton={false}
                        />
                      ) : isTopicHistoryPage ? (
                        breadCrumbRes ? (
                          breadCrumbRes?.bread_crumb?.map((camp, index) => {
                            return (
                              <Link
                                href={`/topic/${
                                  payloadData?.topic_num
                                }-${replaceSpecialCharacters(
                                  breadCrumbRes?.topic_name,
                                  "-"
                                )}/${camp?.camp_num}-${replaceSpecialCharacters(
                                  camp?.camp_name,
                                  "-"
                                )}?${getQueryParams()?.returnQuery}`}
                                key={index}
                              >
                                <a className="text-[12px] text-[#4EB966]">
                                  <span className={styles.slashStyle}>
                                    {index !== 0 && <DoubleRightOutlined />}
                                  </span>

                                  {`${camp?.camp_name}`}
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
                              style={{
                                alignSelf: "center",
                                marginLeft: "10px",
                              }}
                            >
                              <i className="icon-subscribe text-primary"></i>
                            </small>
                          </Tooltip>
                        )}
                      <span className="d-flex ddddd">
                        {" "}
                        {/* <Image
                        src="/images/circle-info-bread.svg"
                        alt="svg"
                        className="icon-topic"
                        height={16}
                        width={16}
                      /> */}
                      </span>
                    </div>
                  </Typography.Paragraph>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {campStatement?.length > 0 ? (
                <div className="topicDetailsCollapseFooter printHIde camp">
                  <CustomButton
                    disabled={campRecord?.is_archive == 1 ? true : false}
                    className="text-white printHIde manage_camp_btn sm:hidden md:hidden hidden lg:flex border border-[#5482c8] !h-[40px] py-[10px] px-[13px] rounded-[10px] flex items-center gap-[10px] text-base font-medium leading-[22px]  text-center  text-[#242b37] bg-[#5482c8]"
                    id="add-camp-statement-btn"
                  >
                    <Link
                      href={
                        campStatement?.length > 0
                          ? `/statement/history/${replaceSpecialCharacters(
                              router?.query?.camp[0],
                              "-"
                            )}/${replaceSpecialCharacters(
                              router?.query?.camp[1] ?? "1-Agreement",
                              "-"
                            )}`
                          : `/create/statement/${replaceSpecialCharacters(
                              router?.query?.camp[0],
                              "-"
                            )}/${replaceSpecialCharacters(
                              router?.query?.camp[1] ?? "1-Agreement",
                              "-"
                            )}`
                      }
                      className="printHIde"
                    >
                      <a className="printHIde flex items-center gap-2">
                        {K?.exceptionalMessages?.manageCampStatementButton}
                        <Image
                          src="/images/manage-btn-icon.svg"
                          alt=""
                          height={24}
                          width={24}
                        />
                      </a>
                    </Link>
                  </CustomButton>
                </div>
              ) : (
                ""
              )}

              <Button
                className="btn hidden create-new-camp-btn border border-[#5482c8] px-[13px] py-[10px] rounded-[10px] lg:flex items-center gap-[10px] text-base font-medium leading-[22px] text-center text-[#242b37] bg-[#98b7e6] bg-opacity-[.1]"
                size="large"
              >
                Create New Camp
                <Image
                  src="/images/Icon-plus.svg"
                  alt="svg"
                  className="icon-topic"
                  height={16}
                  width={16}
                />
              </Button>
            </div>
          </div>

          <div className={styles.topicDetailContentHead_Right}>
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
                      {/* {router.pathname != "/support/[...manageSupport]" ? (
                        <Button
                          type="primary"
                          onClick={eventLinePath}
                          className={styles.btnCampForum}
                          id="camp-forum-btn"
                        >
                          Event Line 
                        </Button>
                      ) : null} */}
                    </>
                  )}
                </Fragment>
              )}
            </Typography.Paragraph>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default TimelineInfoBar;
