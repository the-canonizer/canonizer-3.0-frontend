import { Fragment } from "react";
import { Typography, Form, Row, Col, Button, Input } from "antd";
import {
  CloseCircleOutlined,
  ArrowRightOutlined,
  RedoOutlined,
} from "@ant-design/icons";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";
import FormItem from "../../../common/formElements";

const { Title, Text } = Typography;
const { labels } = messages;

const NameConfirmation = ({
  form,
  onFinish,
  isModal,
  closeModal,
  isOTP,
  onResendClick,
  isResend,
}: any) => (
  <section className={styles.signup_wrapper + " " + styles.textCenter}>
    <Form
      form={form}
      name="name-confirmation"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      validateTrigger={messages.formValidationTypes()}
    >
      <Title level={2} className={styles.titles} id="name-title">
        {isOTP ? labels.otpTitle : labels.nameConfirmationTitle}
      </Title>
      {isModal && (
        <Button
          shape="circle"
          type="link"
          className={styles.close_btn}
          onClick={closeModal}
          icon={<CloseCircleOutlined />}
          id="close-modal-btn"
        />
      )}
      <div className={styles.section_one}>
        <Text type="danger" className={styles.otpNote} id="note-text">
          {isOTP ? labels.otpLabel : labels.nameLabel}
        </Text>
        {isOTP ? (
          <Form.Item
            name="otp"
            className={styles.confirmationINput}
            {...messages.otpRule}
          >
            <Input
              className={styles.otpInput}
              placeholder={messages.placeholders.otp}
              min={6}
              max={6}
            />
          </Form.Item>
        ) : (
          <Row gutter={30} className={styles.textLeft}>
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
          </Row>
        )}
      </div>
      <Form.Item>
        {isResend && (
          <Button
            type="primary"
            htmlType="button"
            className={styles.resetOTP}
            block
            onClick={onResendClick}
            id="otp-send-btn"
          >
            Resend OTP <RedoOutlined />
          </Button>
        )}

        <Button
          type="primary"
          htmlType="submit"
          className={styles["login-form-button"]}
          block
          data-testid="submitButton"
          style={{ width: "150px" }}
          id="submit-btn"
        >
          Submit <ArrowRightOutlined />
        </Button>
      </Form.Item>
    </Form>
  </section>
);

export default NameConfirmation;
