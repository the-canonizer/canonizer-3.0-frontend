import { Col, Row } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convert } from "html-to-text";
import Image from "next/image";

import { RootState, store } from "src/store";
import { setCampActivityData } from "src/store/slices/recentActivitiesSlice";
import K from "src/constants";
import { getTopicActivityLogApi } from "src/network/api/campDetailApi";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "components/ComponentPages/Home/FeaturedTopic/seeMoreLink";
import TopicCampsTab from "./itemList";

function CampRecentActivities() {
  const { loggedInUser, data } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
    data: state.recentActivities.campActivityData,
  }));

  const router = useRouter();

  const [hasShowViewAll, setHasShowViewAll] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [userData, setUserData] = useState(loggedInUser);

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  useEffect(() => setUserData(loggedInUser), [loggedInUser]);

  useEffect(() => {
    async function getTopicActivityLogCall() {
      setLoadingIndicator(true);

      const reqBody = {
        topic_num: router?.query?.camp[0]?.split("-")[0],
        camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
      };

      const res = await getTopicActivityLogApi(reqBody);

      store.dispatch(setCampActivityData(res?.data?.items));

      setHasShowViewAll(res?.data?.is_show_all_btn);
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

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading
            title="Camp activities"
            infoContent="Camp activities"
            icon={null}
          />
        </Col>
        {userData?.is_admin && hasShowViewAll && (
          <Col md={12} sm={12} xs={12} className="text-right">
            <SeeMoreLInk
              title="View All"
              href={{
                pathname: "/activities",
                query: {
                  topic_num: router?.query?.camp[0]?.split("-")[0],
                  camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
                },
              }}
            />
          </Col>
        )}
      </Row>
      <div className="camp-recent lg:bg-canGray bg-transparent lg:py-5 lg:px-4 rounded-2xl">
        <div className="camp-recent-child d-flex justify-center flex-col items-center bg-white rounded-xl border border-canGrey2 h-full p-1">
          <div className="d-flex flex-col w-full h-full min-h-56 max-h-72 overflow-hidden overflow-y-auto">
            {data?.length ? (
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
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default CampRecentActivities;
