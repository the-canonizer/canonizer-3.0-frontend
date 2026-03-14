import { Typography, List, Tooltip, Popover } from "antd";
import Link from "next/link";
import { convert } from "html-to-text";

import CustomSkelton from "src/components/common/customSkelton";
import { getProperties } from "src/utils/generalUtility";
import ReasonsActivity from "components/common/SupportReasonActivity";

const { Text } = Typography;

function ThreadTab({
  getTopicsLoadingIndicator,
  recentActivities,
  decodeUrlLink,
  handleTextOverflow,
  covertToTime,
  bodyCount = 5,
  isOnlyCamp = false,
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
      renderItem={(activity: any, idx) => {
        const decodedProperties = JSON.parse(activity?.activity?.properties);

        return (
          <List.Item
            key={activity.id}
            className="font-inter text-sm font-medium bg-white w-full px-2"
          >
            <Link href={decodeUrlLink(activity)} id={`link-${activity.id}`} className="w-full !text-canBlue hover:!text-canHoverBlue">
                <Text
                  id={`description-${activity.id}`}
                  className="!text-canBlack text-sm font-normal mb-0 block w-full"
                >
                  {activity?.activity?.description}{" "}
                  {!isOnlyCamp && (
                    <Text
                      id={`tooltip-${activity.id}`}
                      className="text-canBlue font-medium"
                    >
                      <Tooltip
                        placement={"topLeft"}
                        title={handleTextOverflow(
                          decodedProperties?.description
                        )}
                      >
                        {handleTextOverflow(
                          convert(
                            decodedProperties?.description?.replace(
                              /<img[^>]*>/gi,
                              ""
                            ),
                            {
                              wordwrap: 130,
                            }
                          )
                        )}
                      </Tooltip>
                    </Text>
                  )}
                  {activity?.activity?.log_name === "support" &&
                    getProperties(activity?.activity)?.reason && (
                      <Popover
                        content={
                          <div className="w-full">
                            <ReasonsActivity
                              CurrentItem={activity?.activity}
                              id={`reasons-activity-${idx}`}
                            />
                          </div>
                        }
                        placement="top"
                        className="pointer text-canGrey2"
                        id={`popover-${idx}`}
                      >
                        <i
                          className="icon-info ml-2"
                          id={`icon-info-${idx}`}
                        ></i>
                      </Popover>
                    )}
                </Text>
                <Text
                  id={`time-${activity.id}`}
                  className="text-canBlack opacity-[0.5] font-normal font-inter text-[10px] block mt-1"
                  type="secondary"
                >
                  {covertToTime(activity.updated_at)}
                </Text>
            </Link>
          </List.Item>
        );
      }}
    />
  );
}

export default ThreadTab;
