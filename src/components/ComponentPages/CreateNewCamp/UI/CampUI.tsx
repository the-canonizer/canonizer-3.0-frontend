import { Fragment } from "react";

import SideBar from "../../Home/SideBar";
import styles from "../../CreateNewTopic/UI/createNewTopic.module.scss";
import FormUI from "./FormUI";

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
      <div className={`${styles.upperTitle}`}>
        <p>
          <strong>Topic:</strong> {topicData?.topic_name}
        </p>
        <p>
          <strong>Camp:</strong> {crCamp.camp_name || topicData?.camp_name}
        </p>
      </div>
      <div className="d-flex">
        <aside className="leftSideBar miniSideBar">
          <SideBar />
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
