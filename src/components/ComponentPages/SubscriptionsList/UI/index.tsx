import { Tabs, Card, Typography, Tooltip, Button } from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

import styles from "./SubscriptionsList.module.scss";

import TopicSubscriptionsTab from "./TopicSubscriptionsTab";
import TopicRemoveModal from "./RemoveModal";

const { TabPane } = Tabs;
const { Title } = Typography;

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
      <Card
        className={styles.cardBox_tags_wrapper}
        type="inner"
        size="default"
        style={{ width: "100%" }}
      >
        <TopicSubscriptionsTab
          onRemoveSubscription={onRemoveSubscription}
          onConfirm={onConfirm}
          subscriptionsList={subscriptionsList}
        />
      </Card>
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
