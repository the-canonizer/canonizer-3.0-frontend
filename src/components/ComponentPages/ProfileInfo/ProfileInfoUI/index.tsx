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
  // onVerifyClick,
  onOTPBtnClick,
  isOTPModalVisible,
  handleOTPCancel,
  otp,
  handleChangeOTP,
  handleselectAfter,
  privateFlags,
  algorithmList,
  languageList,
  handleAddressChange,
  handleAddressSelect,
  address,
  toggleVerifyButton,
  handleMobileNumberChange,
  disableButton,
  postalCodeDisable,
  userProfileSkeletonV,
  setIsOTPModalVisible,
  setOTP,
}: any) {
  return (
    <section className={styles.profileInfo_wrapper}>
      <VerifyMobileNumber
        mobileCarrier={mobileCarrier}
        formVerify={formVerify}
        // onVerifyClick={onVerifyClick}
        // onOTPBtnClick={onOTPBtnClick}
        isOTPModalVisible={isOTPModalVisible}
        setIsOTPModalVisible={setIsOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
        toggleVerifyButton={toggleVerifyButton}
        handleMobileNumberChange={handleMobileNumberChange}
        userProfileSkeletonV={userProfileSkeletonV}
        setOTP={setOTP}
      />

      <ProfileInfoForm
        form={form}
        onFinish={onFinish}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={disableButton}
        postalCodeDisable={postalCodeDisable}
      />
    </section>
  );
}

export default ProfileInfoUI;
