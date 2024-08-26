import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Dropdown } from "antd";

import { isServer } from "src/utils/generalUtility";
import { RootState } from "src/store";
import DropDownMenu from "../../DropdownMenu";
import ViewCounts from "components/shared/ViewsCount";
import SocialShare from "components/shared/ShareTopic";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import K from "src/constants";

const CampDisclaimer = () => {
  const { campRecord, manageSupportStatusCheck, tree } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
      tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    })
  );

  return (
    <div className="flex justify-between mb-4 items-center">
      <div className="flex gap-2.5 items-center">
        <SectionHeading
          title={K?.exceptionalMessages?.campStatementHeading}
          infoContent={K?.exceptionalMessages?.campStatementHeading}
          className="text-sm lg:text-base normal-case text-canBlack text-left font-semibold !mb-0"
        />
        {/* <SectionHeading
          title={campRecord?.camp_name}
          infoContent=""
          icon={null}
          className="!mb-0"
        /> */}
        {/* <ViewCounts views={tree?.[1] && tree[1]?.camp_views} /> */}
      </div>
      {/* <div className="camp-agreement-header flex items-center !mb-0 gap-2"> */}
      {/* <SectionHeading
        title={K?.exceptionalMessages?.campStatementHeading}
        infoContent={K?.exceptionalMessages?.campStatementHeading}
        className="text-sm lg:text-base normal-case text-canBlack text-left font-semibold"
      /> */}
      {/* </div> */}

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
            placement="bottomRight"
            dropdownRender={() =>
              !manageSupportStatusCheck ? <DropDownMenu /> : ""
            }
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()} className="flex">
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
