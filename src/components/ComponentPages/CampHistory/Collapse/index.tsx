import { Typography, Button, Collapse, Space, Checkbox, Divider } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import moment from "moment";

import { changeCommitStatement } from "../../../../network/api/campStatementHistory";

import styles from ".././campHistory.module.scss";

const { Panel } = Collapse;
const { Title } = Typography;

function HistoryCollapse({
  ifIamSupporter,
  campStatement,
  onSelectCompare,
  isDisabledCheck,
  isChecked,
}) {
  const router = useRouter();
  const [commited, setCommited] = useState(false);
  const commitChanges = async () => {
    let reqBody = {
      type: "statement",
      id: campStatement?.id,
    };

    // console.log("req body of commit => ", reqBody);

    let res = await changeCommitStatement(reqBody);

    // console.log("res of commit =>", res);
    if (res?.status_code === 200) {
      setCommited(true);
    }
  };

  // console.log("submit time", campStatement?.submit_time);
  // console.log(
  //   "submit time =>",
  //   moment.unix(campStatement?.submit_time).format("hh : mm : ss ")
  // );

  // let date1: any = moment.now(); // 11:00 am in milisecond
  // let date2: any = 1656503028 * 1000; // 9:00 am in milisecond

  // console.log("sdasd", moment.now(), date2);
  // let differece1 = Math.abs(date2 - date1) / 36e5;
  // console.log("Math.abs(date1 - date2) / 36e5;", differece1); // this will give 2
  // let date3: any = moment.now(); // 11:00 am in milisecond
  // let date4: any = 1656397846 * 1000; // 10:01 am in milisecond
  // let differece2 = Math.abs(date3 - date4) / 36e5;
  // console.log("Math.abs(date1 - date2) / 36e5;", differece2); // this will give 0.9833333333333333

  // console.log("time", convertMsToTime(differece1));

  // function convertMsToTime(milliseconds) {
  //   let seconds = milliseconds * 1000;
  //   let minutes = seconds * 60;
  //   let hours = minutes * 60;

  //   seconds = seconds % 60;
  //   minutes = minutes % 60;

  //   // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  //   // 👇️ comment (or remove) the line below
  //   // commenting next line gets you `24:00:00` instead of `00:00:00`
  //   // or `36:15:31` instead of `12:15:31`, etc.
  //   hours = hours % 24;

  //   return `${hours}:${minutes}:${seconds}`;
  // }

  // console.log("camp statement of camp histroy in componrent=>", ifIamSupporter);
  // var date1 = moment("2014-06-07 00:03:00");
  // var date2 = moment("2014-06-07 09:22:00");

  // let differenceInMs = date2.diff(date1); // diff yields milliseconds
  // console.log("diffms", differenceInMs);
  // let duration = moment.duration(differenceInMs); // moment.duration accepts ms
  // console.log("duration", duration);
  // let differenceInMinutes = duration.asMinutes();
  // console.log("diffmin", differenceInMinutes);
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
                  Submitted on :{" "}
                  <span>
                    {new Date(
                      campStatement?.submit_time * 1000
                    ).toLocaleString()}
                  </span>
                </Title>
                <Title level={5}>
                  Submitter Nick Name :{" "}
                  <span>
                    <a href="">
                      {new Date(
                        campStatement?.objector_nick_name
                      ).toLocaleString()}
                    </a>
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
                    disabled={ifIamSupporter == 0}
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
                ifIamSupporter == 0 && (
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
                      Edit Change
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
                  <Checkbox className={styles.campSelectCheckbox}>
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
    console.log(
      "now => ",
      moment.now(),
      " unixtime",
      unixTime * 1000 + 3600000
    );
    if (moment.now() < unixTime * 1000 + 3600000) {
      console.log("true");
      let currenttime = new Date();
      let subtime = new Date(unixTime * 1000 + 3600000);
      console.log("-----n-h=", currenttime.toLocaleString());
      console.log("-----s-h=", subtime.toLocaleString());
      console.log("---time diff ", subtime.getTime() - currenttime.getTime());
      console.log(
        "final date ",
        convertMsToTime(subtime.getTime() - currenttime.getTime())
      );
    }
  };

  function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    setHours(0);
    setMinutes(0);
    setSeconds(10);

    return `${hours}:${minutes}:${seconds}`;
  }
  useEffect(() => {
    timeall();
    didMount.current = true;
  }, [unixTime]);

  console.log("sdddddddddddddddddddddd");
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
