import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  BackTop,
  Image,
  Popover,
  Select,
  Typography,
  Collapse,
  Modal,
  Input,
  message,
} from "antd";
import moment from "moment";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";

import styles from "./topicDetails.module.scss";

import {
  setCampWithScorevalue,
  setFilterCanonizedTopics,
  setShowDrawer,
  setTreeExpandValue,
  setViewThisVersion,
} from "src/store/slices/filtersSlice";
import {
  getCanonizedCampStatementApi,
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
  getNewsFeedApi,
  getRestrictSupporters,
  getTopicActivityLogApi,
  getTreesApi,
  restrictSupporters,
} from "src/network/api/campDetailApi";
import { RootState, store } from "src/store";
import CampStatementCard from "components/ComponentPages/TopicDetails/CampStatementCard";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import {
  GetActiveSupportTopic,
  GetCheckSupportExists,
} from "src/network/api/topicAPI";
import {
  setCampSupportingTree,
  setCheckSupportExistsData,
  setCurrentCheckSupportStatus,
} from "src/store/slices/campDetailSlice";
import queryParams from "src/utils/queryParams";
import isAuth from "src/hooks/isUserAuthenticated";
import SupportTreeCard from "./SupportTreeCard";
import { fallBackSrc } from "src/assets/data-images";
import Layout from "src/hoc/layout";
import {
  addSupport,
  removeSupportedCamps,
  removeSupportedCampsEntireTopic,
} from "src/network/api/userApi";
import InfoBar from "./CampInfoBar/infoBar";
import { setOpenConsensusTreePopup } from "src/store/slices/hotTopicSlice";
import CampDisclaimer from "components/common/CampDisclaimer";
import ArchivedCampCheckBox from "../ArchivedCampCheckBox";
import Campforum from "../CampForumTopicDetails";
import FullScoreCheckbox from "../FullScoreCheckbox";
import SiblingCamps from "../SiblingCamps";
import CampTree from "./CampTree";
import { setCampActivityData } from "src/store/slices/recentActivitiesSlice";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";
import ScoreTag from "../Home/TrandingTopic/scoreTag";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import CommanBreadcrumbs from "../Breadcrumbs/commonBreadcrumbs";
import ActivityNewsCard from "./ActivityNewsCard";
import { labels } from "src/messages/label";
import { setStatementPreview } from "src/store/slices/topicSlice";
import GoogleAd from "components/googleAds";
import ScorePercentageCheckBox from "../ScorePercentageCheckBox";
import { getHistoryApi } from "src/network/api/history";

// import GoogleAd from "components/googleAds";

const { Link: AntLink } = Typography;
const { Panel } = Collapse;
const { Text } = Typography;

