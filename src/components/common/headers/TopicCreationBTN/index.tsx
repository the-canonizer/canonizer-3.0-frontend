import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import styles from "./createTopic.module.scss";

import { RootState } from "src/store";

const TopicCreationBTN = () => {
  const { authenticated } = useSelector((state: RootState) => ({
    authenticated: state.auth.authenticated,
  }));
  return (
    <div className={styles.topicBTN} key="topic-btn-area">
      {authenticated ? (
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
      ) : (
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
      )}
    </div>
  );
};

export default TopicCreationBTN;
