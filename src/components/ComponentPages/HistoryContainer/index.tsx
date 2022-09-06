import { useEffect, useState, useRef } from "react";
import { Typography, Button, List, Spin, Affix, Skeleton } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

import styles from "./campHistory.module.scss";

import { getHistoryApi, getLiveHistoryApi } from "../../../network/api/history";

import HistoryCollapse from "./Collapse";
import { RootState } from "src/store";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import CreateNewCampButton from "../../common/button/createNewCampBtn";
import CreateNewTopicButton from "../../common/button/createNewTopicBtn";

const { Title } = Typography;

function HistoryContainer() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [top, setTop] = useState(0);
  const [isAbs, setIsAbs] = useState(false);
  const [loadMoreItems, setLoadMoreItems] = useState(true);
  const [agreecheck, setAgreeCheck] = useState(false);
  const changeAgree = () => {
    setAgreeCheck(!agreecheck);
  };
  const historyOf = router?.asPath.split("/")[1];

  const count = useRef(1);

  const { history, currentCampRecord, currentCampNode } = useSelector(
    (state: RootState) => ({
      history: state?.topicDetails?.history,
      currentCampRecord: state.topicDetails.currentCampRecord,
      currentCampNode: state?.filters?.selectedCampNode,
    })
  );

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [campHistory, setCampHistory] = useState(history);
  let payload = history && {
    camp_num: router?.query?.camp[1]?.split("-")[0],
    topic_num: router?.query?.camp[0]?.split("-")[0],
    topic_name:
      historyOf == "topic"
        ? history?.items[0]?.topic_name
        : history?.details?.topic?.topic_name,
  };
  useEffect(() => {
    setCampHistory(history);
  }, [history]);

  useEffect(() => {
    const asynCall = async () => {
      setLoadMoreItems(true);
      count.current = 1;
      if (activeTab === "live") {
        await liveCampStatementApiCall();
      } else {
        await campStatementApiCall();
      }
    };
    asynCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, agreecheck]);

  const campStatementApiCall = async () => {
    try {
      setLoadingIndicator(true);
      const reqBody = {
        topic_num: +router.query.camp[0].split("-")[0],
        camp_num:
          historyOf != "topic" ? +router.query.camp[1].split("-")[0] : null,
        type: activeTab,
        per_page: 4,
        page: count.current,
      };

      let res = await getHistoryApi(reqBody, count.current, historyOf);

      if (!res || !res?.last_page) {
        setLoadMoreItems(false);
        setLoadingIndicator(false);
        return;
      }
      if (count.current >= res?.last_page) {
        setLoadMoreItems(false);
      } else {
        count.current = count.current + 1;
      }
      setLoadingIndicator(false);
    } catch (error) {
      //console.log(error)
    }
  };
  const liveCampStatementApiCall = async () => {
    setLoadingIndicator(true);
    const reqBody = {
      topic_num: +router.query.camp[0].split("-")[0],
      camp_num:
        historyOf != "topic" ? +router.query.camp[1].split("-")[0] : "1",
    };
    const res = await getLiveHistoryApi(reqBody, historyOf);

    setLoadMoreItems(false);
    setLoadingIndicator(false);
  };

  const handleTabButton = async (tabName) => {
    setActiveTab(tabName);
  };

  const topicRoute = () => {
    setLoadingIndicator(true);
  };

  const campRoute = () => {
    setLoadingIndicator(true);
  };

  const onSelectCompare = ({ id }, e: CheckboxChangeEvent) => {
    let oldTopics = [...selectedTopic];

    if (e.target.checked && !oldTopics.includes(id)) {
      oldTopics.push(id);
    } else {
      oldTopics = oldTopics.filter((item) => item !== id);
    }

    setSelectedTopic(oldTopics);
  };

  const onCompareClick = () => {
    router.push({
      pathname: `/statement/compare/${router.query.camp[0]}/${
        router.query.camp[1] ? router.query.camp[1] : "1-Agreement"
      }`,
      query: {
        statements: selectedTopic[0] + "_" + selectedTopic[1],
        from:
          historyOf == "statement"
            ? "statement"
            : historyOf == "camp"
            ? "camp"
            : "topic",
      },
    });
  };

  const loader = (
    <></>
    // will be replaced with alternate
    // <div className="p-3">
    //   <Skeleton active />
    //   <Skeleton active />
    //   <Skeleton active />
    // </div>
  );

  let historyTitle = () => {
    let title: string;
    if (historyOf == "statement") {
      title = "Camp Statement History";
    } else if (historyOf == "camp") {
      title = "Camp History";
    } else if (historyOf == "topic") {
      title = "Topic History";
    }
    return title;
  };

  const renderCampHistories =
    campHistory && campHistory?.items?.length ? (
      campHistory?.items?.map((campHistoryData, index) => {
        return (
          <HistoryCollapse
            key={index}
            campStatement={campHistoryData}
            onSelectCompare={onSelectCompare}
            ifIamSupporter={campHistory?.details?.ifIamSupporter}
            ifSupportDelayed={campHistory?.details?.ifSupportDelayed}
            changeAgree={changeAgree}
            isDisabledCheck={
              selectedTopic.length >= 2 &&
              !selectedTopic?.includes(campHistoryData?.id)
            }
            isChecked={selectedTopic?.includes(campHistoryData?.id)}
          />
        );
      })
    ) : (
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        No Camp History Found
      </h2>
    );
  return (
    <div className={styles.wrap}>
      <CampInfoBar
        payload={payload}
        isTopicHistoryPage={historyOf == "topic" ? true : false}
      />
      <div className={styles.btnGroup}>
        <CreateNewTopicButton className={styles.createBtn} click={topicRoute} />

        {historyOf !== "topic" &&
        currentCampNode?.isDisabled == 0 &&
        currentCampNode?.parentIsOneLevel == 0 ? (
          <CreateNewCampButton
            className={styles.createBtn}
            click={campRoute}
            url={`/camp/create/${
              router.query.camp[0] + "/" + router.query.camp[1]
            }`}
          />
        ) : null}
      </div>
      <div className={styles.campStatementHistoryCard}>
        <Affix
          offsetTop={top}
          style={{ position: isAbs ? "absolute" : "static", left: "16px" }}
          onChange={setIsAbs}
        >
          <div className={styles.cshcHead}>
            <div className={styles.cshcHeadFilterWrap}>
              <Title level={4}>{historyTitle()}</Title>
              <Spin spinning={loadingIndicator} size="default">
                <List className={styles.cshcHeadFilter} size="small">
                  <List.Item
                    className={`${styles.campStatementViewAll} ${
                      styles.cshcHeadFilterItem
                    } ${activeTab == "all" ? styles.active : null}`}
                  >
                    <a
                      onClick={() => {
                        handleTabButton("all");
                      }}
                    >
                      View All
                    </a>
                  </List.Item>
                  <List.Item
                    className={`${styles.campStatementObjected}  ${
                      styles.cshcHeadFilterItem
                    }  ${activeTab == "objected" ? styles.active : null}`}
                  >
                    <a
                      onClick={() => {
                        handleTabButton("objected");
                      }}
                    >
                      Objected
                    </a>
                  </List.Item>
                  <List.Item
                    className={`${styles.campStatementLive} ${
                      styles.cshcHeadFilterItem
                    } ${activeTab == "live" ? styles.active : null}`}
                  >
                    <a
                      onClick={() => {
                        handleTabButton("live");
                      }}
                    >
                      Live
                    </a>
                  </List.Item>
                  <List.Item
                    className={`${styles.campStatementNotLive} ${
                      styles.cshcHeadFilterItem
                    } ${activeTab == "in_review" ? styles.active : null}`}
                  >
                    <a
                      onClick={() => {
                        handleTabButton("in_review");
                      }}
                    >
                      Not Live
                    </a>
                  </List.Item>
                  <List.Item
                    className={`${styles.campStatementOld} ${
                      styles.cshcHeadFilterItem
                    } ${activeTab == "old" ? styles.active : null}`}
                  >
                    <a
                      onClick={() => {
                        handleTabButton("old");
                      }}
                    >
                      Old
                    </a>
                  </List.Item>
                </List>
              </Spin>
            </div>
            <Button
              disabled={
                !(
                  selectedTopic.length >= 2 &&
                  !selectedTopic?.includes(campHistory && campHistory["id"])
                )
              }
              className={styles.active}
              type="primary"
              onClick={onCompareClick}
            >
              Compare{" "}
              {historyOf == "topic"
                ? "Topics"
                : historyOf == "camp"
                ? "Camps"
                : "Statements"}
            </Button>
          </div>
        </Affix>
        <div style={{ paddingBottom: "20px" }}>
          <div style={{ overflow: "auto" }}>
            {activeTab === "live" ? (
              renderCampHistories
            ) : (
              <InfiniteScroll
                loadMore={!loadingIndicator && campStatementApiCall}
                hasMore={loadMoreItems}
                loader={loader}
              >
                {renderCampHistories}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryContainer;
