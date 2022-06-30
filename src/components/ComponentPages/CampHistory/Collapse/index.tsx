import { Typography, Button, Collapse, Space, Checkbox, Divider } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import moment from "moment";

import {
  changeCommitStatement,
  agreeToChangeApi,
} from "../../../../network/api/campStatementHistory";

import styles from ".././campHistory.module.scss";

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

  return campStatement?.status == "in_review" &&
    campStatement?.grace_period != 0 &&
    !campStatement?.isAuthor ? null : (
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
              <Title level={5}>Statement :</Title>
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
                <Title level={5}>
                  Edit summary :{" "}
                  <span className={styles.updateSurveyPrj}>
                    {campStatement?.note}
                  </span>
                </Title>
                <Title level={5}>
                  Submitted on : <span>{campStatement?.submit_time}</span>
                </Title>
                <Title level={5}>
                  Submitter Nick Name :{" "}
                  <span>
                    <a href="">{campStatement?.objector_nick_name}</a>
                  </span>
                </Title>
                {campStatement?.object_reason && (
                  <Title level={5}>
                    Object reason : <span>{campStatement?.object_reason}</span>
                  </Title>
                )}
                <Title level={5}>
                  Go live Time : <span>{campStatement?.go_live_time}</span>
                </Title>
                <Checkbox
                  className={styles.campSelectCheckbox}
                  onChange={onSelectCompare.bind(this, campStatement)}
                  disabled={isDisabledCheck}
                  defaultChecked={isChecked}
                >
                  Select to Compare
                </Checkbox>
              </div>
              <div className={styles.campStatementCollapseButtons}>
                {campStatement?.status == "in_review" && (
                  <Button
                    type="primary"
                    disabled={
                      ifIamSupporter == 0
                        ? true
                        : campStatement?.isAuthor
                        ? true
                        : false
                    }
                    className={styles.campVersionButton}
                  >
                    <Link
                      href={`/manage/statement/${campStatement?.id}-objection`}
                    >
                      Object
                    </Link>
                  </Button>
                )}
                <Button type="primary" className={styles.campUpdateButton}>
                  <Link href={`/manage/statement/${campStatement?.id}`}>
                    Submit Statement Update Based on This
                  </Link>
                </Button>
                <Button type="primary" className={styles.campVersionButton}>
                  <Link
                    href={{
                      pathname: `/topic/${
                        router?.query?.camp[0] + "/" + router?.query?.camp[1]
                      }`,
                      query: {
                        asof: "bydate",
                        asofdate: campStatement?.go_live_time,
                      },
                    }}
                  >
                    View This Version
                  </Link>
                </Button>
              </div>
              {campStatement?.status == "in_review" &&
                !commited &&
                !!campStatement?.grace_period && (
                  <div className={styles.campStatementCollapseButtons}>
                    <p>
                      Note: This countdown timer is the grace period in which
                      you can make minor changes to your statement before other
                      direct supporters are notified.
                    </p>
                    <Button type="primary" className={styles.campUpdateButton}>
                      {campStatement && (
                        <Timer
                          unixTime={campStatement?.submit_time}
                          setCommited={setCommited}
                        />
                      )}
                    </Button>
                    <Button type="primary" className={styles.campUpdateButton}>
                      <Link
                        href={`/manage/statement/${campStatement?.id}-update`}
                      >
                        Edit Change
                      </Link>
                    </Button>
                    <Button
                      type="primary"
                      className={styles.campUpdateButton}
                      onClick={commitChanges}
                    >
                      Commit Change
                    </Button>
                  </div>
                )}
              {campStatement?.status == "in_review" && ifIamSupporter != 0 && (
                <div>
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
      {hours === 0 && minutes === 0 && seconds === 0 ? (
        <h1> 00:00:00 </h1>
      ) : (
        <h1>
          {" "}
          {hours < 10 ? `0${hours}` : hours}:
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </h1>
      )}
    </div>
  );
};
