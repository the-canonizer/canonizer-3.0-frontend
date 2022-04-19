import { Fragment } from "react";
import { useRouter } from "next/router";

import Post from "./UI/Post";
import ThreadSidebar from "./UI/sidebar";

const Threads = ({
  nickNameList = [],
  onCancel,
  initialValue,
  onFinishPost,
  formPost,
  startedBy,
  postCount,
  postList,
  threadStamps,
  cardTitle,
  pCurrent,
  pTotal,
  pOnChange,
  paramsList,
}) => {
  const router = useRouter();

  return (
    <Fragment>
      <div className="d-flex">
        <ThreadSidebar />
        <div className="pageContentWrap">
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
            pCurrent={pCurrent}
            pTotal={pTotal}
            pOnChange={pOnChange}
            paramsList={paramsList}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Threads;
