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
  isDisabled,
}: any) {
  return (
    <Modal
      className={styles.modal_cross}
      title={
        <Typography.Title
          className={styles.modal_title}
          level={4}
          data-testid="rm-title"
        >
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
            data-testid="popremove"
            disabled={isDisabled}
          >
            Remove
          </Button>
          <Button
            onClick={onCancel}
            type="default"
            className="ant-btn"
            data-testid="popcancel"
          >
            Cancel
          </Button>
        </div>
      }
      closeIcon={<CloseCircleOutlined />}
    >
      {!isCamp ? (
        <Typography.Text data-testid="topic-rm-title">
          Your subscription will be removed from the entire Topic -
          <Link href={topicLink}>
            <a> &quot;{topicTitle}&quot;. </a>
          </Link>
          Do you want to continue?
        </Typography.Text>
      ) : (
        <Typography.Text data-testid="camp-rm-title">
          Your subscription will be removed from the Camp -
          <Link href={campLink}>
            <a> &quot;{campTitle}&quot;. </a>
          </Link>
          Do you want to continue?
        </Typography.Text>
      )}
    </Modal>
  );
}

export default TopicRemoveModal;
