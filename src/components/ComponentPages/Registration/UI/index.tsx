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
import SocialLoginButton from "src/components/common/socialLogin";
import LogoHeader from "src/components/common/headers/logoHeader";
import Inputs from "src/components/shared/FormInputs";
import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
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
      >
        {country.map((code) => (
          <Option value={code.phone_code} key={code.country_code}>
            {code.phone_code}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  const onLoginClick = (e) => {
    e.preventDefault();
    router?.push("/login");
  };

  return (
    <Card className="rounded-lg" bordered={false}>
      <Form
        form={form}
        name="registration"
        initialValues={{ prefix: "+1" }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        autoComplete="off"
      >
        <div className="flex justify-center items-center text-center flex-col mb-4">
          <RegistrationUiGoBack onBrowseClick={onBrowseClick} />
          <LogoHeader />
          <Title
            level={4}
            className="mt-4 text-sm text-canBlack font-medium"
            id="registration-title"
          >
            Create your account
          </Title>
          <Paragraph className="text-muted text-sm text-canLight font-regular">
            All fields are mandatory.
          </Paragraph>
        </div>

        <div className="">
          <Row gutter={30}>
            <Col md={12} style={{ width: "100%" }}>
              <Inputs
                name="first_name"
                label={
                  <Fragment>
                    {messages.labels.firstName}
                    {/* <span>(Limit 100 Chars)</span> */}
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
              />
            </Col>

            <Col md={12} style={{ width: "100%" }}>
              <Inputs
                name="last_name"
                label={
                  <Fragment>
                    {messages.labels.lastName}
                    {/* <span>(Limit 100 Chars)</span> */}
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
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <Inputs
                name="email"
                label={
                  <Fragment>
                    {messages.labels.email}
                    {/* <span>(Limit 255 Chars)</span> */}
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
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <Inputs
                name="phone"
                label={
                  <Fragment>
                    {messages.labels.phone}
                    {/* <span>(Limit 100 Chars)</span> */}
                    {/* <span className="required">*</span> */}
                  </Fragment>
                }
                rules={messages.phoneRule}
                type="tel"
                addonBefore={prefixSelector}
                // addonAfter={prefixSelector}
                placeholder={messages.placeholders.phone}
                maxLength={10}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                prefix={<PhoneOutlined />}
                inputMode="tel"
                inputClassName={`numberInput [&>*]:h-[40px] [&_.ant-input-affix-wrapper]:h-full`}
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
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
              />
            </Col>
            <Col md={{ span: 12 }} style={{ width: "100%" }}>
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
              />
            </Col>
          </Row>
        </div>

        <Form.Item className="text-center">
          <PrimaryButton
            type="primary"
            htmlType="submit"
            className="h-[40px] text-sm rounded-md !w-8/12 lg:!w-4/12"
            block
            data-testid="submitButton"
            id="register-btn"
            disabled={!isDisabled}
          >
            Sign Up <ArrowRightOutlined />
          </PrimaryButton>
        </Form.Item>

        <Form.Item className="my-5">
          <SocialLoginButton isNotLogin={true} />
        </Form.Item>
        <Form.Item className="text-center">
          <Text className="text-sm font-semibold" id="already-text">
            Already have an account?{" "}
            <a
              href="#"
              onClick={onLoginClick}
              className="text-canBlue hover:text-canHoverBlue"
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
