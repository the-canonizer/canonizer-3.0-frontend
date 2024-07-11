import React from "react";
import Image from "next/image";
import { isServer } from "src/utils/generalUtility";
import SocialShareUI from "../socialShare";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Dropdown } from "antd";
import DropDownMenu from "../../DropdownMenu";

const CampDisclaimer = () => {
  const { campRecord, manageSupportStatusCheck } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
    manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
  }));
  return (
    <div className="d-flex justify-between">
      <h3 className="mb-3">CAMP: AGREEMENT</h3>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <SocialShareUI
            campName={campRecord?.camp_name}
            campUrl={!isServer() && window?.location?.href}
          />
        </div>
        <div className="flex-1 flex items-center">
        <Dropdown
          // className={styles.campForumDropdown}
          placement="bottomRight"
          dropdownRender={() =>
            !manageSupportStatusCheck ?<DropDownMenu/>:""
          }
          trigger={["click"]}
        >
          <a
            // className={styles.iconMore}
            onClick={(e) => e.preventDefault()}
          >
          <Image
        src="/images/options-icon.svg"
        alt="svg"
        height={24}
        width={24}
      />
        </a>
        </Dropdown>
         
        </div>
      </div>
    </div>
  );
};
export default CampDisclaimer;
