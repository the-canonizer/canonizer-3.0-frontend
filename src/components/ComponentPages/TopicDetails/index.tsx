import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";

import {
  setFilterCanonizedTopics,
  setShowDrawer,
} from "../../../store/slices/filtersSlice";

import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
  getTopicActivityLogApi,
} from "src/network/api/campDetailApi";
import { RootState, store } from "src/store";
import styles from "./topicDetails.module.scss";
import TabbedView from "./TabbedView";
import { Typography, message, Alert, Image, Select } from "antd";
import { BackTop } from "antd";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import moment from "moment";
import {
  GetActiveSupportTopic,
  GetCheckSupportExists,
} from "src/network/api/topicAPI";
import queryParams from "src/utils/queryParams";
import isAuth from "../../../hooks/isUserAuthenticated";
import {
  setCampSupportingTree,
  setCheckSupportExistsData,
  setCurrentCheckSupportStatus,
} from "src/store/slices/campDetailSlice";

import { getHistoryApi } from "../../../network/api/history";

import {
  addSupport,
  removeSupportedCamps,
  removeSupportedCampsEntireTopic,
} from "src/network/api/userApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { setCampActivityData } from "src/store/slices/recentActivitiesSlice";
import LatestFilter from "../LatestFilter";
import { fallBackSrc } from "src/assets/data-images";
import FirstVisitBanner from "./FirstVisitBanner";

const { Link: AntLink } = Typography;

