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
} from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, Fragment } from "react";

import { LoadingOutlined } from "@ant-design/icons";
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
import { getTreesApi } from "src/network/api/campDetailApi";

import { setViewThisVersion } from "src/store/slices/filtersSlice";

const { Panel } = Collapse;
const { Title } = Typography;

import { ExclamationCircleFilled } from "@ant-design/icons";
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
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.loading,
  }));
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
  const { asofdate, asof, algorithm, namespace_id } = useSelector(
    (state: RootState) => ({
      asofdate: state.filters?.filterObject?.asofdate,
      asof: state?.filters?.filterObject?.asof,
      algorithm: state.filters?.filterObject?.algorithm,
      namespace_id: state.filters?.filterObject?.namespace_id,
    })
  );
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
    const reqBodyForService = {
      topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
      camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0) || 1,
      asOf: asof,
      asofdate:
        asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
    };

    let res = await changeCommitStatement(reqBody);
    if (res?.status_code === 200) {
      setCommited(true);
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
      title: "Do you want to cancel this commit?",
      icon: <ExclamationCircleFilled />,
      content:
        "Please note that any unsaved changes will be lost if you cancel.",
      onOk() {
        discardChanges();
      },
    });
  };
  return (
    <div>
      <Space
        direction="vertical"
        className={`${
          styles[campStatement?.status ? campStatement?.status : "live"]
        } ${styles.campStatementCollapseHistory}`}
      >
        <Collapse
          collapsible="header"
          defaultActiveKey={["1"]}
          expandIconPosition="right"
          className={`campHistoryCollapseCards ${
            campStatement?.status ? campStatement?.status : "live"
          } ${styles.collapsiablePanel} `}
          activeKey={collapseKey}
          onChange={() => {
            if (historyOf == "statement") {
              if (collapseKey == "") {
                setCollapseKey("1");
              } else {
                setCollapseKey("");
              }
            }
          }}
        >
          <Panel
            header={
              historyOf == "statement" ? <i className="icon-uparrow"></i> : ""
            }
            key="1"
            className={` ${styles.campStatementCollapse}  ${
              historyOf != "statement" ? "header-none" : ""
            } `}
            showArrow={false}
          >
            <Fragment>
              <Title level={5}>
                {historyTitle()} :{" "}
                {historyOf == "camp" && (
                  <span className={styles.updateSurveyPrj}>
                    {campStatement?.camp_name}
                  </span>
                )}
                {historyOf == "topic" && (
                  <span className={styles.updateSurveyPrj}>
                    {campStatement?.topic_name}
                  </span>
                )}
              </Title>
              <div>
                {historyOf == "statement" && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<div class="ck-content">${campStatement?.parsed_value}</div>`,
                    }}
                  />
                )}
              </div>
              <Divider />
            </Fragment>
          </Panel>
          <Fragment>
            <div className={styles.campCollapseSummaryWrap}>
              <div className={styles.campStatementCollapseSummary}>
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

                <Checkbox
                  className={styles.campSelectCheckbox}
                  id={`select-to-compare-${campStatement?.id}`}
                  onChange={onSelectCompare?.bind(this, campStatement)}
                  disabled={isDisabledCheck}
                  defaultChecked={isChecked}
                  key={campStatement?.id}
                >
                  Select To Compare
                </Checkbox>
              </div>
              {(!campStatement?.grace_period || commited) && (
                <div className={styles.campStatementCollapseButtons}>
                  {(campStatement?.status == "in_review" ||
                    (campStatement?.status == "objected" &&
                      historyOf != "statement")) && (
                    <>
                      <Tooltip
                        title={
                          (
                            !isUserAuthenticated
                              ? true
                              : !campStatement?.ifIAmExplicitSupporter &&
                                campStatement?.ifIamSupporter == 0
                              ? true
                              : false
                          )
                            ? K?.exceptionalMessages?.objectedTooltipMsg
                            : ""
                        }
                      >
                        <Button
                          type="primary"
                          id={`object-change-${campStatement?.id}`}
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
                          className={`mr-3 ${
                            (
                              !isUserAuthenticated
                                ? true
                                : (!campStatement?.ifIAmExplicitSupporter &&
                                    campStatement?.ifIamSupporter == 0) ||
                                  (campHistoryItems[0]?.is_archive == 1 &&
                                    campHistoryItems[0]?.status == "live" &&
                                    campStatement.status == "objected") ||
                                  (parentArchived == 1 &&
                                    directarchived == 1 &&
                                    historyOf == "topic") ||
                                  (parentArchived == 1 && directarchived == 0)
                                ? true
                                : false
                            )
                              ? "disable-style"
                              : ""
                          } ${styles.campUpdateButton}`}
                        >
                          Object
                        </Button>
                      </Tooltip>
                      <Modal
                        title={K?.exceptionalMessages?.objectedModelTitle}
                        style={{
                          top: 20,
                        }}
                        centered
                        okText="Close"
                        visible={modal1Open}
                        footer={[
                          <Button
                            key="submit"
                            danger
                            type="primary"
                            onClick={() => setModal1Open(false)}
                          >
                            Close
                          </Button>,
                        ]}
                        onCancel={() => setModal1Open(false)}
                      >
                        <p>{K?.exceptionalMessages?.objectedModalMsg}</p>
                        <p>
                          {K?.exceptionalMessages?.objectedModalMsgForMoreInfo}
                        </p>
                        <Link href="/topic/132-Help/4-Disagreement?is_tree_open=1">
                          <a style={{ fontSize: "16px" }}>
                            https://canonizer.com/topic/132-Help/4-Disagreement
                          </a>
                        </Link>
                      </Modal>
                    </>
                  )}

                  <Button
                    type="primary"
                    id={`submit-update-${campStatement?.id}`}
                    className={`mr-3 ${styles.campUpdateButton}`}
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
                    {historyOf == "camp" &&
                    campStatement?.is_archive == 1 &&
                    campStatement?.status == "live"
                      ? "Un-Archive This Camp"
                      : historyOf == "topic"
                      ? "Submit Topic Update Based On This"
                      : historyOf == "camp"
                      ? "Submit Camp Update Based On This"
                      : "Submit Statement Update Based On This"}
                  </Button>
                  <Button
                    type="primary"
                    id={`view-this-version-${campStatement?.id}`}
                    className={styles.campVersionButton}
                    onClick={() =>
                      handleViewThisVersion(campStatement?.go_live_time)
                    }
                  >
                    <Link
                      href={`/topic/${
                        replaceSpecialCharacters(
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
                      }?algo=${algorithm}&asofdate=${
                        campStatement?.go_live_time
                      }&asof=bydate&canon=${namespace_id}&viewversion=${1}`}
                    >
                      View This Version
                    </Link>
                  </Button>
                </div>
              )}
              {campStatement?.status == "in_review" &&
                !commited &&
                !!campStatement?.grace_period &&
                moment.now() < campStatement?.submit_time * 1000 + 3600000 && (
                  <div className={styles.campStatementCollapseButtons}>
                    <p className="w-100">
                      Note: This countdown timer is the grace period in which
                      you can make minor changes to your{" "}
                      {historyOf == "topic"
                        ? "topic"
                        : historyOf == "camp"
                        ? "camp"
                        : "statement"}{" "}
                      before other direct supporters are notified.
                    </p>
                    <div className={`mb-3 text-right ${styles.resActionBtn}`}>
                      <span className="ant-btn ant-btn-primary mr-3">
                        {campStatement && (
                          <Timer
                            unixTime={campStatement?.submit_time}
                            setCommited={setCommited}
                          />
                        )}
                      </span>
                      <Button
                        type="primary"
                        className=" mr-3"
                        id={`edit-change-${campStatement?.id}`}
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
                      </Button>
                      <Button
                        className=" mr-3"
                        type="primary"
                        onClick={commitChanges}
                        id={`commit-change-${campStatement?.id}`}
                        disabled={loadingChanges}
                      >
                        Commit Change
                      </Button>
                      <Button
                        className=" mr-3"
                        type="primary"
                        danger
                        onClick={() => cancelConfirm()}
                        id={`commit-change-${campStatement?.id}`}
                        disabled={loadingChanges}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              {campStatement?.status == "in_review" &&
                (!campStatement?.grace_period || commited) && (
                  <div className={styles.campStatementCollapseButtons}>
                    <Spin spinning={loadingChanges} size="default">
                      {" "}
                      <div className={styles.infoText}>
                        {!!(
                          campStatement?.ifIamSupporter != 0 ||
                          campStatement?.ifIAmExplicitSupporter ||
                          campStatement?.isAuthor
                        ) && (
                          <div
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
                                        path: `/user/supports/${
                                          data?.id || ""
                                        }?canon=${topicNamespaceId || ""}`,
                                      },
                                    };
                                  }
                                );
                                setSupporters(supportersData);
                              }
                              setIsModalOpen(true);
                            }}
                          >
                            <i
                              className="icon-info tooltip-icon-style"
                              style={{
                                position: "relative",
                                top: 2,
                                marginRight: 8,
                              }}
                            ></i>
                            {"    "}
                            {campStatement?.agreed_supporters} out of{" "}
                            {campStatement?.total_supporters} required
                            supporters have agreed
                            {!!(
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
                          </div>
                        )}
                      </div>
                      <Modal
                        title="Direct Supporters"
                        centered
                        className="direct-support-modal"
                        open={isModalOpen}
                        onCancel={() => {
                          setIsModalOpen(false);
                        }}
                        footer={null}
                      >
                        {supporters.length > 0 && (
                          <Tabs
                            defaultActiveKey="1"
                            className="agreed-tabs"
                            items={[
                              {
                                key: "1",
                                label: `Not Agreed`,
                                children: (
                                  <>
                                    <Table
                                      dataSource={supporters?.filter(
                                        (obj) => obj.status === false
                                      )}
                                      pagination={false}
                                      columns={columns}
                                    />
                                  </>
                                ),
                              },
                              {
                                key: "2",
                                label: `Agreed`,
                                children: (
                                  <>
                                    {" "}
                                    <Table
                                      dataSource={supporters?.filter(
                                        (obj) => obj.status === true
                                      )}
                                      pagination={false}
                                      columns={columns}
                                    />
                                  </>
                                ),
                              },
                            ]}
                          />
                        )}
                      </Modal>
                      {!!(
                        campStatement?.ifIamSupporter != 0 ||
                        campStatement?.ifIAmExplicitSupporter
                      ) &&
                        isUserAuthenticated &&
                        !campStatement?.isAuthor && (
                          <Spin
                            indicator={
                              <LoadingOutlined
                                style={{
                                  fontSize: 21,
                                  left: 8,
                                }}
                                spin
                              />
                            }
                            spinning={isSelectChecked}
                          >
                            <Checkbox
                              defaultChecked={campStatement?.agreed_to_change}
                              className={
                                styles.campSelectCheckbox + " agreed-text"
                              }
                              disabled={
                                parentArchived == 1 && directarchived == 0
                              }
                              onChange={agreeWithChange}
                            >
                              I agree with this{" "}
                              {historyOf == "camp"
                                ? "camp"
                                : historyOf == "topic"
                                ? "topic"
                                : "statement"}{" "}
                              change
                            </Checkbox>
                          </Spin>
                        )}
                    </Spin>
                  </div>
                )}
            </div>
          </Fragment>
        </Collapse>
      </Space>
    </div>
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
