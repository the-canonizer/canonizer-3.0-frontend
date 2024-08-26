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
import StarIcon from "./starIcon";

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
  onImproveClick,
}) {
  return (
    <CommonCards className="border-0 bg-white">
      <header className="mb-14">
        <Typography.Paragraph className="text-xl text-canBlack font-medium">
          {isEdit ? "Update Camp Statement" : "Adding Camp Statement"}
        </Typography.Paragraph>
        <Typography.Paragraph className="text-canBlack opacity-80 mt-3">
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
            nick_name: nickNameData[0]?.id,
          }}
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
                defaultValue={nickNameData[0]?.id}
                value={values?.nick_name}
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
                onChange={(val) => form.setFieldValue("nick_name", val)}
              />
            </Col>
            <Col xs={24} xl={24}>
              <Form.Item
                className="mb-2 editorContent [&_.ant-form-item-label>label]:w-full"
                name="statement"
                label={
                  <>
                    Statement <span className="required">*</span>
                    <SecondaryButton
                      className="flex justify-center items-center border-0 p-0 ml-auto float-end !shadow-none hover:!shadow-none !bg-transparent"
                      type="link"
                      ghost
                      onClick={onImproveClick}
                    >
                      Improve With Ai <StarIcon className="" />
                    </SecondaryButton>
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
                    saveContent={(data) => {
                      autoSave({
                        statement: data,
                        nick_name: values?.nick_name,
                      });
                    }}
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
                  placeholder={messages.placeholders.editSummary}
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
                  disabled={isAutoSaving}
                >
                  Discard <CloseOutlined />
                </SecondaryButton>
                <PrimaryButton
                  htmlType="submit"
                  className="inline-flex items-center justify-center h-auto py-2 px-7 h-auto"
                  disabled={submitIsDisable || !isDisabled || isAutoSaving}
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
