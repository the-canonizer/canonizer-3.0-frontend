import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import K from "src/constants";

const CampDisclaimer = () => {
  const { tree } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
  }));

  return (
    <div className="flex justify-between mb-4 items-center">
      <div className="flex gap-2.5 items-center">
        <SectionHeading
          title={K?.exceptionalMessages?.campStatementHeading}
          infoContent={K?.exceptionalMessages?.campStatementHeading}
          className="!mb-0"
        />
      </div>
    </div>
  );
};

export default CampDisclaimer;
