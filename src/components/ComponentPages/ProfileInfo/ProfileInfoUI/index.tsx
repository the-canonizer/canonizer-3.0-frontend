import React from "react";
import styles from "./ProfileInfo.module.scss";
import VerifyMobileNumber from "../../Form/VerifyMobileNumberForm";
import ProfileInfoForm from "../../Form/ProfileInfoForm";

function ProfileInfoUI({ form, onFinish, onFinishFailed }) {
  return (
    <section className={styles.profileInfo_wrapper}>
      <VerifyMobileNumber></VerifyMobileNumber>
      <ProfileInfoForm
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      ></ProfileInfoForm>
    </section>
  );
}

export default ProfileInfoUI;
