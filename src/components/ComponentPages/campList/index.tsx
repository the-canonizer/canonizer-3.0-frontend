import { useEffect, useState } from "react";
import { Alert } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Typography, Button } from "antd";

import styles from "./campList.module.scss";
import Link from "next/link";

import { RootState } from "../../../store";

const { Title, Text } = Typography;

export default function CampList() {
  const [isCampBtnVisible, setIsCampBtnVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (router.pathname.includes("camp-details")) {
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

          <button onClick={() => router.push("/create-new-camp")}>
            Create Camp
          </button>
          {isCampBtnVisible ? (
            <Button
              size="large"
              className={styles.createBtn}
              onClick={() => router.push("/create-new-camp")}
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
