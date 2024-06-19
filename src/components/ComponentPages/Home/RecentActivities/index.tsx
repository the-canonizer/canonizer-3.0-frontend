import { Fragment, useEffect, useState } from "react";
import { Row, Col, List, Typography, Tooltip } from "antd";
import { useSelector } from "react-redux";
import Link from "next/link";
import { convert } from "html-to-text";

import Headings from "src/components/shared/Typography";
import CommonCard from "src/components/shared/Card";
import { RootState } from "src/store";
import { getRecentActivitiesApi } from "src/network/api/homePageApi";
import CustomSkelton from "src/components/common/customSkelton";

const covertToTime = (unixTime) => {
  let uTime = new Date(unixTime * 1000);
  var year = uTime.getFullYear();
  var month = uTime.toDateString().split(" ")[1];
  var date = uTime.getDate();
  var time = uTime.toLocaleTimeString();
  var convertedTime = month + " " + date + ", " + year + ", " + time;
  return " " + convertedTime;
};

const handleTextOverflow = (text) => {
  let str = convert(text?.replace(/<img[^>]*>/gi, ""), {
    wordwrap: 130,
  });
  return str?.length > 90 ? str?.substring(0, 90) + "..." : str;
};

const RecentActivities = ({ isUserAuthenticated }) => {
  const { topicsData } = useSelector((state: RootState) => ({
    topicsData: state?.recentActivities?.topicsData,
  }));

  const [recentActivities, setRecentActivities] = useState(topicsData);
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  useEffect(() => {
    setRecentActivities(topicsData);
  }, [topicsData?.topics]);

  async function getTopicsApiCallWithReqBody(loadMore = false) {
    setLoadingIndicator(true);
    const reqBody = {
      log_type: "topic/camps",
      page: 1,
      per_page: 5,
      is_admin_show_all: "",
      camp_num: "",
      topic_num: "",
    };

    await getRecentActivitiesApi(reqBody, loadMore, "topic/camps");

    setLoadingIndicator(false);
  }

  useEffect(() => {
    async function linksApiCall() {
      await getTopicsApiCallWithReqBody(false);
    }

    if (isUserAuthenticated) {
      linksApiCall();
    }
  }, []);

  return (
    <Fragment>
      <Row gutter={15} className="mt-5">
        <Col md={12} sm={12} xs={12} className="mb-3">
          <Headings level={5} className="mb-0 text-base font-bold uppercase">
            Recent activities
          </Headings>
        </Col>
        <Col md={12} sm={12} xs={12} className="text-right">
          <Link href="/activities">
            <a className="text-blue hover:text-hblue text-14 font-inter font-medium">
              See More
            </a>
          </Link>
        </Col>
      </Row>

      <div className="">
        <CommonCard className="border-0 h-100 hover:*:bg-gr focus:*:bg-gr">
          {loadingIndicator ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={5}
              stylingClass="listSkeleton"
              isButton={false}
            />
          ) : (
            <List
              className="mt-1 rounded-lg"
              size="small"
              bordered
              dataSource={recentActivities?.topics}
              renderItem={(item: any) => {
                const decodedProperties = JSON.parse(
                  item?.activity?.properties
                );
                // console.log("decodedProperties----", decodedProperties);
                return (
                  <List.Item
                    className="font-inter text-base font-medium bg-white"
                    id={`topic-${item?.topic_id}`}
                  >
                    <Link href={decodedProperties?.url?.replace(/\s+/g, "-")}>
                      <a className="hover:*:hblue">
                        <Typography.Paragraph className="text-black text-base font-normal mb-0">
                          {item?.activity?.description}{" "}
                          {/* <Typography.Text className="font-medium text-blue">
                          {decodedProperties?.topic_name
                            ? decodedProperties?.topic_name
                            : decodedProperties?.camp_name
                            ? decodedProperties?.camp_name
                            : convert(
                                decodedProperties?.description?.replace(
                                  /<img[^>]*>/gi,
                                  ""
                                ),
                                {
                                  wordwrap: 130,
                                }
                              )}
                        </Typography.Text> */}
                        </Typography.Paragraph>
                        <Typography.Paragraph className="text-black text-base font-normal mb-0">
                          <Tooltip
                            placement={"topLeft"}
                            title={
                              decodedProperties?.topic_name
                                ? `Topic: ${decodedProperties?.topic_name}` +
                                  (decodedProperties?.camp_name
                                    ? ` | Camp: ${decodedProperties?.camp_name}`
                                    : "")
                                : handleTextOverflow(
                                    decodedProperties?.description
                                  )
                            }
                          >
                            <Typography.Text className="font-medium text-blue">
                              {decodedProperties?.topic_name
                                ? `Topic: ${decodedProperties?.topic_name}` +
                                  (decodedProperties?.camp_name
                                    ? ` | Camp: ${decodedProperties?.camp_name}`
                                    : "")
                                : convert(
                                    decodedProperties?.description?.replace(
                                      /<img[^>]*>/gi,
                                      ""
                                    ),
                                    {
                                      wordwrap: 130,
                                    }
                                  )}
                            </Typography.Text>
                          </Tooltip>
                        </Typography.Paragraph>
                        <Typography.Paragraph className="text-balack opacity-[0.5] font-normal font-inter text-[12px]">
                          {covertToTime(item.updated_at)}
                        </Typography.Paragraph>
                      </a>
                    </Link>
                  </List.Item>
                );
              }}
            />
          )}
        </CommonCard>
      </div>
    </Fragment>
  );
};

export default RecentActivities;
