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
  isModalOpen,
  showModal,
  onFinish,
  onCancelThreadUpdateForm,
  onThreadEdit,
  initialValue,
  form,
}: any) => (
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
        isModalOpen={isModalOpen}
        showModal={showModal}
        onFinish={onFinish}
        onCancelThreadUpdateForm={onCancelThreadUpdateForm}
        onThreadEdit={onThreadEdit}
        initialValue={initialValue}
        form={form}
      />
    </div>
  </div>
);

export default Threads;
