import { Form, Row, Col, Typography } from "antd";
import dynamic from "next/dynamic";
import {
  CloseOutlined,
  EyeOutlined,
  FileTextOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRef } from "react";

import K from "src/constants";
import messages from "src/messages";
import CommonCards from "components/shared/Card";
import SelectInputs from "components/shared/FormInputs/select";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import ManageStatementUISkelaton from "./skelaton";
import CustomSkelton from "components/common/customSkelton";
import { defaultNicknameData } from "src/utils/generalUtility";
// import StarIcon from "./starIcon";

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
  editCampStatementData,
  onDiscardClick,
  isDisabled,
  onPreviewClick,
  isDraft,
  autoSave,
  isAutoSaving,
  values,
  // onImproveClick,
  // isGenerating,
}) {
  const editorRef = useRef(null);

  return (
    <CommonCards className="border-0 bg-white" id="common-cards">
      <header className="mb-14" id="header">
        <Typography.Paragraph
          className="text-xl text-canBlack font-medium"
          id="header-title"
        >
          {isEdit ? "Update Camp Statement" : "Adding Camp Statement"}
        </Typography.Paragraph>
        <Typography.Paragraph
          className="text-canBlack opacity-80 mt-3"
          id="header-description"
        >
          Each camp features a statement summarizing the discussions within,
          providing a clear overview of the topic&lsquo;s various perspectives.
          This concise summary serves as a guide.
        </Typography.Paragraph>
      </header>
      {screenLoading ? (
        <ManageStatementUISkelaton isEdit={isEdit && !isDraft} />
      ) : (
        <Form
          form={form}
          layout={"vertical"}
          validateTrigger={messages.formValidationTypes()}
          initialValues={{
            available_for_child: 0,
            nick_name: defaultNicknameData(nickNameData)?.id
              ? -defaultNicknameData(nickNameData)?.id
              : nickNameData[0]?.id,
          }}
          onValuesChange={handleformvalues}
          onFinish={onFinish}
          id="statement-form"
        >
          <Row gutter={28} id="form-row">
            <Col xs={24} sm={24} xl={12} id="nickname-col">
              <SelectInputs
                label={
                  <span className="ant-form-item-required">
                    Nickname <span className="required">*</span>
                  </span>
                }
                name="nick_name"
                defaultValue={
                  defaultNicknameData(nickNameData)?.id
                    ? defaultNicknameData(nickNameData)?.id
                    : nickNameData[0]?.id
                }
                options={nickNameData}
                allowClear
                size="large"
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
                key="statement-nicknames"
                onSelect={(val) => form.setFieldValue("nick_name", val)}
                lastValue={form.getFieldValue("nick_name")}
                id="nickname-select"
              />
            </Col>
            <Col xs={24} xl={24} id="statement-col">
              <Form.Item
                className="mb-2 editorContent [&_.ant-form-item-label>label]:w-full"
                name="statement"
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
                id="statement-form-item"
              >
                {screenLoading ? (
                  <CustomSkelton
                    bodyCount
                    stylingClass
                    isButton
                    height={250}
                    skeltonFor="video"
                    id="statement-skelton"
                  />
                ) : (
                  <Editorckl
                    ref={editorRef}
                    editorState={editorState}
                    oneditorchange={onEditorStateChange}
                    placeholder="Write Your Statement Here"
                    items={EditorToolbarItems}
                    saveContent={(data) => {
                      autoSave({
                        statement: data,
                        nick_name: values?.nick_name,
                      });
                    }}
                    id="statement-editor"
                  ></Editorckl>
                )}
              </Form.Item>
            </Col>
            {isEdit && !isDraft && (
              <Col xs={24} xl={24} className="mt-6" id="edit-summary-col">
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
                  placeholder={messages.placeholders.editSummary}
                  maxLength={100}
                  prefix={<FileTextOutlined />}
                  defaultValue={String(editCampStatementData)}
                  id="edit-summary-input"
                />
              </Col>
            )}
            <Col
              xs={24}
              xl={24}
              className="flex justify-between items-center pt-5 mt-3 flex-wrap gap-5"
              id="form-actions-col"
            >
              <Form.Item
                className="mb-0 [&_.ant-form-item-control-input-content]:flex [&_.ant-form-item-control-input-content]:gap-5 [&_.ant-form-item-control-input-content]:flex-wrap"
                id="form-actions"
              >
                <SecondaryButton
                  className="inline-flex items-center justify-center h-auto py-2 px-7 mr-5 h-auto"
                  onClick={onDiscardClick}
                  id="discard-button"
                  disabled={isAutoSaving}
                >
                  Discard <CloseOutlined />
                </SecondaryButton>
                <PrimaryButton
                  htmlType="submit"
                  className="inline-flex items-center justify-center h-auto py-2 px-7 h-auto"
                  disabled={
                    (submitIsDisable && isEdit) || !isDisabled || isAutoSaving
                  }
                  id="publish-button"
                >
                  Publish Statement
                  <UploadOutlined />
                </PrimaryButton>
              </Form.Item>
              <SecondaryButton
                className="!border-0 flex items-center justify-center !shadow-none h-auto"
                onClick={onPreviewClick}
                id="preview-button"
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
