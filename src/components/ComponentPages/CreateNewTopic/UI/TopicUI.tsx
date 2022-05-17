import { Fragment } from "react";
import Image from "next/image";

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
      <aside className="leftSideBar miniSideBar bg-white">
        <div className="siteAds">
          <Image
            alt="adOne"
            src={"/images/left-sidebar-adv1.jpg"}
            width={200}
            height={400}
          />
        </div>
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
