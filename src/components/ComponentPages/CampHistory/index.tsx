import { Typography, Button, List } from "antd";
import { useRouter } from "next/router";
import styles from "./campHistory.module.scss";
import Link from "next/link";
import { getCampStatementHistoryApi } from "src/network/api/campStatementHistory";
import { useEffect, useState } from "react";
import HistoryCollapse from "./Collapse";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Spin } from "antd";
const { Title, Text } = Typography;

export default function CampList() {
  const [isActive, setIsActive] = useState("all");
  const router = useRouter();

  const { campStatementHistory } = useSelector((state: RootState) => ({
    campStatementHistory: state?.topicDetails?.campStatementHistory,
  }));
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [campHistory, setCampHistory] = useState(campStatementHistory);

  useEffect(() => {
    setCampHistory(campStatementHistory);
  }, [campStatementHistory]);

  useEffect(() => {
    const campStatementApiCall = async () => {
      setLoadingIndicator(true);
      const reqBody = {
        topic_num: +router.query.camp[0].split("-")[0],
        camp_num: +router.query.camp[1].split("-")[0],
        type: isActive,
      };
      await getCampStatementHistoryApi(reqBody);
      setLoadingIndicator(false);
    };
    campStatementApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleTabButton = async (tabName) => {
    setIsActive(tabName);
  };

  const campRoute = () => {
    setLoadingIndicator(true);
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
          <Spin spinning={loadingIndicator} size="large">
            {campHistory?.length ? (
              campHistory[0]?.statement?.map((campHistory, index) => {
                return (
                  <HistoryCollapse key={index} campStatement={campHistory} />
                );
              })
            ) : (
              <h2
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px 0px",
                }}
              >
                No Camp History Found
              </h2>
            )}
          </Spin>
          {/* <HistoryCollapse />
          <HistoryCollapse />
          <HistoryCollapse /> */}
        </div>
      </div>
    </>
  );
}
