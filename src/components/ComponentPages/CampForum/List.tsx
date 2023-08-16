import ThreadListUI from "./UI/ThreadListUI";
import ThreadSidebar from "./UI/sidebar";
import CampInfoBar from "../TopicDetails/CampInfoBar";

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
  payload,
}) => (
  <div className="d-flex">
    <ThreadSidebar />
    <div className="pageContentWrap">
      <CampInfoBar payload={payload} />
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
