import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCanonizedCampSupportingTreeApi,
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
import { BackTop } from "antd";
import { Spin } from "antd";
import { setCurrentTopic } from "../../../store/slices/topicSlice";

import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";

const TopicDetails = () => {
  let myRefToCampStatement = useRef(null);

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);

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

  useEffect(() => {
    async function getTreeApiCall() {
      setGetTreeLoadingIndicator(true);
      setLoadingIndicator(true);
      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
        as_of: asof,
        asofdate:
          asof == ("default" || asof == "review")
            ? Date.now() / 1000
            : asofdate,
        algorithm: algorithm,
        update_all: 1,
      };
      await Promise.all([
        getTreesApi(reqBody),
        getNewsFeedApi(reqBody),
        getCanonizedCampStatementApi(reqBody),
        getCanonizedCampSupportingTreeApi(reqBody),
        getCanonizedAlgorithmsApi(),
      ]);
      setGetTreeLoadingIndicator(false);
      setLoadingIndicator(false);
    }
    getTreeApiCall();
  }, [asofdate, algorithm, +router?.query?.camp[1]?.split("-")[0]]);

  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMoreSupporters = async () => {
    const reqBody = { topic_num: 45, camp_num: 1 };
    await getCanonizedCampSupportingTreeApi(reqBody, true);
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

    const topicName = topicRecord?.topic_name.replaceAll(" ", "-");
    const campName = campRecord?.camp_name.replaceAll(" ", "-");

    router.push({
      pathname: `/camp/create/${topicRecord?.topic_num}-${topicName}/${campRecord?.camp_num}-${campName}`,
    });

    setCurrentTopics(data);
  };

  const onCampForumClick = () => {
    const topicName = topicRecord?.topic_name.replaceAll(" ", "-");
    const campName = campRecord?.camp_name.replaceAll(" ", "-");
    router.push({
      pathname: `/forum/${topicRecord?.topic_num}-${topicName}/${campRecord?.camp_num}-${campName}/threads`,
    });
  };

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <CampInfoBar payload={null} isTopicPage={true} />

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBar onCreateCamp={onCreateCamp} />
        </aside>

        <div className={styles.pageContent + " pageContentWrap"}>
          <Spin spinning={loadingIndicator} size="large">
            {newsFeed?.length != 0 && <NewsFeedsCard newsFeed={newsFeed} />}
          </Spin>
          <Spin spinning={getTreeLoadingIndicator} size="large">
            <CampTreeCard scrollToCampStatement={scrollToCampStatement} />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <CampStatementCard
              myRefToCampStatement={myRefToCampStatement}
              onCampForumClick={onCampForumClick}
            />
          </Spin>

          <Spin spinning={loadingIndicator} size="large">
            <CurrentTopicCard />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <CurrentCampCard />
          </Spin>

          <Spin spinning={loadingIndicator} size="large">
            <SupportTreeCard
              handleLoadMoreSupporters={handleLoadMoreSupporters}
            />
          </Spin>

          <BackTop />
        </div>
      </div>
    </>
  );
};

export default TopicDetails;
