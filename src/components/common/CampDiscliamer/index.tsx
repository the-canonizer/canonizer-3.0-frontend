import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

import { isServer } from "src/utils/generalUtility";
import { RootState } from "src/store";
import SocialShare from "components/shared/ShareTopic";

const CampDisclaimer = () => {
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  return (
    <div className="d-flex justify-between">
      <h3 className="mb-3">CAMP: AGREEMENT</h3>
      <div className="d-flex gap-4">
        <SocialShare
          key={campRecord?.id}
          campName={campRecord?.camp_name}
          campUrl={!isServer() && window?.location?.href}
        />
        <Image
          src="/images/options-icon.svg"
          alt="svg"
          height={24}
          width={24}
        />
      </div>
    </div>
  );
};
export default CampDisclaimer;
