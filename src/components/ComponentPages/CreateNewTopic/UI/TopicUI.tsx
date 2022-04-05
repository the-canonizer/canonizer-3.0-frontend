import { Fragment } from "react";

import SideBar from "../../Home/SideBar";
import FromUI from "./FromUI";

const CreateNewTopicUI = ({
  onFinish,
  form,
  initialValue,
  nameSpaces,
  nickNameList,
  onCancel,
}) => {
  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar">
        <SideBar />
      </aside>
      <div className="pageContentWrap">
        <FromUI
          onFinish={onFinish}
          form={form}
          initialValue={initialValue}
          nameSpaces={nameSpaces}
          nickNameList={nickNameList}
          onCancel={onCancel}
        />
      </div>
    </Fragment>
  );
};

export default CreateNewTopicUI;
