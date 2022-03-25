import { Typography, Breadcrumb } from "antd";
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

const TopicDetails = () => {
  const didMount = useRef(false);
  let myRefToCampStatement = useRef(null);
  const router = useRouter();
  const { asof, asofdate, algorithm, newsFeed } = useSelector(
    (state: RootState) => ({
      asofdate: state.homePage?.filterObject?.asofdate,
      algorithm: state.homePage?.filterObject?.algorithm,
      newsFeed: state?.topicDetails?.newsFeed,
      asof: state?.homePage?.filterObject?.asof,
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
      await getNewsFeedApi(reqBody);
      await getCanonizedCampStatementApi(campStatementReq);
      await getCanonizedCampSupportingTreeApi(reqBody);
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
    const campStatementReq = {
      topic_num: +router.query.camp,
      camp_num: nodeKey,
      as_of: asof,
      as_of_date: asofdate,
    };
    await getNewsFeedApi(req);
    await getCanonizedCampStatementApi(campStatementReq);
    await getCurrentTopicRecordApi(req);
    await getCurrentCampRecordApi(req);
  };

  return (
    <>
      <div className={styles.breadcrumbWrapper}>
        <Typography.Paragraph className={"mb-0 " + styles.topicTitleStyle}>
          {" "}
          <span className="bold"> Topic : </span> Theories of Consciousness{" "}
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
      <div className="pageWrapper">
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
        </div>
      </div>
    </>
  );
};

export default TopicDetails;
