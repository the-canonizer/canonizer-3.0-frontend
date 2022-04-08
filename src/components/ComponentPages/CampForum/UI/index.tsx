import { Fragment } from "react";
import Image from "next/image";

import styles from "./Forum.module.scss";
import ThreadListUI from "./ThreadListUI";
import CreateNewCampButton from "../../../common/button/createNewTopicBtn";
import CreateThread from "./ThreadFormUI";
import Post from "./Post";

const Threads = ({
  onSearch,
  onChange,
  isScreen,
  onCreateThread,
  threadList,
  onThreadClick,
  current,
  total,
  filterThread,
  isLoggedIn,

  nickNameList = [],

  onCancelCreateThread,
  onCancel,

  onFinish,
  form,
  initialValue,

  onFinishPost,
  formPost,
  startedBy,
  postCount,
  postList,
  threadStamps,
  cardTitle,
}) => {
  return (
    <Fragment>
      <div className="d-flex">
        <aside className="leftSideBar miniSideBar bg-white">
          <div className={styles.card}>
            <div className={styles.btnsWrap}>
              <CreateNewCampButton />
            </div>
          </div>
          <div className="siteAds">
            <Image
              alt="adOne"
              src={"/images/Image37.jpg"}
              width={200}
              height={400}
            />
          </div>
        </aside>
        <div className="pageContentWrap">
          {isScreen === 0 ? (
            <ThreadListUI
              onSearch={onSearch}
              onChange={onChange}
              onCreateThread={onCreateThread}
              threadList={threadList}
              onThreadClick={onThreadClick}
              current={current}
              total={total}
              filterThread={filterThread}
              isLoggedIn={isLoggedIn}
            />
          ) : null}

          {isScreen === 1 ? (
            <CreateThread
              onFinish={onFinish}
              onCancel={onCancelCreateThread}
              form={form}
              initialValue={initialValue}
              nickNameList={nickNameList}
            />
          ) : null}

          {isScreen === 2 ? (
            <Post
              onFinishPost={onFinishPost}
              onCancel={onCancel}
              formPost={formPost}
              initialValue={initialValue}
              nickNameList={nickNameList}
              threadStamps={threadStamps}
              startedBy={startedBy}
              postCount={postCount}
              postList={postList}
              cardTitle={cardTitle}
            />
          ) : null}
        </div>
      </div>
    </Fragment>
  );
};

export default Threads;
