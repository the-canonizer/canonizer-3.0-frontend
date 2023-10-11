import React from "react";
import Link from "next/link";

import styles from "./createTopic.module.scss";

const TopicCreationBTN = () => {
  return (
    <div className={styles.topicBTN} key="topic-btn-area">
      <Link href="/create/topic" key="create-topic-btn">
        <a className="ant-btn">
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/topic-icon-orange.svg"
              alt="svg"
              className="icon-topic"
            />
          }
          Create Topic
        </a>
      </Link>
    </div>
  );
};

export default TopicCreationBTN;
