import { Typography, List, Tooltip, Button, Popconfirm } from "antd";
import Link from "next/link";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import CustomSkelton from "components/common/customSkelton";
import K from "src/constants";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

const { Text, Paragraph } = Typography;

function NewsItemListTab({
  newsFeedList,
  getTopicsLoadingIndicator,
  handleDeleteCamp,
  handleTextOverflow,
  is_admin,
  isUserAuthenticated,
  router,
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
      className="rounded-lg max-h-[300px] overflow-y-auto [&_.ant-list-footer]:mt-auto"
      bordered={false}
      locale={{ emptyText: "You don't have any news right now." }}
      dataSource={newsFeedList}
      footer={
        is_admin && isUserAuthenticated ? (
          <Link
            href={{
              pathname: router?.asPath.replace("topic", "addnews"),
            }}
          >
            <a className="flex items-center justify-center !bg-canBlue hover:!bg-canHoverBlue !text-white hover:shadow-md rounded-lg px-3 py-2 w-[200px] inline-block gap-2 mx-auto text-sm">
              Add News <PlusOutlined />
            </a>
          </Link>
        ) : null
      }
      renderItem={(news: {
        id?: string;
        link?: string;
        display_text?: string;
        submitter_nick_name?: string;
        parent_camp_url: string;
        parent_camp_name: string;
        manage_flag: boolean;
      }) => (
        <List.Item
          className="font-inter text-sm font-medium bg-white w-full px-2 [&_.editDeleteSection]:hover:flex"
          key={news?.id}
        >
          <Paragraph>
            <a
              href={
                !/^https?:\/\//i.test(news?.link)
                  ? `http://${news?.link}`
                  : news?.link
              }
              target={"__blank"}
              id="news-a-tag"
              className="w-full !text-canBlue hover:!text-canHoverBlue text-sm"
            >
              {handleTextOverflow(news?.display_text?.trim())}
            </a>
            <Text className="flex gap-1 w-full">
              <span className="text-[#242B3780]">by</span>
              <Link href={{ pathname: "" }}>
                <a className="!text-canBlue hover:!text-canHoverBlue text-sm">
                  {news?.submitter_nick_name}
                </a>
              </Link>
            </Text>
          </Paragraph>
          {is_admin && isUserAuthenticated && (
            <Paragraph className="editDeleteSection hidden flex items-center justify-end gap-2">
              {news?.manage_flag ? (
                <Popconfirm
                  placement="topLeft"
                  title={K?.exceptionalMessages?.deleteCampNewsTooltipMessage}
                  onConfirm={() => handleDeleteCamp(news?.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    size="small"
                    type="link"
                    className="text-canBlack hover:!text-canBlue h-[20px] flex items-center justify-center p-0"
                    id="delete-btn-news"
                  >
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              ) : (
                <Tooltip
                  title={
                    <>
                      This news is inherited from{" "}
                      <Link
                        href={{ pathname: news?.parent_camp_url || "" }}
                        id="inherit-btn"
                      >
                        <a className="font-medium !text-white hover:!text-canHoverBlue flex items-center justify-center">
                          {news?.parent_camp_name}
                        </a>
                      </Link>
                    </>
                  }
                >
                  <DeleteOutlined />
                </Tooltip>
              )}

              <Link
                href={{
                  pathname: `/editnews/${replaceSpecialCharacters(
                    router?.query?.camp[0],
                    "-"
                  )}/${replaceSpecialCharacters(
                    router?.query?.camp[1],
                    "-"
                  )}/news-id-${news?.id}`,
                }}
                type="link"
                id="news-edit-btn"
              >
                <a className="!text-canBlack hover:!text-canBlue flex items-center justify-center">
                  <EditOutlined />
                </a>
              </Link>
            </Paragraph>
          )}
        </List.Item>
      )}
    />
  );
}

export default NewsItemListTab;
