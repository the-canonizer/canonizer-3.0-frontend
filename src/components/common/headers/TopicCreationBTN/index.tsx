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
          <button
            className="ant-btn"
            onClick={() => {
              const returnUrl = "/create/topic";
              router.push(
                {
                  pathname: "/login",
                  query: { returnUrl },
                },
                null,
                { shallow: true }
              );
            }}
          >
            {
              <img
                src="/images/topic-icon-orange.svg"
                alt="svg"
                className="icon-topic"
              />
            }
            Create Topic
          </button>
        </>
      )}
    </div>
  );
};

export default TopicCreationBTN;
