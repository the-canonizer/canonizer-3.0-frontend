import { Breadcrumb, Button, Col, Image, Popover, Row, Spin, Tooltip } from "antd";

import { useEffect, useRef, useState } from "react";
import {
  getCampBreadCrumbApi,
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
  getTreesApi,
  subscribeToCampApi,
} from "src/network/api/campDetailApi";
import { useRouter } from "next/router";
import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  changeSlashToArrow,
  getCookies,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import K from "src/constants";
import Link from "next/link";

function CommanBreadcrumbs({
  payload = null,
  isTopicPage = false,
  isTopicHistoryPage = false,
  isForumPage = false,
  getCheckSupportStatus = null,
  isHtmlContent = null,
  isEventLine = false,
  isHistoryPage = false,
  compareMode = false,
  updateId = null,
  historyOF = null,
}: any) {
  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [payloadData, setPayloadData] = useState(payload);
  const [breadCrumbRes, setBreadCrumbRes] = useState({
    topic_name: "",
    bread_crumb: [],
  });
  const didMount = useRef(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  //   const historyOf = compareMode ? historyOF : router?.asPath.split("/")[1];

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
  const splitId = (path) => {
    return path?.split("-")?.at(0);
  };

  const campId = compareMode
    ? splitId(router?.query?.routes?.at(1))
    : splitId(router?.query?.camp?.at(1));
  const topicId = compareMode
    ? splitId(router?.query?.routes?.at(0))
    : splitId(router?.query?.camp?.at(0));
  const historyOf = compareMode ? historyOF : router?.asPath.split("/")[1];

  const updateCurrentRecord = () => {
    router.push(`/manage/${historyOf}/${updateId}`);
  };
  useEffect(() => {
    const isDefaultOrReview = asof === "default" || asof === "review";

    const reqBody = {
      topic_num: parseInt(router?.query?.camp?.at(0)?.split("-")?.at(0), 10),
      camp_num:
        parseInt(router?.query?.camp?.at(1)?.split("-")?.at(0), 10) || 1,
      as_of: asof,
      as_of_date: isDefaultOrReview
        ? Math.floor(Date.now() / 1000)
        : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
    };

    const fetchTopicRecord = async () => {
      await getCurrentTopicRecordApi(reqBody);
    };

    const fetchCampRecord = async () => {
      await getCurrentCampRecordApi(reqBody);
    };

    if (campRecord === null) {
      fetchCampRecord();
    }

    if (topicRecord === null) {
      fetchTopicRecord();
    }
  }, []);

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

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia("(min-width: 1024.98px)").matches);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  console.log("isMobile", isMobile);

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
        topic_num: payload?.topic_num ? payload?.topic_num : topicId,
        camp_num: payload?.camp_num ? payload?.camp_num : campId ? campId : 1,
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

  //   let payload = history && {
  //     camp_num: router?.query?.camp?.at(1)?.split("-")?.at(0) ?? "1",
  //     topic_num: router?.query?.camp?.at(0)?.split("-")?.at(0),
  //   };
  //   useEffect(() => {
  //     async function getBreadCrumbApiCall() {
  //       setLoadingIndicator(true);
  //       let reqBody = {
  //         topic_num: compareMode
  //           ? router.query.routes?.at(0).split("-")?.at(0)
  //           : payload?.topic_num,
  //         camp_num: payload?.camp_num,
  //         as_of: router?.pathname == "/topic/[...camp]" ? asof : "default",
  //         as_of_date:
  //           asof == "default" || asof == "review"
  //             ? Date.now() / 1000
  //             : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
  //       };

  //       let res = await getCampBreadCrumbApi(reqBody);
  //       setBreadCrumbRes(res?.data);
  //       setLoadingIndicator(false);
  //     }

  //     if (
  //       (payload && Object.keys(payload).length > 0,
  //       !!(getCookies() as any)?.loginToken)
  //     ) {
  //       getBreadCrumbApiCall();
  //     }

  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  let historyTitle = () => {
    let title: string;
    if (historyOf == "statement") {
      title = "Statement History";
    } else if (historyOf == "camp") {
      title = "Camp History";
    } else if (historyOf == "topic") {
      title = "Topic History";
    }
    return title;
  };
  const handleTopicUrl = () => {
    const query = router?.query;
    const basePath = "/topic/history/";
    let routeValue = compareMode
      ? query?.routes?.at(0)
      : query?.camp?.at(0) || query?.manageSupport?.at(0);

    if (routeValue) {
      const formattedRoute = replaceSpecialCharacters(routeValue, "-");
      const fullPath = compareMode
        ? `${basePath}${formattedRoute}/1-Agreement`
        : `${basePath}${formattedRoute}/1-Agreement`;

      router?.push({ pathname: fullPath });
    }
  };

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

  const contentEventLine = (
    <div className="popoverParent">
      <span>
        Observe the gradual progression and changes that happened in this
        topic/camp via Event Line.
      </span>
    </div>
  );

  const title = (
    <div className="popover_header">
      <span className="text-xs 2xl:text-sm text-canLight mb-1.5 font-normal">
        Topic name :
      </span>
      <p className="font-bold mb-5 text-sm text-canBlack">
        {topicRecord && topicRecord?.topic_name}
      </p>
    </div>
  );

  const content = (
    <div className="popoverParent">
      <Row gutter={1}>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-canLight text-xs 2xl:text-sm">Author</span>
          <Link
            href={{
              pathname: `/user/supports/${topicRecord?.submitter_nick_id}`,
              query: { canon: topicRecord?.namespace_id || 1 },
            }}
          >
            <a className="!text-canBlue text-sm font-medium underline hover:!text-canHoverBlue">
              {topicRecord?.submitter_nick_name}
            </a>
          </Link>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Submitted On :{" "}
          </span>
          <span className="text-sm 2xl !text-black font-medium">
            {topicRecord && covertToTime(topicRecord?.submit_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Submitted By
          </span>
          <Link
            href={{
              pathname: `/user/supports/${topicRecord?.submitter_nick_id}`,
              query: { canon: topicRecord?.namespace_id || 1 },
            }}
          >
            <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-medium">
              {topicRecord?.submitter_nick_name}
            </a>
          </Link>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Go Live Time :{" "}
          </span>
          <span className="text-sm text-canBlack font-medium">
            {topicRecord && covertToTime(topicRecord?.go_live_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">Canon : </span>
          <span className="text-sm text-canBlack font-medium">
            {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
          </span>
        </Col>
      </Row>

      <hr className="horizontal_line my-5" />
      {(isTopicPage || isEventLine || isHistoryPage || compareMode) && (
        <PrimaryButton
          className="mx-auto flex items-center justify-center font-medium h-auto"
          onClick={() => handleTopicUrl()}
        >
          {K?.exceptionalMessages?.manageTopicButton}
          <Image
            src="/images/manage-btn-icon.svg"
            alt="svg"
            className="icon-topic"
            height={16}
            width={16}
          />
        </PrimaryButton>
      )}
    </div>
  );

  const title2 = (
    <div className="popover_header">
      <span className="text-xs 2xl:text-sm text-canLight mb-1">
        Camp name :
      </span>
      <p className="font-bold mb-5 text-sm text-canBlack">
        {campRecord && campRecord?.camp_name}
      </p>
    </div>
  );

  const href = `/camp/history/${replaceSpecialCharacters(
    compareMode
      ? router?.query?.routes?.at(0)
      : router?.query?.camp?.at(0) || router?.query?.manageSupport?.at(0),
    "-"
  )}/${replaceSpecialCharacters(
    compareMode
      ? router?.query?.routes?.at(1)
      : router?.query?.camp?.at(1) || "1-Agreement",
    "-"
  )}`;

  const contentForCamp = (
    <div className="popoverParent">
      <Row gutter={5}>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">Submitter</span>
          <Link
            href={{
              pathname: `/user/supports/${campRecord?.submitter_nick_id}`,
              query: { canon: topicRecord?.namespace_id || 1 },
            }}
          >
            <a className="author-name !text-canBlue hover:!text-canHoverBlue text-sm font-medium underline">
              {campRecord?.submitter_nick_name}
            </a>
          </Link>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Submitted On :{" "}
          </span>
          <span className="text-sm text-canBlack">
            {campRecord && covertToTime(campRecord?.submit_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Camp about nickname :{" "}
          </span>
          <Link
            href={{
              pathname: `/user/supports/${campRecord?.camp_about_nick_id}`,
              query: { canon: topicRecord?.namespace_id || 1 },
            }}
          >
            <a className="text-sm !text-canBlue hover:!text-canHoverBlue">
              {campRecord && campRecord.camp_about_nick_name}
            </a>
          </Link>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Camp about URL :{" "}
          </span>
          <a
            href={campRecord && campRecord.camp_about_url}
            className="text-sm block !text-canBlue hover:!text-canHoverBlue"
            target="_blank"
            rel="noreferrer"
          >
            {campRecord && campRecord.camp_about_url}
          </a>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Single level camps only :{" "}
          </span>
          <span className="text-sm text-canBlack">
            {campRecord && campRecord.is_one_level == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Disable additional sub camps:{" "}
          </span>
          <span className="text-sm text-canBlack">
            {campRecord && campRecord.is_disabled == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Camp archive:
          </span>
          <span className="text-sm text-canBlack">
            {campRecord && campRecord.is_archive == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">
            Go live time:
          </span>
          <span className="text-sm text-canBlack">
            {campRecord && covertToTime(campRecord?.go_live_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">canon:</span>
          <span className="text-sm text-canBlack">
            {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight">Topic :</span>
          <span className="text-sm text-canBlack">
            {topicRecord && topicRecord?.topic_name}
          </span>
        </Col>
        {campRecord?.camp_leader_nick_name && (
          <>
            <Col md={12} sm={12} xs={12} className=" flex flex-col mt-4">
              <span className="text-xs 2xl:text-sm text-canLight">
                Camp Leader:
              </span>
              <Link
                className="flex flex-wrap"
                href={{
                  pathname: `/user/supports/${campRecord?.camp_leader_nick_id}`,
                  query: {
                    canon: topicRecord?.namespace_id,
                  },
                }}
              >
                {campRecord?.camp_leader_nick_name}
              </Link>
            </Col>
          </>
        )}
      </Row>
      <hr className="horizontal_line my-5" />
      {(isTopicPage || isHistoryPage || compareMode) && (
        <PrimaryButton className="flex items-center justify-center h-auto mx-auto">
          <Link href={href}>
            <a>
              <span>
                {K?.exceptionalMessages?.manageCampButton}
                <Image
                  src="/images/manage-btn-icon.svg"
                  alt="svg"
                  className="icon-topic"
                  height={16}
                  width={16}
                />
              </span>
            </a>
          </Link>
        </PrimaryButton>
      )}
    </div>
  );

  const handleClick = () => {
    const lastCamp =
      breadCrumbRes?.bread_crumb[breadCrumbRes?.bread_crumb?.length - 1];

    const link = `/camp/create/${payload?.topic_num}-${replaceSpecialCharacters(
      breadCrumbRes?.topic_name,
      "-"
    )}/${lastCamp?.camp_num}-${replaceSpecialCharacters(
      lastCamp?.camp_name,
      "-"
    )}`;

    router.push(link);
  };

  //   const updateCurrentRecord = () => {
  //     router.push(`/manage/${historyOf}/${updateId}`);
  //   };

  // const { bread_crumb, topic_name } = breadCrumbRes;

  //   const topicNum = breadCrumbRes?.bread_crumb?.at(0)?.topic_num;
  //   const campNum = breadCrumbRes?.bread_crumb?.at(0)?.camp_num;
  //   const campName = breadCrumbRes?.bread_crumb?.at(0)?.camp_name;
  //   const formattedTopicName = breadCrumbRes?.topic_name.split(" ").join("-");
  //   const href = `/topic/${topicNum}-${formattedTopicName}/${campNum}-${campName}`;

  return (
    <>
      <div className="max-md:mx-[-1rem] max-md:shadow-[0px_10px_10px_0px_#0000001A] md:bg-canGrey1_Opacity70 p-[1.5rem] md:rounded-[1.25rem] flex items-center justify-between gap-2 ">
        <Spin spinning={false}>
          <Breadcrumb
            className="cn-breadcrumbs"
            separator={
              <>
                <i className="icon-angle-right-arrow"></i>
              </>
            }
          >
            <Breadcrumb.Item href="/">
              <i className="icon-home"></i>
            </Breadcrumb.Item>
            <Popover content={content} title={title} className="title-popover">
              <Breadcrumb.Item href={href}>
                Topic: {breadCrumbRes && breadCrumbRes?.topic_name}
                <span className="flex shrink-0">
                        <Image
                          src="/images/circle-info-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={14}
                          width={14}
                        />
                      </span>
              </Breadcrumb.Item>
            </Popover>
            <Breadcrumb.Item>
            {
                breadCrumbRes ? (
                    breadCrumbRes?.bread_crumb?.map((camp, index) => {
                      return (
                        <Link
                          href={`/topic/${
                            payloadData?.topic_num
                              ? payloadData?.topic_num
                              : topicId
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
                          <a className="!text-canBlack gap-x-1 gap-y-1 flex hover:!text-canBlack !text-sm">
                            {breadCrumbRes &&
                              !!campSubscriptionID &&
                              !isTopicHistoryPage && (
                                <Tooltip
                                  title="You have subscribed to this camp."
                                  key="camp_subscribed_icon"
                                >
                                  <small
                                    style={{ alignSelf: "center" }}
                                  >
                                    <i className="icon-subscribe text-canBlue"></i>
                                  </small>
                                </Tooltip>
                              )}
                            {/* <span
                              className={
                                breadCrumbRes?.bread_crumb.length -
                                  1 ==
                                index
                                  ? styles.greenIndicateText
                                  : styles.boldBreadcrumb
                              }
                            > */}
                              {index ===
                              breadCrumbRes.bread_crumb.length - 1 ? (
                                <Popover
                                  content={contentForCamp}
                                  title={title2}
                                >
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <span className="text-sm font-semibold">
                                      {camp?.camp_name}
                                    </span>
                                    <Image
                                      src="/images/circle-info-bread.svg"
                                      alt="svg"
                                      className="icon-topic"
                                      height={14}
                                      width={14}
                                    />
                                  </div>
                                </Popover>
                              ) : (
                                <div className="flex items-center gap-1.5 text-sm">
                                  <span className="text-sm">
                                    {camp?.camp_name}
                                  </span>
                                </div>
                              )}
                            {/* </span> */}
                            {index !==
                              breadCrumbRes.bread_crumb.length -
                                1 && (
                              <span className="!text-canBlack">
                                <Image
                                  src="/images/arrow-bread.svg"
                                  alt="svg"
                                  className="icon-topic"
                                  height={10}
                                  width={10}
                                />
                              </span>
                            )}
                          </a>
                        </Link>
                      );
                    })
                  ) : (
                    "N/A"
                  )
            }
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            {isEventLine && (
                  <Popover
                    content={contentEventLine}
                    className="title-popover"
                    placement="bottom"
                  >
                    <div className="flex  items-center gap-1.5">
                      <span className="font-normal text-base text-canBlack whitespace-nowrap">
                        Event Line
                      </span>
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
                )}
            </Breadcrumb.Item>
            <Breadcrumb.Item >
            {compareMode && (
                  <>
                    <div>
                      <Image
                        src="/images/arrow-bread.svg"
                        alt="svg"
                        className="icon-topic"
                        height={10}
                        width={10}
                      />
                    </div>
                    <div className="flex  items-center gap-1.5">
                      <span className="font-normal text-base text-canBlack whitespace-nowrap">
                        {historyTitle() == "Statement History"
                          ? "Statement History"
                          : historyTitle() == "Topic History"
                          ? "Topic History"
                          : historyTitle() == "Camp History"
                          ? "Camp History"
                          : null}
                      </span>
                    </div>
                  </>
                )}
            </Breadcrumb.Item>
          </Breadcrumb>
          {!compareMode && !!updateId && (
            <PrimaryButton
              size="large"
              type="primary"
              className="flex items-center justify-center rounded-[10px] max-lg:hidden gap-3.5 leading-none text-sm"
              onClick={() => updateCurrentRecord()}
            >
              Update Current
              {historyTitle() == "Statement History"
                ? " Statement"
                : historyTitle() == "Topic History"
                ? " Topic"
                : historyTitle() == "Camp History"
                ? " Camp"
                : null}
              <i className="icon-edit"></i>
            </PrimaryButton>
          )}
        </Spin>
      </div>
    </>
  );
}

export default CommanBreadcrumbs;