const TopicDetails = ({ serverSideCall }: any) => {
  const myRefToCampStatement = useRef(null);
  const didMount = useRef(false);
  const showTreeSkeltonRef = useRef(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const {
    algorithms,
    asof,
    asofdate,
    algorithm,
    excludeBots,
    campRecord,
    tree,
    campExist,
    viewThisVersionCheck,
    campWithScore,
    openConsensusTreePopup,
    treeExpandValue,
    userEmail,
    haveStatementPreview,
    campStatement,
    history,
  } = useSelector((state: RootState) => ({
    algorithms: state.homePage?.algorithms,
    asof: state?.filters?.filterObject?.asof,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    excludeBots: state?.filters?.filterObject?.exclude_bots,
    campRecord: state?.topicDetails?.currentCampRecord,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
    campWithScore: state?.filters?.campWithScoreValue,
    openConsensusTreePopup: state.hotTopic.openConsensusTreePopup,
    treeExpandValue: state?.filters?.treeExpandValue,
    userEmail: state?.auth?.loggedInUser?.email,
    haveStatementPreview: state?.topic?.haveStatementPreview,
    campStatement: state?.topicDetails?.campStatement,
    history: state?.topicDetails?.history,
  }));

  const { isUserAuthenticated } = isAuth();

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getCheckSupportStatus, setGetCheckSupportStatus] = useState({});
  const totalSupportScore = 0;
  const totalFullSupportScore = 0;
  const [topicList, setTopicList] = useState([]);
  const [isSupportTreeCardModal, setIsSupportTreeCardModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelegateSupportTreeCardModal, setIsDelegateSupportTreeCardModal] =
    useState(false);
  const [removeSupportSpinner, setRemoveSupportSpinner] = useState(false);
  const [isRemovingSupport, setIsRemovingSupport] = useState(false);
  const [backGroundColorClass, setBackGroundColorClass] = useState("default");
  const [totalCampScoreForSupportTree, setTotalCampScoreForSupportTree] =
    useState<number>(null);

  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const count = useRef(1);

  const [supportTreeForCamp, setSupportTreeForCamp] = useState<any[]>([]);
  const [breadCrumbBolean, setBreadCrumbBolean] = useState(true);
  const supportRelatedInfo = (
    <div className="popoverSupport text-xs">
      <span>
        Supporters can delegate their support to others. Direct supporters
        receive email notifications of proposed camp changes, while delegated
        supporters don’t. People delegating their support to others are shown
        below and indented from their delegates in an outline form. If a
        delegate changes camp, everyone delegating their support to them will
        change camps with them.
      </span>
    </div>
  );

  useEffect(() => {
    dispatch(setTreeExpandValue(campWithScore));
  }, [campWithScore]);

  const isMobile = window.matchMedia("(min-width: 1280px)").matches;

  const GetActiveSupportTopicList = async () => {
    const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };
    if (isUserAuthenticated) {
      const reponse = await GetActiveSupportTopic(topicNum && body);
      if (reponse?.status_code == 200) {
        setTopicList(reponse?.data);
      }
    }

    setLoadingIndicator(false);
  };

  useEffect(() => {
    async function getTreeApiCall() {
      if (!showTreeSkeltonRef) {
        showTreeSkeltonRef.current = true;
      }
      setLoadingIndicator(true);
      if (didMount.current && !serverSideCall.current) {
        const reqBodyForService = {
          topic_num: router?.query?.camp[0]?.split("-")[0],
          camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
          asOf: asof,
          asofdate:
            asof == "default" || asof == "review"
              ? Date.now() / 1000
              : asofdate,
          algorithm: algorithm,
          update_all: 1,
          fetch_topic_history: viewThisVersionCheck ? 1 : null,
          current_user: isUserAuthenticated ? userEmail : "",
          exclude_bots: excludeBots ? 1 : 0,
        };

        const reqBody = {
          topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
          camp_num: +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
          as_of: asof,
          as_of_date:
            asof == "default" || asof == "review"
              ? Date.now() / 1000
              : router?.query?.asofdate
              ? moment
                  .utc(+router?.query?.asofdate * 1000)
                  .format("DD-MM-YYYY H:mm:ss")
              : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
        };

        if (!(algorithms?.length > 0)) await getCanonizedAlgorithmsApi();

        await Promise.all([
          dispatch(setCampSupportingTree({})),
          getNewsFeedApi(reqBody),
          getCurrentTopicRecordApi(reqBody),
          getCurrentCampRecordApi(reqBody),
          getCanonizedCampStatementApi(reqBody),
          getTreesApi(reqBodyForService),
        ]);
      } else if (serverSideCall.current) {
        serverSideCall.current = false;
        didMount.current = true;
      } else {
        didMount.current = true;
      }

      GetActiveSupportTopicList();
    }

    getTreeApiCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    asofdate,
    algorithm,
    excludeBots,
    +(router?.query?.camp[1]?.split("-")[0] ?? 1),
    router?.query?.camp[0]?.split("-")[0],
  ]);
  useEffect(() => {
    const query = {
      ...router.query,
      is_tree_open: openConsensusTreePopup ? "1" : "0",
    };

    router.replace(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true } // Prevents a full page reload
    );
  }, [openConsensusTreePopup]);

  useEffect(() => {
    const getStatement = async () => {
      const body = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
        as_of: asof,
        as_of_date:
          asof == "default" || asof == "review"
            ? Date.now() / 1000
            : router?.query?.asofdate
            ? moment
                .utc(+router?.query?.asofdate * 1000)
                .format("DD-MM-YYYY H:mm:ss")
            : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
      };

      dispatch(setStatementPreview(null));

      await getCanonizedCampStatementApi(body);
    };
    if (
      haveStatementPreview ||
      (haveStatementPreview?.camp_id !==
        router?.query?.camp[0]?.split("-")[0] &&
        !openConsensusTreePopup)
    ) {
      console.log("haveStatementPreview", haveStatementPreview);
      getStatement();
    }
  }, [haveStatementPreview, openConsensusTreePopup]);

  useEffect(() => {
    const liveId =
      (history as any)?.details?.liveCamp?.live_record_id ??
      (history as any)?.live_record_id;

    const restrictSupporters = async () => {
      await getRestrictSupporters(liveId);
    };

    restrictSupporters();
  }, []);

  useEffect(() => {
    if (
      (router?.query?.asOf && router.query.asOf !== "bydate") ||
      router.query.asOf == undefined
    ) {
      dispatch(setViewThisVersion(false));
      dispatch(
        setFilterCanonizedTopics({
          asofdate: router?.query?.asofdate
            ? +router?.query?.asofdate
            : Date.now() / 1000,
          asof: router?.query?.asofdate ? "bydate" : "default",
        })
      );
    }
    if (!router?.query?.asof) {
      dispatch(
        setFilterCanonizedTopics({
          asofdate: Date.now() / 1000,
          asof: "default",
        })
      );
    }
  }, [router.query.asOf]);

  async function getTopicActivityLogCall() {
    let reqBody = {
      topic_num: router?.query?.camp[0]?.split("-")[0],
      camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
    };
    let res = await getTopicActivityLogApi(reqBody);
    store.dispatch(setCampActivityData(res?.data?.items));
  }

  const reqBodyData = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
  };

  const removeApiSupport = async (supportedId, reasonData = {}) => {
    setIsRemovingSupport(true);
    const supportedCampsRemove = {
      topic_num: reqBodyData.topic_num,
      remove_camps: [reqBodyData.camp_num],
      type: "direct",
      action: "all",
      nick_name_id: supportedId,
      order_update: [],
      ...reasonData,
    };
    const reqBodyForService = {
      topic_num: +router?.query?.camp[0]?.split("-")[0],
      camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
      asOf: asof,
      asofdate:
        asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
      fetch_topic_history: +router?.query?.topic_history,
      current_user: isUserAuthenticated ? userEmail : "",
      exclude_bots: excludeBots ? 1 : 0,
    };
    setRemoveSupportSpinner(true);
    let reqBody = {
      as_of: asof,
      as_of_date: asofdate,
      topic_num: +router?.query?.camp[0]?.split("-")[0],
      camp_num: +router?.query?.camp[1]?.split("-")[0],
    };

    const res = await removeSupportedCamps(supportedCampsRemove);
    if (res && res.status_code == 200) {
      let type = "success";
      let obj = {
        ...res?.message,
        isSupport: true,
      };
      openNotificationWithIcon(obj, type);
      setIsSupportTreeCardModal(false);
      GetCheckStatusData();
      await getTreesApi(reqBodyForService);
      getTopicActivityLogCall();
      await getCurrentCampRecordApi(reqBody);
      setRemoveSupportSpinner(false);
      setIsRemovingSupport(false);
    }
  };

  const removeSupport = async (supportedId, reasonData = {}) => {
    setIsRemovingSupport(true);
    const RemoveSupportId = {
      topic_num: reqBodyData.topic_num,
      add_camp: {},
      remove_camps: [reqBodyData.camp_num],
      type: "direct",
      action: "partial",
      nick_name_id: supportedId,
      order_update: [],
      ...reasonData,
    };
    const reqBodyForService = {
      topic_num: +router?.query?.camp[0]?.split("-")[0],
      camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
      asOf: asof,
      asofdate:
        asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
      fetch_topic_history: +router?.query?.topic_history,
      current_user: isUserAuthenticated ? userEmail : "",
      exclude_bots: excludeBots ? 1 : 0,
    };
    setRemoveSupportSpinner(true);

    let reqBody = {
      as_of: asof,
      as_of_date: asofdate,
      topic_num: +router?.query?.camp[0]?.split("-")[0],
      camp_num: +router?.query?.camp[1]?.split("-")[0],
    };

    let res = await addSupport(RemoveSupportId);
    if (res && res.status_code == 200) {
      let type = "success";
      openNotificationWithIcon(res?.message, type);
      setIsSupportTreeCardModal(false);
      GetCheckStatusData();
      await getTreesApi(reqBodyForService);
      getTopicActivityLogCall();
      await getCurrentCampRecordApi(reqBody);
      setRemoveSupportSpinner(false);
      setIsRemovingSupport(false);
    }
    setRemoveSupportSpinner(false);
  };

  const removeSupportForDelegate = async (reasonData = {}) => {
    setIsRemovingSupport(true);
    const removeEntireData = {
      topic_num: topicList[0].topic_num,
      nick_name_id: topicList[0]?.nick_name_id,
      delegated_nick_name_id: topicList[0]?.delegate_nick_name_id,
      ...reasonData,
    };
    const reqBodyForService = {
      topic_num: +router?.query?.camp[0]?.split("-")[0],
      camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
      asOf: asof,
      asofdate:
        asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
      fetch_topic_history: +router?.query?.topic_history,
      current_user: isUserAuthenticated ? userEmail : "",
      exclude_bots: excludeBots ? 1 : 0,
    };
    setRemoveSupportSpinner(true);

    let res = await removeSupportedCampsEntireTopic(removeEntireData);
    if (res && res.status_code == 200) {
      let type = "success";
      openNotificationWithIcon(res?.message, type);
      setRemoveSupportSpinner(false);
      setIsSupportTreeCardModal(false);
      setIsDelegateSupportTreeCardModal(false);
      GetCheckStatusData();
      getTopicActivityLogCall();
      await getTreesApi(reqBodyForService);
      setIsRemovingSupport(false);
      setRemoveSupportSpinner(false);
    }
  };

  const GetCheckStatusData = async () => {
    let response = await GetCheckSupportExists(queryParams(reqBodyData));
    if (response && response.status_code === 200) {
      setGetCheckSupportStatus(response.data);

      dispatch(setCurrentCheckSupportStatus(""));
      dispatch(setCheckSupportExistsData(""));

      dispatch(
        setCurrentCheckSupportStatus(
          response.data.warning ? response.data.warning : ""
        )
      );
      dispatch(setCheckSupportExistsData(response.data));
    }
  };

  const handleSupportTreeCardCancel = () => {
    setIsSupportTreeCardModal(false);
    setIsDelegateSupportTreeCardModal(false);
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      GetCheckStatusData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated || router || algorithm, router.query.camp.at(1)]);

  useEffect(() => {
    setBackGroundColorClass(asof);
  }, [asof]);

  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMoreSupporters = async () => {};

  useEffect(() => {
    const q = router?.query;
    if (q?.is_tree_open) {
      if (q?.is_tree_open === "1") {
        dispatch(setShowDrawer(true));
      } else if (q?.is_tree_open === "0") {
        dispatch(setShowDrawer(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateTreeDate = () => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate:
          Date.parse(moment.unix(tree["1"]?.created_date).endOf("day")["_d"]) /
          1000,
        asof: "bydate",
      })
    );
    router.query.asofdate = `${
      Date.parse(moment.unix(tree["1"]?.created_date).endOf("day")["_d"]) / 1000
    }`;
    router?.push(router, null, { shallow: true });
  };

  const onCreateCampDate = () => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate:
          Date.parse(
            moment.unix(campExist && campExist?.created_at).endOf("day")["_d"]
          ) / 1000,
        asof: "bydate",
      })
    );
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scoreOptions = [
    {
      value: "0",
      label: "0%",
    },
    {
      value: "10",
      label: "10%",
    },
    {
      value: "20",
      label: "20%",
    },
    {
      value: "50",
      label: "50%",
    },
    {
      value: "70",
      label: "70%",
    },
    {
      value: "80",
      label: "80%",
    },
    {
      value: "90",
      label: "90%",
    },
  ];

  const handleChange = (value) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, ...{ filter: value } },
      },
      undefined,
      { shallow: true }
    );
    dispatch(setCampWithScorevalue(value));
  };

  const { campSupportingTree } = useSelector((state: RootState) => ({
    campSupportingTree: Array.isArray(supportTreeForCamp)
      ? supportTreeForCamp
      : [],
    asof: state?.filters?.filterObject?.asof,
  }));

  useEffect(() => {
    const campStatementApiCall = async () => {
      const reqBody = {
        topic_num: router?.query.camp[0].split("-")[0],
        camp_num: campRecord?.topic_num || 1,
        type: null,
        per_page: 4,
        page: count.current,
      };
      let res = await getHistoryApi(reqBody, count.current, "topic");
      // setCampId(res?.data);
    };
    if (
      haveStatementPreview ||
      (haveStatementPreview?.camp_id !==
        router?.query?.camp[0]?.split("-")[0] &&
        !openConsensusTreePopup)
    ) {
      campStatementApiCall();
    }
  }, [haveStatementPreview, openConsensusTreePopup]);

  const handleSupporterClick = (supporter) => {
    setSelectedSupporter(supporter);
    setIsModalOpen(true);
    setReason(""); // Reset reason when opening modal
  };

  async function getTreeApiCallback() {
    // Set loading states
    if (!showTreeSkeltonRef.current) {
      showTreeSkeltonRef.current = true;
    }
    setLoadingIndicator(true);

    // Only execute if component is mounted and not a server-side call
    if (didMount.current && !serverSideCall.current) {
      try {
        const reqBodyForService = {
          topic_num: router?.query?.camp[0]?.split("-")[0],
          camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
          asOf: asof,
          asofdate:
            asof === "default" || asof === "review"
              ? Date.now() / 1000
              : asofdate,
          algorithm: algorithm,
          update_all: 1,
          fetch_topic_history: viewThisVersionCheck ? 1 : null,
          current_user: isUserAuthenticated ? userEmail : "",
          exclude_bots: excludeBots ? 1 : 0,
        };

        // Call the API
        const response = await getTreesApi(reqBodyForService);

        // Handle the response
        return response;
      } catch (error) {
        console.error("Error fetching tree data:", error);
        // Handle error appropriately
      } finally {
        // Always reset loading state
        setLoadingIndicator(false);
      }
    } else {
      // Reset loading if conditions not met
      setLoadingIndicator(false);
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSupporter(null);
    setReason("");
  };

  const handleSubmit = async () => {
    const formData = {
      restricted_user_nick_name_id: selectedSupporter?.nick_name_id,
      reason: reason,
    };

    try {
      setLoading(true);

      const liveId =
        (history as any)?.details?.liveCamp?.live_record_id ??
        (history as any)?.live_record_id;

      const res = await restrictSupporters(liveId, formData); // ✅ await here

      if (res?.message === "User restricted successfully") {
        message.success(res?.message);
        handleModalClose();
        getTreeApiCallback();
      } else {
        message.error(res?.message || "Failed to restrict user");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Layout
        className="topicDetailsPageLayout"
        rightSidebar={
          <Fragment>
            {openConsensusTreePopup ? (
              <div className="w-full sticky top-8 z-50">
                <CampStatementCard loadingIndicator={loadingIndicator} />
              </div>
            ) : null}
            {tree?.["1"]?.is_valid_as_of_time && (
              <div
                className={`w-full ${openConsensusTreePopup ? "hidden" : ""}`}
              >
                <div
                  className="support-tree-parent-box w-full mt-14 lg:mt-0"
                  id="topic_detail_section"
                >
                  {tree?.["1"]?.is_valid_as_of_time && (
                    <div
                      className="flex gap-1 items-center mb-4"
                      id="topic_detail_section_heading"
                    >
                      <SectionHeading
                        title="Support Tree"
                        infoContent=""
                        icon={null}
                        className="!mb-0 [&_span]:mr-1"
                      />
                      <Popover
                        id="topic_detail_section_heading_pop_over"
                        content={supportRelatedInfo}
                        className="title-popover"
                        placement="top"
                      >
                        <InfoCircleOutlined id="topic_detail_section_heading_info" />
                      </Popover>
                      <ScoreTag
                        topic_score={
                          campRecord?.is_archive
                            ? 0
                            : totalCampScoreForSupportTree
                        }
                        hideRank={tree && tree?.["1"]?.rank_hidden}
                      />
                    </div>
                  )}
                  {tree?.["1"]?.is_valid_as_of_time && (
                    <div
                      className={
                        tree && tree?.["1"]?.rank_hidden == true
                          ? "bg-canGray py-7 px-2.5 lg:px-6 rounded-lg"
                          : "bg-canGray py-7 px-2.5 lg:px-6 rounded-lg h-[400px] xl:h-[600px]"
                      }
                      id="topic_detail_section_heading_support_tree"
                    >
                      <div
                        className={
                          tree && tree?.["1"]?.rank_hidden == true
                            ? null
                            : "border border-canGrey2 bg-white rounded-lg lg:p-2 p-2.5 h-full"
                        }
                        id="topic_detail_section_heading_support_tree_1"
                      >
                        <SupportTreeCard
                          loadingIndicator={loadingIndicator}
                          isRemovingSupport={isRemovingSupport}
                          handleLoadMoreSupporters={handleLoadMoreSupporters}
                          getCheckSupportStatus={getCheckSupportStatus}
                          removeApiSupport={removeApiSupport}
                          totalSupportScore={totalSupportScore}
                          totalFullSupportScore={totalFullSupportScore}
                          removeSupport={removeSupport}
                          topicList={topicList}
                          removeSupportForDelegate={removeSupportForDelegate}
                          isSupportTreeCardModal={isSupportTreeCardModal}
                          setIsSupportTreeCardModal={setIsSupportTreeCardModal}
                          isDelegateSupportTreeCardModal={
                            isDelegateSupportTreeCardModal
                          }
                          setIsDelegateSupportTreeCardModal={
                            setIsDelegateSupportTreeCardModal
                          }
                          handleSupportTreeCardCancel={
                            handleSupportTreeCardCancel
                          }
                          removeSupportSpinner={removeSupportSpinner}
                          supportTreeForCamp={supportTreeForCamp}
                          totalCampScoreForSupportTree={
                            totalCampScoreForSupportTree
                          }
                          backGroundColorClass={backGroundColorClass}
                          getCheckStatusAPI={GetCheckStatusData}
                          GetActiveSupportTopic={GetActiveSupportTopic}
                          GetActiveSupportTopicList={GetActiveSupportTopicList}
                          setSupportTreeForCamp={setSupportTreeForCamp}
                          setTotalCampScoreForSupportTree={
                            setTotalCampScoreForSupportTree
                          }
                          handleSupporterClick={handleSupporterClick}
                          hideRank={tree && tree?.["1"]?.rank_hidden}
                        />
                      </div>
                      <GoogleAd />
                    </div>
                  )}
                </div>

                {tree?.["1"]?.is_valid_as_of_time && (
                  <div
                    className="my-14"
                    id="topic_detail_section_activity_card"
                  >
                    <ActivityNewsCard />
                  </div>
                )}
              </div>
            )}
          </Fragment>
        }
        afterHeader={
          <Fragment>
            {(tree && tree?.["1"]?.is_valid_as_of_time) ||
            asof === "default" ? (
              <CommanBreadcrumbs
                isTopicPage={true}
                payload={{
                  topic_num: +router?.query?.camp[0]?.split("-")[0],
                  camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
                }}
                getCheckSupportStatus={getCheckSupportStatus}
                setBreadCrumbBolean={setBreadCrumbBolean}
              />
            ) : (
              breadCrumbBolean && (
                <CommanBreadcrumbs
                  payload={{
                    topic_num: +router?.query?.camp[0]?.split("-")[0],
                    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
                  }}
                  isTopicHistoryPage={true}
                  getCheckSupportStatus={getCheckSupportStatus}
                  setBreadCrumbBolean={setBreadCrumbBolean}
                />
              )
            )}
            <InfoBar
              isTopicPage={true}
              payload={{
                topic_num: +router?.query?.camp[0]?.split("-")[0],
                camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
              }}
              isTopicHistoryPage={true}
              getCheckSupportStatus={getCheckSupportStatus}
            />
          </Fragment>
        }
      >
        <div className={styles.pageContent + " pageContentWrap"} id="printWrap">
          {openConsensusTreePopup ? (
            <div className="flex justify-between gap-3 items-start w-full h-full mb-6">
              <div className="bg-canGray py-7 px-5 rounded-lg w-full">
                <div className="border border-canGrey2 bg-white rounded-lg p-5 w-full">
                  <div className="consensu-tree-section">
                    <div className="flex justify-between items-start">
                      <SectionHeading
                        title="Consensus tree"
                        infoContent=""
                        icon={null}
                      />
                      <SecondaryButton
                        className="border-0 p-0 bg-transparent h-auto"
                        onClick={() =>
                          dispatch(setOpenConsensusTreePopup(false))
                        }
                      >
                        <CloseOutlined />
                      </SecondaryButton>
                    </div>
                  </div>
                  <Collapse
                    className="camp-accordion topic-d-accordion"
                    ghost
                    expandIconPosition="right"
                    defaultActiveKey={["0"]}
                  >
                    <Panel
                      header={
                        <>
                          Advanced Settings<br></br>{" "}
                          <Text className="block mt-1 text-xs text-[#777F93]">
                            {labels.cr_keywords_sp}
                          </Text>
                        </>
                      }
                      key="1"
                    >
                      <>
                        <p
                          className="text-sm  font-normal !text-canBlack"
                          id="topic_detail_section_collapse_camps_text"
                        >
                          Collapse camps with support less than
                        </p>

                        <Select
                          id="topic_detail_section_consesnus_tree_select_tag"
                          className="flex items-center [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:focus:!border-none !border !border-canGrey2 !shadow-none rounded-md !w-[200px] !mt-2.5 !mb-5 h-[40px]"
                          suffixIcon={
                            <Image
                              src="/images/select-caret.svg"
                              alt=""
                              height={7}
                              width={15}
                              preview={false}
                            />
                          }
                          value={`${treeExpandValue}`}
                          defaultValue={`${treeExpandValue}`}
                          onChange={handleChange}
                          options={scoreOptions}
                        />

                        <div
                          className={styles.scoreCheckbox}
                          id="topic_detail_section_consesnus_tree_full_score_checkbox"
                        >
                          <FullScoreCheckbox
                            loadingIndicator={loadingIndicator}
                            isDisabled={tree && tree?.["1"]?.rank_hidden}
                          />
                        </div>
                        <ArchivedCampCheckBox
                          loadingIndicator={loadingIndicator}
                          isDisabled={tree && tree?.["1"]?.rank_hidden}
                        />
                        <ScorePercentageCheckBox
                          loadingIndicator={loadingIndicator}
                          isDisabled={tree && tree?.["1"]?.rank_hidden}
                        />
                      </>
                    </Panel>
                  </Collapse>
                  <hr
                    className="border-1 my-7 border-canGrey2"
                    id="topic_detail_section_consesnus_tree_line_break"
                  />
                  {tree && tree?.["1"]?.rank_hidden === true && (
                    <Alert
                      type="warning"
                      showIcon
                      icon={
                        <i className="icon-warning !text-canRed text-[1.125rem]"></i>
                      }
                      message="To view support, add your direct support to the topic or delegate support to another user first."
                      className="bg-transparent border-0 font-medium text-canBlack p-0 mb-[1rem]"
                    />
                  )}
                  <CampTree
                    id="topic_detail_section_consesnus_tree_camp_tree"
                    scrollToCampStatement={scrollToCampStatement}
                    setTotalCampScoreForSupportTree={
                      setTotalCampScoreForSupportTree
                    }
                    setSupportTreeForCamp={setSupportTreeForCamp}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div
            className=""
            id="topic_detail_section_consesnus_tree_camp_disclaimer"
          >
            {tree?.["1"]?.is_valid_as_of_time && (
              <div
                className={`w-full ${openConsensusTreePopup ? "hidden" : ""}`}
              >
                <div
                  className={`w-full ${
                    openConsensusTreePopup ? "hidden" : "block"
                  }`}
                >
                  {isMobile && <CampDisclaimer />}

                  <CampStatementCard loadingIndicator={loadingIndicator} />
                </div>
                <Campforum />
                <SiblingCamps />
              </div>
            )}
          </div>

          {isClient && tree && !tree["1"]?.is_valid_as_of_time && (
            <div
              className="justify-center w-full flex text-right"
              id="topic_detail_section_consesnus_tree_no_camp_tree_img"
            >
              <div id="topic_detail_section_consesnus_tree_no_camp_tree_img_1">
                <Image
                  preview={false}
                  alt="No topic created"
                  src={"/images/empty-img-default.png"}
                  fallback={fallBackSrc}
                  width={200}
                  id="forgot-modal-img"
                />
                <p id="topic_detail_before_date">
                  The topic was created on{" "}
                  <AntLink
                    onClick={() => {
                      onCreateTreeDate();
                    }}
                  >
                    {
                      new Date((tree && tree["1"]?.created_date) * 1000)
                        .toISOString()
                        ?.split("T")[0]
                    }
                  </AntLink>
                </p>
              </div>
            </div>
          )}

          {((tree && tree["1"]?.is_valid_as_of_time) || asof == "default") &&
            campExist &&
            !campExist?.camp_exist && (
              <Alert
                className="alert-camp-created-on printHIde"
                message="The camp was first created on"
                type="info"
                description={
                  <AntLink
                    onClick={() => {
                      onCreateCampDate();
                    }}
                  >
                    {
                      new Date((campExist && campExist?.created_at) * 1000)
                        .toLocaleString()
                        ?.split(",")[0]
                    }
                  </AntLink>
                }
              />
            )}
        </div>
      </Layout>
      <BackTop className="printHIde" />
      <Modal
        title="Restrict User"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        confirmLoading={loading}
        okText="Restrict"
        cancelText="Cancel"
      >
        {selectedSupporter && (
          <div>
            <p className="mb-4">
              <strong>User:</strong> {selectedSupporter.nick_name}
            </p>
            <div>
              <label className="block mb-2 font-medium">
                Reason for restriction: <span className="text-red-500">*</span>
              </label>
              <Input.TextArea
                placeholder="Enter reason for restricting this user"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                maxLength={500}
                showCount
              />
            </div>
          </div>
        )}
      </Modal>
    </Fragment>
  );
};

export default TopicDetails;

