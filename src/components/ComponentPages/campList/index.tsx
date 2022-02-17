import { Typography, Button } from "antd";
import styles from "./campList.module.scss";
import Link from "next/link";
const { Title, Text } = Typography;
export default function CampList() {
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
          <Button size="large" className={styles.createBtn}>
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