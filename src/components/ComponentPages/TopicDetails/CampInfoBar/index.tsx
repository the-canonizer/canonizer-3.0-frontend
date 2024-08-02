import { DoubleLeftOutlined } from "@ant-design/icons";
import { Button, Col, Popover, Row, Spin, Tooltip, Typography } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "../topicDetails.module.scss";

import CustomSkelton from "src/components/common/customSkelton";
import {
  getCampBreadCrumbApi,
  getTreesApi,
  subscribeToCampApi,
} from "src/network/api/campDetailApi";
import { RootState } from "src/store";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import K from "src/constants";
import {
  changeSlashToArrow,
  getCookies,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import CustomButton from "../../../common/button";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

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
      <span className="text-xs text-canLight mb-1.5 font-normal">
        Topic name :
      </span>
      <p className="font-bold mb-5 text-base text-canBlack">
        {" "}
        {topicRecord && topicRecord?.topic_name}
      </p>
    </div>
  );
  const content = (
    <div className="popoverParent">
      <Row gutter={1}>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span>Author</span>
          <span className="text-canBlue text-base font-semibold underline">
            {topicRecord?.submitter_nick_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Submitted On : </span>
          <span className="text-base !text-black font-normal">
            {topicRecord && covertToTime(topicRecord?.submit_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Submitted By</span>
          <span className="text-canDarkBlack text-base font-semibold">
            {topicRecord?.submitter_nick_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Go Live Time : </span>
          <span className="text-base text-black">
            {topicRecord && covertToTime(topicRecord?.go_live_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="flex flex-col">
          <span className="text-xs text-canLight">Canon : </span>
          <span className="text-base text-black">
            {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
          </span>
        </Col>
      </Row>

      <hr className="horizontal_line my-5" />
      {isTopicPage && (
        <PrimaryButton
          className="mx-auto flex items-center justify-center py-3 px-7 font-medium h-[44px]"
          onClick={() =>
            router?.push({
              pathname: `/topic/history/${replaceSpecialCharacters(
                router?.query?.camp
                  ? router?.query?.camp[0]
                  : router?.query?.manageSupport?.at(0),
                "-"
              )}`,
            })
          }
        >
          {K?.exceptionalMessages?.manageTopicButton}
          <Image
            src="/images/manage-btn-icon.svg"
            alt="svg"
            className="icon-topic"
            height={24}
            width={24}
          />
        </PrimaryButton>
      )}
    </div>
  );
  const title2 = (
    <div className="popover_header">
      <span className="text-xs text-canLight mb-1">Camp name :</span>
      <p className="font-bold mb-5 text-base text-canBlack">
        {campRecord && campRecord?.camp_name}
      </p>
    </div>
  );
  const contentForCamp = (
    <div className="popoverParent">
      <Row gutter={5}>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Submitter</span>
          <span className="author-name text-canBlue text-base font-semibold underline">
            {campRecord?.submitter_nick_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Submitted On : </span>
          <span className="text-base text-black">
            {campRecord && covertToTime(campRecord?.submit_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Camp about nickname : </span>
          <span className="text-base text-black">
            {campRecord && campRecord.camp_about_nick_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Camp about URL : </span>
          <span className="text-base text-black">
            {campRecord && campRecord.camp_about_url}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">
            Single level camps only :{" "}
          </span>
          <span className="text-base text-black">
            {campRecord && campRecord.is_one_level == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">
            Disable aditional sub camps:{" "}
          </span>
          <span className="text-base text-black">
            {campRecord && campRecord.is_disabled == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Camp archive:</span>
          <span className="text-base text-black">
            {campRecord && campRecord.is_archive == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs text-canLight">Go live time:</span>
          <span className="text-base text-black">
            {campRecord && covertToTime(campRecord?.go_live_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" flex flex-col">
          <span className="text-xs text-canLight">canon:</span>
          <span className="text-base text-black">
            {campRecord && campRecord.is_archive}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" flex flex-col">
          <span className="text-xs text-canLight">Topic :</span>
          <span className="text-base text-black">
            {campRecord && campRecord.topic_num}
          </span>
        </Col>
      </Row>
      <hr className="horizontal_line my-5" />
      {isTopicPage && (
        <PrimaryButton
          className="flex items-center justify-center py-3 px-7 h-[44px] mx-auto"
          onClick={() =>
            router?.push({
              pathname: `/topic/history/${replaceSpecialCharacters(
                router?.query?.camp
                  ? router?.query?.camp[0]
                  : router?.query?.manageSupport?.at(0),
                "-"
              )}`,
            })
          }
        >
          {K?.exceptionalMessages?.manageCampButton}
          <Image
            src="/images/manage-btn-icon.svg"
            alt="svg"
            className="icon-topic"
            height={24}
            width={24}
          />
        </PrimaryButton>
      )}
    </div>
  );

  const handleClick = () => {
    const camp0 = router?.query.camp?.[0] || "";
    const camp1 = router?.query.camp?.[1] || "";
    const link = `/camp/create/${camp0}/${camp1}`;
    router.push(link);
  };

  return (
    <div className="lg:bg-canGrey1 bg-white lg:py-6 py-3 px-3 lg:px-5 lg:rounded-xl lg:mb-10 mb-7 mt-7.5 mx-[-16px]  lg:mx-0  border-t border-[#EAECF0] shadow-mobile-b-shadow lg:shadow-none ">
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
              </Button>
            </Popover>
          ) : null}
          <div className="flex justify-between items-center">
            {isMobile ? (
              <div className="flex desktop-view gap-5 items-start">
                <Typography.Paragraph
                  className={
                    "!mb-0  flex gap-5 shrink-0 " +
                    `${
                      loadingIndicator
                        ? styles.topicTitleSkeleton
                        : styles.topicTitleStyle
                    }`
                  }
                >
                  <span className="flex items-center lg:gap-5 gap-1 shrink-0">
                    <Image
                      src="/images/home-icon.svg"
                      alt="svg"
                      height={17}
                      width={21}
                    />
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
                    <div className="flex  items-center gap-1.5">
                      <span className="font-normal text-base text-canBlack whitespace-nowrap">
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
                          <a className="whitespace-nowrap !text-canBlack !text-base">
                            {breadCrumbRes?.topic_name}
                          </a>
                        </Link>
                      ) : breadCrumbRes ? (
                        <span
                          className={
                            styles.boldBreadcrumb +
                            " whitespace-nowrap text-base"
                          }
                        >
                          {breadCrumbRes?.topic_name}
                        </span>
                      ) : (
                        "N/A"
                      )}
                      <span className="flex shrink-0">
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
                <div className={styles.breadcrumbLinks + " flex "}>
                  <Typography.Paragraph
                    className={"!mb-0 flex  " + styles.topicTitleStyle}
                  >
                    <div className="flex items-start shrink-0">
                      <div>
                        <Image
                          src="/images/arrow-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={12}
                          width={6}
                        />
                      </div>
                      <span className="ml-5 mr-1 font-bold text-base text-canBlack whitespace-nowrap shrink-0">
                        {!isTopicHistoryPage ? "Camp:" : ""}
                      </span>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="flex gap-x-5 gap-y-2 flex-wrap items-center">
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
                                  )}/${
                                    camp?.camp_num
                                  }-${replaceSpecialCharacters(
                                    camp?.camp_name,
                                    "-"
                                  )}?${getQueryParams()?.returnQuery}`}
                                  key={index}
                                >
                                  <a className="!text-canBlack gap-x-5 gap-y-1 flex hover:!text-canBlack !text-base">
                                    {index !== 0 && (
                                      <span className=" !text-canBlack">
                                        <Image
                                          src="/images/arrow-bread.svg"
                                          alt="svg"
                                          className="icon-topic"
                                          height={12}
                                          width={6}
                                        />
                                      </span>
                                    )}
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
                                      >
                                        <div className="flex items-center gap-1.5 text-sm">
                                          <span
                                            className={`${
                                              index ===
                                              breadCrumbRes.bread_crumb.length -
                                                1
                                                ? "lg:text-base text-xs font-semibold"
                                                : "lg:text-base text-xs"
                                            }`}
                                          >
                                            {camp?.camp_name}
                                          </span>
                                          <Image
                                            src="/images/circle-info-bread.svg"
                                            alt="svg"
                                            className="icon-topic"
                                            height={16}
                                            width={16}
                                          />
                                        </div>
                                      </Popover>
                                    </span>
                                  </a>
                                </Link>
                              );
                            })
                          ) : (
                            "N/A"
                          )
                        ) : null}
                      </div>

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
                    </div>
                  </Typography.Paragraph>
                </div>
              </div>
            ) : (
              <div className="flex mobile-view gap-2 items-center">
                <Typography.Paragraph
                  className={
                    "!mb-0 flex items-center gap-2 shrink-0 " +
                    `${
                      loadingIndicator
                        ? styles.topicTitleSkeleton
                        : styles.topicTitleStyle
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <Image
                      src="/images/home-mobile-infobar.svg"
                      alt="svg"
                      height={21}
                      width={17}
                    />
                    <Image
                      src="/images/mobile-caret-infobar.svg"
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
                    <div className="flex  items-center gap-2 ">
                      <span className="lg:font-normal lg:text-base text-xs lg:text-canBlack text-canLight whitespace-nowrap">
                        Topic :
                      </span>

                      {loadingIndicator ? (
                        <CustomSkelton
                          skeltonFor="list"
                          bodyCount={1}
                          stylingClass="topic-skeleton"
                          isButton={false}
                        />
                      ) : !isTopicHistoryPage ? (
                        <Link
                          href={`/topic/${
                            payload?.topic_num
                          }-${replaceSpecialCharacters(
                            breadCrumbRes?.topic_name,
                            "-"
                          )}/1-Agreement?${getQueryParams()?.returnQuery}`}
                        >
                          <a className="normal lg:text-canBlack !text-canLight lg:text-base text-base leading-5 lg:font-normal text-ellipsis w-[50px] truncate">
                            {breadCrumbRes?.topic_name}
                          </a>
                        </Link>
                      ) : breadCrumbRes ? (
                        <span className="lg:text-base text-base font-normal text-ellipsis w-[80px] lg:w-auto truncate lg:text-canBlack text-canLight ">
                          {breadCrumbRes?.topic_name}
                        </span>
                      ) : (
                        "N/A"
                      )}
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
                <div className={styles.breadcrumbLinks + " flex flex-wrap"}>
                  <Typography.Paragraph
                    className={
                      "!mb-0 flex  flex-wrap " + styles.topicTitleStyle
                    }
                  >
                    <div className="flex items-center gap-2 overflow-y-auto">
                      <span className="flex items-center shrink-0">
                        {" "}
                        <Image
                          src="/images/mobile-caret-infobar.svg"
                          alt="svg"
                          className="icon-topic"
                          height={12}
                          width={6}
                        />
                      </span>
                      <span className="normal text-canGreen whitespace-nowrap flex items-center text-base font-semibold">
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
                                <a className="text-base !text-canGreen flex flex-wrap shrink-0 gap-2 items-center">
                                  {index !== 0 && (
                                    <span
                                      className={
                                        styles.slashStyl + " flex items-center"
                                      }
                                    >
                                      <Image
                                        src="/images/mobile-caret-infobar.svg"
                                        alt="svg"
                                        className="icon-topic"
                                        height={12}
                                        width={6}
                                      />
                                    </span>
                                  )}

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
                      <span className="flex ddddd"></span>
                    </div>
                  </Typography.Paragraph>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 shrink-0">
              {campStatement?.length > 0 ? (
                <div className="topicDetailsCollapseFooter printHIde camp">
                  <PrimaryButton
                    disabled={campRecord?.is_archive == 1 ? true : false}
                    className="printHIde sm:hidden md:hidden hidden lg:flex !h-[40px] py-2.5 px-5 items-center text-sm"
                    onClick={() => {
                      router?.push({
                        pathname: `${
                          campStatement?.length > 0
                            ? `/statement/history/${replaceSpecialCharacters(
                                router?.query?.camp?.at(0),
                                "-"
                              )}/${replaceSpecialCharacters(
                                router?.query?.camp?.at(1) ?? "1-Agreement",
                                "-"
                              )}`
                            : `/create/statement/${replaceSpecialCharacters(
                                router?.query?.camp?.at(0),
                                "-"
                              )}/${replaceSpecialCharacters(
                                router?.query?.camp?.at(1) ?? "1-Agreement",
                                "-"
                              )}`
                        }`,
                      });
                    }}
                    id="add-camp-statement-btn"
                  >
                    {K?.exceptionalMessages?.manageCampStatementButton}
                    <Image
                      src="/images/manage-btn-icon.svg"
                      alt=""
                      height={24}
                      width={24}
                    />
                  </PrimaryButton>
                </div>
              ) : null}

              <SecondaryButton
                className="hidden px-8 py-2.5 lg:flex items-center text-sm"
                size="large"
                onClick={handleClick}
              >
                Create Camp
                <Image
                  src="/images/Icon-plus.svg"
                  alt="svg"
                  className="icon-topic"
                  height={16}
                  width={16}
                />
              </SecondaryButton>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default TimelineInfoBar;
