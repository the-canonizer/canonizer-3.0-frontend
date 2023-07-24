import React from "react";
import { Button } from "antd";
import { useRouter } from "next/router";

import styles from "./createTopic.module.scss";

const TopicCreationBTN = () => {
  const router = useRouter();

  const topicRoute = () => {
    router?.push("/create/topic");
  };

  return (
    <div className={styles.topicBTN} key="topic-btn-area">
      <Button
        size="large"
        className="btn"
        onClick={topicRoute}
        key="create-topic-btn"
      >
        <i className="icon-topic"></i> Create New Topic
      </Button>
    </div>
  );
};

export default TopicCreationBTN;
