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
  const [dropdownNameSpaceList, setDropdownNameSpaceList] = useState();
  const [noData, setNoData] = useState(false);
  const router = useRouter();

  const UserSupportedCampsListApi = async (id) => {
    let res = await getUserSupportedCampList(id);
    if (res && res.status_code === 200) {
      setNoData(true);
      setUserSupportedCampsList(res.data.support_list);
      setProfileData(res.data.profile);
    }
  };

  const UserSupportCampListNewSpaces = async () => {
    let res = await getCanonizedNameSpacesApi();
    if (res && res.status_code === 200) {
      setNameSpaceList(res.data);
    }
  };

  //onLoad

  useEffect(() => {
    setNoData(false);
    const userId = router?.query?.supports[0];
    const topic_num = router?.query?.topicnum;
    const camp_num = router?.query?.campnum;
    const namespace_name_id = dropdownNameSpaceList
      ? dropdownNameSpaceList
      : router?.query?.namespace;
    if (dropdownNameSpaceList) {
      const query = `${userId}?topicnum=${topic_num}&campnum=${camp_num}&namespace=${namespace_name_id}`;
      UserSupportedCampsListApi(query);
    } else {
      UserSupportCampListNewSpaces(userId);
      setDropdownNameSpaceList(namespace_name_id as any);
    }
  }, [dropdownNameSpaceList, router?.query]);

  return (
    <>
      <div className={styles.userProfileData}>
        <UserProfileDetails
          profileData={profileData}
          userSupportedCampsList={userSupportedCampsList}
        />
        <UserProfileCard
          userSupportedCampsList={userSupportedCampsList}
          setUserSupportedCampsList={setUserSupportedCampsList}
          nameSpaceList={nameSpaceList}
          dropdownNameSpaceList={dropdownNameSpaceList}
          setDropdownNameSpaceList={setDropdownNameSpaceList}
          noData={noData}
          profileData={profileData}
        />
      </div>
    </>
  );
};

export default UserProfile;
