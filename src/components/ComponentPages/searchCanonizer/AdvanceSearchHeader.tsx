import Image from "next/image";
import { useRouter } from "next/router";
import AdvanceFilter from "components/common/AdvanceSearchFilter";
import React from "react";

interface AdvanceSearchHeaderProps {
  sectionId: string;
  subSectionId: string;
  headingId: string;
  imgId: string;
  headingTextId: string;
}

const AdvanceSearchHeader: React.FC<AdvanceSearchHeaderProps> = ({
  sectionId,
  subSectionId,
  headingId,
  imgId,
  headingTextId,
}) => {
  const router = useRouter();

  return (
    <div
      className="flex justify-between lg:items-center lg:flex-row flex-col items-start mb-10 mt-2.5 lg:gap-0 gap-5"
      id={sectionId}
    >
      <div className="flex items-center" id={subSectionId}>
        <div className="flex items-center gap-2.5" id={headingId}>
          <Image
            id={imgId}
            src="/images/recent-activiity-arrow.svg"
            width={16}
            height={24}
          />
          <h3
            className="lg:text-3xl text-xl text-canBlack font-medium"
            id={headingTextId}
          >
            Search Results for “
            <span className="text-canBlue capitalize break-all whitespace-break-spaces">
              {router?.query?.q}
            </span>
            ”
          </h3>
        </div>
      </div>
      <AdvanceFilter />
    </div>
  );
};

export default AdvanceSearchHeader;
