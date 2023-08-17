import { Fragment } from "react";
import { Card, Image, Typography } from "antd";
import moment from "moment";

import styles from "./HotTopic.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const { Text, Title } = Typography;

function HotTopic({}) {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  console.log(
    "🚀 ~ file: index.tsx:15 ~ const{topicData}=useSelector ~ topicData:",
    topicData
  );

  return (
    <Fragment>
      <Card title="Hot Topic" bordered={false} className={styles.hotopicCard}>
        <div className={styles.imageSection}>
          <Text className={styles.date}>
            {moment(new Date()).format("MMMM DD, YYYY")}
          </Text>
          <Image
            width={"100%"}
            height={350}
            src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`}
            alt=""
            preview={false}
          />
          <Text className={styles.imageLabel}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
            accusantium recusandae veritatis harum quos, quibusdam beatae neque
            numquam quae maiores?s
          </Text>
        </div>
        <div className={styles.content_area}>
          <Title level={5} className={styles.contenTitle}>
            Lorem ipsum dolor sit amet.
          </Title>
          <Text className={styles.contenCon}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse totam
            itaque dolores obcaecati atque, harum nostrum ullam nam dicta
            deserunt odio, ipsa reprehenderit vitae recusandae soluta! Ipsum
            autem praesentium a!
          </Text>
        </div>
      </Card>
    </Fragment>
  );
}

export default HotTopic;
