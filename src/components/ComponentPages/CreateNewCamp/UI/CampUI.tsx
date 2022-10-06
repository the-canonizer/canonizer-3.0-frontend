import { Fragment } from "react";
import { useRouter } from "next/router";

import SideBar from "../../CampForum/UI/sidebar";
import FormUI from "./FormUI";
import CampInfoBar from "../../TopicDetails/CampInfoBar";

const CreateNewCampUI = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  topicData,
  nickNameList,
  parentCamp,
  campNickName,
  options,
  onCheckboxChange,
  onParentCampChange,
}) => {
  const router = useRouter();

  //  post section end
  let payload = {
    camp_num: (router?.query.camp[1] as string)?.split("-")[0],
    topic_num: (router?.query.camp[0] as string)?.split("-")[0],
  };

  return (
    <Fragment>
      <CampInfoBar payload={payload} />

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
