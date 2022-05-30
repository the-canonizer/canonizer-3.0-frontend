import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.scss";
import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import { UserProfileCard } from "../UserProfileDetails/UserProfileCard";
import {
  getUserProfileById,
  getUserSupportedCampList,
} from "src/network/api/userApi";
import { getCanonizedNameSpacesApi } from "src/network/api/homePageApi";
const UserProfile = () => {
  const [profileData, setProfileData] = useState({} as any);
  const [userSupportedCampsList, setUserSupportedCampsList] = useState([]);
  const [nameSpaceList, setNameSpaceList] = useState([]);
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

  const UserSupportCampListNewSpaces = async (id) => {
    let res = await getCanonizedNameSpacesApi();
    console.log(res);
    if (res && res.status_code === 200) {
      setNameSpaceList(res.data);
    }
  };
  //onLoad
  useEffect(() => {
    let userId = localStorage.getItem("publicUserId");
    GetUserProfileData(userId);
    UserSupportedCampsListApi(userId);
    UserSupportCampListNewSpaces(userId);
  }, []);

  return (
    <>
      <div className={styles.userProfileData}>
        <UserProfileDetails
          // setProfileData={setProfileData}
          profileData={profileData}
        />
        <UserProfileCard
          userSupportedCampsList={userSupportedCampsList}
          setUserSupportedCampsList={setUserSupportedCampsList}
          nameSpaceList={nameSpaceList}
        />
      </div>
    </>
  );
};

export default UserProfile;
