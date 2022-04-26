import {
  Typography,
  Button,
  Image,
  Collapse,
  Space,
  List,
  Checkbox,
  Divider,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import styles from "./campHistory.module.scss";
import Link from "next/link";
import { getCampStatementHistoryApi } from "src/network/api/campStatementHistory";
import { useEffect, useState } from "react";
import HistoryCollapse from "./Collapse";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Paragraph, Title, Text } = Typography;
const { Panel } = Collapse;

const campListColp = (
  <>
    <Title level={5}>Statement :</Title>
    <Title level={2}>Theories of Mind and Consciousness</Title>
    <Paragraph>
      The goal of this topic is to build and track consensus around theories of
      consciousness. Everyone is invited to contribute, as we want to track the
      default popular consensus. There is also the{" "}
      <span>
        <a href="">“Mind Expert”</a>
      </span>{" "}
      canonizer people can select, so people can compare the popular consensus
      with the “Expert Consensus”.
    </Paragraph>
    <Paragraph>
      We focus on bridging the
      <span>
        <a href="">Explanatory Gap </a>
      </span>
      to explore the qualitative nature of consciousness. We are asking the
      questions: “What are the physical properties of conscious experience?”
      Physical properties can be measured. “Can consciousness then be physically
      measured, tested, and observed?”
    </Paragraph>
    <Paragraph>
      Contributors should work to describe experiments that are consistent with
      particular theories, and falsify competing theories.
    </Paragraph>
    <Paragraph>
      This topic is part of the
      <span>
        <a href=""> Consciousness Consensus Project.</a>
      </span>
    </Paragraph>
    <div className={styles.serverFlowChart}>
      <Image src="/images/slow-server.png" preview={false}></Image>
    </div>
    <Paragraph>
      This is an excellent library for designing the front-end. Code District
      has a React template that it uses for all of its projects and the same can
      be used here. The framework includes the following: - Redux toolkit
      (including Redux thunk, Redux-Slice, Redux - - Middleware, RTK Query) -
      Redux-orm - React Router
    </Paragraph>
    <Title level={3}> Excepteur sint occaecat cupidatat non</Title>
    <Paragraph>
      Lorem ipsum dolor sit amet, consaute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
      sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.
    </Paragraph>
    <Paragraph>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ull
    </Paragraph>
    <Paragraph>
      aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
      sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.
    </Paragraph>
    <div className={styles.organizeFlowChart}>
      <Image src="/images/flowchart.png" preview={false}></Image>
      <Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Paragraph>
    </div>
    <Divider />
  </>
);
const campListColpsummary = (
  <>
    <div className={styles.campCollapseSummaryWrap}>
      <div className={styles.campStatementCollapseSummary}>
        <Title level={5}>
          Edit summary :{" "}
          <span className={styles.updateSurveyPrj}>
            Update "Consciousness Survey Project" to "Consciousness Consensus
            Project"
          </span>
        </Title>
        <Title level={5}>
          Submitted on : <span>5/26/2020, 8:04:24 AM</span>
        </Title>
        <Title level={5}>
          Submitter Nick Name :{" "}
          <span>
            <a href="">ali_Ahmed</a>
          </span>
        </Title>
        <Title level={5}>
          Go live Time : <span>5/27/2020, 8:04:24 AM</span>
        </Title>
        <Checkbox className={styles.campSelectCheckbox}>
          Select to Compare
        </Checkbox>
      </div>
      <div className={styles.campStatementCollapseButtons}>
        <Button type="primary" className={styles.campUpdateButton}>
          Submit Statement Update Based on This
        </Button>
        <Button type="primary" className={styles.campVersionButton}>
          View This Version
        </Button>
      </div>
    </div>
  </>
);

function callback(key) {
  console.log(key);
}

