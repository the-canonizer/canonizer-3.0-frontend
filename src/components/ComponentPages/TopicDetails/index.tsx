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
import { RootState } from "src/store";
import SideBar from "../Home/SideBar";
import CampStatementCard from "./CampStatementCard";
import styles from "./topicDetails.module.scss";
import CampTreeCard from "./CampTreeCard";
import CurrentCampCard from "./CurrentCampCard";
import CurrentTopicCard from "./CurrentTopicCard";
import NewsFeedsCard from "./NewsFeedsCard";
import SupportTreeCard from "./SupportTreeCard";
import { BackTop, Dropdown, Menu, Button } from "antd";
import { Spin } from "antd";
import { setCurrentTopic } from "../../../store/slices/topicSlice";

import useAuthentication from "../../../../src/hooks/isUserAuthenticated";
import {
  MoreOutlined,
  FileTextOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";

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

  useEffect(() => {
    async function getTreeApiCall() {
      setGetTreeLoadingIndicator(true);
      setLoadingIndicator(true);
      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
        as_of: asof,
        asofdate: asofdate || Date.now() / 1000,
        algorithm: algorithm,
        update_all: 1,
      };

      await Promise.all([
        getTreesApi(reqBody),
        getNewsFeedApi(reqBody),
        getCanonizedCampStatementApi(reqBody),
        getCurrentTopicRecordApi(reqBody),
        getCurrentCampRecordApi(reqBody),
        getCanonizedCampSupportingTreeApi(reqBody),
        getCanonizedAlgorithmsApi(),
      ]);
      setGetTreeLoadingIndicator(false);
      setLoadingIndicator(false);
    }
    getTreeApiCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asofdate, algorithm, +router?.query?.camp[1]?.split("-")[0]]);

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
      topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
      camp_num: nodeKey,
      as_of: asof,
      as_of_date: asofdate,
    };

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
      topic_num: topicRecord[0]?.topic_num,
      topic_name: topicRecord[0]?.topic_name,
      camp_name: topicRecord[0]?.camp_name,
      parent_camp_num: topicRecord[0]?.camp_num,
    };

    const topicName = topicRecord[0]?.topic_name.replaceAll(" ", "-");
    const campName = campRecord[0]?.parentCamps[0]?.camp_name.replaceAll(
      " ",
      "-"
    );

    router.push({
      pathname: `/camp/create/${topicRecord[0]?.topic_num}-${topicName}/${campRecord[0]?.camp_num}-${campName}`,
    });

    setCurrentTopics(data);
  };

  const onCampForumClick = () => {
    const topicName = topicRecord[0]?.topic_name.replaceAll(" ", "-");
    const campName = campRecord[0]?.parentCamps[0]?.camp_name.replaceAll(
      " ",
      "-"
    );

    router.push({
      pathname: `/forum/${topicRecord[0]?.topic_num}-${topicName}/${campRecord[0]?.camp_num}-${campName}/threads`,
    });
  };
  const campForumDropdownMenu = (
    <Menu className={styles.campForumDropdownMenu}>
      <Menu.Item key="0" icon={<i className="icon-newspaper"></i>}>
        <Link
          href={isLogin ? router.asPath.replace("topic", "addnews") : "/login"}
        >
          <a rel="noopener noreferrer" href="/add-news">
            Add News
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item icon={<i className="icon-subscribe"></i>}>
        Subscribe to Entire Topic
      </Menu.Item>
      <Menu.Item icon={<i className="icon-subscribe"></i>}>
        Subscribe to the Camp
      </Menu.Item>
      <Menu.Item icon={<HeartOutlined />}>Directly Join and Support </Menu.Item>
      <Menu.Item icon={<i className="icon-camp"></i>}>
        Manage/Edit the Camp
      </Menu.Item>
      <Menu.Item icon={<i className="icon-topic"></i>}>
        Manage/Edit the Topic
      </Menu.Item>
      <Menu.Item icon={<FileTextOutlined />}>
        Manage/Edit Camp Statement{" "}
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        <div className={styles.topicDetailContentHead}>
          <div className={styles.topicDetailContentHead_Left}>
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
                      <Link
                        href={`${router.query.camp.at(0)}/${
                          camp?.camp_num
                        }-${camp?.camp_name?.split(" ").join("-")}`}
                        key={camp?.camp_num}
                      >
                        <a>
                          {index !== 0 && "/ "}
                          {`${camp?.camp_name}`}
                        </a>
                      </Link>
                    );
                  })
                : null}
            </div>
          </div>

          <div className={styles.topicDetailContentHead_Right}>
            <Button
              type="primary"
              className={styles.btnCampForum}
              onClick={onCampForumClick}
            >
              Camp Forum
            </Button>
            <Dropdown
              className={styles.campForumDropdown}
              placement="bottomRight"
              overlay={campForumDropdownMenu}
              trigger={["click"]}
            >
              <a
                className={styles.iconMore}
                onClick={(e) => e.preventDefault()}
              >
                <MoreOutlined />
              </a>
            </Dropdown>
          </div>
        </div>

        <aside className="leftSideBar miniSideBar">
          <SideBar onCreateCamp={onCreateCamp} />
        </aside>

        <div className="pageContentWrap">
          <Spin spinning={loadingIndicator} size="large">
            <NewsFeedsCard newsFeed={newsFeed} />
          </Spin>
          <Spin spinning={getTreeLoadingIndicator} size="large">
            <CampTreeCard
              scrollToCampStatement={scrollToCampStatement}
              getSelectedNode={getSelectedNode}
            />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <CampStatementCard
              myRefToCampStatement={myRefToCampStatement}
              onCampForumClick={onCampForumClick}
            />
          </Spin>

          <Spin spinning={loadingIndicator} size="large">
            <SupportTreeCard
              handleLoadMoreSupporters={handleLoadMoreSupporters}
            />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <CurrentTopicCard />
          </Spin>
          <Spin spinning={loadingIndicator} size="large">
            <CurrentCampCard />
          </Spin>
          <BackTop />
        </div>
      </div>
    </>
  );
};

export default TopicDetails;
