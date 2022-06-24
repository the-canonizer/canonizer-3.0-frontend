import React, { useEffect, useState } from "react";
// import ManageSupportUI from "./ManageSupportUI";
import { Image } from "antd";
import CreateNewCampButton from "../../common/button/createNewTopicBtn";
import styles from "./ManageSupportUI/ManageSupport.module.scss";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import dynamic from "next/dynamic";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import { useRouter } from "next/router";

const ManageSupportUI = dynamic(() => import("./ManageSupportUI"), {
  ssr: false,
});

const ManageSupport = () => {
  const router = useRouter();
  const [nickNameList, setNickNameList] = useState([]);
  const [paramsList, setParamsList] = useState({});
  const getCanonizedNicknameList = async () => {
    const topicNum = router?.query?.manageSupport?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };

    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res.status_code == 200) {
      setNickNameList(res.data);
      // setParamsList(paramsList)
    }
  };
  useEffect(() => {
    getCanonizedNicknameList();
  }, []);

  return (
    <>
      <CampInfoBar isStatementBar={false} payload={null} />
      <div className={styles.card}>
        <div className={styles.btnsWrap}>
          <CreateNewCampButton />
        </div>
        <div className="siteAds">
          <Image
            alt="adOne"
            src={"/images/left-sidebar-adv1.jpg"}
            width={200}
            height={400}
          />
        </div>
      </div>
      <ManageSupportUI nickNameList={nickNameList} />
    </>
  );
};

export default ManageSupport;
