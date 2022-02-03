import React from "react";
import styles from "./ProfileInfo.module.scss";
import VerifyMobileNumber from "../../Form/VerifyMobileNumberForm";
import ProfileInfoForm from "../../Form/ProfileInfoForm";

function ProfileInfoUI({ 
  form, 
  mobileCarrier, 
  onFinish, 
  onFinishFailed,
  formVerify,
  onVerifyClick,
  onOTPBtnClick,
  isOTPModalVisible,
  handleOTPCancel,
  oTP,
  handleChangeOTP }) {
  return (
    <section className={styles.profileInfo_wrapper}>
      <VerifyMobileNumber
        mobileCarrier={mobileCarrier}
        formVerify={formVerify}
        onVerifyClick={onVerifyClick}
        onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        oTP={oTP}
        handleChangeOTP={handleChangeOTP}
      ></VerifyMobileNumber>
      <ProfileInfoForm
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      ></ProfileInfoForm>
    </section>
  );
}

export default ProfileInfoUI;
