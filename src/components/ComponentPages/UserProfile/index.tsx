import { Fragment } from "react";
import Sidebar from "../Home-old/SideBarNoFilter";

import styles from "./UserProfileUI/UserProfile.module.scss";

import UserProfileUI from "./UserProfileUI";

const UserProfile = () => {
  return (
    <Fragment>
      {/* <div className={styles.card}>
        <Sidebar />
      </div> */}
      <UserProfileUI />
    </Fragment>
  );
};

export default UserProfile;
