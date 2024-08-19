import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Empty,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import {
  EyeOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { updateCampApi } from "src/network/api/campManageStatementApi";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { RootState } from "src/store";
import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import {
  getAllUsedNickNames,
  getCampBreadCrumbApi,
} from "src/network/api/campDetailApi";
import { store } from "src/store";
import { setTree } from "src/store/slices/campDetailSlice";
import { getHistoryApi } from "src/network/api/history";
import { setCurrentCamp } from "src/store/slices/filtersSlice";
import HistoryCollapse from "./Collapse";
import {
  getCookies,
  historyTitle,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import InfiniteScroll from "react-infinite-scroller";
import CustomSkelton from "../../common/customSkelton";
import moment from "moment";
import Breadcrumbs from "../Breadcrumbs/breadcrumbs";
import HistoryCard from "../HistoryCard/historyCard";
import CustomLayout from "src/hoc/layout/";

const { Title } = Typography;

const { Panel } = Collapse;

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
  const [totalCount, setTotalCount] = useState<any>([]);
  const [liveRecordId, setLiveRecordId] = useState<any>(null);

  const { asof } = useSelector((state: RootState) => ({
    asof: state?.filters?.filterObject?.asof,
  }));

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
  const [campHistory, setCampHistory] = useState<any>(history);
  let payload = history && {
    camp_num: router?.query?.camp?.at(1)?.split("-")?.at(0) ?? "1",
    topic_num: router?.query?.camp?.at(0)?.split("-")?.at(0),
  };

  useEffect(() => {
    async function getTreeApiCall() {
      if (isUserAuthenticated) {
        let response = await getAllUsedNickNames({
          topic_num: router?.query?.camp?.at(0)?.split("-")?.at(0),
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
        setTotalCount(res?.data?.total_counts);
        setLiveRecordId(res?.data?.live_record_id);
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
        statements: selectedTopic?.at(0) + "_" + selectedTopic?.at(1),
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

  let reqBody = {
    topic_num: campHistory?.items?.at(0)?.topic_num,
    topic_id: null,
    topic_name: null,
    namespace_id: null,
    statement_id: null,
    camp_num: campHistory?.items?.at(0)?.camp_num,
    nick_name: nickName?.at(0)?.id,
    // nick_name_id:userNickNameData?.[0]?.n,
    submitter: campHistory?.items?.at(0)?.submitter_nick_id,
    statement: "", //JSON.stringify(convertToRaw(contentState)),//values?.statement?.blocks[0].text.trim(),
    //statement: values?.statement?.trim(), //JSON.stringify(convertToRaw(contentState)),//values?.statement?.blocks[0].text.trim(),
    event_type: "update",
    objection_reason: null,
    statement_update: null,
    camp_id: campHistory?.items?.at(0)?.id,
    camp_name: campHistory?.items?.at(0)?.camp_name,
    key_words: campHistory?.items?.at(0)?.key_words,
    camp_about_url: campHistory?.items?.at(0)?.camp_about_url,
    camp_about_nick_id: null,

    parent_camp_num: campHistory?.items?.at(0)?.parent_camp_num,

    old_parent_camp_num: campHistory?.items?.at(0)?.old_parent_camp_num,
    is_disabled: 0,
    is_one_level: 0,
    is_archive: 0,
    camp_leader_nick_id:
      campHistory && campHistory?.items?.at(0)?.camp_leader_nick_id,
  };
  const callManageCampApi = async () => {
    setLoadingIndicator(true);
    if (campHistory?.items?.length >= 3) {
      count.current = 1;
    }
    await updateCampApi(reqBody);
    await campStatementApiCall();
    setLoadingIndicator(false);
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
    campHistory &&
    campHistory?.items?.length &&
    campHistory?.items?.map((campHistoryData, index) => {
      return (
        <HistoryCard
          collapseKeys={getCollapseKeys(campHistoryData, index)}
          key={index}
          campStatement={campHistoryData}
          onSelectCompare={onSelectCompare}
          userNickNameData={nickName}
          ifIamSupporter={campHistory?.details?.ifIamSupporter}
          ifSupportDelayed={campHistory?.details?.ifSupportDelayed}
          ifIAmExplicitSupporter={campHistory?.details?.ifIAmExplicitSupporter}
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
          historyState={historyOf}
        />
      );
    });

  const handleBackButton = () => {
    const topicDetails = router.query.camp?.at(0);
    const campDetails = router.query.camp?.at(1)
      ? router.query.camp?.at(1)
      : "1-Agreement";

    if (topicDetails && campDetails) {
      router.push(`/topic/${topicDetails}/${campDetails}`);
    }
  };

  const renderContent = () => (
    <div className="ch-content lg:w-[calc(100%-320px)] p-8 bg-[#F4F5FA] rounded-lg max-md:w-full relative">
      {renderCampHistories}
    </div>
  );

  const renderEmpty = () => (
    <div className="no-data-wrapper ch-content lg:w-[calc(100%-320px)] p-8 bg-[#F4F5FA] rounded-lg max-md:w-full relative">
      <Empty />
    </div>
  );
  const renderButton = (type, label, count, active, classes = "",disabled) => (
    <Button
      size="large"
      className={`btn-${type} ${classes} text-sm ${active ? "active" : ""}`}
      onClick={() => handleTabButton(type)}
      disabled={disabled}
    >
      {label} <span className="ml-1">({count}) </span>
    </Button>
  );

  const renderButtons = () => {
    const buttons = [
      {
        type: "all",
        label: "View all",
        count: totalCount?.total_changes || 0,
        className: "btn-all",
      },
      {
        type: "objected",
        label: "Objected",
        count: totalCount?.objected_changes || 0,
        className: "btn-objected",
      },
      {
        type: "live",
        label: "Live",
        count: totalCount?.live_changes || 0,
        className: "btn-live",
      },
      {
        type: "in_review",
        label: "Pending",
        count: totalCount?.in_review_changes || 0,
        className: "btn-pending",
      },
      {
        type: "old",
        label: "Previous",
        count: totalCount?.old_changes || 0,
        className: "btn-previous",
      },
    ];

    return buttons?.map(({ type, label, count, className }) =>
      renderButton(type, label, count, activeTab === type, className,count < 1)
    );
  };


  return (
    <CustomLayout afterHeader={<Breadcrumbs updateId={liveRecordId} />}>
      <div className="ch-wrapper">
        <div className="ch-history">
          <div className="statement-status-sider">
            <Button
              type="link"
              className="text-xl text-canBlack p-1 mb-14 gap-5 flex items-center max-lg:hidden leading-none"
              icon={<i className="icon-back"></i>}
              onClick={handleBackButton}
            >
              {`${historyTitle(historyOf)} History`}
            </Button>
            <Typography.Paragraph className="mb-6 text-base font-medium">
              {`${historyTitle(historyOf).toUpperCase()} BASED ON STATUS`}
            </Typography.Paragraph>
            <div className="sider-btn pr-0 md:pr-8">{renderButtons()}</div>
            <Button
              size="large"
              className="flex items-center justify-center rounded-xl text-sm gap-3.5 leading-none mt-12"
              disabled={
                !(
                  selectedTopic.length >= 2 &&
                  !selectedTopic?.includes(campHistory?.id)
                )
              }
              onClick={onCompareClick}
            >
              Compare {`${historyTitle(historyOf)}s`}
              <i className="icon-compare-statement"></i>
            </Button>
          </div>
          {activeTab === "live" ? (
            campHistory?.items?.length > 0 ? (
              renderContent()
            ) : (
              renderEmpty()
            )
          ) : campHistory?.items?.length > 0 ? (
            <div className="ch-content lg:w-[calc(100%-320px)] p-8 bg-[#F4F5FA] rounded-lg max-md:w-full relative">
              <InfiniteScroll
                initialLoad={false}
                loadMore={!loadingIndicator && campStatementApiCall}
                hasMore={loadMoreItems}
                loader={<></>}
              >
                {renderCampHistories}
              </InfiniteScroll>
            </div>
          ) : (
            renderEmpty()
          )}
        </div>
      </div>
    </CustomLayout>
  );
}

export default HistoryContainer;
