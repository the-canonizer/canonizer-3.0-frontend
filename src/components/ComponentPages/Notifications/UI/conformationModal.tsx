import { Typography, Modal } from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const DeleteAllPopup = ({ onClose, onDelete, isOpen, isDeleteDisabled }) => {
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
        id="modal-header"
      >
        <Typography.Paragraph
          className="text-center text-black text-xl font-medium"
          id="modal-title"
        >
          Are you sure?
        </Typography.Paragraph>
      </div>
      <Typography.Paragraph
        className="text-center text-sm text-canLight"
        id="modal-description"
      >
        You’re deleting all notifications. This action is irreversible.
      </Typography.Paragraph>
      <div className="text-center mt-7" id="modal-actions">
        <SecondaryButton
          onClick={onClose}
          className="rounded-lg px-7 inline-flex items-center justify-center"
          id="go-back-button"
        >
          Go Back <ArrowLeftOutlined />
        </SecondaryButton>
        <PrimaryButton
          onClick={onDelete}
          className="ml-4 rounded-lg px-7 inline-flex items-center justify-center"
          disabled={isDeleteDisabled}
          id="delete-all-button"
        >
          Delete All <DeleteOutlined />
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default DeleteAllPopup;
