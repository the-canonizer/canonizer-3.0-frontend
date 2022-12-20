import { Spin } from "antd";

import ThreadListUI from "./UI/ThreadListUI";
import ThreadSidebar from "./UI/sidebar";

const Threads = ({
  onSearch,
  onChange,
  onCreateThread,
  threadList,
  onThreadClick,
  current,
  total,
  filterThread,
  onEditClick,
  paramsList,
  isLoading,
}) => (
  <div className="d-flex">
    <ThreadSidebar />
    <div className="pageContentWrap">
      <Spin spinning={isLoading} size="large">
        <ThreadListUI
          onSearch={onSearch}
          onChange={onChange}
          onCreateThread={onCreateThread}
          threadList={threadList}
          onThreadClick={onThreadClick}
          current={current}
          total={total}
          filterThread={filterThread}
          onEditClick={onEditClick}
          paramsList={paramsList}
        />
      </Spin>
    </div>
  </div>
);

export default Threads;
