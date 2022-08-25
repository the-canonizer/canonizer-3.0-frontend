import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import SideBar from "../../CampForum/UI/sidebar";
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
  topicRecord,
  campRecord,
  options,
  onCheckboxChange,
  onParentCampChange,
}) => {
  const router = useRouter();

  return (
    <Fragment>
      <div className={`${styles.upperTitle}`}>
        <p id="topic-name">
          <strong>Topic: </strong> {topicRecord && topicRecord?.topic_name}
        </p>
        <p id="camp-name">
          <strong>Camp: </strong>{" "}
          {campRecord
            ? campRecord.parentCamps?.map((camp, index) => {
                return (
                  <Link
                    href={`/topic/${encodeURIComponent(router.query.camp[0])}/${
                      camp?.camp_num
                    }-${encodeURIComponent(camp?.camp_name)}`}
                    key={camp?.camp_num}
                  >
                    <a>
                      {index !== 0 && "/ "}
                      {`${camp?.camp_name}`}
                    </a>
                  </Link>
                );
              })
            : null}
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
            options={options}
            onCheckboxChange={onCheckboxChange}
            onParentCampChange={onParentCampChange}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CreateNewCampUI;
