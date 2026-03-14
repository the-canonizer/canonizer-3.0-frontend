import { Typography, Modal } from "antd";
import { ArrowLeftOutlined, ReadOutlined } from "@ant-design/icons";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const ReadPopup = ({ onClose, onRead, isOpen, isReadDisabled }) => {
  return (
    <Modal
      open={isOpen}
      footer={null}
      className="rounded-lg"
      data-testid="emailpopup"
      centered
      destroyOnClose
      onCancel={onClose}
    >
      <div
        className="flex justify-center items-center relative"
        id="read-popup-header"
      >
        <Typography.Paragraph
          className="text-center text-black text-xl font-medium"
          id="read-popup-title"
        >
          Are you sure?
        </Typography.Paragraph>
      </div>
      <Typography.Paragraph
        className="text-center text-sm text-canLight"
        id="read-popup-description"
      >
        You want to mark all notifications as read. This action is irreversible.
      </Typography.Paragraph>
      <div className="text-center mt-7" id="read-popup-actions">
        <SecondaryButton
          onClick={onClose}
          className="rounded-lg px-7 inline-flex items-center justify-center"
          id="read-popup-cancel-button"
        >
          Cancel <ArrowLeftOutlined />
        </SecondaryButton>
        <PrimaryButton
          onClick={onRead}
          className="ml-4 rounded-lg px-7 inline-flex items-center justify-center"
          disabled={isReadDisabled}
          id="read-popup-confirm-button"
        >
          Mark Read All <ReadOutlined />
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ReadPopup;
