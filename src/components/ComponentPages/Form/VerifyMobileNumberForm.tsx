import React from "react";
import { Row, Col, Form, Input, Button, Select, Modal } from "antd";
import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";
import messages from "../../../messages";
import verifyIcon from "../../../../public/images/checkbox-icn.svg";

const { Option } = Select;

function VerifyMobileNumberForm({
  mobileCarrier,
  formVerify,
  onVerifyClick,
  onOTPBtnClick,
  isOTPModalVisible,
  handleOTPCancel,
  otp,
  handleChangeOTP,
}) {
  let mobileCarrierList =
    mobileCarrier.length > 0 &&
    mobileCarrier.map((item, i) => {
      return (
        <Option key={i} value={item.id}>
          {item.name}
        </Option>
      );
    });

  return (
    <section className={styles.profileInfo_wrapper}>
      <Form
        name="verifyNumber"
        form={formVerify}
        layout="vertical"
        onFinish={onVerifyClick}
      >
        <div className={styles.section_one}>
          <Row gutter={30}>
            <Col md={12}>
              {/* <Icon component={() => (<Image alt="adOne" src={verifyIcon} />)} /> */}
              <Form.Item
                name="phone_number"
                label={messages.labels.phoneNumber}
                {...messages.phoneNumberRule}
              >
                <Input
                  placeholder={messages.placeholders.phoneNumber}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="mobile_carrier"
                label={messages.labels.mobileCarrier}
                {...messages.mobileCarrierRule}
              >
                <Select
                  showSearch
                  placeholder={messages.placeholders.mobileCarrier}
                  optionFilterProp="children"
                  size="large"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {mobileCarrierList}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              className="ant-btn ant-btn-orange ant-btn-lg"
              htmlType="submit"
              data-testid="submitButton"
            >
              Verify
            </Button>
          </Form.Item>
          <Modal
            title=""
            visible={isOTPModalVisible}
            footer=""
            onCancel={handleOTPCancel}
          >
            <p>Otp has been sent on your phone number.</p>
            <Input
              placeholder={messages.placeholders.otp}
              value={otp}
              onChange={handleChangeOTP}
              size="large"
            />
            <p></p> {/* For Empty Row */}
            <Button
              type="primary"
              className="ant-btn ant-btn-orange ant-btn-lg"
              onClick={onOTPBtnClick}
            >
              Submit
            </Button>
          </Modal>
        </div>
      </Form>
    </section>
  );
}

export default VerifyMobileNumberForm;
