import { Fragment, useEffect, useState } from "react";
import { Col, Image, Row, Typography } from "antd";
import { useRouter } from "next/router";
import { RightOutlined } from "@ant-design/icons";

import { latestThread } from "src/network/api/campForumApi";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import SeeMoreLInk from "../Home/FeaturedTopic/seeMoreLink";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import { covertToTime } from "src/utils/generalUtility";
import CommonCard from "components/shared/Card";

function Campforum() {
  const router = useRouter();

  const [thread, setThread] = useState([]);

  const getThreadList = async () => {
    const body = {
      topic_num: router?.query?.camp[0]?.split("-")[0],
      camp_num: router?.query?.camp[1]?.split("-")[0],
    };

    const res = await latestThread(body);
    setThread(res);
  };

  useEffect(() => {
    getThreadList();
  }, []);

  const onCampForumClick = () => {
    router?.push({
      pathname: `/forum/${router?.query?.camp[0]}/${
        router?.query?.camp[1] || "1"
      }/threads`,
    });
  };

  return (
    <Fragment>
      <Row gutter={15}>
        <Col md={12} sm={12} xs={12}>
          <SectionHeading title="Camp Forum" infoContent="" icon={null} />
        </Col>
        {thread?.length ? (
          <Col md={12} sm={12} xs={12} className="text-right">
            <SeeMoreLInk
              href={{
                pathname: `/forum/${router?.query?.camp[0]}/${
                  router?.query?.camp[1] || "1"
                }/threads`,
              }}
              title="See All Threads"
            />
          </Col>
        ) : null}
      </Row>

      <Row className="mt-4" gutter={[24, 24]}>
        <Col md={24} lg={24} xs={24} sm={24}>
          <CommonCard
            className={`bg-canGray flex flex-col items-center justify-center [&_.ant-card-body]:w-full ${
              !thread?.length
                ? "py-14 [&_.ant-card-body]:text-center "
                : "!py-0"
            }`}
          >
            {!thread?.length ? (
              <Fragment>
                <Typography.Paragraph className="font-normal text-sm text-canBlack">
                  No threads have been started in the Camp Forum
                </Typography.Paragraph>
                <SecondaryButton
                  className="h-[44px] flex items-center justify-center px-20 py-2.5 mx-auto"
                  onClick={onCampForumClick}
                >
                  Start A Thread
                  <Image
                    src="/images/plus-Icon.svg"
                    alt="svg"
                    height={24}
                    width={24}
                  />
                </SecondaryButton>
              </Fragment>
            ) : (
              thread?.map((obj) => (
                <div
                  key={obj?.id}
                  className="cursor-pointer last:border-none py-3 px-5 group flex justify-between w-full hover:shadow-camp-light hover:bg-white hover:border-transparent hover:rounded-xl [&_.arrowIcon]:hover:block lg:border-b lg:mb-0 mb-2.5"
                >
                  <div className="w-full grid grid-rows-2 md:grid-flow-col center">
                    <Typography.Paragraph className="!mb-0 text-base text-canBlack text-ellipsis font-medium row-start-1 md:row-start-0 col-span-2 md:col-span-2">
                      {obj.body}
                    </Typography.Paragraph>
                    <Typography.Paragraph className="text-canBlack text-opacity-50 font-medium text-xs !mb-0 flex items-center mt-2 row-start-2 row-span-2 col-span-2 md:col-span-2 md:row-start-0 md:row-span-0">
                      {covertToTime(obj?.created_at)}
                    </Typography.Paragraph>
                    <div className="flex justify-end items-center gap-3 row-start-2 row-span-2 md:row-start-0 md:row-span-2">
                      <Image
                        src="/images/comment-icon.svg"
                        alt="svg"
                        height={15}
                        width={18}
                      />
                      <Typography.Text className="text-xs text-canLightBlack flex items-center gap-1 font-medium">
                        {obj.post_count} <span> Replies</span>
                        <RightOutlined className="hidden arrowIcon" />
                      </Typography.Text>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CommonCard>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Campforum;
