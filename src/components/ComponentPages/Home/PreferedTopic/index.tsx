import { Fragment, useEffect, useState } from "react";
import { Row, Col, Typography, Divider, Pagination } from "antd";
import { useSelector } from "react-redux";

import { RootState } from "src/store";
import SectionHeading from "../FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../FeaturedTopic/seeMoreLink";
import SingleTopicCard from "../HotTopics/topicCard";
import CustomSkelton from "components/common/customSkelton";
import { GetPreferedTopicDetails } from "src/network/api/topicAPI";

const { Title } = Typography;

const PreferedTopics = ({ isPage = false }) => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.preferedTopic,
  }));

  const [pCurrent, setPcurrent] = useState(1);
  const [pTotal, setPtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [postperPage] = useState(12);
  const [topicsList, setTopicsList] = useState([]);

  useEffect(() => {
    setTopicsList(topicData);
  }, [topicData]);

  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);

  const pOnChange = (page) => {
    setIsLoading(true);
    setPcurrent(page);
  };

  const getList = async () => {
    setIsLoading(true);

    const prefData = await GetPreferedTopicDetails(pCurrent, postperPage);

    if (prefData.status_code === 200) {
      setPtotal(prefData?.data?.total_rows);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isPage) {
      getList();
    }
  }, [pCurrent]);

  if (!isPage && !topicsList?.length) {
    return null;
  }

  const topicLists = !isPage ? topicsList?.slice(0, 6) : topicsList;

  return (
    <Fragment>
      {isPage ? (
        <div className="browse-wrapper pb-4 mt-3">
          <Title level={4} className="browse-title !mb-0">
            Your preferred Topics
          </Title>
          <Divider />
        </div>
      ) : (
        <Row gutter={15}>
          <Col md={12} sm={12} xs={12}>
            <SectionHeading
              title="Your preferred topics"
              infoContent="Preferred Topics are a personalized list of subjects shown to you based on the topic tags or categories you selected during registration. These topics align with your interests, making it easier for you to engage in discussions that matter most to you"
            />
          </Col>
          <Col md={12} sm={12} xs={12} className="text-right">
            <SeeMoreLInk href="/preferred-topics" />
          </Col>
        </Row>
      )}

      <div className="mt-3">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {topicLists?.map((ft) => (
            <div className="mb-4 h-full" key={ft?.id}>
              {loadMoreIndicator ? (
                <CustomSkelton
                  skeltonFor="hotTopic"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <SingleTopicCard
                  topic={ft}
                  onTopicLinkClick={() => setLoadMoreIndicator(false)}
                  avatars={ft?.supporterData?.slice(0, 3)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`paginationCon flex justify-center py-5`}>
        {isLoading && (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={1}
            stylingClass=""
            listStyle="liHeight"
            isButton={false}
          />
        )}
        {!isLoading && pTotal > postperPage ? (
          <Pagination
            current={pCurrent}
            onChange={pOnChange}
            total={pTotal}
            showSizeChanger={false}
            data-testid="s"
            pageSize={postperPage}
          />
        ) : null}
      </div>
    </Fragment>
  );
};

export default PreferedTopics;
