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
  otp,
  handleChangeOTP,
  handleselectAfter,
  privateFlags,
  algorithmList,
}) {
  return (
    <section className={styles.profileInfo_wrapper}>
      <VerifyMobileNumber
        mobileCarrier={mobileCarrier}
        formVerify={formVerify}
        onVerifyClick={onVerifyClick}
        onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
      />

      <ProfileInfoForm
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
      />
    </section>
  );
}

export default ProfileInfoUI;
