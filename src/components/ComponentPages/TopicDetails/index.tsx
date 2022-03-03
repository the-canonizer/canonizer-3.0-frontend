import {  Typography, Breadcrumb   } from "antd";
import SideBar from "../Home/SideBar";
import CampStatementCard from "./CampStatementCard";
import styles from './campTree.module.scss';
import CampTreeCard from './CampTreeCard'
import CurrentCampCard from "./CurrentCampCard";
import CurrentTopicCard from "./CurrentTopicCard";
import NewsFeedsCard from "./NewsFeedsCard";
import SupportTreeCard from "./SupportTreeCard";



const TopicDetails = (props) => {
  return (
    <>
       <div className={styles.breadcrumbWrapper}>
            <Typography.Paragraph className={"mb-0 " + styles.topicTitleStyle}> <span className="bold"> Topic : </span>  Theories of Consciousness </Typography.Paragraph>
            <div className={styles.breadcrumbLinks}> <span className="bold mr-1"> Camp :  </span>
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
              <CampTreeCard />
              <NewsFeedsCard />
              <CampStatementCard />
              <CurrentTopicCard />
              <CurrentCampCard />
              <SupportTreeCard />
            </div>
        </div>
 
    </>
  );
};

export default TopicDetails;
