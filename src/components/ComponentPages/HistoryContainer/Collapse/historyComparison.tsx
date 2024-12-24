import { Collapse, Typography } from "antd";
import moment from "moment";
import Link from "next/link";
import styles from "../campHistory.module.scss";
import { useRouter } from "next/router";
import { capitalizeFirstLetter } from "src/utils/generalUtility";

import ReactJoyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useState } from "react";

const { Title } = Typography;
const { Panel } = Collapse;

const HistoryComparison = ({
  campStatement,
  topicNamespaceId,
  s1 = false,
}: any) => {
  const router = useRouter();
  const historyOf = router?.asPath?.split("/")?.at(1);
  const covertToTime = (unixTime: number) =>
    moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  
  const [isTourRunning, setIsTourRunning] = useState(true);
  const steps: Step[] = [
    {
      target: "#comparison-topic-camp-name-container",
      content: "This section shows the topic or camp name.",
      disableBeacon: true, // No blinking beacon for the first step
  
    },
    {
      target: "#comparison-topic-camp-updates",
      content: "This is where updates for the selected history type are displayed.",
    },
    {
      target: ".comparision-collapse",
      content: "Expand this panel to view detailed information about the statement.",
    },
    {
      target: "#edit-summary",
      content: "Here is the edit summary for this history item.",
    },
    {
      target: "#submitter-info",
      content: "This section displays the name and details of the submitter.",
    },
    {
      target: "#start-tour-button",
      content: "Click this button to start the tour again.",
    },
  ];

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setIsTourRunning(false);
    }
  };

  const handleStartTour = () => {
    setIsTourRunning(true);
  };

  const validUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const topicName = router?.query?.routes[0];
  const topic_name = topicName?.split("-")?.slice(1)?.join(" ");

  const getTitle = () => {
    if (historyOf === "camp" || historyOf === "topic") return "Updates";
    if (historyOf === "statement") return s1 ? "EDITS" : "DETAILS";
    return null;
  };

  return (
    <>
      <ReactJoyride
        steps={steps}
        continuous
        scrollToFirstStep
        showSkipButton
        run={isTourRunning} 
        callback={handleTourCallback}
        startIndex={0}
        styles={{
          options: {
            zIndex: 10000, // Ensure tooltips are above other elements
          },
        }}
      />
      <button id="start-tour-button" onClick={handleStartTour}>
        Start Tour
      </button>
      {historyOf === "topic" || historyOf === "camp" ? (
        <p
          id="comparison-topic-camp-name-container"
          className="mb-2.5 break-all"
        >
          {capitalizeFirstLetter(historyOf)} Name: {" "}
          <span>{campStatement?.parsed_value}</span>
        </p>
      ) : null}

      <Title
        level={5}
        id="comparison-topic-camp-updates"
        className="font-semibold mb-2.5 break-all"
      >
        {getTitle()}
      </Title>
      <div>
        {historyOf === "topic" && (
          <>
            <p id="edit-summary" className="break-all">
              Edit summary: <span>{campStatement?.note}</span>
            </p>
            <p>
              Canon: {" "}
              <span>
                {campStatement?.namespace &&
                  campStatement?.namespace
                    ?.replace(/^\/|\/$/g, "")
                    ?.replace(/\//g, " > ")}
              </span>
            </p>
          </>
        )}
        {historyOf === "camp" && (
          <>
            {!!campStatement?.parent_camp_name && (
              <p>
                Parent Camp: <span>{campStatement?.parent_camp_name}</span>
              </p>
            )}
            <p id="edit-summary" className="break-all">
              Edit summary: <span>{campStatement?.note}</span>
            </p>
            <p>
              Camp about URL: {" "}
              <span>
                {validUrl(campStatement?.camp_about_url) ? (
                  <Link href={campStatement?.camp_about_url || ""}>
                    <a>{campStatement?.camp_about_url}</a>
                  </Link>
                ) : null}
              </span>
            </p>
            <p id="submitter-info">
              Submitter nickname: {" "}
              <span>
                <Link
                  href={`/user/supports/${
                    campStatement?.submitter_nick_id || ""
                  }?canon=${topicNamespaceId || ""}`}
                  passHref
                >
                  <a>{campStatement?.submitter_nick_name}</a>
                </Link>
              </span>
            </p>
          </>
        )}
        {historyOf === "statement" && (
          <Collapse
            expandIconPosition="end"
            className="comparision-collapse"
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) =>
              isActive ? (
                <i className="icon-chevron-up"></i>
              ) : (
                <i className="icon-chevron-down"></i>
              )
            }
            ghost
          >
            <Panel header="" key="1">
              <div>
                <h5 className="font-semibold text-canOrange mb-3">Statement</h5>
                <div
                  className="text-canBlack compare-card-internal"
                  dangerouslySetInnerHTML={{
                    __html: campStatement?.parsed_v
                      ? campStatement?.parsed_v
                      : campStatement?.parsed_value,
                  }}
                ></div>
              </div>
            </Panel>
          </Collapse>
        )}
        <p>
          Submitted on: <span>{covertToTime(campStatement?.submit_time)}</span>
        </p>
        <p>
          {campStatement &&
          (campStatement?.status === "live" ||
            campStatement?.status === "old" ||
            campStatement?.status === "objected")
            ? "Go Live Time"
            : "Going live on"} {" "}
          :<span>{covertToTime(campStatement?.go_live_time)}</span>
        </p>
      </div>
    </>
  );
};

export default HistoryComparison;
