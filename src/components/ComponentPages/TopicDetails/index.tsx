import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  setFilterCanonizedTopics,
  setShowDrawer,
} from "../../../store/slices/filtersSlice";

import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  // getCanonizedCampSupportingTreeApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import { RootState } from "src/store";
import SideBar from "../Home/SideBar";
import CampStatementCard from "./CampStatementCard";
import CampInfoBar from "./CampInfoBar";
import styles from "./topicDetails.module.scss";
// import CampTreeCard from "./CampTreeCard";
import CurrentCampCard from "./CurrentCampCard";
import CurrentTopicCard from "./CurrentTopicCard";
import NewsFeedsCard from "./NewsFeedsCard";
import SupportTreeCard from "./SupportTreeCard";
import { BackTop, Typography, message, Alert, Row, Col, Image } from "antd";
import { Spin } from "antd";
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

import CampRecentActivities from "../Home/CampRecentActivities";

import {
  addSupport,
  removeSupportedCamps,
  removeSupportedCampsEntireTopic,
} from "src/network/api/userApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import InfoBar from "./CampInfoBar/infoBar";
import { fallBackSrc } from "src/assets/data-images";
import LatestFilter from "../LatestFilter";

const { Link: AntLink } = Typography;

const TopicDetails = ({ serverSideCall }: any) => {
  let myRefToCampStatement = useRef(null);
  const didMount = useRef(false);
  const { isUserAuthenticated } = isAuth();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);
  const [getCheckSupportStatus, setGetCheckSupportStatus] = useState({});
  const totalSupportScore = 0;
  const totalFullSupportScore = 0;
  const [topicList, setTopicList] = useState([]);
  const [isSupportTreeCardModal, setIsSupportTreeCardModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [isDelegateSupportTreeCardModal, setIsDelegateSupportTreeCardModal] =
    useState(false);
  const [removeSupportSpinner, setRemoveSupportSpinner] = useState(false);
  const [isRemovingSupport, setIsRemovingSupport] = useState(false);
  const [backGroundColorClass, setBackGroundColorClass] = useState("default");
  const [totalCampScoreForSupportTree, setTotalCampScoreForSupportTree] =
    useState<number>(null);
  const [supportTreeForCamp, setSupportTreeForCamp] = useState<number>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const showTreeSkeltonRef = useRef(false);
  const {
    algorithms,
    asof,
    asofdate,
    algorithm,
    newsFeed,
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
    asof: state?.filters?.filterObject?.asof,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
  }));
  const { is_camp_archive_checked,is_checked,includeReview,filteredScore,selectedAsOf} = useSelector(
    (state: RootState) => ({
      is_camp_archive_checked: state?.utils?.archived_checkbox,
      loading: state?.loading?.loading,
      is_checked: state?.utils?.score_checkbox,
      includeReview: state?.filters?.filterObject?.includeReview,
      filteredScore: state?.filters?.filterObject?.filterByScore,
      selectedAlgorithm: state?.filters?.filterObject?.algorithm,
      algorithms: state.homePage?.algorithms,
      selectedAsOf: state?.filters?.filterObject?.asof,
    })
  );
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
        const reqBodyForCampData = {
          topic_num: router?.query?.camp[0]?.split("-")[0],
          camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
          type: "all",
          per_page: 4,
          page: 1,
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
  }, [asofdate, algorithm, +(router?.query?.camp[1]?.split("-")[0] ?? 1)]);

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
    };
    setRemoveSupportSpinner(true);

    const res = await removeSupportedCamps(supportedCampsRemove);
    if (res && res.status_code == 200) {
      message.success(res.message);
      setIsSupportTreeCardModal(false);
      GetCheckStatusData();
      await getTreesApi(reqBodyForService);
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
    };
    setRemoveSupportSpinner(true);

    let res = await addSupport(RemoveSupportId);
    if (res && res.status_code == 200) {
      message.success(res.message);
      setIsSupportTreeCardModal(false);
      GetCheckStatusData();
      await getTreesApi(reqBodyForService);
      setRemoveSupportSpinner(false);
      setIsRemovingSupport(false);
    }
    setRemoveSupportSpinner(false);
  };
  const removeSupportForDelegate = async (reasonData = {}) => {
    setIsRemovingSupport(true);
    const removeEntireData = {
      topic_num: topicList[0].topic_num,
      nick_name_id: topicList[0].nick_name_id,
      delegated_nick_name_id: topicList[0].delegate_nick_name_id,
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
    setRemoveSupportSpinner(true);

    let res = await removeSupportedCampsEntireTopic(removeEntireData);
    if (res && res.status_code == 200) {
      message.success(res.message);
      setRemoveSupportSpinner(false);
      setIsSupportTreeCardModal(false);
      setIsDelegateSupportTreeCardModal(false);
      GetCheckStatusData();
      await getTreesApi(reqBodyForService);
      setIsRemovingSupport(false);
      setRemoveSupportSpinner(false);
    }
  };

  const GetCheckStatusData = async () => {
    let response = await GetCheckSupportExists(queryParams(reqBodyData));
    if (response && response.status_code === 200) {
      setGetCheckSupportStatus(response.data);
      //dispatch remove
      dispatch(setCurrentCheckSupportStatus(""));
      dispatch(setCheckSupportExistsData(""));
      //dispatch add Values data
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

  const setCurrentTopics = (data) => dispatch(setCurrentTopic(data));

  const onCreateCamp = () => {
    const data = {
      message: null,
      topic_num: topicRecord?.topic_num,
      topic_name: topicRecord?.topic_name,
      camp_name: topicRecord?.camp_name,
      parent_camp_num: topicRecord?.camp_num,
    };

    const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    const campName = campRecord?.camp_name?.replaceAll(" ", "-");

    router?.push({
      pathname: `/camp/create/${
        topicRecord?.topic_num
      }-${replaceSpecialCharacters(topicName, "-")}/${
        campRecord?.camp_num
      }-${replaceSpecialCharacters(campName, "-")}`,
    });

    setCurrentTopics(data);
  };

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

  const lable = algorithms?.find((obj) => {
    return obj.algorithm_key == selectedAlgorithm;
  });

  return (
    <Fragment>
      <div className={styles.topicDetailContentWrap}>
        <aside
          className={
            styles.miniSide +
            " topicPageNewLayoutSidebar leftSideBar miniSideBar printHIde"
          }
        >
          <SideBar
            onCreateCamp={onCreateCamp}
            getTreeLoadingIndicator={getTreeLoadingIndicator}
            scrollToCampStatement={scrollToCampStatement}
            setTotalCampScoreForSupportTree={setTotalCampScoreForSupportTree}
            setSupportTreeForCamp={setSupportTreeForCamp}
            backGroundColorClass={backGroundColorClass}
            loadingIndicator={loadingIndicator}
          />
        </aside>

        <div className={styles.pageContent + " pageContentWrap"} id="printWrap">
          {(tree && tree["1"]?.is_valid_as_of_time) || asof == "default" ? (
            <CampInfoBar
              isTopicPage={true}
              payload={{
                topic_num: +router?.query?.camp[0]?.split("-")[0],
                camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
              }}
              getCheckSupportStatus={getCheckSupportStatus}
            />
          ) : (
            <CampInfoBar
              payload={{
                topic_num: +router?.query?.camp[0]?.split("-")[0],
                camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
              }}
              isTopicHistoryPage={true}
              getCheckSupportStatus={getCheckSupportStatus}
            />
          )}
          <InfoBar
            onCreateCamp={onCreateCamp}
            isTopicPage={true}
            payload={{
              topic_num: +router?.query?.camp[0]?.split("-")[0],
              camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
            }}
            isTopicHistoryPage={true}
            getCheckSupportStatus={getCheckSupportStatus}
          />

          {isClient &&
            tree &&
            (!tree["1"]?.is_valid_as_of_time ||
              (tree["1"]?.is_valid_as_of_time &&
                !(
                  tree["1"]?.created_date <=
                  (asof == "default" || asof == "review"
                    ? Date.now() / 1000
                    : asofdate)
                ))) && (
              <div className={`printHIde ${styles.imageWrapper}`}>
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
                    <AntLink
                      onClick={() => {
                        onCreateTreeDate();
                      }}
                    >
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
            )}

          {((isClient &&
            tree &&
            tree["1"]?.is_valid_as_of_time &&
            tree["1"]?.created_date <=
              (asof == "default" || asof == "review"
                ? Date.now() / 1000
                : asofdate)) ||
            asof == "default") && (
            <Fragment>
              {campExist
                ? campExist?.camp_exist
                : true && (
                    <Fragment>

                      {(router.query.algo &&
                        selectedAlgorithm &&
                        lable?.algorithm_label !== undefined) ||
                      is_camp_archive_checked ||
                      is_checked ||
                      selectedAsOf == "bydate" ||
                      includeReview ||
                      router?.query?.asof === "review" ||
                      filteredScore != 0 ? (
                        <LatestFilter />
                      ) : (
                        ""
                      )}
                      <CampStatementCard
                        loadingIndicator={loadingIndicator}
                        backGroundColorClass={backGroundColorClass}
                      />

                      <SupportTreeCard
                        loadingIndicator={loadingIndicator}
                        isRemovingSupport={isRemovingSupport}
                        handleLoadMoreSupporters={handleLoadMoreSupporters}
                        getCheckSupportStatus={getCheckSupportStatus}
                        removeApiSupport={removeApiSupport}
                        // fetchTotalScore={fetchTotalScore}
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
                      />

                      <CurrentTopicCard
                        loadingIndicator={loadingIndicator}
                        backGroundColorClass={backGroundColorClass}
                      />

                      <CurrentCampCard
                        loadingIndicator={loadingIndicator}
                        backGroundColorClass={backGroundColorClass}
                      />

                      <Row
                        gutter={15}
                        className={`${styles.bottomRow} printHIde`}
                      >
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                          <CampRecentActivities />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                          <Spin
                            spinning={loadingIndicator}
                            size="large"
                            wrapperClassName="newfeedCardSpinner"
                          >
                            <NewsFeedsCard newsFeed={newsFeed} />
                          </Spin>
                        </Col>
                      </Row>
                    </Fragment>
                  )}
            </Fragment>
          )}

          {((tree &&
            tree["1"]?.is_valid_as_of_time &&
            tree["1"]?.created_date <=
              (asof == "default" || asof == "review"
                ? Date.now() / 1000
                : asofdate)) ||
            asof == "default") &&
            campExist &&
            !campExist?.camp_exist && (
              <Alert
                className="alert-camp-created-on printHIde"
                message="The camp was first created on"
                type="info"
                description={
                  <span>
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
                  </span>
                }
              />
            )}
        </div>
      </div>
      <BackTop className="printHIde" />
    </Fragment>
  );
};

export default TopicDetails;
