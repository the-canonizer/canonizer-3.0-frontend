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
  isLoggedIn,
  onEditClick,
  paramsList,
}) => (
  <div className="d-flex">
    <ThreadSidebar />
    <div className="pageContentWrap">
      <ThreadListUI
        onSearch={onSearch}
        onChange={onChange}
        onCreateThread={onCreateThread}
        threadList={threadList}
        onThreadClick={onThreadClick}
        current={current}
        total={total}
        filterThread={filterThread}
        isLoggedIn={isLoggedIn}
        onEditClick={onEditClick}
        paramsList={paramsList}
      />
    </div>
  </div>
);

export default Threads;
