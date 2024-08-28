import { Modal, Typography } from "antd";
import {
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

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
}) {
  return (
    <Modal
      className="rounded-lg"
      title={
        <Typography.Title className="" level={4} data-testid="rm-title">
          Remove Subscription
        </Typography.Title>
      }
      visible={isVisible}
      onCancel={onCancel}
      footer={
        <div className="gap-5 py-3">
          <PrimaryButton
            onClick={onRemove}
            className="inline-flex items-center justify-center gap-2"
            data-testid="popremove"
            disabled={isDisabled}
          >
            Remove
            <DeleteOutlined />
          </PrimaryButton>
          <SecondaryButton
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2"
            data-testid="popcancel"
          >
            Cancel <CloseOutlined />
          </SecondaryButton>
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
