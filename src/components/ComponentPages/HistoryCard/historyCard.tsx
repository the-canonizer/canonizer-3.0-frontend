import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
  Modal,
  Spin,
  Table,
  Tabs
} from "antd";

import {
  ExclamationCircleFilled,
  EyeOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useDispatch, useSelector } from "react-redux";
import useAuthentication from "src/hooks/isUserAuthenticated";
import HistoryCardModal from "./historyCardDrawer";
import HistoryCardDrawer from "./historyCardDrawer";
// import "./historyCard.scss";
import { setFilterCanonizedTopics, setViewThisVersion } from "src/store/slices/filtersSlice";
import { RootState } from "src/store";
import { agreeToChangeApi, changeCommitStatement, discardStatement, getChangeSupporters } from "src/network/api/history";
import { setChangeGoneLive } from "src/store/slices/campDetailSlice";
import Link from "next/link";
import moment from "moment";
import StatementHistory from "../HistoryContainer/Collapse/statementHistory";
import CampHistory from "../HistoryContainer/Collapse/campHistory";
import TopicHistory from "../HistoryContainer/Collapse/topicHistory";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const { Title } = Typography;

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const { Panel } = Collapse;

function HistoryCard({
  collapseKeys,
  userNickNameData,
  topicNamespaceId,
  campStatement,
  onSelectCompare,
  isDisabledCheck,
  changeAgree,
  changeDiscard,
  isChecked,
  setIsTreesApiCallStop,
  campHistoryItems,
  callManageCampApi,
  parentArchived,
  unarchiveChangeSubmitted,
  directarchived,
  compareMode = false,
  comparisonData = null,
  historyState = null,

}: any) {
  const router = useRouter();
  const [commited, setCommited] = useState(false);
  const [isSelectChecked, setIsSelectChecked] = useState(false);
  const [collapseKey, setCollapseKey] = useState(collapseKeys);

  const [modal1Open, setModal1Open] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supporters, setSupporters] = useState([]);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const dispatch = useDispatch();
  const { isUserAuthenticated } = useAuthentication();
  const handleViewThisVersion = (goLiveTime) => {
    setIsTreesApiCallStop(true);
    dispatch(setViewThisVersion(true));
    dispatch(
      setFilterCanonizedTopics({
        asofdate: goLiveTime,
        asof: "bydate",
      })
    );
  };
  const { algorithm, namespace_id, changeGoneLive } = useSelector(
    (state: RootState) => ({
      algorithm: state.filters?.filterObject?.algorithm,
      namespace_id: state.filters?.filterObject?.namespace_id,
      changeGoneLive: state?.topicDetails?.changeGoneLive,
    }));
  const historyOf = router?.asPath.split("/")[1];
  // const covertToTime = (unixTime) => {
  //   return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  // };

  const commitChanges = async () => {
    setLoadingChanges(true);
    let reqBody = {
      type: historyOf,
      id: campStatement?.id,
      old_parent_camp_num: campStatement?.old_parent_camp_num ?? null,
      parent_camp_num: campStatement?.parent_camp_num ?? null,
    };

    let res = await changeCommitStatement(reqBody);
    if (res?.status_code === 200) {
      setCommited(true);
      dispatch(setChangeGoneLive(!changeGoneLive));
    }
    changeAgree();
    setLoadingChanges(false);
    // await getTreesApi(reqBodyForService);
  };

  const discardChanges = async () => {
    setLoadingChanges(true);
    let reqBody = {
      type: historyOf,
      id: campStatement?.id,
    };
    let res = await discardStatement(reqBody);
    if (res?.status_code === 200) {
      setCommited(true);
    }
    changeDiscard();
    setLoadingChanges(false);
  };

  const agreeWithChange = async () => {
    setLoadingChanges(true);
    setIsSelectChecked(true);
    let reqBody = {
      record_id: campStatement.id,
      topic_num: router?.query.camp[0].split("-")[0],
      camp_num: historyOf == "topic" ? 1 : router?.query.camp[1].split("-")[0],
      change_for: historyOf,
      nick_name_id: userNickNameData[0]?.id,
      user_agreed: campStatement?.agreed_to_change ? 0 : 1,
    };
    let res = await agreeToChangeApi(reqBody);
    if (res?.status_code == 200) {
      dispatch(setChangeGoneLive(!changeGoneLive));
      res?.data?.is_submitted
        ? message.success(res?.message)
        : message?.error(res?.message);
      setIsSelectChecked(false);
    }

    changeAgree();
    setLoadingChanges(false);
  };

  let historyTitle = () => {
    let title: string;

    if (historyOf == "statement") {
      title = "Statement";
    } else if (historyOf == "camp") {
      title = "Camp Name";
    } else if (historyOf == "topic") {
      title = "Topic Name";
    }
    return title;
  };

  const submitUpdateRedirect = (historyOf: string) => {
    if (!isUserAuthenticated) {
      router?.push({
        pathname: "/login",
        query: { returnUrl: `/manage/${historyOf}/${campStatement?.id}` },
      });
    } else {
      router?.push(`/manage/${historyOf}/${campStatement?.id}`);
    }
  };

  const columns = [
    {
      title: "Nick Name",
      dataIndex: "nickNameData",
      render: (text) => (
        <Link href={text?.path} passHref>
          <a>{text?.name}</a>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (tag) => {
        return (
          <Tag color={tag ? "geekblue" : "volcano"} key={tag}>
            {tag ? "Agreed" : "Not Agreed"}
          </Tag>
        );
      },
    },
  ];
  const cancelConfirm = () => {
    Modal.confirm({
      title: "Do you want to discard this commit?",
      icon: <ExclamationCircleFilled />,
      content:
        "Please note that any unsaved changes will be lost if you cancel.",
      onOk() {
        discardChanges();
      },
    });
  };

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMM YYYY, hh:mm:ss A");
  };

  return (
    <>
      <div className={`csh-wrapper cn-wrapper 
         ${campStatement?.status == "live" ? "live-wrapper" :
          campStatement?.status == "in_review" ? "pending-wrapper" :
            campStatement?.status == "objected" ? "objected-wrapper" :
              campStatement?.status == "old" ? "previous-wrapper" : null} 
        `}>
        <div className="badge-wrapper">
          <Badge
            className="cn-dot-badge ch-dot-history"
            color=""
            text={
              <>
                {compareMode ? (
                  <>
                    {covertToTime(comparisonData?.submit_time).split(",")[0]}
                    ,<span> {covertToTime(comparisonData?.submit_time).split(",")[1]}</span>
                  </>
                ) : (
                  <>
                    {campStatement?.status === "live" ? (
                      <>
                        {covertToTime(campStatement?.go_live_time).split(",")[0]}
                        ,<span> {covertToTime(campStatement?.go_live_time).split(",")[1]}</span>
                      </>
                    ) : (
                      <>
                        {covertToTime(campStatement?.submit_time).split(",")[0]}
                        ,<span> {covertToTime(campStatement?.submit_time).split(",")[1]}</span>
                      </>
                    )}
                  </>
                )}
              </>
            }
          />

          {
            campStatement &&
            campStatement?.status == "in_review" &&
            !commited &&
            !!campStatement?.grace_period &&
            moment.now() < campStatement?.submit_time * 1000 + 3600000 && (
              <div className="tooltip-count">
                <Tooltip title={` Note: This countdown timer is the grace period in which
                      you can make minor changes to your
                      ${historyOf == "topic"
                    ? "topic"
                    : historyOf == "camp"
                      ? "camp"
                      : "statement"}
                      before other direct supporters are notified.`}>
                  <InfoCircleOutlined />
                </Tooltip>
                <p>Grace period countdown</p>
                <Tag
                  className={
                    "bg-[#5482C833] border-0 rounded-md inline-flex py-[3px] items-center"
                  }
                >
                  <Timer
                    unixTime={campStatement?.submit_time}
                    setCommited={setCommited}
                  />
                </Tag>
              </div>
            )
          }
        </div>
        {!compareMode &&

          <Checkbox className="mb-5 ch-checkbox"
            id={`select-to-compare-${campStatement?.id}`}
            onChange={onSelectCompare?.bind(this, campStatement)}
            disabled={isDisabledCheck}
            defaultChecked={isChecked}
            key={campStatement?.id}
          >
            Select to compare
          </Checkbox>
        }
        <Card className="cn-card">
          {
            historyOf == "statement" || historyState == "statement" && (
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
                    <h5 className="font-semibold text-[#F19C39] mb-3">Statement</h5>
                    <div
                      className="text-[#242B37] pb-5"
                      dangerouslySetInnerHTML={{
                        __html: campStatement?.parsed_value,
                      }}>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            )
          }

          {

          }
          {compareMode && (
            <CampHistory
              campStatement={comparisonData}
              topicNamespaceId={topicNamespaceId}
            />
          )}

          {!compareMode && historyOf == "statement" && (
            <StatementHistory
              campStatement={campStatement}
              topicNamespaceId={topicNamespaceId}
            />
          )}

          {!compareMode && historyOf == "camp" && (
            <CampHistory
              campStatement={campStatement}
              topicNamespaceId={topicNamespaceId}
            />
          )}
          {!compareMode && historyOf == "topic" && (
            <TopicHistory
              campStatement={campStatement}
              topicNamespaceId={topicNamespaceId}
            />
          )}

          <Divider className="border-[#242B3733] my-[1.125rem]" />
          <div className="agreement-wrapper">
            <div className="flex flex-col">
              {campStatement?.status == "in_review" &&
                (!campStatement?.grace_period || commited) && (<>
                  {!!(
                    campStatement?.ifIamSupporter != 0 ||
                    campStatement?.ifIAmExplicitSupporter
                  ) &&
                    isUserAuthenticated &&
                    !campStatement?.isAuthor && (<>
                      <Checkbox
                        defaultChecked={campStatement?.agreed_to_change}
                        disabled={
                          // historyOf == "camp" ? !campStatement?.ifICanAgreeAndObject : false ||
                          parentArchived == 1 && directarchived == 0
                        }
                        onChange={agreeWithChange}>I agree with this{" "}
                        {historyOf == "camp"
                          ? "camp"
                          : historyOf == "topic"
                            ? "topic"
                            : "statement"}{" "}
                        change</Checkbox>
                    </>)}
                </>)}
              <Space>

                {campStatement?.status == "in_review" &&
                  (!campStatement?.grace_period || commited) && (<>
                    {!!(
                      campStatement?.ifIamSupporter != 0 ||
                      campStatement?.ifIAmExplicitSupporter ||
                      campStatement?.isAuthor
                    ) && (<>
                      <HistoryCardDrawer
                        onClick={async () => {
                          let req = {
                            topic_num: router?.query.camp[0].split("-")[0],
                            camp_num:
                              historyOf == "topic"
                                ? 1
                                : router?.query.camp[1].split("-")[0],
                            change_id: campStatement?.id,
                            type: historyOf,
                          };
                          let res = await getChangeSupporters(req);
                          if (res.status_code == 200) {
                            let supportersData = res?.data.supporters?.map(
                              (data, key) => {
                                return {
                                  key: key,
                                  status: data?.agreed,
                                  nickNameData: {
                                    name: data?.nick_name,
                                    path: `/user/supports/${data?.id || ""
                                      }?canon=${topicNamespaceId || ""}`,
                                  },
                                };
                              }
                            );
                            setSupporters(supportersData);
                          }
                          setIsModalOpen(true);
                        }}
                        displayText={<>
                          {campStatement?.agreed_supporters} out of{" "}
                          {campStatement?.total_supporters} required
                          supporters have agreed
                          {(campStatement?.ifICanAgreeAndObject || campStatement?.ifICanAgreeAndObject == undefined) && !!(
                            campStatement?.ifIamSupporter != 0 ||
                            campStatement?.ifIAmExplicitSupporter
                          ) &&
                            isUserAuthenticated &&
                            !campStatement?.isAuthor &&
                            campStatement?.total_supporters -
                            campStatement?.agreed_supporters ==
                            1 &&
                            !campStatement?.agreed_to_change && (
                              <>
                                , Since you are the last hold out, the instant
                                you agree, this will go live.
                              </>
                            )}
                        </>}
                        agreedSupporters={supporters?.filter((obj) => obj?.status === true)}
                        notAgreedSupporters={supporters?.filter((obj) => obj?.status === false)}
                      />
                    </>)}
                  </>)}

              </Space>
            </div>
            {/* <Button
              type="link"
              danger
              size="large"
              icon={<i className="icon-delete"></i>}
              className="flex items-center justify-center gap-2 rounded-[10px] leading-none p-0"
            >
              Object
            </Button> */}
          </div>

          {!compareMode && (!campStatement?.grace_period || commited) && (
            <>
              <div className="cn-footer-btn">
                <div className="cn-card-btn">
                  <Button
                    size="large"
                    type="primary"
                    id={`submit-update-${campStatement?.id}`}
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none w-100"
                    onClick={() => {
                      campStatement?.is_archive == 1 &&
                        campStatement?.status == "live"
                        ? !isUserAuthenticated
                          ? router?.push({
                            pathname: "/login",
                            query: {
                              returnUrl: `/manage/${historyOf}/${campStatement?.id}`,
                            },
                          })
                          : callManageCampApi()
                        : submitUpdateRedirect(historyOf);
                    }}
                    disabled={
                      unarchiveChangeSubmitted ||
                        (campHistoryItems && campHistoryItems[0]?.status == "in_review" &&
                          !commited &&
                          !!campHistoryItems[0]?.grace_period) ||
                        (campHistoryItems?.at(0)?.status == "live" &&
                          campHistoryItems?.at(0)?.is_archive == 1 &&
                          campStatement.status == "old") ||
                        (parentArchived == 1 && directarchived == 0) ||
                        (parentArchived == 1 &&
                          directarchived == 1 &&
                          historyOf == "topic") ||
                        (campHistoryItems?.at(0)?.is_archive == 1 &&
                          campHistoryItems?.at(0)?.status == "live" &&
                          campStatement.status == "objected")
                        ? true
                        : false
                    }
                  >
                    Edit Based On This
                    <i className="icon-edit"></i>
                  </Button>

                  {(campStatement?.status == "in_review") && (
                    <>
                      <Button
                        size="large"
                        type="primary"
                        // disabled={historyOf == "camp" ? !campStatement?.ifICanAgreeAndObject : false}
                        id={`object-change-${campStatement?.id}`}
                        className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none w-100"
                        onClick={() => {
                          let isModelPop = !isUserAuthenticated
                            ? true
                            : (!campStatement?.ifIAmExplicitSupporter &&
                              campStatement?.ifIamSupporter == 0) ||
                              (parentArchived == 1 &&
                                directarchived == 1 &&
                                historyOf == "topic") ||
                              (parentArchived == 1 && directarchived == 0)
                              ? true
                              : false;
                          if (isModelPop) {
                            setModal1Open(true);
                          } else {
                            router?.push(
                              historyOf == "camp"
                                ? `/manage/camp/${campStatement?.id}-objection`
                                : historyOf == "topic"
                                  ? `/manage/topic/${campStatement?.id}-objection`
                                  : `/manage/statement/${campStatement?.id}-objection`
                            );
                          }
                        }}
                      >
                        Object Changes
                        <i className="icon-edit"></i>
                      </Button>
                    </>
                  )}
                </div>
                <div className="cn-link-btn">
                  <Button
                    size="large"
                    type="link"
                    icon={<EyeOutlined className="mr-1" />}
                    id={`view-this-version-${campStatement?.id}`}
                    className="flex items-center justify-center rounded-[10px] leading-none text-[#242B37]"
                    onClick={() =>
                      handleViewThisVersion(campStatement?.go_live_time)
                    }
                  >
                    <Link
                      href={`/topic/${replaceSpecialCharacters(
                        historyOf == "topic"
                          ? replaceSpecialCharacters(
                            campStatement?.topic_num +
                            "-" +
                            campStatement?.topic_name?.replace(/ /g, "-"),
                            "-"
                          )
                          : router?.query?.camp?.at(0),
                        "-"
                      ) +
                        "/" +
                        (historyOf != "topic"
                          ? historyOf == "camp"
                            ? replaceSpecialCharacters(
                              campStatement?.camp_num +
                              "-" +
                              campStatement?.camp_name?.replace(/ /g, "-"),
                              "-"
                            )
                            : replaceSpecialCharacters(
                              router?.query?.camp?.at(1),
                              "-"
                            )
                          : "1-Agreement")
                        }?algo=${algorithm}&asofdate=${campStatement?.go_live_time
                        }&asof=bydate&canon=${namespace_id}&viewversion=${1}`}
                    >
                      View Version
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}


          {
            campStatement?.status == "in_review" &&
            !commited &&
            !!campStatement?.grace_period &&
            moment.now() < campStatement?.submit_time * 1000 + 3600000 && (<>
              <div className="cn-footer-btn">
                <div className="cn-card-btn">
                  <Button
                    size="large"
                    type="primary"
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                    onClick={commitChanges}
                    id={`commit-change-${campStatement?.id}`}
                    disabled={loadingChanges}
                  >
                    Commit Changes
                    <i className="icon-upload"></i>
                  </Button>
                  <Button
                    size="large"
                    id={`edit-change-${campStatement?.id}`}
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                  >
                    <Link
                      href={
                        historyOf == "camp"
                          ? `/manage/camp/${campStatement?.id}-update`
                          : historyOf == "topic"
                            ? `/manage/topic/${campStatement?.id}-update`
                            : `/manage/statement/${campStatement?.id}-update`
                      }
                    >
                      Edit Change
                    </Link>
                    <i className="icon-edit"></i>
                  </Button>
                </div>
                <div className="cn-link-btn">
                  <Button
                    type="link"
                    danger
                    size="large"
                    icon={<i className="icon-delete"></i>}
                    id={`commit-change-${campStatement?.id}`}
                    className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                    onClick={() => cancelConfirm()}
                    disabled={loadingChanges}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>)
          }
        </Card>
      </div >
    </>
  );
}

