import {
  DoubleLeftOutlined,
  EditOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Popover,
  Row,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
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
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const TimelineInfoBar = ({
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
    tree,
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
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
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

  const [tagsArrayList, setTagsArrayList] = useState([]);

  const [showAll, setShowAll] = useState(false);
  const tagsToShow = showAll ? tagsArrayList : tagsArrayList?.slice(0, 4);

  const transformDataForTags = (data) => {
    return data?.map((item, index) => {
      return {
        id: item.id,
        content: item.title,
      };
    });
  };

  useEffect(() => {
    setTagsArrayList(transformDataForTags(topicRecord?.tags));
  }, [topicRecord]);

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
    const fullPath = `/topic/history/${
      topicRecord?.topic_num
    }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/1-Agreement`;
    router?.push({ pathname: fullPath });
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
        {topicRecord && topicRecord?.topic_name?.length > 50
          ? `${topicRecord?.topic_name.substring(0, 20)}....`
          : topicRecord?.topic_name}
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
        {tagsArrayList && tagsArrayList?.length > 0 ? (
          <Col md={24} sm={24} xs={24} className="mt-3">
            <span className="text-xs 2xl:text-sm text-canLight">Tags :</span>
            <div className="vertical-chips mt-2 flex flex-wrap gap-2">
              {tagsToShow?.map((item: any, index) => (
                <div key={index}>
                  <Tag
                    className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                    closable={false}
                  >
                    <span data-testid="styles_Bluecolor">{item?.content}</span>
                  </Tag>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              {tagsArrayList && tagsArrayList?.length > 4 && (
                <button
                  className=" text-canBlue"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </Col>
        ) : null}
      </Row>

      <hr className="horizontal_line my-5" />
      <PrimaryButton
        className="mx-auto flex items-center justify-center font-medium h-auto gap-1"
        onClick={() => handleTopicUrl()}
      >
        {K?.exceptionalMessages?.manageTopicButton}
        <EditOutlined />
      </PrimaryButton>
    </div>
  );

  const title2 = (
    <div className="popover_header">
      <span className="text-xs 2xl:text-sm text-canLight mb-1">
        Camp name :
      </span>
      <p className="font-bold mb-5 text-sm text-canBlack line-clamp-1 overflow-hidden">
        <Link
          href={`/topic/${topicRecord?.topic_num}-${replaceSpecialCharacters(
            topicRecord?.topic_name,
            "-"
          )}/${campRecord?.camp_num}-${replaceSpecialCharacters(
            campRecord?.camp_name,
            "-"
          )}`}
        >
          {campRecord && campRecord?.camp_name?.length > 50
            ? `${campRecord?.camp_name.substring(0, 20)}....`
            : campRecord?.camp_name}
        </Link>
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

  const campHref = `/camp/history/${
    topicRecord?.topic_num
  }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/${
    campRecord?.camp_num
  }-${replaceSpecialCharacters(campRecord?.camp_name, "-")}`;

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
            {topicRecord && topicRecord?.topic_name?.length > 50
              ? `${topicRecord?.topic_name.substring(0, 20)}....`
              : topicRecord?.topic_name}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" flex flex-col mt-4">
          <span className="text-xs 2xl:text-sm text-canLight">
            Camp Leader:
          </span>
          {campRecord?.camp_leader_nick_name ? (
            <Link
              href={{
                pathname: `/user/supports/${campRecord?.camp_leader_nick_id}`,
                query: {
                  canon: topicRecord?.namespace_id,
                },
              }}
            >
              <a className="flex flex-wrap !text-canBlue hover:!text-canHoverBlue">
                {campRecord?.camp_leader_nick_name}
              </a>
            </Link>
          ) : (
            "No"
          )}
        </Col>
      </Row>
      <hr className="horizontal_line my-5" />
      <PrimaryButton className="flex items-center justify-center h-auto mx-auto gap-1">
        <Link href={campHref}>
          <a className="flex items-center justify-center h-auto mx-auto gap-1">
            <span className="flex items-center justify-center h-auto mx-auto gap-1">
              {K?.exceptionalMessages?.manageCampButton}
              <EditOutlined />
            </span>
          </a>
        </Link>
      </PrimaryButton>
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

  const getCurrentUpdateButton = () => {
    const renderButtonLabel = () => {
      switch (historyTitle()) {
        case "Statement History":
          return " Statement";
        case "Topic History":
          return " Topic";
        case "Camp History":
          return " Camp";
        default:
          return "";
      }
    };

    const btn = (
      <PrimaryButton
        size="large"
        type="primary"
        className="flex items-center justify-center rounded-[10px] max-lg:hidden gap-3.5 leading-none text-sm ml-auto"
        onClick={() => updateCurrentRecord()}
      >
        Update Current
        {renderButtonLabel()}
        <i className="icon-edit"></i>
      </PrimaryButton>
    );

    // Return button for "Camp History" if the record is not archived
    if (!compareMode && !!updateId) {
      if (historyTitle() === "Camp History" && campRecord?.is_archive === 1) {
        return null;
      }
      return btn;
    }

    // Return null if conditions are not met
    return null;
  };

  return (
    <div className="lg:bg-canGrey1 bg-white lg:py-4 py-3 px-3 lg:px-5 lg:rounded-xl lg:mb-10 mb-10 -mt-9 lg:mt-0 mx-[-16px] lg:mx-0 border-t border-[#EAECF0] shadow-mobile-b-shadow lg:shadow-none inforBarClass">
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
          <div className="flex justify-between items-center gap-3">
            {isMobile ? (
              <div className="flex desktop-view w-full gap-3 items-center">
                <Typography.Paragraph
                  className={
                    "!mb-0  flex gap-3 shrink-0 " +
                    `${
                      loadingIndicator
                        ? styles.topicTitleSkeleton
                        : styles.topicTitleStyle
                    }`
                  }
                >
                  {/* <span className="flex items-center lg:gap-5 gap-1 shrink-0">
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
                  </span> */}
                  <Popover
                    content={content}
                    title={title}
                    className="title-popover"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-canBlack whitespace-nowrap">
                        Topic:
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
                            payload?.topic_num ? payload?.topic_num : topicId
                          }-${replaceSpecialCharacters(
                            breadCrumbRes?.topic_name,
                            "-"
                          )}/1-Agreement?${getQueryParams()?.returnQuery}`}
                        >
                          <a className="whitespace-nowrap !text-canBlack !text-sm">
                            {topicRecord?.topic_name}
                          </a>
                        </Link>
                      ) : breadCrumbRes ? (
                        <span className="!text-sm gap-x-1 flex">
                          {breadCrumbRes && !!topicSubscriptionID && (
                            <Tooltip
                              title="You have subscribed to the entire topic."
                              key="camp_subscribed_icon"
                            >
                              <small style={{ alignSelf: "center" }}>
                                <i className="icon-subscribe text-canBlue"></i>
                              </small>
                            </Tooltip>
                          )}
                          <Link
                            href={`/topic/${
                              payload?.topic_num ? payload?.topic_num : topicId
                            }-${replaceSpecialCharacters(
                              breadCrumbRes?.topic_name,
                              "-"
                            )}/1-Agreement?${getQueryParams()?.returnQuery}`}
                          >
                            <span
                              className={
                                styles.boldBreadcrumb +
                                " whitespace-nowrap text-sm cursor-pointer"
                              }
                            >
                              {topicRecord?.topic_name}
                            </span>
                          </Link>
                        </span>
                      ) : (
                        "N/A"
                      )}
                      <span className="flex shrink-0">
                        <Image
                          src="/images/circle-info-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={14}
                          width={14}
                        />
                      </span>
                    </div>
                  </Popover>

                  {tree?.["1"]?.is_valid_as_of_time && (
                    <div>
                      <Image
                        src="/images/arrow-bread.svg"
                        alt="svg"
                        className="icon-topic"
                        height={10}
                        width={10}
                      />
                    </div>
                  )}
                </Typography.Paragraph>
                {!isEventLine && (
                  <div className={styles.breadcrumbLinks + " flex "}>
                    <Typography.Paragraph
                      className={"!mb-0 flex  " + styles.topicTitleStyle}
                    >
                      {/* <div className="flex items-center shrink-0 mr-1">
                        <span className="mr-1 font-bold text-sm text-canBlack whitespace-nowrap shrink-0">
                          {!isTopicHistoryPage ? "Camp: " : ""}
                        </span>
                      </div> */}
                      <div className="flex items-center gap-3">
                        <div className="flex gap-x-2 gap-y-2 flex-wrap items-center">
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
                                  <a
                                    className="!text-canBlack gap-x-1 gap-y-1 flex hover:!text-canBlack !text-sm"
                                    key={index}
                                  >
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
                                    <span
                                      className={
                                        breadCrumbRes?.bread_crumb.length - 1 ==
                                        index
                                          ? styles.greenIndicateText
                                          : styles.boldBreadcrumb
                                      }
                                    >
                                      {index ===
                                      breadCrumbRes.bread_crumb.length - 1 ? (
                                        <Popover
                                          content={contentForCamp}
                                          title={title2}
                                        >
                                          <div className="flex items-center gap-1.5 text-sm">
                                            <span className="text-sm font-semibold">
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
                                                )}?${
                                                  getQueryParams()?.returnQuery
                                                }`}
                                                key={index}
                                              >
                                                <span className="!text-canBlack gap-x-1 gap-y-1 flex hover:!text-canBlack !text-sm">
                                                  {camp?.camp_name}
                                                </span>
                                              </Link>
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
                                              )}?${
                                                getQueryParams()?.returnQuery
                                              }`}
                                              key={index}
                                            >
                                              <span className="!text-canBlack gap-x-1 gap-y-1 flex hover:!text-canBlack !text-sm">
                                                {camp?.camp_name}
                                              </span>
                                            </Link>
                                          </span>
                                        </div>
                                      )}
                                    </span>
                                    {index !==
                                      breadCrumbRes.bread_crumb.length - 1 && (
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
                                );
                              })
                            ) : (
                              "N/A"
                            )
                          ) : null}
                        </div>
                      </div>
                    </Typography.Paragraph>
                  </div>
                )}
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
                {getCurrentUpdateButton()}
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
                      <span className="lg:font-normal lg:text-sm text-sm 2xl:text-sm lg:text-canBlack text-canLight whitespace-nowrap">
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
                            payloadData?.topic_num
                              ? payloadData?.topic_num
                              : topicId
                          }-${replaceSpecialCharacters(
                            breadCrumbRes?.topic_name,
                            "-"
                          )}/1-Agreement?${getQueryParams()?.returnQuery}`}
                        >
                          <a className="normal lg:text-canBlack !text-canLight lg:text-sm text-sm leading-5 lg:font-normal text-ellipsis w-[50px] truncate">
                            {breadCrumbRes?.topic_name}
                          </a>
                        </Link>
                      ) : breadCrumbRes ? (
                        <span className="lg:text-sm text-sm font-normal text-ellipsis w-[80px] lg:w-auto truncate lg:text-canBlack text-canLight ">
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
                        <i className="icon-subscribe text-canBlue"></i>
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
                        <Image
                          src="/images/mobile-caret-infobar.svg"
                          alt="svg"
                          className="icon-topic"
                          height={12}
                          width={6}
                        />
                      </span>
                      <span className="normal text-canGreen whitespace-nowrap flex items-center text-sm font-semibold">
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
                                    ? payloadData?.topic_num
                                    : topicId
                                }-${replaceSpecialCharacters(
                                  breadCrumbRes?.topic_name,
                                  "-"
                                )}/${camp?.camp_num}-${replaceSpecialCharacters(
                                  camp?.camp_name,
                                  "-"
                                )}?${getQueryParams()?.returnQuery}`}
                                key={index}
                              >
                                <a className="text-sm !text-canGreen flex flex-wrap shrink-0 gap-2 items-center">
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
                              <i className="icon-subscribe text-canBlue"></i>
                            </small>
                          </Tooltip>
                        )}
                      <span className="flex ddddd"></span>
                    </div>
                  </Typography.Paragraph>
                </div>
              </div>
            )}
            {!isEventLine && (
              <div className="flex items-center gap-3 shrink-0">
                {!isHtmlContent &&
                isTopicPage &&
                campStatement?.length > 0 &&
                (campStatement?.at(0)?.in_review_changes > 0 ||
                  campStatement?.at(0)?.grace_period_record_count > 0 ||
                  campStatement?.at(0)?.parsed_value) ? (
                  <div className="topicDetailsCollapseFooter printHIde camp">
                    <PrimaryButton
                      disabled={campRecord?.is_archive == 1 ? true : false}
                      className="printHIde sm:hidden md:hidden hidden lg:flex !h-[40px] py-2.5 px-5 items-center text-sm"
                      onClick={() => {
                        router?.push(
                          `${`/statement/history/${replaceSpecialCharacters(
                            router?.query?.camp?.at(0),
                            "-"
                          )}/${replaceSpecialCharacters(
                            router?.query?.camp?.at(1) ?? "1-Agreement",
                            "-"
                          )}`}`
                        );
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

                {!isHtmlContent &&
                  !isHistoryPage &&
                  !compareMode &&
                  campRecord?.is_archive == 0 &&
                  breadCrumbRes?.bread_crumb[
                    breadCrumbRes?.bread_crumb?.length - 1
                  ] && (
                    <SecondaryButton
                      className="hidden px-8 py-2.5 lg:flex items-center text-sm gap-1"
                      size="large"
                      onClick={handleClick}
                      disabled={
                        !tree?.["1"]?.is_valid_as_of_time ? true : false
                      }
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
                  )}
                {isHtmlContent}
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default TimelineInfoBar;
