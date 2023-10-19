import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography, Form, Input, Button, Select } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";

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
  country,
  openLogin,
}: any) {
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
    if (isModal) {
      closeModal();
      openLogin();
    } else {
      router?.push("/login");
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
        <Title level={2} className={styles.titles} id="registration-title">
          Register Now On Canonizer
        </Title>
        {isModal && (
          <Button
            shape="circle"
            type="link"
            className={styles.close_btn}
            onClick={closeModal}
            icon={<CloseCircleOutlined />}
            id="register-modal-close-btn"
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
                    <span className="required">*</span>
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
                    <span className="required">*</span>
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
                    <span className="required">*</span>
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
                  type="tel"
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  className={`${styles.phoneInput} numberInput`}
                  placeholder={messages.placeholders.phone}
                  autoComplete="off"
                  maxLength={10}
                  onKeyDown={(e) =>
                    e.key === " " && e.keyCode === 32 && e.preventDefault()
                  }
                />
              </Form.Item>
            </Col>
            <Col md={12} style={{ width: "100%" }}>
              <Form.Item
                name="password"
                label={
                  <>
                    {messages.labels.password}
                    <span className="required">*</span>
                  </>
                }
                {...messages.passwordRule}
              >
                <Input.Password
                  className={styles.passwordInput}
                  type="password"
                  placeholder={messages.placeholders.password}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col md={{ span: 12 }} style={{ width: "100%" }}>
              <Form.Item
                name="confirm"
                label={
                  <>
                    {messages.labels.confirmPassword}
                    <span className="required">*</span>
                  </>
                }
                dependencies={["password"]}
                {...messages.confirmPasswordRule}
              >
                <Input.Password
                  className={styles.passwordInput}
                  type="password"
                  placeholder={messages.placeholders.confirmPassword}
                  autoComplete="off"
                />
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
            id="register-btn"
          >
            Register Now <ArrowRightOutlined />
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: "15px" }}>
          <SocialLoginButton isNotLogin={true} />
        </Form.Item>
        <Form.Item noStyle>
          <Text className={styles.ft_link} id="already-text">
            Already have an account?{" "}
            <a href="#" onClick={onLoginClick} id="already-text-link">
              Login Here
            </a>
          </Text>
        </Form.Item>
      </Form>
    </section>
  );
}

export default RegistrationUi;
