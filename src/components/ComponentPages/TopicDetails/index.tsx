import { Typography, Breadcrumb, Button } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
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
  const router = useRouter();
  const { asof, asofdate, algorithm, newsFeed, topicRecord } = useSelector(
    (state: RootState) => ({
      asofdate: state.homePage?.filterObject?.asofdate,
      algorithm: state.homePage?.filterObject?.algorithm,
      newsFeed: state?.topicDetails?.newsFeed,
      asof: state?.homePage?.filterObject?.asof,
      topicRecord: state?.topicDetails?.currentTopicRecord,
    })
  );
  useEffect(() => {
    async function getTreeApiCall() {
      if (didMount.current) {
        const reqBody = {
          topic_num: 88,
          asofdate: 1644323333,
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
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href=""> Agreement </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href=""> Approachable Via Science </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href=""> Representational Qualia </a>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <aside className="leftSideBar miniSideBar">
          <SideBar />
        </aside>

        <div className="pageContentWrap">
          <CampTreeCard
            scrollToCampStatement={scrollToCampStatement}
            getSelectedNode={getSelectedNode}
          />
          <NewsFeedsCard newsFeed={newsFeed} />
          <CampStatementCard myRefToCampStatement={myRefToCampStatement} />
          <CurrentTopicCard />
          <CurrentCampCard />
          <SupportTreeCard
            handleLoadMoreSupporters={handleLoadMoreSupporters}
          />
          {/* <Button
            onClick={() => {
              scrollToTop();
            }}
          >
            Scroll to top
          </Button> */}
          <BackTop />
        </div>
      </div>
    </>
  );
};

export default TopicDetails;
