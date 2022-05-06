import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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
  topicRecord,
  campRecord,
}) => {
  const router = useRouter();

  return (
    <Fragment>
      <div className={`${styles.upperTitle}`}>
        <p>
          <strong>Topic: </strong> {topicRecord && topicRecord?.topic_name}
        </p>
        <p>
          <strong>Camp: </strong>{" "}
          {campRecord
            ? campRecord.parentCamps?.map((camp, index) => {
                return (
                  <Link
                    href={`/topic/${router.query.camp[0]}/${
                      camp?.camp_num
                    }-${camp?.camp_name?.split(" ").join("-")}`}
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
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CreateNewCampUI;
