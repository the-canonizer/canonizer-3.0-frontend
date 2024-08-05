import { Typography, Modal, Button } from "antd";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import sanitizeHtml from "sanitize-html";

import CommonCards from "components/shared/Card";
import CustomSkelton from "components/common/customSkelton";

function StatementPreview({
  statement,
  onPreveiwClose,
  isLoading = false,
  isVisible = false,
}) {
  return (
    <Modal
      style={{ top: "20px" }}
      visible={isVisible}
      footer={null}
      closable={false}
      width={800}
      className="rounded-xl overflow-hidden [&_.ant-modal-body]:rounded-xl"
      data-testid="statementPreview"
    >
      <header className="mb-3 flex items-start justify-start">
        <Typography.Paragraph className="text-xl text-canBlack font-medium !mb-0">
          Camp Statement{" "}
          <Typography.Text className="uppercase text-xs text-canLight font-semibold">
            <EyeOutlined /> Preview Mode
          </Typography.Text>
        </Typography.Paragraph>
        <Button
          className="ml-auto !border-0 h-auto p-0 !shadow-none"
          onClick={onPreveiwClose}
        >
          <CloseOutlined />
        </Button>
      </header>
      <CommonCards className="border-0 bg-canGray !p-0 [&_.ant-card-body]:!p-5 [&_.ant-card-body]:min-h-72 [&_.ant-card-body]:max-h-96 [&_.ant-card-body]:overflow-y-auto [&_.ant-card-body]:overflow-x-hidden [&_.ant-card-body]:scroll-pr-6 [&_.ant-card-body]:snap-y">
        {isLoading ? (
          <CustomSkelton
            bodyCount
            stylingClass
            isButton
            height={150}
            skeltonFor="video"
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(statement, {
                allowedAttributes: {
                  "*": [
                    "class",
                    "id",
                    "href",
                    "align",
                    "alt",
                    "center",
                    "bgcolor",
                    "src",
                    "title",
                    "style",
                    "rel",
                    "target",
                  ],
                },
              }),
            }}
            className="text-canBlack rounded-sm h-full"
          ></div>
        )}
      </CommonCards>
    </Modal>
  );
}

export default StatementPreview;
