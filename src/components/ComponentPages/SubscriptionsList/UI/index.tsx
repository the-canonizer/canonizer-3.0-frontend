import { Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import styles from "./SubscriptionsList.module.scss";

import TopicSubscriptionsTab from "./TopicSubscriptionsTab";
import TopicRemoveModal from "./RemoveModal";

const { TabPane } = Tabs;

function SubscriptionsListUI({
  tabCallBack,
  onSearch,
  activeKey,
  subscriptionsList,
  onRemoveSubscription,
  onConfirm,
  isVisible,
  onCancel,
  onRemove,
  topicTitle,
}) {
  const Note = () => {
    const key = activeKey === "topic_subs" ? "camp" : "camp";
    return (
      <div className={styles.notes}>
        {`Note : To change the order of ${key}, drag & drop the ${key} box on your
        choice position.`}
      </div>
    );
  };

  const placeholder =
    activeKey === "topic_subs" ? "Search by topic name" : "Search by camp name";

  return (
    <div className={styles.supported_camps}>
      <div className={styles.search_users}>
        <SearchOutlined />
        <input
          placeholder={placeholder}
          type="text"
          name="search"
          onChange={onSearch}
          className={styles.searchInput}
        />
      </div>
      <Tabs onChange={tabCallBack} type="card" activeKey={activeKey}>
        <TabPane tab="Subscriptions List" key="topic_subs">
          <Note />
          <TopicSubscriptionsTab
            onRemoveSubscription={onRemoveSubscription}
            onConfirm={onConfirm}
            subscriptionsList={subscriptionsList}
          />
        </TabPane>
        {/* <TabPane tab="Camp Subscriptions" key="camp_subs">
          <Note />
          <CampSubscriptionsTab />
        </TabPane> */}
      </Tabs>
      <TopicRemoveModal
        isVisible={isVisible}
        onCancel={onCancel}
        onRemove={onRemove}
        topicTitle={topicTitle}
      />
    </div>
  );
}

export default SubscriptionsListUI;
