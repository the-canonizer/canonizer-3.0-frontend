import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import styles from "./createTopic.module.scss";

import { RootState } from "src/store";
import { useRouter } from "next/router";

const TopicCreationBTN = () => {
  const router = useRouter();
  const { authenticated } = useSelector((state: RootState) => ({
    authenticated: state.auth.authenticated,
  }));
  return (
    <div className={styles.topicBTN} key="topic-btn-area">
      {authenticated ? (
        <Link href="/create/topic" key="create-topic-btn">
          <a className="ant-btn">Start a Topic</a>
        </Link>
      ) : (
        <Link href="/registration">
          <a className="ant-btn">Sign Up Free</a>
        </Link>
      )}
    </div>
  );
};

export default TopicCreationBTN;
