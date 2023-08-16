// import { Spin } from "antd";

import Post from "./UI/Post";
import ThreadSidebar from "./UI/sidebar";
import CampInfoBar from "../TopicDetails/CampInfoBar";

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
  quillContent,
  onContentChange,
  isError,
  onDeleteClick,
  onPostEditClick,
  currentThread,
  isLog,
  isLoading,
  postperPage,
  threadDetailsLoading,
  payload,
}) => (
  <div className="d-flex">
    <ThreadSidebar />
    <div className="pageContentWrap">
      <CampInfoBar payload={payload} />
      {/* <Spin spinning={isLoading} size="large"> */}
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
        isLog={isLog}
        isLoading={isLoading}
        postperPage={postperPage}
        threadDetailsLoading={threadDetailsLoading}
      />
      {/* </Spin> */}
    </div>
  </div>
);

export default Threads;
