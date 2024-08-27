import { Typography, List, Tooltip } from "antd";
import Link from "next/link";
import { convert } from "html-to-text";

import CustomSkelton from "src/components/common/customSkelton";

const { Text } = Typography;

function ThreadTab({
  getTopicsLoadingIndicator,
  recentActivities,
  decodeUrlLink,
  handleTextOverflow,
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
            <Link href={decodeUrlLink(activity)} passHref>
              <a className="w-full !text-canBlue hover:!text-canHoverBlue">
                <Text className="!text-canBlack text-sm font-normal mb-0 block w-full">
                  {activity?.activity?.description}{" "}
                  <Text className="text-canBlue font-medium">
                    <Tooltip
                      placement={"topLeft"}
                      title={handleTextOverflow(decodedProperties?.description)}
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
                </Text>
                <Text
                  className="text-canBlack opacity-[0.5] font-normal font-inter text-[10px] block mt-1"
                  type="secondary"
                >
                  {covertToTime(activity.updated_at)}
                </Text>
              </a>
            </Link>
          </List.Item>
        );
      }}
    />
  );
}

export default ThreadTab;
