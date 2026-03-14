import { Typography, Modal, Button } from "antd";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";

import CommonCards from "components/shared/Card";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import StatementDescPreview from "./descView";

function StatementAIPreview({
  statement,
  onPreveiwClose,
  onInsertClick,
  isLoading = false,
  isVisible = false,
}) {
  return (
    <Modal
      visible={isVisible}
      footer={
        <div
          id="footer-container"
          className="flex justify-center items-center py-4"
        >
          <SecondaryButton
            id="cancel-button"
            onClick={onPreveiwClose}
            className="flex justify-center items-center py-2 px-8 h-auto"
          >
            Cancel <CloseOutlined />
          </SecondaryButton>
          <PrimaryButton
            id="use-statement-button"
            onClick={onInsertClick}
            className="flex justify-center items-center py-2 px-8 h-auto"
          >
            Use this statement <CheckCircleOutlined />
          </PrimaryButton>
        </div>
      }
      closable={false}
      width={900}
      className="rounded-xl overflow-hidden [&_.ant-modal-body]:rounded-xl"
      data-testid="statementPreview"
      centered
    >
      <header id="modal-header" className="mb-8 flex items-start justify-start">
        <Typography.Paragraph
          id="modal-title"
          className="text-xl text-canBlack font-medium !mb-0"
        >
          AI Improved Camp Statement
        </Typography.Paragraph>
        <Button
          id="close-button"
          className="ml-auto !border-0 h-auto p-0 !shadow-none"
          onClick={onPreveiwClose}
        >
          <CloseOutlined />
        </Button>
      </header>
      <CommonCards
        id="statement-card"
        className="border-0 bg-canGray !p-0 [&_.ant-card-body]:!p-5 [&_.ant-card-body]:min-h-72 [&_.ant-card-body]:max-h-96 [&_.ant-card-body]:overflow-y-auto [&_.ant-card-body]:overflow-x-hidden [&_.ant-card-body]:scroll-pr-6 [&_.ant-card-body]:snap-y"
      >
        <StatementDescPreview statement={statement} isLoading={isLoading} />
      </CommonCards>
    </Modal>
  );
}

export default StatementAIPreview;
