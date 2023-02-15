import { Modal, Button, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

import styles from "./SubscriptionsList.module.scss";

function TopicRemoveModal({
  isVisible,
  onCancel,
  onRemove,
  topicTitle,
  topicLink,
  isCamp,
  campTitle,
  campLink,
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
          Your subscription will be removed from the entire Topic -
          <Link href={topicLink}>&quot;{topicTitle}&quot;.</Link>
          Do you want to continue?
        </Typography.Text>
      ) : (
        <Typography.Text>
          Your subscription will be removed from the Camp -
          <Link href={campLink}>&quot;{campTitle}&quot;.</Link>
          Do you want to continue?
        </Typography.Text>
      )}
    </Modal>
  );
}

export default TopicRemoveModal;