const TopicDetails = ({ serverSideCall }: any) => {
  let myRefToCampStatement = useRef(null);
  const didMount = useRef(false);
  const { isUserAuthenticated } = isAuth();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);
  const [getCheckSupportStatus, setGetCheckSupportStatus] = useState({});
  const [topicList, setTopicList] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [backGroundColorClass, setBackGroundColorClass] = useState("default");

  const router = useRouter();
  const dispatch = useDispatch();
  const showTreeSkeltonRef = useRef(false);
  const {
    algorithms,
    asof,
    asofdate,
    algorithm,
    newsFeed,
    campStatement,
    topicRecord,
    campRecord,
    tree,
    campExist,
    viewThisVersionCheck,
    selectedAlgorithm,
  } = useSelector((state: RootState) => ({
    algorithms: state.homePage?.algorithms,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    newsFeed: state?.topicDetails?.newsFeed,
    campStatement: state?.topicDetails?.campStatement,
    asof: state?.filters?.filterObject?.asof,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
  }));
  const {
    is_camp_archive_checked,
    is_checked,
    includeReview,
    filteredScore,
    selectedAsOf,
  } = useSelector((state: RootState) => ({
    is_camp_archive_checked: state?.utils?.archived_checkbox,
    loading: state?.loading?.loading,
    is_checked: state?.utils?.score_checkbox,
    includeReview: state?.filters?.filterObject?.includeReview,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    algorithms: state.homePage?.algorithms,
    selectedAsOf: state?.filters?.filterObject?.asof,
  }));

  const GetActiveSupportTopicList = async () => {
    const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };
    if (isUserAuthenticated) {
      const reponse = await GetActiveSupportTopic(topicNum && body);
      if (reponse?.status_code == 200) {
        setTopicList(reponse?.data);
      }
    }
    setGetTreeLoadingIndicator(false);
    setLoadingIndicator(false);
  };

  async function getTopicActivityLogCall() {
    let reqBody = {
      topic_num: router?.query?.camp[0]?.split("-")[0],
      camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
    };
    let res = await getTopicActivityLogApi(reqBody);
    store.dispatch(setCampActivityData(res?.data?.items));
  }

  useEffect(() => {
    async function getTreeApiCall() {
      if (!showTreeSkeltonRef) {
        setGetTreeLoadingIndicator(true);
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
        };
        const reqBody = {
          topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
          camp_num: +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
          as_of: asof,
          as_of_date:
            asof == "default" || asof == "review"
              ? Date.now() / 1000
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
  }, [asofdate, algorithm, +(router?.query?.camp[1]?.split("-")[0] ?? 1) || router]);

  const reqBodyData = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
  };

  const removeApiSupport = async (supportedId, reasonData = {}) => {
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
    };
    let reqBody = {
      as_of: asof,
      as_of_date: asofdate,
      topic_num: +router?.query?.camp[0]?.split("-")[0],
      camp_num: +router?.query?.camp[1]?.split("-")[0],
    };

    const res = await removeSupportedCamps(supportedCampsRemove);
    if (res && res.status_code == 200) {
      message.success(res.message);
      GetCheckStatusData();
      await getTreesApi(reqBodyForService);
      getTopicActivityLogCall();
      await getCurrentCampRecordApi(reqBody);
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

  // Get camp count from tree
  const getCampCount = () => {
    if (!tree) return 0;
    const flattenCount = (data: any): number => {
      if (!data) return 0;
      let count = 0;
      Object.keys(data).forEach((key) => {
        count++;
        if (data[key]?.children) {
          count += flattenCount(data[key].children);
        }
      });
      return count;
    };
    return flattenCount(tree);
  };

  const topicName =
    topicRecord?.topic_name || router?.query?.camp?.[0]?.split("-")?.slice(1)?.join(" ") || "";
  const campName = campRecord?.camp_name || "Agreement";

  return (
    <Fragment>
      <FirstVisitBanner />
      <div className={styles.page}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">
            <a>Home</a>
          </Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <Link href="/browse">
            <a>Explore</a>
          </Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span>{topicName}</span>
        </div>

        {/* Main content */}
        <div className={styles.main}>
          {/* Topic Header */}
          <div className={styles.topicHeader}>
            <div className={styles.topicLabel}>Topic</div>
            <h1 className={styles.topicTitle}>{topicName}</h1>
            <div className={styles.topicMeta}>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {getCampCount()} participants
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {getCampCount()} positions
              </span>
            </div>
          </div>

          {/* Statement Card */}
          {isClient && tree && tree["1"]?.is_valid_as_of_time === false && asof !== "default" ? (
            <div className={styles.imageWrapper}>
              <div>
                <Image
                  preview={false}
                  alt="No topic created"
                  src={"/images/empty-img-default.png"}
                  fallback={fallBackSrc}
                  width={200}
                  id="forgot-modal-img"
                />
                <p>
                  The topic was created on
                  <AntLink onClick={onCreateTreeDate}>
                    {" "}
                    {
                      new Date((tree && tree["1"]?.created_date) * 1000)
                        .toLocaleString()
                        ?.split(",")[0]
                    }
                  </AntLink>
                </p>
              </div>
            </div>
          ) : (
            <Fragment>
              <div className={styles.statementCard} ref={myRefToCampStatement}>
                <div className={styles.statementTop}>
                  <div className={styles.statementLabel}>
                    Statement
                    <span className={styles.viewingBadge}>{campName}</span>
                  </div>
                  <div className={styles.statementActions}>
                    <button className={styles.btnIcon} title="Share">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                    </button>
                    <button className={styles.btnIcon} title="Suggest Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {campStatement && campStatement[0]?.parsed_value ? (
                  <div
                    className={styles.statementBody}
                    dangerouslySetInnerHTML={{
                      __html: campStatement[0].parsed_value,
                    }}
                  />
                ) : (
                  <p className={styles.noStatement}>
                    No camp statement has been submitted yet.
                  </p>
                )}
                {campStatement && campStatement[0]?.submit_time && (
                  <div className={styles.statementFooter}>
                    Last updated{" "}
                    {new Date(campStatement[0].submit_time * 1000).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </div>
                )}
              </div>

              {/* Tabbed View */}
              <TabbedView
                campStatement={campStatement}
                campRecord={campRecord}
                tree={tree}
                topicName={topicName}
                getTreeLoadingIndicator={getTreeLoadingIndicator}
                scrollToCampStatement={scrollToCampStatement}
                backGroundColorClass={backGroundColorClass}
              />
            </Fragment>
          )}

          {/* Camp doesn't exist alert */}
          {((tree && tree["1"]?.is_valid_as_of_time) || asof == "default") &&
            campExist &&
            !campExist?.camp_exist && (
              <Alert
                className="alert-camp-created-on printHIde"
                message="The camp was first created on"
                type="info"
                description={
                  <span>
                    <AntLink onClick={onCreateCampDate}>
                      {
                        new Date((campExist && campExist?.created_at) * 1000)
                          .toLocaleString()
                          ?.split(",")[0]
                      }
                    </AntLink>
                  </span>
                }
              />
            )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Community Response */}
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>Community Response</div>
            <div className={styles.participationSummary}>
              <div className={styles.participationRow}>
                <div className={`${styles.participationIcon} ${styles.piAgree}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </div>
                <span className={styles.participationLabel}>Support</span>
                <span className={styles.participationNum}>
                  {tree ? Math.round(tree["1"]?.score || 0) : 0}
                </span>
              </div>
              <div className={styles.participationRow}>
                <div className={`${styles.participationIcon} ${styles.piPartial}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <span className={styles.participationLabel}>Almost there</span>
                <span className={styles.participationNum}>-</span>
              </div>
              <div className={styles.participationRow}>
                <div className={`${styles.participationIcon} ${styles.piDisagree}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                    <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                  </svg>
                </div>
                <span className={styles.participationLabel}>Disagree</span>
                <span className={styles.participationNum}>-</span>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className={styles.sidebarCard}>
            <button
              className={`${styles.advancedToggle} ${advancedOpen ? styles.open : ""}`}
              onClick={() => setAdvancedOpen(!advancedOpen)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Advanced Settings
            </button>
            {advancedOpen && (
              <div className={styles.advancedPanel}>
                <div className={styles.advancedRow}>
                  <label>Algorithm</label>
                  <Select
                    size="small"
                    value={algorithm}
                    style={{ width: 140, fontSize: "0.75rem" }}
                    onChange={(val) =>
                      dispatch(setFilterCanonizedTopics({ algorithm: val }))
                    }
                  >
                    {algorithms?.map((a: any) => (
                      <Select.Option key={a.algorithm_key} value={a.algorithm_key}>
                        {a.algorithm_label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className={styles.advancedRow}>
                  <label>As Of</label>
                  <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                    {asof === "default" ? "Current" : asof}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* What is Canonizer */}
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarTitle}>What is Canonizer?</div>
            <p className={styles.explainer}>
              <strong>Canonizer</strong> is where people find common ground.
              Topics pose questions. <strong>Positions</strong> represent
              answers. You respond — support, suggest changes, or offer
              alternatives — and AI helps find where everyone agrees.
            </p>
          </div>
        </div>
      </div>
      <BackTop className="printHIde" />
    </Fragment>
  );
};

export default TopicDetails;
