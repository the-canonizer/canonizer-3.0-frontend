import { Fragment } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

// import SideBar from "../../CampForum/UI/sidebar";
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
  isLoading,
}: any) => {
  const router = useRouter();

  //  post section end
  let payload = {
    camp_num: (router?.query.camp[1] as string)?.split("-")[0] ?? "1",
    topic_num: (router?.query.camp[0] as string)?.split("-")[0],
  };

  return (
    <Fragment>
      <div className="d-flex">
        <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
          {/* <SideBar /> */}
        </aside>
        <div className="pageContentWrap">
          <CampInfoBar payload={payload} />
          <Spin spinning={isLoading} size="large">
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
              isLoading={isLoading}
            />
          </Spin>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateNewCampUI;
