import { Modal, Button, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import styles from "./SubscriptionsList.module.scss";

function TopicRemoveModal({
  isVisible,
  onCancel,
  onRemove,
  topicTitle,
  isCamp,
  campTitle,
}) {
  return (
    <Modal
      className={styles.modal_cross}
      title={
        <Typography.Title className={styles.modal_title} level={4}>
          Remove Subscription
        </Typography.Title>
      }
      visible={isVisible}
      onCancel={onCancel}
      footer={
        <div className={styles.text_right}>
          <Button
            onClick={onRemove}
            type="primary"
            style={{ marginRight: 10 }}
            className="ant-btn ant-btn-orange"
          >
            Remove
          </Button>
          <Button onClick={onCancel} type="default" className="ant-btn">
            Cancel
          </Button>
        </div>
      }
      closeIcon={<CloseCircleOutlined />}
    >
      {!isCamp ? (
        <Typography.Text>
          Your subscription will be removed from the entire Topic - &quot;
          {topicTitle}&quot;. Do you want to continue?
        </Typography.Text>
      ) : (
        <Typography.Text>
          Your subscription will be removed from the Camp - &quot;{campTitle}
          &quot;. Do you want to continue?
        </Typography.Text>
      )}
    </Modal>
  );
}

export default TopicRemoveModal;
