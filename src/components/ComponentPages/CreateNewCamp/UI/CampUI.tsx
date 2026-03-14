import { useRouter } from "next/router";
import { Spin } from "antd";

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
  isLoading,
}) => {
  const router = useRouter();

  //  post section end
  let payload = {
    camp_num: (router?.query.camp[1] as string)?.split("-")[0] ?? "1",
    topic_num: (router?.query.camp[0] as string)?.split("-")[0],
  };

  return (
    <div id="create-new-camp-container" className="d-flex">
      <aside
        id="create-new-camp-sidebar"
        className="leftSideBar miniSideBar topicPageNewLayoutSidebar"
      >
        {/* <SideBar /> */}
      </aside>
      <div id="create-new-camp-content" className="pageContentWrap">
        <CampInfoBar id="create-new-camp-info-bar" payload={payload} />
        <Spin spinning={isLoading} size="large">
          <FormUI
            id="create-new-camp-form"
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
            isLoading={isLoading}
            isEdit={undefined}
            isDisabled={undefined}
            onCampChange={undefined}
            onCampNameBlur={undefined}
            values={undefined}
          />
        </Spin>
      </div>
    </div>
  );
};

export default CreateNewCampUI;
