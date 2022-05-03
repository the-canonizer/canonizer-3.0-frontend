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
  quillContent,
  onContentChange,
  isError,
  onDeleteClick,
  onPostEditClick,
  currentThread,
}) => (
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
);

export default Threads;
