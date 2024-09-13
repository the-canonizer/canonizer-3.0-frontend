import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";
import moment from "moment";
import { convert } from "html-to-text";

import { RootState, store } from "src/store";
import { setCampActivityData } from "src/store/slices/recentActivitiesSlice";
import K from "src/constants";
import { getTopicActivityLogApi } from "src/network/api/campDetailApi";
import TopicCampsTab from "./itemList";

function CampRecentActivities({ onShowAllSet }) {
  const { data } = useSelector((state: RootState) => ({
    data: state.recentActivities.campActivityData,
  }));

  const router = useRouter();

  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  useEffect(() => {
    async function getTopicActivityLogCall() {
      setLoadingIndicator(true);

      const reqBody = {
        topic_num: router?.query?.camp[0]?.split("-")[0],
        camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
      };

      const res = await getTopicActivityLogApi(reqBody);

      store.dispatch(setCampActivityData(res?.data?.items));

      onShowAllSet(res?.data?.is_show_all_btn);
      setLoadingIndicator(false);
    }

    getTopicActivityLogCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.camp[1]?.split("-")[0] ?? 1]);

  const handleTextOverflow = (text) => {
    let str = convert(text?.replace(/<img[^>]*>/gi, ""), {
      wordwrap: 130,
    });
    return str?.length > 90 ? str?.substring(0, 90) + "..." : str;
  };

  const getTopicCampName = (activity, decodedProperties) => {
    const subjectType = activity?.subject_type;

    const subjectTypeMap = {
      "App\\Models\\Camp": decodedProperties?.camp_name,
      "App\\Models\\Topic": decodedProperties?.topic_name,
    };

    const result =
      subjectTypeMap[subjectType] ||
      convert(decodedProperties?.description?.replace(/<img[^>]*>/gi, ""), {
        wordwrap: 130,
      });

    return handleTextOverflow(
      convert(result?.replace(/<img[^>]*>/gi, ""), {
        wordwrap: 130,
      })
    );
  };

  return data?.length ? (
    <TopicCampsTab
      getTopicsLoadingIndicator={loadingIndicator}
      recentActivities={{ topics: data }}
      handleTextOverflow={handleTextOverflow}
      getTopicCampName={getTopicCampName}
      covertToTime={covertToTime}
    />
  ) : (
    <div className="flex items-center justify-center gap-3 flex-col pt-14 pb-14">
      {K?.exceptionalMessages?.noRecentActivityFound}
      <Image
        src="/images/no-activity.svg"
        alt="svg"
        className="icon-topic"
        height={81}
        width={118}
      />
    </div>
  );
}

export default CampRecentActivities;
