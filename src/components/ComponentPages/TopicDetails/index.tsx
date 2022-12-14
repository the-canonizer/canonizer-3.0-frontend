import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setFilterCanonizedTopics } from "../../../store/slices/filtersSlice";
//  "../../../store/slices/filtersSlice";
import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCanonizedCampSupportingTreeApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import { fallBackSrc } from "src/assets/data-images";
import { RootState } from "src/store";
import SideBar from "../Home/SideBar";
import CampStatementCard from "./CampStatementCard";
import CampInfoBar from "./CampInfoBar";
import styles from "./topicDetails.module.scss";
import CampTreeCard from "./CampTreeCard";
import CurrentCampCard from "./CurrentCampCard";
import CurrentTopicCard from "./CurrentTopicCard";
import NewsFeedsCard from "./NewsFeedsCard";
import SupportTreeCard from "./SupportTreeCard";
import { BackTop, Image, Typography, message, Alert } from "antd";
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
const { Link } = Typography;
import {
  addSupport,
  removeSupportedCamps,
  removeSupportedCampsEntireTopic,
} from "src/network/api/userApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { SupportTreeTotalScore } from "src/network/api/campDetailApi";
// import SocialShareCard from "./SocialShareCard";

const TopicDetails = () => {
  let myRefToCampStatement = useRef(null);
  const { isUserAuthenticated } = isAuth();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);
  const [getCheckSupportStatus, setGetCheckSupportStatus] = useState({});
  const [totalSupportScore, setTotalSupportScore] = useState<number>(0);
  const [totalFullSupportScore, setTotalFullSupportScore] = useState<number>(0);
  const [topicList, setTopicList] = useState([]);
  const [isSupportTreeCardModal, setIsSupportTreeCardModal] = useState(false);
  const [removeSupportSpinner, setRemoveSupportSpinner] = useState(false);
  const [totalCampScoreForSupportTree, setTotalCampScoreForSupportTree] = useState<number>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    asof,
    asofdate,
    algorithm,
    newsFeed,
    topicRecord,
    campRecord,
    tree,
    campExist,
    viewThisVersionCheck,
  } = useSelector((state: RootState) => ({
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    newsFeed: state?.topicDetails?.newsFeed,
    asof: state?.filters?.filterObject?.asof,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
  }));

  const reqBody = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
    as_of: asof,
    as_of_date:
      asof == "default" || asof == "review"
        ? Date.now() / 1000
        : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
  };
  useEffect(() => {
    async function getTreeApiCall() {
      setGetTreeLoadingIndicator(true);
      setLoadingIndicator(true);
      const reqBodyForService = {
        topic_num: +router?.query?.camp[0]?.split("-")[0],
        camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
        asOf: asof,
        asofdate:
          asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
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
      const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);

      const body = { topic_num: topicNum };
      const reqBodyForCampData = {
        topic_num: +router?.query?.camp[0]?.split("-")[0],
        camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
        type: "all",
        per_page: 4,
        page: 1,
      };
      await Promise.all([
        getTreesApi(reqBodyForService),
        getNewsFeedApi(reqBody),
        getCurrentTopicRecordApi(reqBody),
        getCurrentCampRecordApi(reqBody),
        getCanonizedCampStatementApi(reqBody),
        dispatch(setCampSupportingTree({})),
        getCanonizedCampSupportingTreeApi(reqBody, algorithm),
        getHistoryApi(reqBodyForCampData, "1", "statement"),
        getCanonizedAlgorithmsApi(),
      ]);
      const reponse = await GetActiveSupportTopic(topicNum && body);
      if (reponse?.status_code == 200) {
        setTopicList(reponse?.data);
      }
      setGetTreeLoadingIndicator(false);
      setLoadingIndicator(false);
    }
    getTreeApiCall();
  }, [asofdate, algorithm, +(router?.query?.camp[1]?.split("-")[0] ?? 1)]);

  const reqBodyData = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
  };

  const removeApiSupport = async (supportedId) => {
    const supportedCampsRemove = {
      topic_num: reqBodyData.topic_num,
      remove_camps: [reqBodyData.camp_num],
      type: "direct",
      action: "all",
      nick_name_id: supportedId,
      order_update: [],
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
      getCanonizedCampSupportingTreeApi(reqBody, algorithm);
      getTreesApi(reqBodyForService);
      // fetchTotalScore();
    }
  };
  const removeSupport = async (supportedId) => {
    const RemoveSupportId = {
      topic_num: reqBodyData.topic_num,
      add_camp: {},
      remove_camps: [reqBodyData.camp_num],
      type: "direct",
      action: "partial",
      nick_name_id: supportedId,
      order_update: [],
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
      getCanonizedCampSupportingTreeApi(reqBody, algorithm);
      getTreesApi(reqBodyForService);
      // fetchTotalScore();
    }
  };
  const removeSupportForDelegate = async () => {
    const removeEntireData = {
      topic_num: topicList[0].topic_num,
      nick_name_id: topicList[0].nick_name_id,
      delegated_nick_name_id: topicList[0].delegate_nick_name_id,
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
      setIsSupportTreeCardModal(false);
      GetCheckStatusData();
      getCanonizedCampSupportingTreeApi(reqBody, algorithm);
      getTreesApi(reqBodyForService);
      // fetchTotalScore();
    }
  };

  const totalScoreData = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
    asOf: asof,
    asofdate:
      asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
    algorithm: algorithm,
  };

  // const fetchTotalScore = async () => {
  //   const CampTotalScore = {
  //     topic_num: totalScoreData.topic_num,
  //     camp_num: totalScoreData.camp_num,
  //     asOf: totalScoreData.asOf,
  //     asofdate: totalScoreData.asofdate,
  //     algorithm: totalScoreData.algorithm,
  //   };
  //   let response = await SupportTreeTotalScore(CampTotalScore);
  //   if (response && response.status_code == 200) {
  //     setTotalSupportScore(response.data.score);
  //     setTotalFullSupportScore(response.data.full_score);
  //   }
  // };

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
      // dispatch(setManageSupportStatusCheck(true));
    }
  };
  const handleSupportTreeCardCancel = () => {
    setIsSupportTreeCardModal(false);
  };
  useEffect(() => {
    if (isUserAuthenticated) {
      GetCheckStatusData();
    }
    // fetchTotalScore();
  }, [isUserAuthenticated, router, algorithm]);

  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMoreSupporters = async () => {
    const reqBody = { topic_num: 45, camp_num: 1 };
    await getCanonizedCampSupportingTreeApi(reqBody, algorithm, true);
  };

  const setCurrentTopics = (data) => dispatch(setCurrentTopic(data));

  const onCreateCamp = () => {
    // const queryParams = router.query;

    const data = {
      message: null,
      topic_num: topicRecord?.topic_num,
      topic_name: topicRecord?.topic_name,
      camp_name: topicRecord?.camp_name,
      parent_camp_num: topicRecord?.camp_num,
    };

    const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    const campName = campRecord?.camp_name?.replaceAll(" ", "-");

    router.push({
      pathname: `/camp/create/${
        topicRecord?.topic_num
      }-${replaceSpecialCharacters(topicName, "-")}/${
        campRecord?.camp_num
      }-${replaceSpecialCharacters(campName, "-")}`,
    });

    setCurrentTopics(data);
  };

  const onCampForumClick = async () => {
    const topicName = await topicRecord?.topic_name?.replaceAll(" ", "-"),
      topicNum = topicRecord?.topic_num,
      campName = await campRecord?.camp_name?.replaceAll(" ", "-"),
      campNum = campRecord?.camp_num;

    if (topicName && topicNum && campName && campNum) {
      router.push({
        pathname: `/forum/${topicNum}-${replaceSpecialCharacters(
          topicName,
          "-"
        )}/${campNum}-${replaceSpecialCharacters(campName, "-")}/threads`,
      });
    }
  };

  const onCreateTreeDate = () => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate: tree["1"]?.created_date,
        asof: "bydate",
      })
    );
  };
  const onCreateCampDate = () => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate: campExist?.created_at,
        asof: "bydate",
      })
    );
  };

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
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

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBar onCreateCamp={onCreateCamp} />
        </aside>
        {((tree && tree["1"]?.is_valid_as_of_time) || asof == "default") && (
          <>
            <div className={styles.pageContent + " pageContentWrap"}>
              <Spin spinning={getTreeLoadingIndicator} size="large">
                <CampTreeCard scrollToCampStatement={scrollToCampStatement} setTotalCampScoreForSupportTree={setTotalCampScoreForSupportTree} />
              </Spin>
              {campExist && !campExist?.camp_exist && (
                <Spin spinning={loadingIndicator} size="large">
                  <>
                    <Alert
                      className="alert-camp-created-on"
                      message="The camp was first created on"
                      type="info"
                      description={
                        <span>
                          <Link
                            onClick={() => {
                              onCreateCampDate();
                            }}
                          >
                            {" "}
                            {new Date(
                              (campExist && campExist?.created_at) * 1000
                            ).toLocaleString()}
                          </Link>
                        </span>
                      }
                    />
                  </>
                </Spin>
              )}
              {campExist
                ? campExist?.camp_exist
                : true && (
                    <>
                      <Spin spinning={loadingIndicator} size="large">
                        <CampStatementCard />
                      </Spin>
                      {typeof window !== "undefined" &&
                        window.innerWidth < 767 && (
                          <>
                            {router.asPath.includes("topic") && (
                              <CampRecentActivities />
                            )}
                            <Spin spinning={loadingIndicator} size="large">
                              {!!newsFeed?.length && (
                                <NewsFeedsCard newsFeed={newsFeed} />
                              )}
                            </Spin>
                          </>
                        )}
                      <Spin spinning={loadingIndicator} size="large">
                        <CurrentTopicCard />
                      </Spin>
                      <Spin spinning={loadingIndicator} size="large">
                        <CurrentCampCard />
                      </Spin>

                      <Spin spinning={loadingIndicator} size="large">
                        <SupportTreeCard
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
                          handleSupportTreeCardCancel={
                            handleSupportTreeCardCancel
                          }
                          removeSupportSpinner={removeSupportSpinner}
                          totalCampScoreForSupportTree={totalCampScoreForSupportTree}
                        />
                      </Spin>

                      {/* <Spin spinning={loadingIndicator} size="large">
                        <SocialShareCard />
                      </Spin> */}
                    </>
                  )}
            </div>
          </>
        )}
        {tree && !tree["1"]?.is_valid_as_of_time && (
          // {tree && !tree["1"]?.is_valid_as_of_time &&
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
                <Link
                  onClick={() => {
                    onCreateTreeDate();
                  }}
                >
                  {" "}
                  {new Date(
                    (tree && tree["1"]?.created_date) * 1000
                  ).toLocaleString()}
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
