import {
  Typography,
  Button,
  Collapse,
  Space,
  Checkbox,
  Divider,
  Modal,
  Spin,
  Tooltip,
  Tabs,
  Tag,
  message,
  Table,
  Card,
  Badge,
} from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, Fragment } from "react";

import { EyeOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  changeCommitStatement,
  discardStatement,
  agreeToChangeApi,
} from "../../../../network/api/history";
import { setFilterCanonizedTopics } from "../../../../store/slices/filtersSlice";
import { RootState } from "../../../../store";
import K from "../../../../constants";

import {
  // getHistoryApi,
  getChangeSupporters,
} from "../../../..//network/api/history";

import { useDispatch, useSelector } from "react-redux";
import styles from ".././campHistory.module.scss";
import StatementHistory from "./statementHistory";
import CampHistory from "./campHistory";
import TopicHistory from "./topicHistory";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";

import { setViewThisVersion } from "src/store/slices/filtersSlice";

const { Panel } = Collapse;
const { Title } = Typography;

import { ExclamationCircleFilled } from "@ant-design/icons";
import { setChangeGoneLive } from "src/store/slices/campDetailSlice";
function HistoryCollapse({
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
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  return (
    <>
      <Card className="ch-content" bordered={false}>
        <div className={`cn-wrapper csh-wrapper
        ${campStatement?.status == "live" ? "live-wrapper" :
            campStatement?.status == "in_review" ? "pending-wrapper" :
              campStatement?.status == "not_live" ? "objected-wrapper" :
                campStatement?.status == "old" ? "previous-wrapper" : null}`}>
          <div className="badge-wrapper">
            <Badge
              className="cn-dot-badge ch-dot-history"
              color=""
              text={
                <>
                  {campStatement?.status == "live" ? (<>
                    {covertToTime(campStatement?.go_live_time).split(",")[0]}
                    ,<span> {covertToTime(campStatement?.go_live_time).split(",")[1]}</span>
                  </>) : (<>
                    {covertToTime(campStatement?.submit_time).split(",")[0]}
                    ,<span> {covertToTime(campStatement?.submit_time).split(",")[1]}</span>
                  </>)}
                </>
              }
            />
            <div className="tooltip-count">
              {
                campStatement &&
                campStatement?.status == "in_review" &&
                !commited &&
                !!campStatement?.grace_period &&
                moment.now() < campStatement?.submit_time * 1000 + 3600000 && (
                  <>
                    <Tooltip title="prompt text">
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
                  </>
                )}
            </div>
          </div>
          <Checkbox className="mb-5 ch-checkbox"
            id={`select-to-compare-${campStatement?.id}`}
            onChange={onSelectCompare?.bind(this, campStatement)}
            disabled={isDisabledCheck}
            defaultChecked={isChecked}
            key={campStatement?.id}
          >
            Select to compare
          </Checkbox>
          <Card className="cn-card">
            {
              historyOf == "statement" && (
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
              )
            }

            {historyOf == "statement" && (
              <StatementHistory
                campStatement={campStatement}
                topicNamespaceId={topicNamespaceId}
              />
            )}

            {historyOf == "camp" && (
              <CampHistory
                campStatement={campStatement}
                topicNamespaceId={topicNamespaceId}
              />
            )}
            {historyOf == "topic" && (
              <TopicHistory
                campStatement={campStatement}
                topicNamespaceId={topicNamespaceId}
              />
            )}

            <Divider className="border-[#242B3733] my-[1.125rem]" />

            {(!campStatement?.grace_period || commited ) && (
              <>
                {(campStatement?.status == "in_review") && (
                  <>
                    {/* object btn */}
                    <div className="cn-footer-btn">
                      <div className="cn-card-btn">
                        <Button
                          size="large"
                          type="primary"
                          className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none px-10"
                        >
                          Object
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
                          disabled={loadingChanges}
                          onClick={() => cancelConfirm()}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* modal */}
                  </>)}
                {/* Submit Statement Update Based On This */}
                {/* View this version */}
                <div className="cn-footer-btn">
                  <div className="cn-card-btn">
                    <Button
                      size="large"
                      type="primary"
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
                          (campHistoryItems[0]?.status == "in_review" &&
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
                      Edit Based on This
                      <i className="icon-upload"></i>
                    </Button>
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

            {campStatement?.status == "in_review" &&
              !commited &&
              !!campStatement?.grace_period &&
              moment.now() < campStatement?.submit_time * 1000 + 3600000 && (
                <>
                  <div className="cn-footer-btn">
                    <div className="cn-card-btn">
                      <Button
                        size="large"
                        type="primary"
                        id={`commit-change-${campStatement?.id}`}
                        className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none"
                        disabled={loadingChanges}
                        onClick={commitChanges}
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
                      <Button
                        type="link"
                        danger
                        size="large"
                        icon={<i className="icon-delete"></i>}
                        id={`commit-change-${campStatement?.id}`}
                        className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                        disabled={loadingChanges}
                        onClick={() => cancelConfirm()}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </>
              )}
          </Card>
        </div>
      </Card>
    </>
  );
}

export default HistoryCollapse;

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
