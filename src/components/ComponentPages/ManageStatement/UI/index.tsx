import { Form, Row, Col, Typography } from "antd";
import dynamic from "next/dynamic";
import {
  CloseOutlined,
  EyeOutlined,
  FileTextOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

import K from "src/constants";
import messages from "src/messages";
import CommonCards from "components/shared/Card";
import SelectInputs from "components/shared/FormInputs/select";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import ManageStatementUISkelaton from "./skelaton";
import CustomSkelton from "components/common/customSkelton";

//Ckeditor
const Editorckl = dynamic(() => import("components/common/editorck"), {
  ssr: false,
});

const EditorToolbarItems = [
  "heading",
  "|",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "superscript",
  "subscript",
  "|",
  "numberedList",
  "bulletedList",
  "alignment",
  "todoList",
  "|",
  "fontColor",
  "|",
  "indent",
  "outdent",
  "|",
  "link",
  "autolink",
  "imageInsert",
  "blockQuote",
  "insertTable",
  "mediaEmbed",
  "|",
  "findAndReplace",
  "horizontalLine",
  "pageBreak",
  "specialCharacters",
  "|",
  "undo",
  "redo",
];

function ManageStatementUI({
  form,
  handleformvalues,
  onFinish,
  screenLoading,
  nickNameData,
  isEdit,
  editorState,
  onEditorStateChange,
  submitIsDisable,
  onNickNameSelect,
  editCampStatementData,
  onDiscardClick,
  isDisabled,
  onPreviewClick,
  isDraft,
}) {
  console.log(
    "IS-DISABLED---",
    submitIsDisable,
    !isDisabled,
    "<--- variables, final output ---->",
    submitIsDisable || !isDisabled
  );
  return (
    <CommonCards className="border-0 bg-white">
      <header className="mb-14">
        <Typography.Paragraph className="text-xl text-canBlack font-medium">
          {isEdit && !isDraft
            ? "Update Camp Statement"
            : "Adding Camp Statement"}
        </Typography.Paragraph>
        <Typography.Paragraph className="text-canBlack opacity-80 mt-3">
          Each camp features a statement summarizing the discussions within,
          providing a clear overview of the topic's various perspectives. This
          concise summary serves as a guide.
        </Typography.Paragraph>
      </header>
      {screenLoading ? (
        <ManageStatementUISkelaton isEdit={isEdit && !isDraft} />
      ) : (
        <Form
          form={form}
          layout={"vertical"}
          validateTrigger={messages.formValidationTypes()}
          initialValues={{ available_for_child: 0 }}
          onValuesChange={handleformvalues}
          onFinish={onFinish}
        >
          <Row gutter={28}>
            <Col xs={24} sm={24} xl={12}>
              <SelectInputs
                label={
                  <>
                    Nickname <span className="required">*</span>
                  </>
                }
                name="nick_name"
                value={nickNameData[0]?.id}
                options={nickNameData}
                allowClear
                size={"large"}
                dataid="topic-category"
                showSearch
                optionFilterProp="children"
                inputClassName="border-0"
                rules={[
                  {
                    required: true,
                    message: K?.exceptionalMessages?.selectNickNameErrorMsg,
                  },
                ]}
                nameKey="nick_name"
                prefix={<UserOutlined className="px-3 text-canBlack" />}
                onChange={onNickNameSelect}
              />
            </Col>
            <Col xs={24} xl={24}>
              <Form.Item
                className="mb-2"
                name="statement"
                label={
                  <>
                    Statement <span className="required">*</span>
                  </>
                }
                rules={[
                  {
                    required: true,
                    message: K?.exceptionalMessages?.statementRequiredErrorMsg,
                  },
                  {
                    pattern: /[^ \s]/,
                    message: K?.exceptionalMessages?.statementRequiredErrorMsg,
                  },
                ]}
              >
                {screenLoading ? (
                  <CustomSkelton
                    bodyCount
                    stylingClass
                    isButton
                    height={250}
                    skeltonFor="video"
                  />
                ) : (
                  <Editorckl
                    editorState={editorState}
                    oneditorchange={onEditorStateChange}
                    placeholder="Write Your Statement Here"
                    items={EditorToolbarItems}
                  ></Editorckl>
                )}
              </Form.Item>
            </Col>
            {isEdit && !isDraft && (
              <Col xs={24} xl={24} className="mt-6">
                <Inputs
                  name="edit_summary"
                  label={
                    <>
                      Add Summary Of Changes
                      <small className="ml-1">
                        (Briefly describe your changes)
                      </small>
                    </>
                  }
                  rules={messages.summaryRule}
                  placeholder={messages.placeholders.firstName}
                  maxLength={100}
                  prefix={<FileTextOutlined />}
                  defaultValue={String(editCampStatementData)}
                />
              </Col>
            )}
            <Col
              xs={24}
              xl={24}
              className="flex justify-between items-center pt-5 mt-3"
            >
              <Form.Item className="mb-0">
                <SecondaryButton
                  className="inline-flex items-center justify-center h-auto py-2 px-7 mr-5 h-auto"
                  onClick={onDiscardClick}
                  id="update-cancel-btn"
                >
                  Discard <CloseOutlined />
                </SecondaryButton>
                <PrimaryButton
                  htmlType="submit"
                  className="inline-flex items-center justify-center h-auto py-2 px-7 h-auto"
                  disabled={submitIsDisable || !isDisabled}
                >
                  Publish Statement
                  <UploadOutlined />
                </PrimaryButton>
              </Form.Item>
              <SecondaryButton
                className="!border-0 flex items-center justify-center !shadow-none h-auto"
                onClick={onPreviewClick}
              >
                Preview Statement <EyeOutlined />
              </SecondaryButton>
            </Col>
          </Row>
        </Form>
      )}
    </CommonCards>
  );
}

export default ManageStatementUI;
