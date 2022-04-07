import { Typography } from "antd";
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
import { editNewsFeedApi } from "src/network/api/addupdateNewsApi";
import { RootState } from "src/store";
import SideBar from "../Home/SideBar";
import CampStatementCard from "./CampStatementCard";
import styles from "./topicDetails.module.scss";
import CampTreeCard from "./CampTreeCard";
import CurrentCampCard from "./CurrentCampCard";
import CurrentTopicCard from "./CurrentTopicCard";
import NewsFeedsCard from "./NewsFeedsCard";
import SupportTreeCard from "./SupportTreeCard";
import { BackTop } from "antd";
import { Spin } from "antd";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import useAuthentication from "src/hooks/isUserAuthenticated";

const TopicDetails = () => {
  const isLogin = useAuthentication();
  const didMount = useRef(false);
  let myRefToCampStatement = useRef(null);

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { asof, asofdate, algorithm, newsFeed, topicRecord, campRecord } =
    useSelector((state: RootState) => ({
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
      newsFeed: state?.topicDetails?.newsFeed,
      asof: state?.filters?.filterObject?.asof,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      campRecord: state?.topicDetails?.currentCampRecord,
    }));

  const [requestBody, setRequestBody] = useState({
    topic_num: topicRecord[0].topic_num,
    camp_num: topicRecord[0].camp_num,
  });
  const [feednews2, setfeednews2] = useState(null);
  console.log(
    " /comp/compPage/topicdetail/ind  requestBody =====> ",
    requestBody
  );
  useEffect(() => {
    async function getTreeApiCall() {
      let feed = await editNewsFeedApi(requestBody);

      setfeednews2(feed.data);
      console.log(
        "feed ",
        feed,
        topicRecord[0].topic_num,
        topicRecord[0].camp_num
      );
      if (didMount.current) {
        setGetTreeLoadingIndicator(true);
        const reqBody = {
          topic_num: +router.query.camp,
          asofdate: asofdate || Date.now() / 1000,
          algorithm: algorithm,
          update_all: 1,
        };
        await getTreesApi(reqBody);

        setGetTreeLoadingIndicator(false);
      } else didMount.current = true;
    }

    getTreeApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asofdate, algorithm]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    });
  };

  const scrollToCampStatement = () => {
    myRefToCampStatement.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMoreSupporters = async () => {
    const reqBody = { topic_num: 45, camp_num: 1 };
    await getCanonizedCampSupportingTreeApi(reqBody, true);
  };

  const getSelectedNode = async (nodeKey) => {
    setLoadingIndicator(true);
    const reqBody = {
      topic_num: +router.query.camp,
      camp_num: nodeKey,
      as_of: asof,
      as_of_date: asofdate,
    };
    console.log("reqBody of main ", reqBody);
    let { camp_num, topic_num } = reqBody;

    setRequestBody({ camp_num, topic_num });

    await Promise.all([
      getNewsFeedApi(reqBody),
      getCanonizedCampStatementApi(reqBody),
      getCurrentTopicRecordApi(reqBody),
      getCurrentCampRecordApi(reqBody),
      getCanonizedCampSupportingTreeApi(reqBody),
    ]);
    setLoadingIndicator(false);
  };

  const setCurrentTopics = (data) => dispatch(setCurrentTopic(data));

  const onCreateCamp = () => {
    const queryParams = router.query;

    const data = {
      message: null,
      topic_num: queryParams.camp[0],
      topic_name: topicRecord[0]?.topic_name,
      camp_name: topicRecord[0]?.camp_name,
      parent_camp_num: topicRecord[0]?.camp_num,
    };

    router.push({
      pathname: "/create-new-camp",
    });

    setCurrentTopics(data);
  };
  console.log("reqin /comp/compPage/topicdetail/ind tr =====>", topicRecord);
  console.log("reqin /comp/compPage/topicdetail/ind cr =====>", campRecord);
  console.log("reqin /comp/compPage/topicdetail/ind fn2 =====>", feednews2);
  console.log("reqin /comp/compPage/topicdetail/ind isLogin =====>", isLogin);
  console.log("--------------------------------------------------------------");
  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <div className={styles.breadcrumbWrapper}>
          <Typography.Paragraph className={"mb-0 " + styles.topicTitleStyle}>
            {" "}
            <span className="bold"> Topic: </span>
            {topicRecord?.length && topicRecord[0]?.topic_name}
          </Typography.Paragraph>
          <div className={styles.breadcrumbLinks}>
            {" "}
            <span className="bold mr-1"> Camp : </span>
            {campRecord?.length
              ? campRecord[0].parentCamps?.map((camp, index) => {
                  return (
                    <a
                      key={camp?.camp_num}
                      onClick={() => {
                        getSelectedNode(camp?.camp_num);
                      }}
                    >
                      {" "}
                      {index !== 0 && "/"}
                      {`${camp?.camp_name}`}
                    </a>
                  );
                })
              : null}
          </div>
        </div>

        <aside className="leftSideBar">
          <SideBar onCreateCamp={onCreateCamp} />
        </aside>

        <div className="pageContentWrap">
          {/* <CampTreeCard
            scrollToCampStatement={scrollToCampStatement}
            getSelectedNode={getSelectedNode}
            reqBody={requestBody}
          />
          <NewsFeedsCard newsFeed={newsFeed} reqBody={requestBody} />
          <CampStatementCard myRefToCampStatement={myRefToCampStatement} />
          <CurrentTopicCard />
          <CurrentCampCard />
          <SupportTreeCard
            handleLoadMoreSupporters={handleLoadMoreSupporters}
          /> */}
          <Spin spinning={getTreeLoadingIndicator} size="large">
            <CampTreeCard
              scrollToCampStatement={scrollToCampStatement}
              getSelectedNode={getSelectedNode}
              reqBody={requestBody}
              isLogin={isLogin}
            />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <NewsFeedsCard
              newsFeed={feednews2}
              reqBody={requestBody}
              isLogin={isLogin}
            />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <CampStatementCard myRefToCampStatement={myRefToCampStatement} />
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
