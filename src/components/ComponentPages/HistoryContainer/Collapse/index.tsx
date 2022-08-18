import {
  Typography,
  Button,
  Collapse,
  Space,
  Checkbox,
  Divider,
  Tooltip,
} from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

import {
  changeCommitStatement,
  agreeToChangeApi,
} from "../../../../network/api/history";
import { useDispatch } from "react-redux";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

import styles from ".././campHistory.module.scss";
import StatementHistory from "./statementHistory";
import CampHistory from "./campHistory";
import TopicHistory from "./topicHistory";
import useAuthentication from "src/hooks/isUserAuthenticated";

const { Panel } = Collapse;
const { Title } = Typography;

function HistoryCollapse({
  ifIamSupporter,
  ifSupportDelayed,
  campStatement,
  onSelectCompare,
  isDisabledCheck,
  changeAgree,
  isChecked,
}) {
  const router = useRouter();
  const [commited, setCommited] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useAuthentication();
  const handleViewThisVersion = (goLiveTime) => {
    dispatch(
      setFilterCanonizedTopics({
        asofdate: goLiveTime,
        asof: "bydate",
      })
    );
  };
  const historyOf = router?.asPath.split("/")[1];
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

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

  const agreeWithChange = async () => {
    let reqBody = {
      record_id: campStatement.id,
      topic_num: router.query.camp[0].split("-")[0],
      camp_num: historyOf == "topic" ? 1 : router.query.camp[1].split("-")[0],
      change_for: historyOf,

      nick_name_id: campStatement?.submitter_nick_id,
    };
    let res = await agreeToChangeApi(reqBody);
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
              {historyOf == "statement" && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: campStatement?.parsed_value,
                  }}
                />
              )}

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
                  <StatementHistory campStatement={campStatement} />
                )}
                {historyOf == "camp" && (
                  <CampHistory campStatement={campStatement} />
                )}
                {historyOf == "topic" && (
                  <TopicHistory campStatement={campStatement} />
                )}

                <Checkbox
                  className={styles.campSelectCheckbox}
                  onChange={onSelectCompare.bind(this, campStatement)}
                  disabled={isDisabledCheck}
                  defaultChecked={isChecked}
                  key={campStatement.id}
                >
                  Select to Compare
                </Checkbox>
              </div>
              <div className={styles.campStatementCollapseButtons}>
                {(campStatement?.status == "in_review" ||
                  (campStatement?.status == "objected" &&
                    historyOf != "statement")) && (
                  <Tooltip
                    title={
                      !!(
                        !isLoggedIn &&
                        ifIamSupporter == 0 &&
                        ifSupportDelayed == 0
                      )
                        ? "Only admin can object"
                        : campStatement?.isAuthor
                        ? "Only admin can object"
                        : false
                    }
                  >
                    <Button
                      type="primary"
                      disabled={
                        !isLoggedIn
                          ? true
                          : !!(ifIamSupporter == 0 && ifSupportDelayed == 0)
                          ? true
                          : campStatement?.isAuthor
                          ? true
                          : false
                      }
                      onClick={() =>
                        router.push(
                          historyOf == "camp"
                            ? `/manage/camp/${campStatement?.id}-objection`
                            : historyOf == "topic"
                            ? `/manage/topic/${campStatement?.id}-objection`
                            : `/manage/statement/${campStatement?.id}-objection`
                        )
                      }
                      className={`mr-3 ${styles.campUpdateButton}`}
                    >
                      Object
                    </Button>
                  </Tooltip>
                )}
                <Button
                  type="primary"
                  className={`mr-3 ${styles.campUpdateButton}`}
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push("/login");
                    } else if (historyOf == "statement") {
                      router.push(`/manage/statement/${campStatement?.id}`);
                    } else if (historyOf == "camp") {
                      router.push(`/manage/camp/${campStatement?.id}`);
                    } else if (historyOf == "topic") {
                      router.push(`/manage/topic/${campStatement?.id}`);
                    }
                  }}
                >
                  {historyOf == "camp"
                    ? "Submit Camp Update Based on This"
                    : historyOf == "topic"
                    ? "Submit Topic Update Based on This"
                    : "Submit Statement Update Based on This"}
                </Button>
                <Button
                  type="primary"
                  className={styles.campVersionButton}
                  onClick={() =>
                    handleViewThisVersion(campStatement?.go_live_time)
                  }
                >
                  <Link
                    href={`/topic/${
                      router?.query?.camp[0] +
                      "/" +
                      (historyOf != "topic"
                        ? router?.query?.camp[1]
                        : "1-Agreement")
                    }`}
                  >
                    View This Version
                  </Link>
                </Button>
              </div>
              {campStatement?.status == "in_review" &&
                !commited &&
                !!campStatement?.grace_period && (
                  <div className={styles.campStatementCollapseButtons}>
                    <Divider className="mt-0"></Divider>
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
                      <Button type="primary" className=" mr-3">
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
                      <Button type="primary" onClick={commitChanges}>
                        Commit Change
                      </Button>
                    </div>
                  </div>
                )}
              {campStatement?.status == "in_review" &&
                !!(ifIamSupporter != 0 || ifSupportDelayed != 0) &&
                isLoggedIn && (
                  <div className={styles.campStatementCollapseButtons}>
                    <Checkbox
                      className={styles.campSelectCheckbox}
                      onChange={agreeWithChange}
                    >
                      I agree with this statement change
                    </Checkbox>
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

const Timer = ({ unixTime, setCommited }) => {
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
    let now_time = moment.now();
    if (moment.now() < unixTime * 1000 + 3600000) {
      let currenttime = new Date();
      let subtime = new Date(unixTime * 1000 + 3600000);
      convertMsToTime(unixTime * 1000 + 3600000 - moment.now() + 34900);
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
