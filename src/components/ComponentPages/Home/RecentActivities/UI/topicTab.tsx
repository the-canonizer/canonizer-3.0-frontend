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
      renderItem={(activity: any) => {
        const decodedProperties = JSON.parse(activity?.activity?.properties);

        return (
          <List.Item className="font-inter text-sm font-medium bg-white w-full px-2">
            <AntLink
              href={decodedProperties?.url?.replace(/\s+/g, "-")}
              className="w-full !text-canBlue hover:!text-canHoverBlue"
            >
              <Fragment>
                <Text className="text-canBlack text-sm font-normal mb-0">
                  {activity?.activity?.description}{" "}
                  {activity?.activity?.log_name === "support" &&
                    getProperties(activity?.activity)?.reason && (
                      <Popover
                        content={
                          <div className="w-full">
                            <ReasonsActivity CurrentItem={activity?.activity} />
                          </div>
                        }
                        placement="top"
                        className="pointer text-canGrey2"
                      >
                        <i className="icon-info"></i>
                      </Popover>
                    )}
                  <Text className="text-canBlue font-medium">
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
                    >
                      {getTopicCampName(activity, decodedProperties)}
                    </Tooltip>
                  </Text>
                </Text>
                <Text
                  className="text-canBlack opacity-[0.5] font-normal font-inter text-[10px] block mt-1"
                  type="secondary"
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