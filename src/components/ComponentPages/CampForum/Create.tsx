import CreateThread from "./UI/ThreadFormUI";
import ThreadSidebar from "./UI/sidebar";

const Threads = ({
  isThreadUpdate,
  nickNameList = [],
  onCancelCreateThread,
  onFinish,
  form,
  initialValue,
}) => (
  <div className="d-flex">
    <ThreadSidebar />
    <div className="pageContentWrap">
      <CreateThread
        onFinish={onFinish}
        onCancel={onCancelCreateThread}
        form={form}
        initialValue={initialValue}
        nickNameList={nickNameList}
        isThreadUpdate={isThreadUpdate}
      />
    </div>
  </div>
);

export default Threads;
