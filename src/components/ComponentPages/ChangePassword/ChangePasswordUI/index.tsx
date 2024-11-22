import { Form, Input, Row, Col } from "antd";
import { useState } from "react";
import Image from "next/image";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

import messages from "src/messages";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

function ChangePasswordUI({
  form,
  onFinish,
  onFinishFailed,
  incorrectPasswordData,
  setIncorrectPasswordData,
}) {
  const [currentPassWord, setCurrentPassWord] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewpassword, setShowNewpassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateFun = {
    validateStatus: "error" as any,
    help: incorrectPasswordData as any,
  };

  const onChangeFun = (value) => {
    setCurrentPassWord(value);
    setIncorrectPasswordData("");
  };

  return (
    <section id="change_password_section">
      <SectionHeading
        title="Change Password"
        icon={null}
        className="!mb-5 lg:mt-0 mt-10"
      />
      <Form
        id="change_password_form"
        form={form}
        name="changePassword"
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="p-0"
      >
        <Row gutter={30} id="change_password_row_1">
          <Col
            md={12}
            className="lg:w-auto w-full"
            id="change_password_col_current_password"
          >
            <Form.Item
              id="form_for_current_password"
              className="[&_.ant-input-affix-wrapper]:!border-canGrey2 text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              name="current_password"
              label={
                <>
                  {messages.labels.currentPassword}
                  <span className="required" id="asteriskCurrentPassword">
                    *
                  </span>
                </>
              }
              {...messages.currentPasswordRule}
              {...(currentPassWord !== ""
                ? incorrectPasswordData
                  ? validateFun
                  : ""
                : "")}
            >
              <Input
                id="current_password_input"
                className="rounded-lg pl-5 pr-5 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                prefix={
                  <Image
                    src="/images/nickname-lock-icon.svg"
                    width={14}
                    height={16}
                    alt=""
                  />
                }
                suffix={
                  <Image
                    src="/images/visible-icon.svg"
                    width={16}
                    height={13}
                    alt=""
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  />
                }
                type={showCurrentPassword ? "text" : "password"}
                data-testid="currentpasssword"
                // placeholder={messages.placeholders.currentPassword}
                onChange={(e) => onChangeFun(e.target.value)}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="mt-12" id="change_password_section_new_password">
          <SectionHeading
            title="Enter New Password"
            icon={null}
            className="!mb-5"
          />
        </div>
        <Row gutter={30} id="change_password_row_2">
          <Col
            md={8}
            sm={24}
            className="lg:w-auto w-full"
            id="change_password_col_new_password"
          >
            <Form.Item
              id="form_for_new_password"
              className="[&_.ant-input-affix-wrapper]:!border-canGrey2 text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              name="new_password"
              label={
                <>
                  {messages.labels.newPassword}
                  <span className="required" id="asteriskNewPassword">
                    *
                  </span>
                </>
              }
              {...messages.newPasswordRule}
            >
              <Input
                className="rounded-lg pl-5 pr-5 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                prefix={
                  <Image
                    src="/images/nickname-lock-icon.svg"
                    width={14}
                    height={16}
                    alt=""
                  />
                }
                suffix={
                  <Image
                    src="/images/visible-icon.svg"
                    width={16}
                    height={13}
                    alt=""
                    onClick={() => setShowNewpassword(!showNewpassword)}
                  />
                }
                id="new_password_input"
                type={showNewpassword ? "text" : "password"}
                data-testid="newpassword"
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
              />
            </Form.Item>
          </Col>
          <Col
            md={8}
            sm={24}
            className="lg:w-auto w-full"
            id="change_password_col_confirm_password"
          >
            <Form.Item
              id="form_for_confirm_password"
              className="[&_.ant-input-affix-wrapper]:!border-canGrey2 text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              name="confirm_password"
              label={
                <>
                  {messages.labels.confirmPassword}
                  <span className="required" id="asteriskConfirmPassword">
                    *
                  </span>
                </>
              }
              dependencies={["new_password"]}
              {...messages.confirmNewPasswordRule}
            >
              <Input
                className="rounded-lg pl-5 pr-5 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                prefix={
                  <Image
                    src="/images/nickname-lock-icon.svg"
                    width={14}
                    height={16}
                    alt=""
                  />
                }
                suffix={
                  <Image
                    src="/images/visible-icon.svg"
                    width={16}
                    height={13}
                    alt=""
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                id="confirm_password_input"
                data-testid="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div
            className="flex items-center w-full flex-wrap justify-center gap-6 my-5"
            id="change_password_btn_section"
          >
            <SecondaryButton
              className="flex gap-2.5 items-center justify-center h-auto py-2 lg:w-3/12"
              onClick={() => {
                form.resetFields();
                setCurrentPassWord("");
                setIncorrectPasswordData("");
              }}
              id="change_password_discard_btn"
            >
              Discard{" "}
              <CloseOutlined id="change_password_discard_btn_close_outline" />
            </SecondaryButton>
            <PrimaryButton
              id="change_password_save_btn_btn"
              type="primary"
              htmlType="submit"
              data-testid="submitButton"
              tabIndex={12}
              className="flex gap-2.5 items-center justify-center h-auto py-2 lg:w-3/12"
            >
              Save Changes{" "}
              <SaveOutlined id="change_password_save_btn_save_outline" />
            </PrimaryButton>
          </div>
        </Form.Item>
      </Form>
    </section>
  );
}

export default ChangePasswordUI;
