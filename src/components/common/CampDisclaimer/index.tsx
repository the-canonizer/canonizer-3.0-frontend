import React from "react";
import Image from "next/image";
import { isServer } from "src/utils/generalUtility";
import SocialShareUI from "../socialShare";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const CampDisclaimer = () => {
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
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
          <Image
            src="/images/options-icon.svg"
            alt="svg"
            height={24}
            width={24}
          />
        </div>
      </div>
    </div>
  );
};
export default CampDisclaimer;
