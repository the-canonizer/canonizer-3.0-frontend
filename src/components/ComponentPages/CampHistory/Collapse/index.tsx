import {
  Typography,
  Button,
  Collapse,
  Space,
  Checkbox,
  Divider,
  Tooltip,
  Tag,
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

const { Panel } = Collapse;
const { Title } = Typography;

function HistoryCollapse({
  ifIamSupporter,
  campStatement,
  onSelectCompare,
  isDisabledCheck,
  changeAgree,
  isChecked,
}) {
  const router = useRouter();
  const [commited, setCommited] = useState(false);
  const dispatch = useDispatch();

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
      type: "statement",
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
      camp_num: router.query.camp[1].split("-")[0],
      change_for: "statement",
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
      title = "Camp";
    } else if (historyOf == "topic") {
      title = "Topic";
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
              <div
                dangerouslySetInnerHTML={{
                  __html: campStatement?.parsed_value,
                }}
              />
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

                {/* <Title level={5}>
                  Edit summary :{" "}
                  <span className={styles.updateSurveyPrj}>
                    {campStatement?.note}
                  </span>
                </Title>
                <Title level={5}>
                  Submitted on :{" "}
                  <span>{covertToTime(campStatement?.submit_time)}</span>
                </Title>
                <Title level={5}>
                  Submitter Nick Name :{" "}
                  <span>
                    <Link
                      href={`/user/supports/${
                        campStatement?.submitter_nick_id || ""
                      }?topicnum=${campStatement?.topic_num || ""}&campnum=${
                        campStatement?.camp_num || ""
                      }&namespace=1`}
                      passHref
                    >
                      <a>{campStatement?.submitter_nick_name}</a>
                    </Link>
                  </span>
                </Title>
                {campStatement?.object_reason && (
                  <Title level={5}>
                    Object reason : <span>{campStatement?.object_reason}</span>
                  </Title>
                )}
                {campStatement?.objector_nick_name && (
                  <Title level={5}>
                    Object Nick Name :{" "}
                    <span>{campStatement?.objector_nick_name}</span>
                  </Title>
                )}
                <Title level={5}>
                  Go live Time :{" "}
                  <span>{covertToTime(campStatement?.go_live_time)}</span>
                </Title> */}
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
                {campStatement?.status == "in_review" && (
                  <Tooltip
                    title={
                      ifIamSupporter == 0
                        ? "Only admin can object"
                        : campStatement?.isAuthor
                        ? "Only admin can object"
                        : false
                    }
                  >
                    <Button
                      type="primary"
                      disabled={
                        ifIamSupporter == 0
                          ? true
                          : campStatement?.isAuthor
                          ? true
                          : false
                      }
                      onClick={() =>
                        router.push(
                          `/manage/statement/${campStatement?.id}-objection`
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
                  onClick={() =>
                    router.push(`/manage/statement/${campStatement?.id}`)
                  }
                >
                  Submit Statement Update Based on This
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
                      router?.query?.camp[0] + "/" + router?.query?.camp[1]
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
                      you can make minor changes to your statement before other
                      direct supporters are notified.
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
                          href={`/manage/statement/${campStatement?.id}-update`}
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
              {campStatement?.status == "in_review" && ifIamSupporter != 0 && (
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
