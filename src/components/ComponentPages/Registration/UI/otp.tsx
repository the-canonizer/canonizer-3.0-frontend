import { Image, Typography, Form, Input, Button, Select } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";
import { fallBackSrc } from "../../../../assets/data-images";

const { Title, Text } = Typography;

export default function OTPVerify({ form, onFinish, isModal, closeModal }) {
  return (
    <section className={styles.signup_wrapper + " " + styles.textCenter}>
      <Form
        form={form}
        name="registration"
        initialValues={{ prefix: "001" }}
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
      >
        <Title level={2} className={styles.titles}>
          Login One Time Verification Code
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
          <div className={styles.imageWrapper}>
            <Image
              preview={false}
              alt="otp"
              src="/images/otp-image.png"
              fallback={fallBackSrc}
            />
          </div>
          <Text type="danger" className={styles.otpNote}>
            Note : Registration code has been sent to your registered email
            address and Phone Number.
          </Text>
          <Form.Item
            name="otp"
            style={{ textAlign: "center" }}
            {...messages.otpRule}
          >
            <Input
              className={styles.otpInput}
              placeholder={messages.placeholders.otp}
              min={6}
              max={6}
            />
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles["login-form-button"]}
            block
            data-testid="submitButton"
          >
            Submit <ArrowRightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
