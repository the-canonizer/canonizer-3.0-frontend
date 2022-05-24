import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.scss";
import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import { UserProfileCard } from "../UserProfileDetails/UserProfileCard";
import {
  getUserProfileById,
  getUserSupportedCampList,
} from "src/network/api/userApi";
const UserProfile = () => {
  const [profileData, setProfileData] = useState({} as any);
  const [userSupportedCampsList, setUserSupportedCampsList] = useState([]);

  const GetUserProfileData = async (id) => {
    let response = await getUserProfileById(id);
    if (response && response.status_code === 200) {
      setProfileData(response.data);
    }
  };
  const UserSupportedCampsListApi = async (id) => {
    let res = await getUserSupportedCampList(id);
    if (res && res.status_code === 200) {
      setUserSupportedCampsList(res.data);
    }
  };
  //onLoad
  useEffect(() => {
    let userId = localStorage.getItem("publicUserId");
    GetUserProfileData(userId);
    UserSupportedCampsListApi(userId);
  }, []);

  return (
    <>
      <div className={styles.userProfileData}>
        <UserProfileDetails
          setProfileData={setProfileData}
          profileData={profileData}
        />
        <UserProfileCard
          userSupportedCampsList={userSupportedCampsList}
          setUserSupportedCampsList={setUserSupportedCampsList}
        />
      </div>
    </>
  );
};

export default UserProfile;
