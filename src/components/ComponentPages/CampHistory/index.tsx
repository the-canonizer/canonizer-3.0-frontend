import { useEffect, useState } from "react";
import { Typography, Button, List, Spin, Affix } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

import styles from "./campHistory.module.scss";

import { getCampStatementHistoryApi } from "../../../network/api/campStatementHistory";
import HistoryCollapse from "./Collapse";
import { RootState } from "src/store";

const { Title, Text } = Typography;

function CampList() {
  const [isActive, setIsActive] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [top, setTop] = useState(40);
  const [isAbs, setIsAbs] = useState(false);

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
      try {
        setLoadingIndicator(true);
        const reqBody = {
          topic_num: +router.query.camp[0].split("-")[0],
          camp_num: +router.query.camp[1].split("-")[0],
          type: isActive,
          as_of: "default",
          per_page: 10,
          page: 1,
        };
        await getCampStatementHistoryApi(reqBody);
        setLoadingIndicator(false);
      } catch (error) {
        //console.log(error)
      }
    };
    campStatementApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleTabButton = async (tabName) => {
    setIsActive(tabName);
  };

  const topicRoute = () => {
    setLoadingIndicator(true);
    router.push("/create/topic");
  };

  const campRoute = () => {
    setLoadingIndicator(true);
    router.push(
      `/camp/create/${router.query.camp[0] + "/" + router.query.camp[1]}`
    );
  };

  const onSelectCompare = ({ id }, e: CheckboxChangeEvent) => {
    let oldTopics = [...selectedTopic];

    if (e.target.checked && !oldTopics.includes(id)) {
      oldTopics.push(id);
    } else {
      oldTopics = oldTopics.filter((item) => item !== id);
    }

    setSelectedTopic(oldTopics);
  };

  const onCompareClick = () => {
    router.push({
      pathname: `/statement/compare/${router.query.camp[0]}/${router.query.camp[1]}`,
      query: {
        s1: selectedTopic[0],
        s2: selectedTopic[1],
      },
    });
  };
  console.log("camp history redux => ", campStatementHistory);
  console.log("camp history  => ", campHistory);

  return (
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
        <Button size="large" className={styles.createBtn} onClick={topicRoute}>
          <i className="icon-topic"></i>Create New Topic
        </Button>
        <Button size="large" className={styles.createBtn} onClick={campRoute}>
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
          <Affix
            offsetTop={top}
            style={{ position: isAbs ? "absolute" : "static", right: "10px" }}
            onChange={setIsAbs}
          >
            <Button
              disabled={
                !(
                  selectedTopic.length >= 2 &&
                  !selectedTopic.includes(campHistory.id)
                )
              }
              className={styles.active}
              type="primary"
              onClick={onCompareClick}
            >
              Compare Statements
            </Button>
          </Affix>
        </div>

        <Spin spinning={loadingIndicator} size="large">
          {!loadingIndicator && campHistory && campHistory?.items?.length ? (
            campHistory?.items?.map((campHistory, index) => {
              return (
                <HistoryCollapse
                  key={index}
                  campStatement={campHistory}
                  onSelectCompare={onSelectCompare}
                  isDisabledCheck={
                    selectedTopic.length >= 2 &&
                    !selectedTopic.includes(campHistory.id)
                  }
                  isChecked={selectedTopic.includes(campHistory.id)}
                />
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
      </div>
    </div>
  );
}

export default CampList;
