import React from "react";
import UserProfileUI from "./UserProfileUI";
import { Image } from "antd";
import CreateNewCampButton from "../../common/button/createNewTopicBtn";
import styles from "./UserProfileUI/UserProfile.module.scss";
const UserProfile = () => {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.btnsWrap}>
          <CreateNewCampButton />
        </div>
        <div className="siteAds">
          <Image
            alt="adOne"
            src={"/images/left-sidebar-adv1.jpg"}
            width={200}
            height={400}
          />
        </div>
      </div>
      <UserProfileUI />
    </>
  );
};

export default UserProfile;
