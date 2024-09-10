import dynamic from "next/dynamic";
import { Fragment } from "react";
import { Form, Row, Col, Typography, Drawer } from "antd";
import {
  CloseOutlined,
  LeftOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import SelectInputs from "components/shared/FormInputs/select";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import GetBreadCrumbs from "./PopupBreadCrumb";
import CustomSkelton from "components/common/customSkelton";

const Editorckl = dynamic(
  () => import("src/components/common/editorck/index"),
  { ssr: false }
);

const { Text } = Typography,
  { labels, placeholders, nickNmRule, validations } = messages,
  formats = [
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
    "|",
    "fontColor",
    "|",
    "indent",
    "outdent",
    "|",
    "link",
    "autolink",
    "blockQuote",
    "|",
    "findAndReplace",
    "|",
    "undo",
    "redo",
  ];

const PostFormPopup = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  nickNameList,
  quillContent,
  onContentChange,
  isError = false,
  isLoading = true,
  isMobile,
  isPostUpdate,
  onClose,
  isOpen,
  topicRecord,
  campRecord,
  isDisabled,
  isUpdateSubmit,
}) => {
  return (
    <Drawer
      closeIcon={<LeftOutlined className="text-xl" />}
      placement={isMobile ? "top" : "right"}
      title={isPostUpdate ? "Update Comment" : "Comment in this thread"}
      destroyOnClose
      onClose={onClose}
      open={isOpen}
      height={700}
      width={560}
      extra={
        <GetBreadCrumbs topicRecord={topicRecord} campRecord={campRecord} />
      }
      className="[&_.ant-drawer-header]:flex-wrap [&_.ant-drawer-header-title]:py-3 [&_.ant-drawer-header-title]:w-full [&_.ant-drawer-header-title]:flex-[100%] [&_.ant-drawer-header-title]:h-auto [&_.ant-drawer-extra]:w-full"
    >
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        name="new_post"
        className="flex flex-col w-full h-full pb-9"
        layout={"vertical"}
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        initialValues={{ ...initialValue }}
      >
        <Row gutter={16}>
          <Col sm={24} className="py-6">
            <Typography.Paragraph className="text-canRed text-xs">
              Note: Once you pick a nickname, for any contribution to a topic,
              you must always use the same nickname for any other contribution
              or forum comment to this topic.
            </Typography.Paragraph>
          </Col>
          <Col xs={24} sm={16} className="mb-4">
            <SelectInputs
              label={
                <Fragment>
                  {labels.cr_nick_name} <span className="required">*</span>
                </Fragment>
              }
              name="nick_name"
              defaultValue={nickNameList[0]?.id}
              options={nickNameList}
              placeholder={placeholders.nickName}
              allowClear
              size={"large"}
              dataid="topic-category"
              showSearch
              optionFilterProp="children"
              data-id="nick-names"
              inputClassName="border-0"
              rules={nickNmRule}
              nameKey="nick_name"
              prefix={<UserOutlined className="px-3 text-canBlack" />}
              onChange={(val) => form.setFieldValue("nick_name", val)}
              lastValue={form.getFieldValue("nick_name")}
            />
          </Col>
          <Col xs={24}>
            <div
              className="mb-[30px] relative editorContent"
              key="post_editor_div"
            >
              <label
                htmlFor="new_post_nick_name"
                className="ant-form-item-required text-sm font-medium mb-3 block"
                title=""
              >
                Message <span className="required">*</span>
              </label>
              {isLoading ? (
                <CustomSkelton skeltonFor="table" />
              ) : (
                <Editorckl
                  key="post_editor"
                  editorState={quillContent || ""}
                  oneditorchange={onContentChange}
                  placeholder="Post Your Message Here..."
                  items={formats}
                  height={200}
                />
              )}
              {isError && <Text type="danger">{validations.reply}</Text>}
            </div>
          </Col>
        </Row>
        <div className="flex justify-center pt-9 mt-auto">
          <SecondaryButton
            htmlType="button"
            className={`flex items-center justify-center py-2 h-auto px-9 mr-4`}
            onClick={onCancel}
            id="back-btn"
            data-testid="back-btn"
          >
            Cancel <CloseOutlined />
          </SecondaryButton>
          <PrimaryButton
            htmlType="submit"
            className={`flex items-center justify-center py-2 h-auto px-9`}
            id="submit-btn"
            data-testid="submit-btn"
            disabled={
              isLoading || !isDisabled || (isPostUpdate && !isUpdateSubmit)
            }
          >
            Submit <SaveOutlined />
          </PrimaryButton>
        </div>
      </Form>
    </Drawer>
  );
};

export default PostFormPopup;