export default function CampList() {
  const [isActive, setisActive] = useState("all");
  const router = useRouter();

  const { campStatementHistory } = useSelector((state: RootState) => ({
    campStatementHistory: state?.topicDetails?.campStatementHistory,
  }));

  const handleTabButton = async (tabName) => {
    setisActive(tabName);
    const reqBody = {
      topic_num: +router.query.camp[0].split("-")[0],
      camp_num: +router.query.camp[1].split("-")[0],
      type: tabName,
    };
    await getCampStatementHistoryApi(reqBody);
  };
  const mockLinks = [
    {
      link: "/",
      linkTitle: "View All",
      id: 1,
    },
    {
      link: "/",
      linkTitle: " Objected",
      id: 2,
    },
    {
      link: "/",
      linkTitle: " Live",
      id: 3,
    },
    {
      link: "/",
      linkTitle: "Not Live",
      id: 4,
    },
    {
      link: "/",
      linkTitle: "Old",
      id: 5,
    },
  ];

  const campRoute = () => {
    router.push("/create/topic");
  };

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.heading}>
          <Title level={5}>
            <Text>Topic :</Text>{" "}
            {campStatementHistory?.length &&
              campStatementHistory[0].topic?.topic_name}
          </Title>
          <Title level={5}>
            <Text>Camp : </Text>{" "}
            <Text className={styles.blueText}>
              {campStatementHistory?.length &&
                campStatementHistory[0]?.parentCamp?.map((camp, index) => {
                  return (
                    <Link
                      href={`/topic/${router.query.camp[0]}/${
                        camp?.camp_num
                      }-${camp?.camp_name?.split(" ").join("-")}`}
                      key={camp?.camp_num}
                    >
                      <a>
                        {index !== 0 && "/"}
                        {`${camp?.camp_name}`}
                      </a>
                    </Link>
                  );
                })}
            </Text>
          </Title>
        </div>
        <div className={styles.btnGroup}>
          <Button size="large" className={styles.createBtn} onClick={campRoute}>
            <i className="icon-topic"></i>Create New Topic
          </Button>
          <Button size="large" className={styles.createBtn}>
            <i className="icon-topic"></i>Create New Camp
          </Button>
        </div>
        <div className={styles.campStatement}>
          <div className={styles.tabHead}>
            <div className={styles.filterOt}>
              <Title level={4}>Camp Statement History</Title>
              {/* <ul className={styles.filters}>
                {mockLinks?.map((item) => {
                  return (
                    <li className={styles.active} key={item.id}>
                      <Link href={item.link}>
                        <a>{item.linkTitle}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul> */}

              <List className={styles.campStatementHistory} size="small">
                <List.Item
                  className={`${styles.campStatementViewAll} ${
                    styles.campStatementListItem
                  } ${isActive == "all" ? styles.active : null}`}
                >
                  <a
                    onClick={() => {
                      handleTabButton("all");
                    }}
                  >
                    View All
                  </a>
                </List.Item>
                <List.Item
                  className={`${styles.campStatementObjected}  ${
                    styles.campStatementListItem
                  }  ${isActive == "objected" ? styles.active : null}`}
                >
                  <a
                    onClick={() => {
                      handleTabButton("objected");
                    }}
                  >
                    Objected
                  </a>
                </List.Item>
                <List.Item
                  className={`${styles.campStatementLive} ${
                    styles.campStatementListItem
                  } ${isActive == "live" ? styles.active : null}`}
                >
                  <a
                    onClick={() => {
                      handleTabButton("live");
                    }}
                  >
                    Live
                  </a>
                </List.Item>
                <List.Item
                  className={`${styles.campStatementNotLive} ${
                    styles.campStatementListItem
                  } ${isActive == "in_review" ? styles.active : null}`}
                >
                  <a
                    onClick={() => {
                      handleTabButton("in_review");
                    }}
                  >
                    Not Live
                  </a>
                </List.Item>
                <List.Item
                  className={`${styles.campStatementOld} ${
                    styles.campStatementListItem
                  } ${isActive == "old" ? styles.active : null}`}
                >
                  <a
                    onClick={() => {
                      handleTabButton("old");
                    }}
                  >
                    Old
                  </a>
                </List.Item>
              </List>
            </div>
            <Button disabled className={styles.active} type="primary">
              Compare Statements
            </Button>
          </div>
          {/* <Space
            direction="vertical"
            className={`${styles.campStatementCollapseObjectedHistory} ${styles.campStatementCollapseHistory}`}
          >
            <Collapse
              collapsible="header"
              defaultActiveKey={["1"]}
              expandIconPosition="right"
              className="campHistoryCollapseCards campHistoryCollapseObjectedCard"
            >
              <Panel
                header={<i className="icon-uparrow"></i>}
                key="1"
                className={styles.campStatementCollapse}
                showArrow={false}
              >
                {campListColp}
              </Panel>
              {campListColpsummary}
            </Collapse>
          </Space>
          <Space
            direction="vertical"
            className={`${styles.campStatementCollapseLiveHistory} ${styles.campStatementCollapseHistory}`}
          >
            <Collapse
              collapsible="header"
              defaultActiveKey={["1"]}
              expandIconPosition="right"
              className="campHistoryCollapseCards campHistoryCollapseLiveCard"
            >
              <Panel
                header={<i className="icon-uparrow"></i>}
                key="1"
                className={styles.campStatementCollapse}
                showArrow={false}
              >
                {campListColp}
              </Panel>
              {campListColpsummary}
            </Collapse>
          </Space>
          <Space
            direction="vertical"
            className={`${styles.campStatementCollapseNotLiveHistory} ${styles.campStatementCollapseHistory}`}
          >
            <Collapse
              collapsible="header"
              defaultActiveKey={["1"]}
              expandIconPosition="right"
              className="campHistoryCollapseCards campHistoryCollapseNotLiveCard"
            >
              <Panel
                header={<i className="icon-uparrow"></i>}
                key="1"
                className={styles.campStatementCollapse}
                showArrow={false}
              >
                {campListColp}
              </Panel>
              {campListColpsummary}
            </Collapse>
          </Space>
          <Space
            direction="vertical"
            className={`${styles.campStatementCollapseOldHistory} ${styles.campStatementCollapseHistory}`}
          >
            <Collapse
              collapsible="header"
              defaultActiveKey={["1"]}
              expandIconPosition="right"
              className="campHistoryCollapseCards campHistoryCollapseOldCard"
            >
              <Panel
                header={<i className="icon-uparrow"></i>}
                key="1"
                className={styles.campStatementCollapse}
                showArrow={false}
              >
                {campListColp}
              </Panel>
              {campListColpsummary}
            </Collapse>
          </Space>
        */}
          {campStatementHistory?.length &&
            campStatementHistory[0]?.statement?.map((campHistory, index) => {
              return (
                <HistoryCollapse key={index} campStatement={campHistory} />
              );
            })}
          {/* <HistoryCollapse />
          <HistoryCollapse />
          <HistoryCollapse /> */}
        </div>
      </div>
    </>
  );
}
