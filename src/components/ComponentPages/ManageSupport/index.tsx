import React from "react";
import ManageSupportUI from "./ManageSupportUI";
import { Image } from "antd";
import CreateNewCampButton from "../../common/button/createNewTopicBtn";
import styles from "./ManageSupportUI/ManageSupport.module.scss";
import CampInfoBar from "../TopicDetails/CampInfoBar";
const ManageSupport = () => {
  return (
    <>
      <CampInfoBar isStatementBar={false} payload={null} />
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
      <ManageSupportUI />
    </>
  );
};

export default ManageSupport;
