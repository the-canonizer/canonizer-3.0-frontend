import React from "react";
import styles from "./ProfileInfo.module.scss";
import VerifyMobileNumber from "../../Form/VerifyMobileNumberForm";
import ProfileInfoForm from "../../Form/ProfileInfoForm";

function ProfileInfoUI() {
  return (
    <section className={styles.profileInfo_wrapper}>
      <VerifyMobileNumber></VerifyMobileNumber>
      <ProfileInfoForm></ProfileInfoForm>
    </section>
  );
}

export default ProfileInfoUI;
