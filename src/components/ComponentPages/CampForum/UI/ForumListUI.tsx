import { Fragment } from "react";
import Image from "next/image";

import styles from "./Forum.module.scss";
import FormUI from "./ThreadListUI";
import CreateNewCampButton from "../../../common/button/createNewTopicBtn";

const CreateNewCampUI = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  topicData,
  nickNameList,
  parentCamp,
  campNickName,
  onValuesChange,
  crCamp,
}) => {
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
          <FormUI
            onFinish={onFinish}
            onCancel={onCancel}
            form={form}
            initialValue={initialValue}
            topicData={topicData}
            nickNameList={nickNameList}
            parentCamp={parentCamp}
            campNickName={campNickName}
            onValuesChange={onValuesChange}
            crCamp={crCamp}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CreateNewCampUI;
