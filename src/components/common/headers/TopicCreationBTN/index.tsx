import React from "react";
import Link from "next/link";

import styles from "./createTopic.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const TopicCreationBTN = () => {
  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));
  return (
    <div className={styles.topicBTN} key="topic-btn-area">
      {
        loggedInUser ? (
        <>
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
        </>
        ): (
          <>
            <div className="ant-btn">
            {
              <img
                src="/images/topic-icon-orange.svg"
                alt="svg"
                className="icon-topic"
              />
            }
              Create Topic
            </div>
          </>
        )
      }
    </div>
  );
};

export default TopicCreationBTN;
