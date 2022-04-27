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
  postList,
  pCurrent,
  pTotal,
  pOnChange,
  paramsList,
  quillContent,
  onContentChange,
  isError,
  onDeleteClick,
  onPostEditClick,
  currentThread,
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
            postList={postList}
            pCurrent={pCurrent}
            pTotal={pTotal}
            pOnChange={pOnChange}
            quillContent={quillContent}
            onContentChange={onContentChange}
            isError={isError}
            onEditClick={onPostEditClick}
            onDeleteClick={onDeleteClick}
            currentThread={currentThread}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Threads;
