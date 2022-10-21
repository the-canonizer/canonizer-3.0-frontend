import { Fragment } from "react";
import Image from "next/image";
import { Spin } from "antd";

import FromUI from "./FromUI";

const CreateNewTopicUI = ({
  onFinish,
  form,
  initialValue,
  nameSpaces,
  nickNameList,
  onCancel,
  options,
  onCheckboxChange,
  isLoading,
}) => {
  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar bg-white">
        <div className="siteAds">
          <Image
            alt="adOne"
            src={"/images/left-sidebar-adv1.jpg"}
            width={200}
            height={400}
            id="ads-img"
          />
        </div>
      </aside>
      <div className="pageContentWrap">
        <Spin spinning={isLoading} size="large">
          <FromUI
            onFinish={onFinish}
            form={form}
            initialValue={initialValue}
            nameSpaces={nameSpaces}
            nickNameList={nickNameList}
            onCancel={onCancel}
            options={options}
            onCheckboxChange={onCheckboxChange}
          />
        </Spin>
      </div>
    </Fragment>
  );
};

export default CreateNewTopicUI;
