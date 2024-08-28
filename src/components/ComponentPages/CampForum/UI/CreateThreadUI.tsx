import { Fragment } from "react";
import { Form, Row, Col, Typography, Drawer } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  LeftOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import SelectInputs from "components/shared/FormInputs/select";
import Inputs from "components/shared/FormInputs";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import GetBreadCrumbs from "./PopupBreadCrumb";

const { labels, placeholders, nickNmRule, threadTitleRule } = messages;

const CreateEditThreadPopup = ({
  isOpen,
  onFinish,
  form,
  onClose,
  isMobile,
  initialValue,
  isThreadUpdate,
  nickNameList,
  isLoading,
  onCancel,
  isDisabled,
  topicRecord,
  campRecord,
  isUpdateSubmit,
}) => {
  return (
    <Drawer
      closeIcon={<LeftOutlined className="text-xl" />}
      placement={isMobile ? "top" : "right"}
      title={isThreadUpdate ? "Update thread" : "Create a new thread"}
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
        name="create_new_thread"
        className="flex flex-col w-full h-full pb-9"
        layout={"vertical"}
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        initialValues={{ ...initialValue }}
      >
        <Row gutter={16}>
          {!isThreadUpdate && (
            <Col sm={24} className="py-6">
              <Typography.Paragraph className="text-canRed text-xs">
                Note: Once you pick a nickname, for any contribution to a topic,
                you must always use the same nickname for any other contribution
                or forum comment to this topic.
              </Typography.Paragraph>
            </Col>
          )}
          <Col xs={24} sm={16} className="mb-4">
            {!isThreadUpdate ? (
              <SelectInputs
                label={
                  <Fragment>
                    Nickname <span className="required">*</span>
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
              />
            ) : null}
          </Col>
          <Col xs={24} sm={24}>
            <Inputs
              name="thread_title"
              label={
                <Fragment>
                  {labels.threadTitle}
                  <span>(Limit 100 Chars)</span>
                  <span className="required">*</span>
                </Fragment>
              }
              rules={threadTitleRule}
              placeholder="Title"
              maxLength={100}
              prefix={<EditOutlined />}
            />
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
              isLoading || !isDisabled || (isThreadUpdate && !isUpdateSubmit)
            }
          >
            Submit <SaveOutlined />
          </PrimaryButton>
        </div>
      </Form>
    </Drawer>
  );
};

export default CreateEditThreadPopup;
