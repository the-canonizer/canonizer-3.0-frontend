import { Fragment } from "react";
import { Typography, Form, Checkbox, Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

import messages from "src/messages";
import SocialLoginButton from "src/components/common/socialLogin";
import RegistrationUiGoBack from "components/ComponentPages/Registration/UI/goBack";
import LogoHeader from "components/common/headers/logoHeader";
import Inputs from "src/components/shared/FormInputs";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const { Title, Paragraph, Text } = Typography;

const LoginUi = ({
  form,
  onFinish,
  onOTPClick,
  errorMsg,
  onBrowseClick,
  isDisabled,
  isOTPDisabled,
  onForgotPasswordClick,
  onRegister,
}) => {
  return (
    <Card
      className="rounded-lg pb-3 [&_.ant-card-body]:pb-4 mb-8"
      bordered={false}
    >
      <Form
        form={form}
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
      >
        <div className="flex justify-center items-center text-center flex-col mb-4 [&_.ant-image>img]:h-[39px]">
          <RegistrationUiGoBack onBrowseClick={onBrowseClick} />
          <LogoHeader />
          <Title
            level={4}
            className="mt-4 text-sm text-canBlack !font-medium"
            id="login-title"
          >
            Welcome back!
          </Title>
          {/* <Paragraph className="text-muted text-sm text-canLight font-regular">
            All fields are mandatory.
          </Paragraph> */}
          {errorMsg && (
            <Text className="text-canRed" type="danger" id="login-error-label">
              {errorMsg}
            </Text>
          )}
        </div>
        <div className="w-full lg:w-8/12 m-auto mt-10">
          <Inputs
            name="username"
            label={
              <Fragment>
                {messages.labels.emailPhone} <span className="required">*</span>
              </Fragment>
            }
            rules={messages.usernameRule}
            placeholder={messages.placeholders.emailPhone}
            dataid="username"
            data-testid="username"
            onKeyDown={() => {}}
          />

          <Inputs
            name="password"
            label={
              <Fragment>
                {messages.labels.password}
                <span className="required">*</span>
              </Fragment>
            }
            rules={messages.userPassRule}
            type="password"
            placeholder={messages.placeholders.password}
          />

          <div className="flex justify-between items-center pb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-canBlack text-sm font-normal">
                Remember Me
              </Checkbox>
            </Form.Item>
            <Link href="/">
              <a
                id="forgot-password-link"
                data-testid="forgot-password-link"
                className="text-canBlue hover:text-canHoverBlue"
                onClick={onForgotPasswordClick}
              >
                Forgot Password?
              </a>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-5 mb-16">
          <PrimaryButton
            data-testid="submitButton"
            htmlType="submit"
            className="h-[40px] text-sm rounded-lg !w-8/12 lg:!w-4/12 mb-6 flex justify-center items-center mx-auto"
            id="login-btn"
            disabled={!isDisabled}
          >
            Log In <ArrowRightOutlined />
          </PrimaryButton>
          <SecondaryButton
            htmlType="button"
            className="h-[40px] text-sm rounded-lg !w-8/12 lg:!w-4/12 flex justify-center items-center"
            onClick={onOTPClick}
            id="request-otp-btn"
            data-testid="request-otp-btn"
            disabled={!isOTPDisabled}
          >
            Request OTP
          </SecondaryButton>
        </div>

        <div className="mt-10">
          <SocialLoginButton />
        </div>

        <Form.Item noStyle>
          <Text
            className="text-canBlack text-base text-center block mt-4"
            id="dont-account-link"
          >
            {`Don't have an account? `}
            <a
              onClick={onRegister}
              id="dont-account-link-tag"
              data-testid="dont-account-link-tag"
              className="!text-canBlue font-medium"
            >
              Register
            </a>
          </Text>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginUi;
