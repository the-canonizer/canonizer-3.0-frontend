import { Card } from "antd";

import styles from "./SubscriptionsList.module.scss";

import TopicSubscriptionsTab from "./TopicSubscriptionsTab";
import TopicRemoveModal from "./RemoveModal";

function SubscriptionsListUI({
  activeKey,
  subscriptionsList,
  onRemoveSubscription,
  onConfirm,
  isVisible,
  onCancel,
  onRemove,
  topicTitle,
  isCamp,
  campTitle,
}) {
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
        isCamp={isCamp}
        campTitle={campTitle}
      />
    </div>
  );
}

export default SubscriptionsListUI;
