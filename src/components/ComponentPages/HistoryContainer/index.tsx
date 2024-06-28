import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
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
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import { store } from "src/store";
import { setTree } from "src/store/slices/campDetailSlice";
import { getHistoryApi } from "src/network/api/history";
import { setCurrentCamp } from "src/store/slices/filtersSlice";
import HistoryCollapse from "./Collapse";

const { Title } = Typography;

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
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
    camp_leader_nick_id: campHistory?.items?.[0]?.camp_leader_nick_id,
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
            {/* <HistoryCollapse
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
            /> */}
          </>
        );
      })
    ) : (
      <NoRecordsMessage />
    );

  return (
    <>
      <div className="cn-breadcrumbs">
        <Breadcrumb
          separator={
            <>
              <i className="icon-angle-right"></i>
            </>
          }
        >
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">(Canon) General</Breadcrumb.Item>
          <Breadcrumb.Item href="">
            Topic: Representationalist Books
          </Breadcrumb.Item>
          <Breadcrumb.Item>Topic History</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          size="large"
          type="primary"
          className="flex items-center justify-center rounded-[10px] max-lg:hidden gap-3.5 leading-none"
        >
          Update Current Statement
          <i className="icon-edit"></i>
        </Button>
      </div>
      <div className="ch-history">
        <div className="statement-status-sider">
          <Button
            type="link"
            className="text-2xl text-[#242B37] p-1 mb-16 flex items-center max-lg:hidden leading-none"
            icon={<LeftOutlined />}
          >
            Camp Statement History
          </Button>
          <Title level={5} className="mb-6">
            Statements Based On Status
          </Title>
          <div className="sider-btn">
            <Button size="large" className="btn-all active">
              View all (3)
            </Button>
            <Button size="large" className="btn-objected">
              Objected (1)
            </Button>
            <Button size="large" className="btn-live">
              Live (1)
            </Button>
            <Button size="large" className="btn-pending">
              Pending (1)
            </Button>
            <Button size="large" className="btn-previous">
              Previous (0)
            </Button>
          </div>
          <Button
            size="large"
            className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none mt-12"
          >
            Compare Statements
            <i className="icon-compare-statement"></i>
          </Button>
        </div>
        <Card className="ch-content" bordered={false}>
          <div className="cn-wrapper pending-wrapper">
            <div className="badge-wrapper">
              <Badge
                className="cn-dot-badge ch-dot-history"
                color=""
                text={
                  <>
                    16 Feb 2024,<span>04:36 PM</span>
                  </>
                }
              />
              <div className="tooltip-count">
                <Tooltip title="prompt text">
                  <InfoCircleOutlined />
                </Tooltip>
                <p>Grace period countdown</p>
                <Tag
                  className={
                    "bg-[#5482C833] border-0 rounded-md inline-flex py-[3px] items-center"
                  }
                >
                  00:51:12
                </Tag>
              </div>
            </div>
            <Checkbox className="mb-5 ch-checkbox" onChange={onChange}>
              Select to compare
            </Checkbox>
            <Card className="cn-card">
              <Collapse
                expandIconPosition="end"
                className="ch-collapse"
                defaultActiveKey={["0"]}
                expandIcon={({ isActive }) =>
                  isActive ? (
                    <i className="icon-up-arrow"></i>
                  ) : (
                    <i className="icon-down-arrow"></i>
                  )
                }
                ghost
              >
                <Panel header="" key="1">
                  <div>
                    <h5 className="font-semibold text-[#F19C39] mb-3">
                      Statement
                    </h5>
                    <p className="text-[#242B37] pb-5">
                      Contemporary philosophy of mind unfortunately has been
                      burdened for decades with a residual philosophical
                      behaviorism and intellectualized naive realism. Unpacking
                      these terms, the fashionable behaviorism gical nonentity.{" "}
                    </p>
                  </div>
                </Panel>
              </Collapse>

              <p className="font-semibold mb-2.5">Updates</p>
              <p>
                Category:<span>Test</span>
              </p>
              <p>
                Edit summary:<span>Minor tweaks</span>
              </p>
              <p>
                Camp about URL:<a> www.thisisalink.com</a>
              </p>
              <p>
                Camp about Nickname: <span>Jane</span>
              </p>
              <p>
                Submitter nickname:<span>Mary Ann</span>
              </p>
              <p>
                Disable additional sub-camps:<span>No</span>
              </p>
              <p>
                Single level Camps only:<span>Minor tweaks</span>
              </p>
              <p>
                Camp archived:<span> Jane Doe</span>
              </p>
              <p>
                Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
              </p>
              <p>
                Going live on :<span>17 Feb 2024, 04:36 PM</span>
              </p>
              <Divider className="border-[#242B3733] my-[1.125rem]" />
              <div className="cn-footer-btn">
                <div className="cn-card-btn">
                  <Button
                    size="large"
                    type="primary"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Commit Changes
                    <i className="icon-upload"></i>
                  </Button>
                  <Button
                    size="large"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Edit Statement
                    <i className="icon-edit"></i>
                  </Button>
                </div>
                <div className="cn-link-btn">
                  <Button
                    size="large"
                    type="link"
                    icon={<EyeOutlined />}
                    className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                  >
                    Preview Camp
                  </Button>
                  <Button
                    type="link"
                    danger
                    size="large"
                    icon={<i className="icon-delete"></i>}
                    className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          {/* <div className="cn-wrapper live-wrapper">
            <div className="badge-wrapper">
              <Badge
                className="cn-dot-badge ch-dot-history"
                color=""
                text={
                  <>
                    16 Feb 2024,<span>04:36 PM</span>
                  </>
                }
              />
              <div className="tooltip-count">
                <Tooltip title="prompt text">
                  <InfoCircleOutlined />
                </Tooltip>
                <p>Grace period countdown</p>
                <Tag
                  className={
                    "bg-[#5482C833] border-0 rounded-md inline-flex py-[3px] items-center"
                  }
                >
                  00:51:12
                </Tag>
              </div>
            </div>
            <Checkbox className="mb-5 ch-checkbox" onChange={onChange}>
              Select to compare
            </Checkbox>
            <Card className="cn-card">
              <p className="font-semibold mb-2.5">Updates</p>
              <p>
                Category:<span>Test</span>
              </p>
              <p>
                Edit summary:<span>Minor tweaks</span>
              </p>
              <p>
                Camp about URL:<a> www.thisisalink.com</a>
              </p>
              <p>
                Camp about Nickname: <span>Jane</span>
              </p>
              <p>
                Submitter nickname:<span>Mary Ann</span>
              </p>
              <p>
                Disable additional sub-camps:<span>No</span>
              </p>
              <p>
                Single level Camps only:<span>Minor tweaks</span>
              </p>
              <p>
                Camp archived:<span> Jane Doe</span>
              </p>
              <p>
                Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
              </p>
              <p>
                Going live on :<span>17 Feb 2024, 04:36 PM</span>
              </p>
              <Divider className="border-[#242B3733] my-[1.125rem]" />
              <div className="cn-footer-btn">
                <div className="cn-card-btn">
                  <Button
                    size="large"
                    type="primary"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Commit Changes
                    <i className="icon-upload"></i>
                  </Button>
                  <Button
                    size="large"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Edit Statement
                    <i className="icon-edit"></i>
                  </Button>
                </div>
                <div className="cn-link-btn">
                  <Button
                    size="large"
                    type="link"
                    icon={<EyeOutlined />}
                    className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                  >
                    Preview Camp
                  </Button>
                  <Button
                    type="link"
                    danger
                    size="large"
                    icon={<i className="icon-delete"></i>}
                    className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </div> */}
          {/* <div className="cn-wrapper previous-wrapper">
            <div className="badge-wrapper">
              <Badge
                className="cn-dot-badge ch-dot-history"
                color=""
                text={
                  <>
                    16 Feb 2024,<span>04:36 PM</span>
                  </>
                }
              />
              <div className="tooltip-count">
                <Tooltip title="prompt text">
                  <InfoCircleOutlined />
                </Tooltip>
                <p>Grace period countdown</p>
                <Tag
                  className={
                    "bg-[#5482C833] border-0 rounded-md inline-flex py-[3px] items-center"
                  }
                >
                  00:51:12
                </Tag>
              </div>
            </div>
            <Checkbox className="mb-5 ch-checkbox" onChange={onChange}>
              Select to compare
            </Checkbox>
            <Card className="cn-card">
              <p className="font-semibold mb-2.5">Updates</p>
              <p>
                Category:<span>Test</span>
              </p>
              <p>
                Edit summary:<span>Minor tweaks</span>
              </p>
              <p>
                Camp about URL:<a> www.thisisalink.com</a>
              </p>
              <p>
                Camp about Nickname: <span>Jane</span>
              </p>
              <p>
                Submitter nickname:<span>Mary Ann</span>
              </p>
              <p>
                Disable additional sub-camps:<span>No</span>
              </p>
              <p>
                Single level Camps only:<span>Minor tweaks</span>
              </p>
              <p>
                Camp archived:<span> Jane Doe</span>
              </p>
              <p>
                Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
              </p>
              <p>
                Going live on :<span>17 Feb 2024, 04:36 PM</span>
              </p>
              <Divider className="border-[#242B3733] my-[1.125rem]" />
              <div className="cn-footer-btn">
                <div className="cn-card-btn">
                  <Button
                    size="large"
                    type="primary"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Commit Changes
                    <i className="icon-upload"></i>
                  </Button>
                  <Button
                    size="large"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Edit Statement
                    <i className="icon-edit"></i>
                  </Button>
                </div>
                <div className="cn-link-btn">
                  <Button
                    size="large"
                    type="link"
                    icon={<EyeOutlined />}
                    className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                  >
                    Preview Camp
                  </Button>
                  <Button
                    type="link"
                    danger
                    size="large"
                    icon={<i className="icon-delete"></i>}
                    className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </div> */}
          {/* <div className="cn-wrapper objected-wrapper">
            <div className="badge-wrapper">
              <Badge
                className="cn-dot-badge ch-dot-history"
                color=""
                text={
                  <>
                    16 Feb 2024,<span>04:36 PM</span>
                  </>
                }
              />
              <div className="tooltip-count">
                <Tooltip title="prompt text">
                  <InfoCircleOutlined />
                </Tooltip>
                <p>Grace period countdown</p>
                <Tag
                  className={
                    "bg-[#5482C833] border-0 rounded-md inline-flex py-[3px] items-center"
                  }
                >
                  00:51:12
                </Tag>
              </div>
            </div>
            <Checkbox className="mb-5 ch-checkbox" onChange={onChange}>
              Select to compare
            </Checkbox>
            <Card className="cn-card">
              <p className="font-semibold mb-2.5">Updates</p>
              <p>
                Category:<span>Test</span>
              </p>
              <p>
                Edit summary:<span>Minor tweaks</span>
              </p>
              <p>
                Camp about URL:<a> www.thisisalink.com</a>
              </p>
              <p>
                Camp about Nickname: <span>Jane</span>
              </p>
              <p>
                Submitter nickname:<span>Mary Ann</span>
              </p>
              <p>
                Disable additional sub-camps:<span>No</span>
              </p>
              <p>
                Single level Camps only:<span>Minor tweaks</span>
              </p>
              <p>
                Camp archived:<span> Jane Doe</span>
              </p>
              <p>
                Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
              </p>
              <p>
                Going live on :<span>17 Feb 2024, 04:36 PM</span>
              </p>
              <Divider className="border-[#242B3733] my-[1.125rem]" />
              <div className="cn-footer-btn">
                <div className="cn-card-btn">
                  <Button
                    size="large"
                    type="primary"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Commit Changes
                    <i className="icon-upload"></i>
                  </Button>
                  <Button
                    size="large"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    Edit Statement
                    <i className="icon-edit"></i>
                  </Button>
                </div>
                <div className="cn-link-btn">
                  <Button
                    size="large"
                    type="link"
                    icon={<EyeOutlined />}
                    className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                  >
                    Preview Camp
                  </Button>
                </div>
              </div>
            </Card>
          </div> */}
        </Card>
      </div>
    </>
  );
}

export default HistoryContainer;
