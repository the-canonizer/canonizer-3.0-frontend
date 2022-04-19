import { Fragment } from "react";
import { useRouter } from "next/router";

import CreateThread from "./UI/ThreadFormUI";
import ThreadSidebar from "./UI/sidebar";

const Threads = ({
  isThreadUpdate,
  nickNameList = [],
  onCancelCreateThread,
  onFinish,
  form,
  initialValue,
  paramsList,
}) => {
  return (
    <Fragment>
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
            paramsList={paramsList}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Threads;
