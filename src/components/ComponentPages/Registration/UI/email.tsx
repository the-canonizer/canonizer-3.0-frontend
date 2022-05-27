import { Image, Typography, Form, Input, Button } from "antd";
import { CloseCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";

import styles from "./Registration.module.scss";

import messages from "../../../../messages";
import { fallBackSrc } from "../../../../assets/data-images";

const { Title, Text } = Typography;

const EmailConfirmation = ({ form, onFinish, isModal, closeModal }) => (
  <section className={styles.signup_wrapper + " " + styles.textCenter}>
    <Form
      form={form}
      name="registration"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      validateTrigger={messages.formValidationTypes()}
    >
      <Title level={2} className={styles.titles}>
        User Email Confirmation
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
        {/* <div className={styles.imageWrapper}>
          <Image
            preview={false}
            alt="otp"
            src="/images/otp-image.png"
            fallback={fallBackSrc}
          />
        </div> */}
        <Text type="danger" className={styles.otpNote}>
          Note : Your email address is not returned from social account. You
          have to enter the email address.
        </Text>
        <Form.Item
          name="email"
          style={{
            maxWidth: "300px",
            margin: "0 auto 20px",
          }}
          {...messages.emailRule}
        >
          <Input placeholder={messages.placeholders.email} />
        </Form.Item>
      </div>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className={styles["login-form-button"]}
          block
          data-testid="submitButton"
          style={{ width: "150px" }}
        >
          Submit <ArrowRightOutlined />
        </Button>
      </Form.Item>
    </Form>
  </section>
);

export default EmailConfirmation;
