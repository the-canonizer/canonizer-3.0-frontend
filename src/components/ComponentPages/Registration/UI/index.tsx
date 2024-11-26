import { Fragment } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography, Form, Select, Card } from "antd";
import {
  UserOutlined,
  ArrowRightOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import SocialLoginButton from "components/common/socialLogin";
import LogoHeader from "components/common/headers/logoHeader";
import Inputs from "components/shared/FormInputs";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import RegistrationUiGoBack from "./goBack";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

declare global {
  interface Window {
    grecaptcha: any;
  }
}

function RegistrationUi({
  form,
  onFinish,
  country,
  isDisabled,
  onBrowseClick,
}) {
  const router = useRouter();

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 90 }}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option!.children as unknown as string).includes(input)
        }
        filterSort={(optionA, optionB) =>
          (optionA!.children as unknown as string)
            .toLowerCase()
            .localeCompare(
              (optionB!.children as unknown as string).toLowerCase()
            )
        }
        data-testid="dropdown_country"
        id="dropdown_country"
      >
        {country.map((code) => (
          <Option
            value={code.phone_code}
            key={code.country_code}
            id={`country_code_${code.country_code}`}
          >
            {code.phone_code}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  const onLoginClick = (e) => {
    e.preventDefault();
    router?.push({ pathname: "/login", query: { ...router?.query } });
  };

  return (
    <Card
      className="rounded-lg [&_.ant-card-body]:pb-3 mb-0"
      bordered={false}
      id="registration-card"
    >
      <Form
        form={form}
        name="registration"
        initialValues={{ prefix: "+1" }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        autoComplete="off"
        id="registration-form"
      >
        <div
          className="flex justify-center items-center text-center flex-col mb-4 [&_.ant-image>img]:h-[39px]"
          id="registration-header"
        >
          <RegistrationUiGoBack onBrowseClick={onBrowseClick} />
          <LogoHeader />
          <Title
            level={4}
            className="mt-4 text-sm text-canBlack !font-normal !mb-0"
            id="registration-title"
          >
            Create your account
          </Title>
          <Paragraph
            className="text-muted text-[10px] 2xl:text-xs text-canLight !font-[300]"
            id="mandatory-fields"
          >
            All fields marked with * are mandatory.
          </Paragraph>
        </div>

        <div className="mt-10" id="registration-inputs">
          <Row gutter={30}>
            <Col md={12} style={{ width: "100%" }} id="first-name-col">
              <Inputs
                name="first_name"
                label={
                  <Fragment>
                    {messages.labels.firstName}
                    <span className="required">*</span>
                  </Fragment>
                }
                rules={messages.firstNameRule}
                placeholder={messages.placeholders.firstName}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
                prefix={<UserOutlined />}
                id="first-name-input"
              />
            </Col>

            <Col md={12} style={{ width: "100%" }} id="last-name-col">
              <Inputs
                name="last_name"
                label={
                  <Fragment>
                    {messages.labels.lastName}
                    <span className="required">*</span>
                  </Fragment>
                }
                rules={messages.lastNameRule}
                placeholder={messages.placeholders.lastName}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
                prefix={<UserOutlined />}
                id="last-name-input"
              />
            </Col>
            <Col md={12} style={{ width: "100%" }} id="email-col">
              <Inputs
                name="email"
                label={
                  <Fragment>
                    {messages.labels.email}
                    <span className="required">*</span>
                  </Fragment>
                }
                rules={messages.emRule}
                placeholder={messages.placeholders.email}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={255}
                prefix={<MailOutlined />}
                type="email"
                id="email-input"
              />
            </Col>
            <Col md={12} style={{ width: "100%" }} id="phone-col">
              <Inputs
                name="phone"
                label={messages.labels.phone}
                rules={messages.phoneRule}
                type="tel"
                addonBefore={prefixSelector}
                placeholder={messages.placeholders.phone}
                maxLength={10}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                prefix={<PhoneOutlined className="opacity-0" />}
                inputMode="tel"
                inputClassName={`numberInput [&>*]:h-[40px] [&_.ant-input-affix-wrapper]:h-full [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-prefix]:w-0 [&_.ant-input-group-addon]:bg-transparent`}
                wrapperClassName="[&_.ant-form-item-explain-error]:!mb-0 [&_.ant-form-item-explain-connected]:last:mb-6"
                id="phone-input"
              />
            </Col>
            <Col md={12} style={{ width: "100%" }} id="password-col">
              <Inputs
                name="password"
                label={
                  <Fragment>
                    {messages.labels.password}
                    <span className="required">*</span>
                  </Fragment>
                }
                rules={messages.passwordRule}
                type="password"
                placeholder={messages.placeholders.password}
                prefix={<LockOutlined />}
                inputMode="password"
                id="password-input"
              />
            </Col>
            <Col
              md={{ span: 12 }}
              style={{ width: "100%" }}
              id="confirm-password-col"
            >
              <Inputs
                name="confirm"
                label={
                  <Fragment>
                    {messages.labels.confirmPassword}
                    <span className="required">*</span>
                  </Fragment>
                }
                dependencies={["password"]}
                rules={messages.confirmPasswordRule}
                type="password"
                placeholder={messages.placeholders.confirmPassword}
                prefix={<LockOutlined />}
                inputMode="password"
                id="confirm-password-input"
              />
            </Col>
          </Row>
        </div>

        <Form.Item className="text-center mt-5 mb-16" id="submit-button-item">
          <PrimaryButton
            type="primary"
            htmlType="submit"
            className="h-[40px] text-sm rounded-lg !w-8/12 lg:!w-4/12 flex items-center justify-center mx-auto"
            block
            data-testid="submitButton"
            id="register-btn"
            disabled={!isDisabled}
          >
            Sign Up <ArrowRightOutlined />
          </PrimaryButton>
        </Form.Item>

        <Form.Item className="my-5" id="social-login-item">
          <SocialLoginButton isNotLogin={true} id="social-login-button" />
        </Form.Item>
        <Form.Item className="text-center" id="already-account-item">
          <Text className="text-sm" id="already-text">
            Already have an account?{" "}
            <a
              href="#"
              onClick={onLoginClick}
              className="!text-canBlue hover:!text-canHoverBlue !text-xl !font-semibold"
              id="already-text-link"
            >
              Login
            </a>
          </Text>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default RegistrationUi;
