import React from "react";
import styles from "./UserProfile.module.scss";
import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import UserProfileCard from "../UserProfileDetails/UserProfileCard";
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
