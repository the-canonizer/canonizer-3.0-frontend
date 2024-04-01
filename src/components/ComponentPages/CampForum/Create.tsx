import { Spin } from "antd";

import CreateThread from "./UI/ThreadFormUI";
import ThreadSidebar from "./UI/sidebar";
import CampInfoBar from "../TopicDetails/CampInfoBar";

// email link issue with ashutosh/gautam's bro.

const Threads = ({
  isThreadUpdate,
  nickNameList,
  onCancelCreateThread,
  onFinish,
  form,
  initialValue,
  isLoading,
  payload,
}: any) => {
  return (
    <div className="d-flex">
      <ThreadSidebar />
      <div className="pageContentWrap">
        <CampInfoBar payload={payload} />
        <Spin spinning={isLoading} size="large">
          <CreateThread
            onFinish={onFinish}
            onCancel={onCancelCreateThread}
            form={form}
            initialValue={initialValue}
            nickNameList={nickNameList}
            isThreadUpdate={isThreadUpdate}
            isLoading={isLoading}
          />
        </Spin>
      </div>
    </div>
  );
};

export default Threads;
