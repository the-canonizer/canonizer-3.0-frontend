import { Card } from "antd";

import styles from "./SubscriptionsList.module.scss";

import TopicSubscriptionsTab from "./TopicSubscriptionsTab";
import TopicRemoveModal from "./RemoveModal";

function SubscriptionsListUI({
  subscriptionsList,
  onRemoveSubscription,
  onConfirm,
  isVisible,
  onCancel,
  onRemove,
  topicTitle,
  topicLink,
  isCamp,
  campTitle,
  campLink,
  isDisabled,
}: any) {
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
        topicLink={topicLink}
        isCamp={isCamp}
        campTitle={campTitle}
        campLink={campLink}
        isDisabled={isDisabled}
      />
    </div>
  );
}

export default SubscriptionsListUI;
