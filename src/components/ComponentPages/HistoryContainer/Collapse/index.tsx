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
} from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

import {
  changeCommitStatement,
  discardStatement,
  agreeToChangeApi,
} from "../../../../network/api/history";
import { setFilterCanonizedTopics } from "../../../../store/slices/filtersSlice";
import { RootState } from "../../../../store";
import K from "../../../../constants";

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

function HistoryCollapse({
  ifIamSupporter,
  ifSupportDelayed,
  ifIAmExplicitSupporter,
  userNickNameData,
  topicNamespaceId,
  campStatement,
  onSelectCompare,
  isDisabledCheck,
  changeAgree,
  changeDiscard,
  isChecked,
  setIsTreesApiCallStop,
}: any) {
  const router = useRouter();
  const [commited, setCommited] = useState(false);
  const [isSelectChecked, setIsSelectChecked] = useState(false);
  const { loading } = useSelector((state: RootState) => ({
    loading: state?.loading?.loading,
  }));

  const [modal1Open, setModal1Open] = useState(false);
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
  const historyOf = router?.asPath.split("/")[1];
  // const covertToTime = (unixTime) => {
  //   return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  // };

  const commitChanges = async () => {
    let reqBody = {
      type: historyOf,
      id: campStatement?.id,
    };
    let res = await changeCommitStatement(reqBody);
    if (res?.status_code === 200) {
      setCommited(true);
    }
  };

  const discardChanges = async () => {
    let reqBody = {
      type: historyOf,
      id: campStatement?.id,
    };
    let res = await discardStatement(reqBody);
    if (res?.status_code === 200) {
      setCommited(true);
    }
    changeDiscard();
  };

  const agreeWithChange = async () => {
    setIsSelectChecked(true);
    let reqBody = {
      record_id: campStatement.id,
      topic_num: router.query.camp[0].split("-")[0],
      camp_num: historyOf == "topic" ? 1 : router.query.camp[1].split("-")[0],
      change_for: historyOf,
      nick_name_id: userNickNameData[0]?.id,
      user_agreed: campStatement?.agreed_to_change ? 0 : 1,
    };
    await agreeToChangeApi(reqBody);
    changeAgree();
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
      router.push({
        pathname: "/login",
        query: { returnUrl: `/manage/${historyOf}/${campStatement?.id}` },
      });
    } else {
      router.push(`/manage/${historyOf}/${campStatement?.id}`);
    }
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
          className={`campHistoryCollapseCards + " " + ${
            campStatement?.status ? campStatement?.status : "live"
          }`}
        >
          <Panel
            header={<i className="icon-uparrow"></i>}
            key="1"
            className={styles.campStatementCollapse}
            showArrow={false}
          >
            <>
              <Title level={5}>{historyTitle()} :</Title>
              <div>
                {historyOf == "statement" && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: campStatement?.value,
                    }}
                  />
                )}
              </div>

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

              <Divider />
            </>
          </Panel>
          <>
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
                              : (!ifIAmExplicitSupporter &&
                                  ifIamSupporter == 0) ||
                                ifSupportDelayed != 0
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
                              : (!ifIAmExplicitSupporter &&
                                  ifIamSupporter == 0) ||
                                ifSupportDelayed != 0
                              ? true
                              : false;
                            if (isModelPop) {
                              setModal1Open(true);
                            } else {
                              router.push(
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
                                : (!ifIAmExplicitSupporter &&
                                    ifIamSupporter == 0) ||
                                  ifSupportDelayed != 0
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
                        <Link href="/topic/132-Help/4-Disagreement">
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
                    onClick={() => submitUpdateRedirect(historyOf)}
                  >
                    {historyOf == "camp"
                      ? "Submit Camp Update Based On This"
                      : historyOf == "topic"
                      ? "Submit Topic Update Based On This"
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
                      href={{
                        pathname: `/topic/${
                          replaceSpecialCharacters(
                            historyOf == "topic"
                              ? replaceSpecialCharacters(
                                  campStatement?.topic_num +
                                    "-" +
                                    campStatement?.topic_name?.replace(
                                      / /g,
                                      "-"
                                    ),
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
                                    campStatement?.camp_name?.replace(
                                      / /g,
                                      "-"
                                    ),
                                  "-"
                                )
                              : replaceSpecialCharacters(
                                  router?.query?.camp?.at(1),
                                  "-"
                                )
                            : "1-Agreement")
                        }`,
                      }}
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
                    <div className="mb-3 text-right">
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
                        disabled={loading}
                      >
                        Commit Change
                      </Button>
                      <Button
                        className=" mr-3"
                        type="primary"
                        danger
                        onClick={discardChanges}
                        id={`commit-change-${campStatement?.id}`}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              {campStatement?.status == "in_review" &&
                (!campStatement?.grace_period || commited) && (
                  <div className={styles.campStatementCollapseButtons}>
                    <Spin spinning={loading} size="default">
                      {" "}
                      <div className={styles.infoText}>
                        {!!(
                          (ifIamSupporter != 0 && ifSupportDelayed == 0) ||
                          ifIAmExplicitSupporter ||
                          campStatement?.isAuthor
                        ) && (
                          <>
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
                              (ifIamSupporter != 0 && ifSupportDelayed == 0) ||
                              ifIAmExplicitSupporter
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
                          </>
                        )}
                      </div>
                      {!!(
                        (ifIamSupporter != 0 && ifSupportDelayed == 0) ||
                        ifIAmExplicitSupporter
                      ) &&
                        isUserAuthenticated &&
                        !campStatement?.isAuthor && (
                          <Checkbox
                            defaultChecked={campStatement?.agreed_to_change}
                            className={
                              styles.campSelectCheckbox + " agreed-text"
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
                        )}
                    </Spin>
                  </div>
                )}
            </div>
          </>
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
