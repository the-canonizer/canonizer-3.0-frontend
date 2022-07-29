import { Spin } from "antd";

import CreateThread from "./UI/ThreadFormUI";
import ThreadSidebar from "./UI/sidebar";

const Threads = ({
  isThreadUpdate,
  nickNameList,
  onCancelCreateThread,
  onFinish,
  form,
  initialValue,
  isLoading,
}) => {
  return (
    <div className="d-flex">
      <ThreadSidebar />
      <div className="pageContentWrap">
        <Spin spinning={isLoading} size="large">
          <CreateThread
            onFinish={onFinish}
            onCancel={onCancelCreateThread}
            form={form}
            initialValue={initialValue}
            nickNameList={nickNameList}
            isThreadUpdate={isThreadUpdate}
          />
        </Spin>
      </div>
    </div>
  );
};

export default Threads;
