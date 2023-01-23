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
        isLoading={isLoading}
      />
    </div>
  </div>
);

export default Threads;
