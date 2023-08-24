import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import styles from "./UserProfile.module.scss";

import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import { UserProfileCard } from "../UserProfileDetails/UserProfileCard";

import { getUserSupportedCampList } from "src/network/api/userApi";
import { getCanonizedNameSpacesApi } from "src/network/api/homePageApi";
import { GetSupportedNickNames } from "src/network/api/campDetailApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import { RootState } from "src/store";

const UserProfile = () => {
  const { isUserAuthenticated } = useAuthentication();
  const token = useSelector((state: RootState) => state.auth.authToken);

  const [profileData, setProfileData] = useState({} as any);
  const [userSupportedCampsList, setUserSupportedCampsList] = useState([]);
  const [nameSpaceList, setNameSpaceList] = useState([]);
  const [dropdownNameSpaceList, setDropdownNameSpaceList] = useState();
  const [noData, setNoData] = useState(false);
  const [nickNameList, setNickNameList] = useState([]);
  const [defaultNickname, setDefaultNickname] = useState(null);
  const [selectedNikname, setSelectedNikname] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [userProfileCardSkeleton, SetUserProfileCardSkeleton] = useState(false);

  const router = useRouter();

  const UserSupportedCampsListApi = async (id) => {
    SetUserProfileCardSkeleton(true);
    let res = await getUserSupportedCampList(id);
    if (res && res.status_code === 200) {
      setNoData(true);
      setUserSupportedCampsList(res?.data?.support_list);
      setProfileData(res?.data?.profile);
    }
    SetUserProfileCardSkeleton(false);
  };

  const UserSupportCampListNewSpaces = async () => {
    let res = await getCanonizedNameSpacesApi();
    if (res && res.status_code === 200) {
      setNameSpaceList(res.data);
    }
  };

  const getSupportedNickNames = async (id) => {
    const response = await GetSupportedNickNames(id);
    if (response && response.status_code === 200) {
      let nickNames = response?.data;
      nickNames = nickNames.map((nick) => ({
        ...nick,
        label: nick.nick_name,
        value: +nick.id,
      }));

      setNickNameList(nickNames);

      const selectedNickname = nickNames.filter((nick) => +nick.id === +id);
      setDefaultNickname(selectedNickname[0]?.label);
      setSelectedNikname(selectedNickname[0]?.label);
    }
  };

  useEffect(() => setIsLoggedIn(isUserAuthenticated), [isUserAuthenticated]);

  //onLoad
  useEffect(() => {
    setNoData(false);
    const userId = router?.query?.supports[0];
    const topic_num = router?.query?.topicnum;
    const camp_num = router?.query?.campnum;
    const namespace_name_id = dropdownNameSpaceList
      ? dropdownNameSpaceList
      : router?.query?.canon;
    // if (dropdownNameSpaceList) {
      const query = `${userId}?topicnum=${topic_num}&campnum=${camp_num}&namespace=${namespace_name_id}`;
      UserSupportedCampsListApi(query);
    // } else {
      UserSupportCampListNewSpaces();
      setDropdownNameSpaceList(namespace_name_id as any);
    // }
  }, [dropdownNameSpaceList, router?.query]);

  useEffect(() => {
    const q = router?.query,
      nick_id = q?.supports[0];
    if (nick_id) {
      if (!token && !isLoggedIn) {
        setTimeout(() => {
          getSupportedNickNames(nick_id);
        }, 1000);
      } else {
        getSupportedNickNames(nick_id);
      }
    }
  }, [router, isLoggedIn]);


  return (
    <>
      <div className={styles.userProfileData}>
        <UserProfileDetails
          profileData={profileData}
          userSupportedCampsList={userSupportedCampsList}
          userProfileCardSkeleton={userProfileCardSkeleton}
        />
        <UserProfileCard
          userSupportedCampsList={userSupportedCampsList}
          setUserSupportedCampsList={setUserSupportedCampsList}
          nameSpaceList={nameSpaceList}
          dropdownNameSpaceList={dropdownNameSpaceList}
          setDropdownNameSpaceList={setDropdownNameSpaceList}
          noData={noData}
          profileData={profileData}
          nickNames={nickNameList}
          defaultNickname={defaultNickname}
          selectedNikname={selectedNikname}
          // onNickNameChange={onNickNameChange}
          isLoggedIn={isLoggedIn}
          userProfileCardSkeleton={userProfileCardSkeleton}
          setSelectedNikname={setSelectedNikname}
        />
      </div>
    </>
  );
};

export default UserProfile;
