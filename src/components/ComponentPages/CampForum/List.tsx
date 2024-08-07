import ThreadListUI from "./UI/ThreadListUI";
import ThreadSidebar from "./UI/sidebar";
import CampInfoBar from "../TopicDetails/CampInfoBar";

const Threads = ({
  onSearch,
  onChange,
  threadList,
  onThreadClick,
  current,
  total,
  filterThread,
  paramsList,
  isLoading,
  payload,
  onThreadEdit,
}: any) => (
  <div className="d-flex">
    <ThreadSidebar />
    <div className="pageContentWrap">
      <CampInfoBar payload={payload} />
      <ThreadListUI
        onSearch={onSearch}
        onChange={onChange}
        threadList={threadList}
        onThreadClick={onThreadClick}
        current={current}
        total={total}
        filterThread={filterThread}
        paramsList={paramsList}
        isLoading={isLoading}
        onThreadEdit={onThreadEdit}
      />
    </div>
  </div>
);

export default Threads;