export default HistoryCard;

const Timer = ({ unixTime, setCommited }: any) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hours, setHours] = useState(0);
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      let myInterval = setInterval(() => {
        if (hours > 0) {
          setHours(hours - 1);
        }
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (hours === 0) {
          if (seconds === 0) {
            if (minutes === 0) {
              setCommited(true);
              clearInterval(myInterval);
            } else {
              setMinutes(minutes - 1);
              setSeconds(59);
            }
          }
        } else {
          setMinutes(59);
          setSeconds(59);
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    }
  });

  const timeall = () => {
    if (moment.now() < unixTime * 1000 + 3600000) {
      let resetSecLim = Math.floor(
        (unixTime * 1000 + 3600000 - moment.now() + 53000) / 1000
      );
      let resetMinLim = Math.floor(resetSecLim / 60) % 60;
      if (resetMinLim >= 59 && resetSecLim % 60 >= 55) {
        convertMsToTime(3600000);
      } else {
        convertMsToTime(unixTime * 1000 + 3600000 - moment.now());
      }
    }
  };
  function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
    return `${hours}:${minutes}:${seconds}`;
  }
  useEffect(() => {
    timeall();
    didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unixTime]);

  return (
    <div>
      {hours === -1 && minutes === -1 && seconds === -1 ? (
        <span> 00:00:00 </span>
      ) : (
        <span>
          {" "}
          {hours < 10 ? `0${hours}` : hours}:
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      )}
    </div>
  );
};
export { Timer };
