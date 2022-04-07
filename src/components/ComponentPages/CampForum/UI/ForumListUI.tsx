import { Fragment } from "react";
import Image from "next/image";

import styles from "./Forum.module.scss";
import ThreadListUI from "./ThreadListUI";
import CreateNewCampButton from "../../../common/button/createNewTopicBtn";

const CreateNewCampUI = ({ onSearch, onChange }) => {
  return (
    <Fragment>
      <div className="d-flex">
        <aside className="leftSideBar miniSideBar bg-white">
          <div className={styles.card}>
            <div className={styles.btnsWrap}>
              <CreateNewCampButton />
            </div>
          </div>
          <div className="siteAds">
            <Image
              alt="adOne"
              src={"/images/image11.jpg"}
              width={200}
              height={635}
            />
          </div>
        </aside>
        <div className="pageContentWrap">
          <ThreadListUI onSearch={onSearch} onChange={onChange} />
        </div>
      </div>
    </Fragment>
  );
};

export default CreateNewCampUI;
