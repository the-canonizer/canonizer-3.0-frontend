import { Fragment } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography, Form, Select, Card, Button } from "antd";
import {
  UserOutlined,
  ArrowRightOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  LeftOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import SocialLoginButton from "src/components/common/socialLogin";
import LogoHeader from "src/components/common/headers/logoHeader";
import Inputs from "src/components/shared/FormInputs";
import PrimaryButton from "src/components/shared/Buttons/PrimariButton";

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
          <Button
            type="link"
            className="h-[50px] text-14 w-2/12 text-black flex items-center justify-start text-14 font-medium p-0 mb-4 hidden sm:block sm:self-start"
            onClick={onBrowseClick}
          >
            <LeftOutlined /> Go Back
          </Button>
          <LogoHeader />
          <Title
            level={4}
            className="mt-4 text-14 text-black font-medium"
            id="registration-title"
          >
            Create your account
          </Title>
          <Paragraph className="text-muted text-14 text-light font-regular">
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
                    <span className="required">*</span>
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
            className="h-[40px] text-14 rounded-md !w-6/12"
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
          <Text className="text-14 font-semibold" id="already-text">
            Already have an account?{" "}
            <a
              href="#"
              onClick={onLoginClick}
              className="text-blue hover:text-hblue"
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
