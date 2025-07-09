import { Fragment } from "react";
import { Typography, List, Tooltip } from "antd";

import CustomSkelton from "components/common/customSkelton";
import { getProperties } from "src/utils/generalUtility";
import ReasonsActivity from "components/common/SupportReasonActivity";

const { Link: AntLink, Text } = Typography;

function TopicCampsTab({
  getTopicsLoadingIndicator,
  recentActivities,
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
      className="rounded-lg max-h-[300px] overflow-y-auto"
      bordered={false}
      locale={{ emptyText: "You don't have any recent activity right now." }}
      dataSource={recentActivities?.topics}
      renderItem={(activity: any) => {
        const decodedProperties = JSON.parse(activity?.properties);

        return (
          <List.Item className="font-inter text-sm font-medium bg-white w-full px-2">
            <AntLink
              href={
                decodedProperties?.url?.startsWith("topic")
                    ? `/${decodedProperties.url.replace(/\s+/g, "-")}`
                    : decodedProperties?.url?.replace(/\s+/g, "-")
              }
              className="w-full !text-canBlue hover:!text-canHoverBlue"
            >
              <Fragment>
                <Text className="text-canBlack text-sm font-normal mb-0">
                  {activity?.description}{" "}
                  {activity?.log_name === "support" &&
                    getProperties(activity)?.reason && (
                      <Tooltip
                        title={
                          <div className="w-full">
                            <ReasonsActivity CurrentItem={activity} />
                          </div>
                        }
                        placement="top"
                        className="pointer text-canGrey2"
                      >
                        <i className="icon-info ml-1"></i>
                      </Tooltip>
                    )}
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
