import { Typography, Breadcrumb } from "antd";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCanonizedCampSupportingTreeApi,
} from "src/network/api/campDetailApi";
import { RootState } from "src/store";
import SideBar from "../Home/SideBar";
import CampStatementCard from "./CampStatementCard";
import styles from "./campTree.module.scss";
import CampTreeCard from "./CampTreeCard";
import CurrentCampCard from "./CurrentCampCard";
import CurrentTopicCard from "./CurrentTopicCard";
import NewsFeedsCard from "./NewsFeedsCard";
import SupportTreeCard from "./SupportTreeCard";

const TopicDetails = () => {
  const didMount = useRef(false);
  let myRefToCampStatement = useRef(null);
  const { asofdate, asof, algorithm, filterByScore, includeReview } =
    useSelector((state: RootState) => ({
      asofdate: state.homePage?.filterObject?.asofdate,
      asof: state.homePage?.filterObject?.asof,
      algorithm: state.homePage?.filterObject?.algorithm,
      filterByScore: state.homePage?.filterObject?.filterByScore,
      includeReview: state?.homePage?.filterObject?.includeReview,
    }));
  useEffect(() => {
    async function getTreeApiCall() {
      if (didMount.current) {
        const reqBody = {
          topic_num: 88,
          asofdate: 1644323333,
          algorithm: algorithm,
          update_all: 0,
        };
        const result = await getTreesApi(reqBody);
        debugger;
      } else didMount.current = true;
    }
    getTreeApiCall();
  }, [asofdate, algorithm]);

  const reqBody = {};
  useEffect(() => {
    async function getNewsFeedAndCampStatementApiCall() {
      await getNewsFeedApi(reqBody);
      await getCanonizedCampStatementApi(reqBody);
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
          <CampTreeCard scrollToCampStatement={scrollToCampStatement} />
          <NewsFeedsCard />
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
