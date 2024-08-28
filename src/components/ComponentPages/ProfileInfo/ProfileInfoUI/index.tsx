import React from "react";

import styles from "./ProfileInfo.module.scss";

import ProfileInfoForm from "../../Form/ProfileInfoForm";

function ProfileInfoUI({
  form,
  onFinish,
  handleselectAfter,
  privateFlags,
  disableButton,
  postalCodeDisable,
  viewEmail,
  userProfileData,
}) {
  return (
    <section className={styles.profileInfo_wrapper}>
      <ProfileInfoForm
        form={form}
        onFinish={onFinish}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        disableButton={disableButton}
        postalCodeDisable={postalCodeDisable}
        viewEmail={viewEmail}
        userProfileData={userProfileData}
      />
    </section>
  );
}

export default ProfileInfoUI;
