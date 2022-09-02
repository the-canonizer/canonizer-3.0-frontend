import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCanonizedCampSupportingTreeApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import { RootState } from "src/store";
import SideBar from "../Home/SideBar";
import CampStatementCard from "./CampStatementCard";
import CampInfoBar from "./CampInfoBar";
import K from "../../../constants";
import styles from "./topicDetails.module.scss";
import CampTreeCard from "./CampTreeCard";
import CurrentCampCard from "./CurrentCampCard";
import CurrentTopicCard from "./CurrentTopicCard";
import NewsFeedsCard from "./NewsFeedsCard";
import SupportTreeCard from "./SupportTreeCard";
import { BackTop, message } from "antd";
import { Spin } from "antd";
import { setCurrentTopic } from "../../../store/slices/topicSlice";

import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import moment from "moment";
import { GetCheckSupportExists } from "src/network/api/topicAPI";
import queryParams from "src/utils/queryParams";
import isAuth from "../../../hooks/isUserAuthenticated";
import {
  setCheckSupportExistsData,
  setCurrentCheckSupportStatus,
  setManageSupportStatusCheck,
} from "src/store/slices/campDetailSlice";

import CampRecentActivities from "../Home/CampRecentActivities";
import { addSupport, getNickNameList } from "src/network/api/userApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { SupportTreeTotalScore } from "src/network/api/campDetailApi";

const TopicDetails = () => {
  let myRefToCampStatement = useRef(null);
  const isLogin = isAuth();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);
  const [getCheckSupportStatus, setGetCheckSupportStatus] = useState({});
  const [totalSupportScore, setTotalSupportScore] = useState<number>(0);

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    asof,
    asofdate,
    algorithm,
    newsFeed,
    topicRecord,
    campRecord,
    campStatement,
  } = useSelector((state: RootState) => ({
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    newsFeed: state?.topicDetails?.newsFeed,
    asof: state?.filters?.filterObject?.asof,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    campStatement: state?.topicDetails?.campStatement,
  }));

  const reqBody = {
    topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
    camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
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
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
        asOf: asof,
        asofdate:
          asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
        algorithm: algorithm,
        update_all: 1,
      };

      await Promise.all([
        getTreesApi(reqBodyForService),
        getNewsFeedApi(reqBody),
        getCurrentTopicRecordApi(reqBody),
        getCurrentCampRecordApi(reqBody),
        getCanonizedCampStatementApi(reqBody),
        getCanonizedCampSupportingTreeApi(reqBody, algorithm),
        getCanonizedAlgorithmsApi(),
      ]);
      setGetTreeLoadingIndicator(false);
      setLoadingIndicator(false);
    }
    getTreeApiCall();
  }, [asofdate, algorithm, +router?.query?.camp[1]?.split("-")[0]]);
  const reqBodyData = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +router?.query?.camp[1]?.split("-")[0],
  };

  const removeSupport = async (supportedId) => {
    const RemoveSupportId = {
      topic_num: reqBodyData.topic_num,
      add_camp: {},
      remove_camps: [reqBodyData.camp_num],
      type: "direct",
      action: "add",
      nick_name_id: supportedId,
      order_update: [],
    };
    let res = await addSupport(RemoveSupportId);
    console.log(res, "res");
    if (res && res.status_code == 200) {
      message.success(res.message);
      GetCheckStatusData();
      getCanonizedCampSupportingTreeApi(reqBody, algorithm);
    }
  };

  const totalScoreData = {
    topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
    camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
    asOf: asof,
    asofdate:
      asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
    algorithm: algorithm,
  };
  const fetchTotalScore = async () => {
    const CampTotalScore = {
      topic_num: totalScoreData.topic_num,
      camp_num: totalScoreData.camp_num,
      asOf: totalScoreData.asOf,
      asofdate: totalScoreData.asofdate,
      algorithm: totalScoreData.algorithm,
    };
    let response = await SupportTreeTotalScore(CampTotalScore);
    if (response && response.status_code == 200) {
      setTotalSupportScore(response.data.score);
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
      // dispatch(setManageSupportStatusCheck(true));
    }
  };

  useEffect(() => {
    if (isLogin) {
      GetCheckStatusData();
      fetchTotalScore();
    }
  }, [isLogin, router]);

  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMoreSupporters = async () => {
    const reqBody = { topic_num: 45, camp_num: 1 };
    await getCanonizedCampSupportingTreeApi(reqBody, algorithm, true);
  };

  const setCurrentTopics = (data) => dispatch(setCurrentTopic(data));

  const onCreateCamp = () => {
    const queryParams = router.query;

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

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <CampInfoBar
          isTopicPage={true}
          getCheckSupportStatus={getCheckSupportStatus}
        />

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBar onCreateCamp={onCreateCamp} />
        </aside>

        <div className={styles.pageContent + " pageContentWrap"}>
          <Spin spinning={getTreeLoadingIndicator} size="large">
            <CampTreeCard scrollToCampStatement={scrollToCampStatement} />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <CampStatementCard
              myRefToCampStatement={myRefToCampStatement}
              onCampForumClick={onCampForumClick}
            />
          </Spin>
          {typeof window !== "undefined" && window.innerWidth < 767 && (
            <>
              {router.asPath.includes("topic") && <CampRecentActivities />}
              <Spin spinning={loadingIndicator} size="large">
                {!!newsFeed?.length && <NewsFeedsCard newsFeed={newsFeed} />}
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
              removeSupport={removeSupport}
              fetchTotalScore={fetchTotalScore}
              totalSupportScore={totalSupportScore}
            />
          </Spin>
        </div>
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
