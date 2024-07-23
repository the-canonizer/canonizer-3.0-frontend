import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Dropdown } from "antd";

import { isServer } from "src/utils/generalUtility";
import { RootState } from "src/store";
import DropDownMenu from "../../DropdownMenu";
import ViewCounts from "components/shared/ViewsCount";
import SocialShare from "components/shared/ShareTopic";

const CampDisclaimer = () => {
  const { campRecord, manageSupportStatusCheck, tree } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
      tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    })
  );

  return (
    <div className="flex justify-between mb-6 items-center">
      <div className="flex gap-2.5 items-center">
        <h3 className="font-semibold text-canBlack text-sm lg:text-base uppercase">
          CAMP: {campRecord?.camp_name}
        </h3>
        <div className="lg:flex items-center gap-2 hidden ">
          <ViewCounts views={tree?.[1] && tree[1]?.camp_views} />
        </div>
      </div>

      <div className="flex gap-7 items-center">
        <div className="">
          <SocialShare
            key={campRecord?.id}
            campName={campRecord?.camp_name}
            campUrl={!isServer() && window?.location?.href}
          />
        </div>
        <div className="">
          <Dropdown
            // className={styles.campForumDropdown}
            placement="bottomRight"
            dropdownRender={() =>
              !manageSupportStatusCheck ? <DropDownMenu /> : ""
            }
            trigger={["click"]}
          >
            <a
              // className={styles.iconMore}
              onClick={(e) => e.preventDefault()}
              className="flex"
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
