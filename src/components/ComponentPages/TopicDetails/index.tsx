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
import { BackTop } from "antd";
import { Spin } from "antd";
import { setCurrentTopic } from "../../../store/slices/topicSlice";

import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";

const TopicDetails = () => {
  const didMount = useRef(false);
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

  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );
  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );
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

  useEffect(() => {
    if (didMount.current) {
      setCampSubscriptionID(campRecord?.subscriptionId);
      setTopicSubscriptionID(topicRecord?.topicSubscriptionId);
    } else didMount.current = true;
  }, [campRecord?.subscriptionId, topicRecord?.topicSubscriptionId]);

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
    // const queryParams = router.query;

    // const data = {
    //   message: null,
    //   topic_num: queryParams.camp[0],
    //   topic_name: topicRecord?.topic_name,
    //   camp_name: topicRecord?.camp_name,
    //   parent_camp_num: topicRecord?.camp_num,
    // };
    // setCurrentTopics(data);
    const topicName = topicRecord?.topic_name.replaceAll(" ", "-");
    const campName = campRecord?.camp_name.replaceAll(" ", "-");

    router.push({
      pathname: `/forum/${topicRecord?.topic_num}-${topicName}/${campRecord?.camp_num}-${campName}/threads`,
    });
  };

  const payload = {
    setLoadingIndicator,
    campSubscriptionID,
    topicSubscriptionID,
  };

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
<<<<<<< HEAD
        <CampInfoBar payload={payload} isStatementBar={false} />
=======
        <div className={styles.topicDetailContentHead}>
          <div className={styles.topicDetailContentHead_Left}>
            <Typography.Paragraph className={"mb-0 " + styles.topicTitleStyle}>
              {" "}
              <span className="bold"> Topic: </span>
              {topicRecord && topicRecord?.topic_name}{" "}
              {!!topicSubscriptionID && (
                <small>
                  <i className="icon-subscribe text-primary"></i>
                </small>
              )}
            </Typography.Paragraph>
            <div className={styles.breadcrumbLinks}>
              {" "}
              <span className="bold mr-1"> Camp : </span>
              {campRecord
                ? campRecord.parentCamps?.map((camp, index) => {
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
              {!!campSubscriptionID && (
                <small
                  style={{
                    alignSelf: "center",
                    marginLeft: "10px",
                    opacity: campRecord?.flag == 2 ? 0.5 : 1,
                  }}
                >
                  <i className="icon-subscribe text-primary"></i>
                </small>
              )}
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
>>>>>>> 7372c8a6db7b7ed950833376b09bbb7aea378afe

        <aside className="leftSideBar miniSideBar">
          <SideBar onCreateCamp={onCreateCamp} />
        </aside>

        <div className="pageContentWrap">
          <Spin spinning={loadingIndicator} size="large">
            <NewsFeedsCard newsFeed={newsFeed} />
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
