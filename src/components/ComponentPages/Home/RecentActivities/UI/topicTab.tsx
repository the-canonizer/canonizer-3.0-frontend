import { Fragment } from "react";
import { Typography, List, Tooltip, Popover } from "antd";

import CustomSkelton from "src/components/common/customSkelton";
import { getProperties } from "src/utils/generalUtility";
import ReasonsActivity from "src/components/common/SupportReasonActivity";

const { Link: AntLink, Text } = Typography;

function TopicCampsTab({
  getTopicsLoadingIndicator,
  recentActivities,
  handleTextOverflow,
  getTopicCampName,
  covertToTime,
  bodyCount = 5,
}) {
  return getTopicsLoadingIndicator ? (
    <CustomSkelton
      skeltonFor="list"
      bodyCount={bodyCount}
      stylingClass="listSkeleton"
      isButton={false}
    />
  ) : (
    <List
      className="rounded-lg"
      bordered={false}
      locale={{
        emptyText: "You don't have any recent activity right now.",
      }}
      dataSource={recentActivities?.topics}
      renderItem={(activity: any, index: number) => {
        const decodedProperties = JSON.parse(activity?.activity?.properties);

        return (
          <List.Item
            key={`list-item-${index}`}
            className="font-inter text-sm font-medium bg-white w-full px-2"
          >
            <AntLink
              href={decodedProperties?.url?.replace(/\s+/g, "-")}
              className="w-full !text-canBlue hover:!text-canHoverBlue"
              id={`ant-link-${index}`}
            >
              <Fragment>
                <Text
                  className="text-canBlack text-sm font-normal mb-0"
                  id={`text-description-${index}`}
                >
                  {activity?.activity?.description}{" "}
                  <Text
                    className="text-canBlue font-medium"
                    id={`text-topic-camp-${index}`}
                  >
                    <Tooltip
                      placement={"topLeft"}
                      title={
                        decodedProperties?.topic_name
                          ? `Topic: ${decodedProperties?.topic_name}` +
                            (decodedProperties?.camp_name
                              ? ` | Camp: ${decodedProperties?.camp_name}`
                              : "")
                          : handleTextOverflow(decodedProperties?.description)
                      }
                      id={`tooltip-${index}`}
                    >
                      {getTopicCampName(activity, decodedProperties)}
                    </Tooltip>
                  </Text>
                  {activity?.activity?.log_name === "support" &&
                    getProperties(activity?.activity)?.reason && (
                      <Popover
                        content={
                          <div className="w-full">
                            <ReasonsActivity
                              CurrentItem={activity?.activity}
                              id={`reasons-activity-${index}`}
                            />
                          </div>
                        }
                        placement="top"
                        className="pointer text-canGrey2"
                        id={`popover-${index}`}
                      >
                        <i
                          className="icon-info ml-2"
                          id={`icon-info-${index}`}
                        ></i>
                      </Popover>
                    )}
                </Text>
                <Text
                  className="text-canBlack opacity-[0.5] font-normal font-inter text-[10px] block mt-1"
                  type="secondary"
                  id={`text-time-${index}`}
                >
                  {covertToTime(activity.updated_at)}
                </Text>
              </Fragment>
            </AntLink>
          </List.Item>
        );
      }}
    />
  );
}

export default TopicCampsTab;
