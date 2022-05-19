import React from "react";
import styles from "./UserProfile.module.scss";
import UserProfileDetails from "../UserProfileDetails/userProfileDetails";
import UserProfileCard from "../UserProfileDetails/userProfileCard";
const UserProfile = () => {
  return (
    <>
      <div className={styles.userProfileData}>
        <UserProfileDetails />
        <UserProfileCard />
      </div>
    </>
  );
};

export default UserProfile;
