import React, { createRef, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography, Form, Input, Button, Select } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";
import SocialLoginButton from "../../../common/socialLogin";
import FormItem from "../../../common/formElements";

const { Title, Text } = Typography;
const { Option } = Select;

declare global {
  interface Window {
    grecaptcha: any;
  }
}

function RegistrationUi({
  form,
  onFinish,
  isModal,
  closeModal,
  onReCAPTCHAChange,
  resetCaptcha,
  showCaptchaError,
  country,
  openLogin,
}) {
  const router = useRouter();

  const recaptchaRef: React.RefObject<{ reset }> = createRef();

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 90 }}>
        {country.map((code) => (
          <Option value={code.phone_code} key={code.country_code}>
            {code.phone_code}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  useEffect(() => {
    if (resetCaptcha) {
      recaptchaRef?.current?.reset();
    }
  }, [resetCaptcha, recaptchaRef]);

  const onLoginClick = (e) => {
    e.preventDefault();
    if (isModal) {
      closeModal();
      openLogin();
    } else {
      router.push("/login");
    }
  };

  return (
    <section className={styles.signup_wrapper}>
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
        <Title level={2} className={styles.titles}>
          Register Now on Canonizer
        </Title>
        {isModal && (
          <Button
            shape="circle"
            type="link"
            className={styles.close_btn}
            onClick={closeModal}
            icon={<CloseCircleOutlined />}
          />
        )}
        <div className={styles.section_one}>
          <Row gutter={30}>
            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="first_name"
                label={
                  <Fragment>
                    {messages.labels.firstName} <span>(Limit 100 Chars)</span>
                  </Fragment>
                }
                rules={messages.firstNameRule}
                placeholder={messages.placeholders.firstName}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
              />
            </Col>

            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="last_name"
                label={
                  <Fragment>
                    {messages.labels.lastName}
                    <span>(Limit 100 Chars)</span>
                  </Fragment>
                }
                rules={messages.lastNameRule}
                placeholder={messages.placeholders.lastName}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <FormItem
                name="email"
                label={
                  <Fragment>
                    {messages.labels.email}
                    <span>(Limit 255 Chars)</span>
                  </Fragment>
                }
                rules={messages.emRule}
                placeholder={messages.placeholders.email}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={255}
              />
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <Form.Item
                name="phone"
                label={messages.labels.phone}
                {...messages.phoneRule}
                className={styles.phoneInput}
              >
                <Input
                  type="number"
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  className={`${styles.phoneInput} numberInput`}
                  placeholder={messages.placeholders.phone}
                  autoComplete="new-phone"
                  onKeyDown={(e) =>
                    e.key === " " && e.keyCode === 32 && e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <Form.Item
                name="password"
                label={messages.labels.password}
                {...messages.passwordRule}
              >
                <Input.Password
                  className={styles.passwordInput}
                  type="password"
                  placeholder={messages.placeholders.password}
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
            <Col md={{ span: 12 }} style={{ width: "100%" }}>
              <Form.Item
                name="confirm"
                label={messages.labels.confirmPassword}
                dependencies={["password"]}
                {...messages.confirmPasswordRule}
              >
                <Input.Password
                  className={styles.passwordInput}
                  type="password"
                  placeholder={messages.placeholders.confirmPassword}
                  autoComplete="new-conf-password"
                />
              </Form.Item>
            </Col>
            <Col md={{ span: 12, offset: 6 }} style={{ width: "100%" }}>
              <Form.Item
                // label={messages.labels.captcha}
                name="captcha"
                {...messages.getCaptchaRule(showCaptchaError)}
                style={{
                  paddingLeft: "30px",
                  marginTop: "15px",
                  marginBottom: "0",
                }}
              >
                <div className={styles.captchaCol}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onReCAPTCHAChange}
                    grecaptcha={global?.window?.grecaptcha}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
            data-testid="submitButton"
            style={{ marginTop: "20px" }}
          >
            Register Now <ArrowRightOutlined />
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: "15px" }}>
          <SocialLoginButton isNotLogin={true} />
        </Form.Item>
        <Form.Item noStyle>
          <Text className={styles.ft_link}>
            Already have an account?{" "}
            <a href="#" onClick={onLoginClick}>
              Login Here
            </a>
          </Text>
        </Form.Item>
      </Form>
    </section>
  );
}

export default RegistrationUi;
