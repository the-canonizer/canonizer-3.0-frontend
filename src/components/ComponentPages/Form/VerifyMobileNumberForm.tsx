import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Select, Modal, message } from "antd";
import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";
import messages from "../../../messages";
import verifyIcon from "../../../../public/images/checkbox-icn.svg";
import Icon from "@ant-design/icons";
import Image from "next/image";
import CustomSkelton from "../../common/customSkelton";
import { SendOTP, VerifyOTP } from "../../../network/api/userApi";

const { Option } = Select;

function VerifyMobileNumberForm({
  mobileCarrier,
  formVerify,
  // onVerifyClick,
  // onOTPBtnClick,
  isOTPModalVisible,
  handleOTPCancel,
  otp,
  handleChangeOTP,
  toggleVerifyButton,
  handleMobileNumberChange,
  userProfileSkeletonV,
  setIsOTPModalVisible,
  setOTP,
}: any) {
  const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
  const [maxLengthKeysAllowed] = useState([
    "backspace",
    "delete",
    "control",
    "c",
    "v",
    "a",
  ]);
  const mobileCarrierList =
    mobileCarrier.length > 0 &&
    mobileCarrier.map((item: any, i: any) => {
      return (
        <Option key={i} value={item.id}>
          {item.name}
        </Option>
      );
    });
  const onOTPBtnClick = async () => {
    let otpBody = {
      otp: otp,
    };

    let res = await VerifyOTP(otpBody);
    if (res && res.status_code === 200) {
      message.success(res.message);
      setIsOTPModalVisible(false);
    }
  };
  const onVerifyClick = async (values: any) => {
    let res = await SendOTP(values);
    if (res && res.status_code === 200) {
      message.success(res.message);
      setIsOTPModalVisible(true);
      setOTP("");
      //setOTP(res.data.otp)
    }
  };
  return (
    <section className={styles.profileInfo_wrapper}>
      <Form
        name="verifyNumber"
        form={formVerify}
        layout="vertical"
        onFinish={onVerifyClick}
      >
        {userProfileSkeletonV ? (
          <CustomSkelton
            skeltonFor="verifyInfoForm"
            bodyCount={1}
            stylingClass=""
            isButton={false}
          />
        ) : (
          <div className={styles.section_one}>
            <Row gutter={30}>
              <Col md={12}>
                {/* <Icon component={() => (<Image alt="adOne" src={verifyIcon} />)} /> */}
                <Form.Item
                  name="phone_number"
                  label={
                    <>
                      {messages.labels.phoneNumber}
                      <span className="required" id="asteriskPhonenumber">
                        *
                      </span>
                    </>
                  }
                  {...messages.phoneNumberRule}
                >
                  <Input
                    data-testid="handleMobileNumberChange"
                    id="phoneNumber"
                    type="number"
                    placeholder={messages.placeholders.phoneNumber}
                    size="large"
                    maxLength={10}
                    onChange={handleMobileNumberChange}
                    onKeyDown={(e) => {
                      symbolsArr.includes(e.key) && e.preventDefault();
                      e.currentTarget.value.length >= 10 &&
                        !maxLengthKeysAllowed.includes(e.key.toLowerCase()) &&
                        e.preventDefault();
                    }}
                    tabIndex={1}
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="mobile_carrier"
                  label={
                    <>
                      {messages.labels.mobileCarrier}
                      <span className="required" id="asteriskMobileCarrier">
                        *
                      </span>
                    </>
                  }
                  {...messages.mobileCarrierRule}
                >
                  <Select
                    data-testid="mobileCarrier"
                    showSearch
                    placeholder={messages.placeholders.mobileCarrier}
                    optionFilterProp="children"
                    size="large"
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                    tabIndex={2}
                  >
                    {mobileCarrierList}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              {!toggleVerifyButton ? (
                <Button
                  id="verifyBtn"
                  type="primary"
                  className="Profile_btn ant-btn ant-btn-orange ant-btn-lg"
                  htmlType="submit"
                  data-testid="verify_btn"
                  tabIndex={3}
                >
                  Verify
                </Button>
              ) : (
                <div>
                  <Icon
                    component={() => (
                      <Image id="siteAddImage" alt="adOne" src={verifyIcon} />
                    )}
                  />{" "}
                  <span> Your phone number is verified</span>
                </div>
              )}
            </Form.Item>
            <Modal
              title=""
              visible={isOTPModalVisible}
              footer=""
              onCancel={handleOTPCancel}
            >
              <p>OTP has been sent on your phone number.</p>
              <Input
                data-testid="handle_Change_OTP"
                id="otpInput"
                placeholder={messages.placeholders.otp}
                value={otp}
                onChange={handleChangeOTP}
                size="large"
              />
              <p></p> {/* For Empty Row */}
              <Button
                data-testid="on_otp_btn_click"
                id="submitBtn"
                type="primary"
                className="ant-btn ant-btn-orange ant-btn-lg"
                onClick={onOTPBtnClick}
              >
                Submit
              </Button>
            </Modal>
          </div>
        )}
      </Form>
    </section>
  );
}

export default VerifyMobileNumberForm;
