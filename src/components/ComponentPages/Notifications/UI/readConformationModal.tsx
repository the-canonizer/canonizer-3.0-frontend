import { Typography, Modal } from "antd";
import { ArrowLeftOutlined, ReadOutlined } from "@ant-design/icons";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const ReadPopup = ({ onClose, onRead, isOpen }) => {
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
      <div className="flex justify-center items-center relative">
        <Typography.Paragraph className="text-center text-black text-xl font-medium">
          Are you sure?
        </Typography.Paragraph>
      </div>
      <Typography.Paragraph className="text-center text-sm text-canLight">
        You want to mark all notifications as read. This action is irreversible.
      </Typography.Paragraph>
      <div className="text-center mt-7">
        <SecondaryButton
          onClick={onClose}
          className="rounded-md px-7 inline-flex items-center justify-center"
        >
          Cancel <ArrowLeftOutlined />
        </SecondaryButton>
        <PrimaryButton
          onClick={onRead}
          className="ml-4 rounded-md px-7 inline-flex items-center justify-center"
        >
          Mark Read All <ReadOutlined />
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default ReadPopup;
