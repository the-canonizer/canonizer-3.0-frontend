import { useEffect, useState, useRef } from "react";
import { Typography, Button, List, Affix } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

import styles from "./campHistory.module.scss";

import { getHistoryApi } from "src/network/api/history";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import CustomSkelton from "../../common/customSkelton";

import HistoryCollapse from "./Collapse";
import { RootState } from "src/store";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import CreateNewCampButton from "../../common/button/createNewCampBtn";
import { setCurrentCamp } from "src/store/slices/filtersSlice";
import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";

import { store } from "src/store";
import { setTree } from "src/store/slices/campDetailSlice";
import { updateCampApi } from "src/network/api/campManageStatementApi";
import CommanBreadcrumbs from "../Breadcrumbs/commonBreadcrumbs";

const { Title } = Typography;

function HistoryContainer() {
  const { isUserAuthenticated } = useIsUserAuthenticated();
  const router = useRouter();
  const dispatch = useDispatch();
  const didMount = useRef(false);

  const [activeTab, setActiveTab] = useState("all");

  const [nickName, setNickName] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [selectedTopicStatus, setSelectedTopicStatus] = useState([]);

  const [isAbs, setIsAbs] = useState(false);
  const [loadMoreItems, setLoadMoreItems] = useState(true);
  const [agreecheck, setAgreeCheck] = useState(false);
  const [discardChange, setDiscardChange] = useState(false);
  const [parentarchived, setParentarchived] = useState(0);
  const [directarchived, setDirectarchived] = useState(0);

  const changeAgree = () => {
    setAgreeCheck(!agreecheck);
  };
  const changeDiscard = () => {
    setDiscardChange(!discardChange);
  };
  const historyOf = router?.asPath.split("/")[1];

  const count = useRef(1);

  const { history, currentCampNode, asofdate, algorithm } = useSelector(
    (state: RootState) => ({
      history: state?.topicDetails?.history,
      currentCampRecord: state.topicDetails.currentCampRecord,
      currentCampNode: state?.filters?.selectedCampNode,
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
    })
  );

  const [isTreesApiCallStop, setIsTreesApiCallStop] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [campHistory, setCampHistory] = useState(history);
  let payload = history && {
    camp_num: router?.query?.camp?.at(1)?.split("-")?.at(0) ?? "1",
    topic_num: router?.query?.camp?.at(0)?.split("-")?.at(0),
  };

  useEffect(() => {
    async function getTreeApiCall() {
      if (isUserAuthenticated) {
        let response = await getAllUsedNickNames({
          topic_num: router?.query?.camp?.at(0)?.split("-")[0],
        });
        setNickName(response?.data);
      }
    }
    if (!isTreesApiCallStop) {
      getTreeApiCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isUserAuthenticated,
    asofdate,
    algorithm,
    +router?.query?.camp?.at(1)?.split("-")[0],
  ]);

  useEffect(() => {
    setCampHistory(history);
  }, [history]);

  useEffect(() => {
    const asynCall = async () => {
      setLoadMoreItems(true);
      count.current = 1;
      await campStatementApiCall();
    };
    asynCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, agreecheck, discardChange, isUserAuthenticated]);
  useEffect(() => {
    if (didMount.current) {
      return () => {
        store.dispatch(setTree([]));
      };
    } else didMount.current = true;
  }, []);

  const campStatementApiCall = async () => {
    try {
      setLoadingIndicator(true);
      const reqBody = {
        topic_num: router?.query.camp[0].split("-")[0],
        camp_num:
          historyOf != "topic"
            ? router?.query.camp?.at(1)?.split("-")?.at(0) || 1
            : 1,
        type: activeTab,
        per_page: 4,
        page: count.current,
      };
      let res = await getHistoryApi(reqBody, count.current, historyOf);
      if (res?.status_code == 404 || res?.status_code == 400) {
        if (router?.pathname == "/topic/history/[...camp]") {
          router?.push(router?.asPath?.replace("topic/history", "topic"));
          return;
        } else if (router?.pathname == "/statement/history/[...camp]") {
          router?.push(router?.asPath?.replace("statement/history", "topic"));
          return;
        } else if (router?.pathname == "/camp/history/[...camp]") {
          router?.push(router?.asPath?.replace("camp/history", "topic"));
          return;
        }
      }

      if (res?.status_code == 200) {
        let liveCard = res?.data?.details?.liveCamp;
        let parentIsOneLevel = res?.data?.details?.parent_is_one_level;
        let _isOneLevel = liveCard?.is_one_level || parentIsOneLevel;
        let _isDisabled =
          res?.data?.details?.parent_is_disabled || liveCard?.is_disabled;
        let is_archive = liveCard?.is_archive;
        setDirectarchived(liveCard?.direct_archive);
        setParentarchived(liveCard?.is_archive);
        dispatch(
          setCurrentCamp({
            parentIsOneLevel,
            _isDisabled,
            _isOneLevel,
            is_archive,
          })
        );
      }

      didMount.current = true;
      if (!res?.data || !res?.data?.last_page) {
        setLoadMoreItems(false);
        setLoadingIndicator(false);
        return;
      }
      if (count.current >= res?.data?.last_page) {
        setLoadMoreItems(false);
      } else {
        count.current = count.current + 1;
      }

      setLoadingIndicator(false);
    } catch (error) {
      /**/
    }
  };

  const handleTabButton = async (tabName) => {
    setActiveTab(tabName);
  };

  const campRoute = () => {
    setLoadingIndicator(true);
  };

  const onSelectCompare = ({ id, status }, e: CheckboxChangeEvent) => {
    let oldTopics = [...selectedTopic];
    let oldTopicsStatus = [...selectedTopicStatus];

    if (e.target.checked && !oldTopics.includes(id)) {
      oldTopics.push(id);
    } else {
      oldTopics = oldTopics.filter((item) => item !== id);
    }

    if (e.target.checked && !oldTopicsStatus.includes(`${id}_${status}`)) {
      oldTopicsStatus.push(`${id}_${status}`);
    } else {
      oldTopicsStatus = oldTopicsStatus.filter(
        (item) => item !== `${id}_${status}`
      );
    }
    setSelectedTopic(oldTopics);
    setSelectedTopicStatus(oldTopicsStatus);
  };

  const onCompareClick = () => {
    router?.push({
      pathname: `/statement/compare/${router?.query.camp[0]}/${
        router?.query.camp[1] ? router?.query.camp[1] : "1-Agreement"
      }`,
      query: {
        statements: selectedTopic[0] + "_" + selectedTopic[1],
        from:
          historyOf == "statement"
            ? "statement"
            : historyOf == "camp"
            ? "camp"
            : "topic",
        status: selectedTopicStatus.join("-"),
      },
    });
  };

  const loader = <></>;

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

  const NoRecordsMessage = () => {
    let title: string;
    if (historyOf == "statement") {
      title = "No Camp Statement History Found";
    } else if (historyOf == "camp") {
      title = "No Camp History Found";
    } else if (historyOf == "topic") {
      title = "No Topic History Found";
    }
    return (
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        {title}
      </h2>
    );
  };
  let reqBody = {
    topic_num: campHistory?.items?.[0]?.topic_num,
    topic_id: null,
    topic_name: null,
    namespace_id: null,
    statement_id: null,
    camp_num: campHistory?.items?.[0]?.camp_num,
    nick_name: nickName?.[0]?.id,
    // nick_name_id:userNickNameData?.[0]?.n,
    submitter: campHistory?.items?.[0]?.submitter_nick_id,
    statement: "", //JSON.stringify(convertToRaw(contentState)),//values?.statement?.blocks[0].text.trim(),
    //statement: values?.statement?.trim(), //JSON.stringify(convertToRaw(contentState)),//values?.statement?.blocks[0].text.trim(),
    event_type: "update",
    objection_reason: null,
    statement_update: null,
    camp_id: campHistory?.items?.[0]?.id,
    camp_name: campHistory?.items?.[0]?.camp_name,
    key_words: campHistory?.items?.[0]?.key_words,
    camp_about_url: campHistory?.items?.[0]?.camp_about_url,
    camp_about_nick_id: null,

    parent_camp_num: campHistory?.items?.[0]?.parent_camp_num,

    old_parent_camp_num: campHistory?.items?.[0]?.old_parent_camp_num,
    is_disabled: 0,
    is_one_level: 0,
    is_archive: 0,
  };
  const callManageCampApi = async () => {
    // window.location.reload()
    setLoadingIndicator(true);
    if (campHistory?.items?.length >= 3) {
      count.current = 1;
    }
    await updateCampApi(reqBody);
    await campStatementApiCall();
    setLoadingIndicator(false);
    // await commitChanges()
  };
  const getCollapseKeys = (campHistoryData, index) => {
    let key = "";
    let oldstatements = campHistory?.items?.filter(
      (campHistoryData) => campHistoryData?.status == "old"
    );

    if (
      campHistoryData?.status == "live" ||
      campHistory?.items?.length <= 3 ||
      (oldstatements.length > 0 &&
        oldstatements[oldstatements.length >= 3 ? 2 : oldstatements.length - 1]
          ?.submit_time <= campHistoryData?.submit_time) ||
      (oldstatements.length == 0 && index < 2)
    ) {
      key = "1";
    }
    if (historyOf != "statement") {
      key = "1";
    }

    return key;
  };

  const renderCampHistories =
    campHistory && campHistory?.items?.length ? (
      campHistory?.items?.map((campHistoryData, index) => {
        return (
          <>
            <HistoryCollapse
              collapseKeys={getCollapseKeys(campHistoryData, index)}
              key={index}
              campStatement={campHistoryData}
              onSelectCompare={onSelectCompare}
              userNickNameData={nickName}
              ifIamSupporter={campHistory?.details?.ifIamSupporter}
              ifSupportDelayed={campHistory?.details?.ifSupportDelayed}
              ifIAmExplicitSupporter={
                campHistory?.details?.ifIAmExplicitSupporter
              }
              topicNamespaceId={campHistory?.details?.topic?.namespace_id}
              changeAgree={changeAgree}
              changeDiscard={changeDiscard}
              isDisabledCheck={
                selectedTopic.length >= 2 &&
                !selectedTopic?.includes(campHistoryData?.id)
              }
              isChecked={selectedTopic?.includes(campHistoryData?.id)}
              setIsTreesApiCallStop={setIsTreesApiCallStop}
              campHistoryItems={campHistory?.items}
              callManageCampApi={callManageCampApi}
              parentArchived={parentarchived}
              unarchiveChangeSubmitted={
                campHistory?.details?.unarchive_change_submitted
              }
              directarchived={directarchived}
            />
          </>
        );
      })
    ) : (
      <NoRecordsMessage />
    );
  return (
    <div className={styles.wrap}>
      {/* <CampInfoBar
        payload={payload}
        isTopicHistoryPage={historyOf == "topic" ? true : false}
      /> */}
      <CommanBreadcrumbs
        payload={payload}
        isTopicHistoryPage={historyOf == "topic" ? true : false}
      />
      <div className={styles.btnGroup}>
        {/* <CreateNewTopicButton className={styles.createBtn} click={topicRoute} /> */}

        {historyOf !== "topic" &&
        currentCampNode?._isDisabled == 0 &&
        currentCampNode?.parentIsOneLevel == 0 &&
        currentCampNode?.is_archive == 0 ? (
          <CreateNewCampButton
            className={styles.createBtn}
            click={campRoute}
            url={`/camp/create/${
              router?.query.camp?.at(0) + "/" + router?.query.camp?.at(1)
            }`}
          />
        ) : null}
      </div>
      <div className={styles.campStatementHistoryCard}>
        <Affix
          offsetTop={0}
          style={{ position: isAbs ? "absolute" : "static", left: "16px" }}
          onChange={setIsAbs}
        >
          <div className={styles.cshcHead}>
            <div className={styles.cshcHeadFilterWrap}>
              <Title level={4}>{historyTitle()}</Title>
              {/* <Spin spinning={loadingIndicator} size="default"> */}
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
            </div>
            <Button
              disabled={
                !(
                  selectedTopic.length >= 2 &&
                  !selectedTopic?.includes(campHistory && campHistory["id"])
                )
              }
              className={styles.active}
              id={`compare-${historyOf}`}
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
            {loadingIndicator ? (
              <>
                <div className="px-3 py-2">
                  <CustomSkelton
                    skeltonFor="card"
                    bodyCount={4}
                    stylingClass="test"
                    isButton={false}
                    action={false}
                    title={false}
                  />
                </div>{" "}
                <div className="px-3 py-2">
                  <CustomSkelton
                    skeltonFor="card"
                    bodyCount={4}
                    stylingClass="test"
                    isButton={false}
                    action={false}
                    title={false}
                  />{" "}
                </div>
                <div className="px-3 py-2">
                  <CustomSkelton
                    skeltonFor="card"
                    bodyCount={4}
                    stylingClass="test"
                    isButton={false}
                    action={false}
                    title={false}
                  />
                </div>
              </>
            ) : activeTab === "live" ? (
              renderCampHistories
            ) : (
              <InfiniteScroll
                initialLoad={false}
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
