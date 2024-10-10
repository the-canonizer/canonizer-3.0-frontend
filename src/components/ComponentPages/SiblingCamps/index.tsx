import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { getSiblingCamp } from "src/network/api/campForumApi";
import { RootState } from "src/store";
import { setSiblingCampData } from "src/store/slices/campDetailSlice";
import SingleTopicCard from "../Home/HotTopics/topicCard";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";

const SiblingCamps = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  const secondToLastElement =
    campRecord?.parentCamps &&
    campRecord?.parentCamps[campRecord?.parentCamps?.length - 2];
  const parentCampNum = secondToLastElement ? secondToLastElement?.camp_num : 1;

  const [siblingCampsData, setSiblingCampsData] = useState([]);

  const siblingCampsFunction = async () => {
    const body = {
      topic_num: router?.query?.camp[0]?.split("-")[0],
      camp_num: router?.query?.camp[1]?.split("-")[0],
      parent_camp_num: parentCampNum,
    };

    const response = await getSiblingCamp(body);

    if (response?.status_code === 200) {
      setSiblingCampsData(response?.data);
      dispatch(setSiblingCampData(response?.data));
    }
  };

  useEffect(() => {
    siblingCampsFunction();
  }, []);

  if (!siblingCampsData?.length) {
    return null;
  }

  return (
    <div className="flex flex-col mt-14">
      <SectionHeading title="SIBLING CAMPS" icon={null} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {siblingCampsData?.map((obj) => (
          <SingleTopicCard
            topic={{ ...obj, topic_name: obj?.camp_name }}
            tag_key=""
            key={obj?.id}
            avatars={obj?.supporterData?.slice(0, 3)}
          />
        ))}
      </div>
    </div>
  );
};
export default SiblingCamps;
