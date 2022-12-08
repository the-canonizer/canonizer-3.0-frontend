import { Fragment } from "react";
import { Spin } from "antd";
import Script from "next/script";

import FromUI from "./FromUI";
import Sidebar from "../../Home/SideBarNoFilter";

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
        <Sidebar isShowBtn={false} />
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
