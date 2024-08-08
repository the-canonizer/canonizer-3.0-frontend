import React from "react";

import styles from "./ProfileInfo.module.scss";

import ProfileInfoForm from "../../Form/ProfileInfoForm";

function ProfileInfoUI({
  form,
  mobileCarrier,
  onFinish,
  formVerify,
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
  setToggleVerifyButton,
  viewEmail,
  userProfileData,
}: any) {
  return (
    <section className={styles.profileInfo_wrapper}>
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
        mobileCarrier={mobileCarrier}
        handleMobileNumberChange={handleMobileNumberChange}
        toggleVerifyButton={toggleVerifyButton}
        formVerify={formVerify}
        isOTPModalVisible={isOTPModalVisible}
        handleOTPCancel={handleOTPCancel}
        otp={otp}
        handleChangeOTP={handleChangeOTP}
        userProfileSkeletonV={userProfileSkeletonV}
        setIsOTPModalVisible={setIsOTPModalVisible}
        setOTP={setOTP}
        setToggleVerifyButton={setToggleVerifyButton}
        viewEmail={viewEmail}
        userProfileData={userProfileData}
      />
    </section>
  );
}

export default ProfileInfoUI;
