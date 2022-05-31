import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./UserProfile.module.scss";
import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import { UserProfileCard } from "../UserProfileDetails/UserProfileCard";

import { getUserSupportedCampList } from "src/network/api/userApi";
import { getCanonizedNameSpacesApi } from "src/network/api/homePageApi";
const UserProfile = () => {
  const [profileData, setProfileData] = useState({} as any);
  const [userSupportedCampsList, setUserSupportedCampsList] = useState([]);
  const [nameSpaceList, setNameSpaceList] = useState([]);
  const router = useRouter();

  const UserSupportedCampsListApi = async (id) => {
    let res = await getUserSupportedCampList(id);
    if (res && res.status_code === 200) {
      setUserSupportedCampsList(res.data.support_list);
      setProfileData(res.data.profile);
    }
  };

  const UserSupportCampListNewSpaces = async (id) => {
    let res = await getCanonizedNameSpacesApi();
    if (res && res.status_code === 200) {
      setNameSpaceList(res.data);
    }
  };

  //onLoad
  useEffect(() => {
    let userId = localStorage.getItem("publicUserId");
    let topicRecord = JSON.parse(localStorage.getItem("topicRecord"));
    let namespace_name_id = localStorage.getItem("namespace_name_id");
    const query = `${userId}?topicnum=${topicRecord?.topic_num}&campnum=${topicRecord?.camp_num}&namespace=${namespace_name_id}`;
    UserSupportedCampsListApi(query);
    UserSupportCampListNewSpaces(userId);
  }, []);

  return (
    <>
      <div className={styles.userProfileData}>
        <UserProfileDetails profileData={profileData} />
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
