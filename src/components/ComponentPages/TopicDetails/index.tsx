import { Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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

const TopicDetails = () => {
  const didMount = useRef(false);
  let myRefToCampStatement = useRef(null);
  const [requestBody, setRequestBody] = useState({
    topic_num: 45,
    camp_num: 1,
  });

  console.log("reqin /comp/compPage/topicdetail/ind =====> ", requestBody);
  const router = useRouter();
  const { asof, asofdate, algorithm, newsFeed, topicRecord, campRecord } =
    useSelector((state: RootState) => ({
      asofdate: state.homePage?.filterObject?.asofdate,
      algorithm: state.homePage?.filterObject?.algorithm,
      newsFeed: state?.topicDetails?.newsFeed,
      asof: state?.homePage?.filterObject?.asof,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      campRecord: state?.topicDetails?.currentCampRecord,
    }));
  useEffect(() => {
    async function getTreeApiCall() {
      if (didMount.current) {
        const reqBody = {
          topic_num: +router.query.camp,
          asofdate: asofdate || Date.now() / 1000,
          algorithm: algorithm,
          update_all: 1,
        };
        await getTreesApi(reqBody);
      } else didMount.current = true;
    }
    getTreeApiCall();
  }, [asofdate, algorithm]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    });
  };

  const reqBody = { topic_num: 45, camp_num: 1 };
  useEffect(() => {
    const campStatementReq = {
      topic_num: 45,
      camp_num: 1,
      // topic_num: +router.query.camp,
      // camp_num: "1",
      as_of: asof,
      as_of_date: asofdate,
    };
    async function getNewsFeedAndCampStatementApiCall() {
      await Promise.all([
        getNewsFeedApi(reqBody),
        getCanonizedCampStatementApi(campStatementReq),
        getCanonizedCampSupportingTreeApi(reqBody),
      ]);
    }
    getNewsFeedAndCampStatementApiCall();
  }, []);

  const scrollToCampStatement = () => {
    myRefToCampStatement.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMoreSupporters = async () => {
    await getCanonizedCampSupportingTreeApi(reqBody, true);
  };

  const getSelectedNode = async (nodeKey) => {
    const req = {
      topic_num: +router.query.camp,
      camp_num: nodeKey,
    };
    const campReq = {
      topic_num: +router.query.camp,
      camp_num: nodeKey,
      as_of: asof,
      as_of_date: asofdate,
    };
    await Promise.all([
      getNewsFeedApi(req),
      getCanonizedCampStatementApi(campReq),
      getCurrentTopicRecordApi(campReq),
      getCurrentCampRecordApi(campReq),
    ]);
  };

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
            {campRecord?.length &&
              campRecord[0].parentCamps?.map((camp, index) => {
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
              })}
          </div>
        </div>

        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>

        <div className="pageContentWrap">
          <CampTreeCard
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
          />

          <BackTop />
        </div>
      </div>
    </>
  );
};

export default TopicDetails;
