import { Fragment } from "react";
import Image from "next/image";

import styles from "./Forum.module.scss";

import CreateNewCampButton from "../../../common/button/createNewTopicBtn";

const ThreadSidebar = () => (
  <Fragment>
    <aside className="leftSideBar miniSideBar bg-white">
      <div className={styles.card}>
        <div className={styles.btnsWrap}>
          <CreateNewCampButton />
        </div>
      </div>
      <div className="siteAds">
        <Image
          alt="adOne"
          src={"/images/Image37.jpg"}
          width={200}
          height={400}
        />
      </div>
    </aside>
  </Fragment>
);
export default ThreadSidebar;
