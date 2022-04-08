import { Fragment } from "react";
import { Card, Typography } from "antd";

import styles from "../Forum.module.scss";

const { Text } = Typography;

const CreateCampFormUI = ({
  postedBy = null,
  postedTime = null,
  title = null,
  content = null,
}) => {
  return (
    <Fragment>
      <Card className={styles.listCard}>
        <div className={`${styles.cardTitle} ${styles.listCardTitle}`}>
          <Text>
            <span className={styles.by}>{postedBy}</span> {postedTime}
          </Text>
        </div>
        <Text strong>{title}</Text>
        <br />
        <Text>{content}</Text>
      </Card>
    </Fragment>
  );
};

export default CreateCampFormUI;
