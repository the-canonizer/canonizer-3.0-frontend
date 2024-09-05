import React, { Fragment, useState } from "react";
import { Row, Col, Form, Input, Button, Select, Modal, message } from "antd";
import Icon, { CloseOutlined } from "@ant-design/icons";
import Image from "next/image";

import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";

import messages from "../../../messages";
import verifyIcon from "../../../../public/images/checkbox-icn.svg";
import CustomSkelton from "../../common/customSkelton";
import {
  SendOTP,
  VerifyOTP,
  GetUserProfileInfo,
} from "../../../network/api/userApi";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

const { Option } = Select;

function VerifyMobileNumberForm({
  mobileCarrier,
  formVerify,
  isOTPModalVisible,
  handleOTPCancel,
  otp,
  handleChangeOTP,
  toggleVerifyButton,
  handleMobileNumberChange,
  userProfileSkeletonV,
  setIsOTPModalVisible,
  setOTP,
  setToggleVerifyButton,
}: any) {
  const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
  const [isLoadingh, setIsLoading] = useState(false);
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

      let resa = await GetUserProfileInfo();
      if (resa != undefined) {
        if (resa.data != undefined) {
          setToggleVerifyButton(resa?.data?.mobile_verified);
        }
      }
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
    setIsLoading(false);
  };
  const onVerifyClicked = async (e) => {
    setIsLoading(true);
    e?.preventDefault();
    e?.stopPropagation();

    const phoneV = formVerify.getFieldValue("phone_number");
    const carrirV = formVerify.getFieldValue("mobile_carrier");

    if (!phoneV && !carrirV) {
      message.error("Please enter the mobile number with the carrier first!");
      formVerify.resetFields(["phone_number", "mobile_carrier"]);
      setIsLoading(false);
      return;
    }

    await onVerifyClick({ phone_number: phoneV, mobile_carrier: carrirV });
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
          <Fragment>
            <Row gutter={40}>
              <Col md={12}>
                <Form.Item
                  name="phone_number"
                  label={
                    <>
                      {messages.labels.phoneNumber}
                      <span
                        id="asteriskPhonenumber"
                        style={{ marginLeft: "5px" }}
                      >
                        {" "}
                        (for mobile OTP verification)
                      </span>
                    </>
                  }
                  {...messages.phoneNumberRule}
              className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray [&_.ant-input-affix-wrapper]:focus:!border-canGrey2 [&_.ant-input-affix-wrapper-focused]:!shadow-none  [&_.ant-input-affix-wrapper-focused]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!shadow-none"

                >
                  <Input
                  className="!rounded-lg"
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
              <Col md={8}>
                <Form.Item
                  name="mobile_carrier"
                  label={messages.labels.mobileCarrier}
                  {...messages.mobileCarrierRule}
                  className="[&_.ant-select-selector]:!rounded-lg text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray [&_.ant-input-affix-wrapper]:focus:!border-canGrey2 [&_.ant-input-affix-wrapper-focused]:!shadow-none  [&_.ant-input-affix-wrapper-focused]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!shadow-none"
                >
                  <Select
                  suffixIcon={<Image src="/images/caret-icon.svg" width={16} height={9} alt="" />}
                    data-testid="mobileCarrier"
                    showSearch
                    placeholder={messages.placeholders.mobileCarrier}
                    area-placeholder={messages.placeholders.mobileCarrier}
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
              <Col md={4}>
                <Form.Item label="&nbsp;" className={styles.btnLayout}>
                  {!toggleVerifyButton ? (
                    <PrimaryButton
                      id="verifyBtn"
                      type="primary"
                      className="Profile_btn ant-btn ant-btn-orange ant-btn-lg"
                      htmlType="button"
                      data-testid="verify_btn"
                      tabIndex={3}
                      onClick={onVerifyClicked}
                      disabled={isLoadingh}
                    >
                      {isLoadingh ? "Verifying" : "Verify"}
                    </PrimaryButton>
                  ) : (
                    <div>
                      <Icon
                        component={() => (
                          <Image
                            id="siteAddImage"
                            alt="adOne"
                            src={verifyIcon}
                          />
                        )}
                      />{" "}
                      <span> Your phone number is verified</span>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Modal
              title="OTP has been sent on your phone number."
              visible={isOTPModalVisible}
              footer=""
              onCancel={handleOTPCancel}
              className="[&_.ant-modal-body]:!p-5 [&_.ant-modal-content]:!rounded-xl"
            >
              {/* <p  className="text-base text-canBlack font-medium text-center">OTP has been sent on your phone number.</p> */}
              <div className="flex justify-center">
              <Input
                data-testid="handle_Change_OTP"
                id="otpInput"
                placeholder={messages.placeholders.otp}
                value={otp}
                onChange={handleChangeOTP}
                size="large"
                className="!rounded-lg m-auto"
              />
              </div>
             
              <p></p> {/* For Empty Row */}
              <div className="flex gap-2.5 mt-5 justify-center">
              <SecondaryButton
            className="flex gap-2.5 items-center justify-center w-[11.25rem] h-auto"
            onClick={() => {
              setIsOTPModalVisible(false);
            }}
          >
            Cancel
            <CloseOutlined />
          </SecondaryButton>
          <PrimaryButton
                data-testid="on_otp_btn_click"
                id="submitBtn"
                type="primary"
                // className="ant-btn ant-btn-orange ant-btn-lg"
                onClick={onOTPBtnClick}
                className="flex gap-2.5 items-center justify-center w-[11.25rem] h-auto"
              >
                Submit
              </PrimaryButton>
              </div>
              
            </Modal>
          </Fragment>
        )}
      </Form>
    </section>
  );
}

export default VerifyMobileNumberForm;
