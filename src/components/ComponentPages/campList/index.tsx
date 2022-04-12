import { useEffect, useState } from "react";
import { Alert } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button } from "antd";

import styles from "./campList.module.scss";
import Link from "next/link";

import { RootState } from "../../../store";
import { setCurrentTopic } from "../../../store/slices/topicSlice";

const { Title, Text } = Typography;

export default function CampList() {
  const [isCampBtnVisible, setIsCampBtnVisible] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.pathname.includes("/topic/")) {
      setIsCampBtnVisible(true);
    }
  }, [router.pathname]);

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
    router.push("/create-new-topic");
  };

  const createdData = useSelector(
    (state: RootState) => state.topic.currentTopic
  );

  const setCurrentTopics = (data) => dispatch(setCurrentTopic(data));

  const onCreateCamp = () => {
    const queryParams = router.query;

    const data = {
      message: null,
      topic_num: queryParams.camp[0],
      topic_name: "",
      camp_name: "Agreement",
      parent_camp_num: "1",
    };

    router.push({
      pathname: "/create-new-camp",
    });
    setCurrentTopics(data);
  };

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.heading}>
          <Title level={5}>
            <Text>Topic :</Text> Theories of Consciousness
          </Title>
          <Title level={5}>
            <Text>Camp :</Text>{" "}
            <Text className={styles.blueText}>
              Agreement / Approachable Via Science / Representational Qualia
            </Text>
          </Title>
        </div>
        <div className={styles.btnGroup}>
          <Button size="large" className={styles.createBtn} onClick={campRoute}>
            <i className="icon-topic"></i>Create New Topic
          </Button>
          {createdData?.message && (
            <Alert message={createdData?.message} type="success" />
          )}

          {isCampBtnVisible ? (
            <Button
              size="large"
              className={styles.createBtn}
              onClick={onCreateCamp}
            >
              <i className="icon-topic"></i>Create New Camp
            </Button>
          ) : null}
        </div>
        <div className={styles.campStatement}>
          <div className={styles.tabHead}>
            <div className={styles.filterOt}>
              <Title level={4}>Camp Statement History</Title>
              <ul className={styles.filters}>
                {mockLinks?.map((item) => {
                  return (
                    <li className={styles.active} key={item.id}>
                      <Link href={item.link}>
                        <a>{item.linkTitle}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Button>Compare Statements</Button>
          </div>
        </div>
      </div>
    </>
  );
}
