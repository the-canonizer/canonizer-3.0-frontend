import React from "react";
import { Row, Col, Form, Input, Button } from "antd";
import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";
import messages from "../../../messages";

function VerifyMobileNumberForm() {
  return (
    <section className={styles.profileInfo_wrapper}>
      <Form
        name="verifyNumber"
        initialValues={{ prefix: "+91" }}
        layout="vertical"
      >
        <div className={styles.section_one}>
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item
                name="phoneNumber"
                label={messages.labels.phoneNumber}
                {...messages.phoneNumberRule}
              >
                <Input placeholder={messages.placeholders.phoneNumber} size="large" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="mobileCarrier"
                label={messages.labels.mobileCarrier}
                {...messages.mobileCarrierRule}
              >
                <Input placeholder={messages.placeholders.mobileCarrier} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            htmlType="submit"
            className="ant-btn ant-btn-orange ant-btn-lg"
          >
            Verify
          </Button>
        </div>
      </Form>
    </section>
  );
}

export default VerifyMobileNumberForm;
