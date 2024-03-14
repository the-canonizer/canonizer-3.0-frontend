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
  isModalOpen,
  showModal,
  createdAt,
}: any) => (
  <div className="d-flex">
    <ThreadSidebar />
    <div className="pageContentWrap">
      <CampInfoBar payload={payload} isForumPage={true} />
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
        isModalOpen={isModalOpen}
        showModal={showModal}
        createdAt={createdAt}
      />
    </div>
  </div>
);

export default Threads;
