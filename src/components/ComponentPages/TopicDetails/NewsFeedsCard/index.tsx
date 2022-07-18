import { Button, Typography, Tooltip, Collapse, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { deleteNewsFeedApi } from "../../../../network/api/campNewsApi";
import { getNewsFeedApi } from "../../../../network/api/campDetailApi";
import { DeleteOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import K from "../../../../constants";
import Link from "next/link";

const { Paragraph } = Typography;

const { Panel } = Collapse;

const NewsFeedsCard = ({ newsFeed }) => {
  const isLogin = useAuthentication();
  const [deleteNews, setDeleteNews] = useState(false);
  const [editNews, setEditNews] = useState(false);

  const router = useRouter();

  const handleDeleteCamp = async (id) => {
    const res = await deleteNewsFeedApi({
      newsfeed_id: id,
    });
    if (res?.status_code == 200) {
      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
      };
      await getNewsFeedApi(reqBody);
    }
  };
  useEffect(() => {
    setDeleteNews(false);
    setEditNews(false);
  }, [newsFeed]);

  return (
    <Collapse
      defaultActiveKey={["1"]}
      expandIconPosition="right"
      className="topicDetailsCollapse"
    >
      <Panel
        header={
          <h3 className="text-orange card_heading">
            <i className={"icon-fi-document"} /> News Feeds
          </h3>
        }
        key="1"
        extra={
          <>
            {newsFeed?.length ? (
              <div
                className="ant-checkbox-wrapper"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <>
                  {!(deleteNews || editNews) && (
                    <>
                      <Button
                        type="link"
                        onClick={() => {
                          if (isLogin) {
                            setEditNews(true);
                            setDeleteNews(false);
                          } else {
                            router.push("/login");
                          }
                        }}
                      >
                        <i className={"icon-edit "} />
                        Edit News
                      </Button>

                      <Button
                        type="link"
                        onClick={() => {
                          if (isLogin) {
                            setDeleteNews(true);
                            setEditNews(false);
                          } else {
                            router.push("/login");
                          }
                        }}
                      >
                        <i className={"icon-delete"} />
                        Delete News
                      </Button>
                    </>
                  )}
                  {(deleteNews || editNews) && (
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        setDeleteNews(false);
                        setEditNews(false);
                      }}
                    >
                      <CloseOutlined /> Cancel
                    </Button>
                  )}
                </>
              </div>
            ) : null}
          </>
        }
      >
        <ul className="newsFeedsList">
          {newsFeed?.length
            ? newsFeed?.map((news) => {
                return (
                  <li key={news?.id}>
                    <Paragraph>
                      <a
                        href={
                          !/^https?:\/\//i.test(news?.link)
                            ? `http://${news?.link}`
                            : news?.link
                        }
                        target={"__blank"}
                      >
                        {news?.display_text}{" "}
                      </a>

                      {!(deleteNews && editNews) &&
                        !!news?.submitter_nick_name && (
                          <>
                            (by{" "}
                            <strong className="text-orange">
                              {" "}
                              {news?.submitter_nick_name}
                            </strong>
                            )
                          </>
                        )}
                      {deleteNews &&
                        (news?.manage_flag && news?.owner_flag ? (
                          <Popconfirm
                            disabled={!news.owner_flag}
                            placement="topLeft"
                            title={
                              K?.exceptionalMessages
                                ?.deleteCampNewsTooltipMessage
                            }
                            onConfirm={() => handleDeleteCamp(news?.id)}
                            onCancel={() => {
                              setDeleteNews(false);
                              setEditNews(false);
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              size="small"
                              type="link"
                              danger
                              disabled={!news.owner_flag}
                            >
                              <DeleteOutlined />
                            </Button>
                          </Popconfirm>
                        ) : news?.owner_flag && !news?.manage_flag ? (
                          <Tooltip
                            title={
                              <>
                                This news is inherited from
                                <Link href={news?.parent_camp_url}>
                                  <a>{news?.parent_camp_name}</a>
                                </Link>
                              </>
                            }
                          >
                            <DeleteOutlined />
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title={
                              news.owner_flag
                                ? ""
                                : K?.exceptionalMessages?.tooltipNewsDelete
                            }
                          >
                            <DeleteOutlined />
                          </Tooltip>
                        ))}

                      {editNews && (
                        <Tooltip
                          title={
                            news.owner_flag
                              ? ""
                              : K?.exceptionalMessages?.tooltipNewsEdit
                          }
                        >
                          <Button
                            size="small"
                            type="link"
                            disabled={!news.owner_flag}
                            onClick={() =>
                              router.push(
                                `/editnews/${router?.query?.camp[0]}/${router?.query?.camp[1]}/camp-id-${news?.id}`
                              )
                            }
                          >
                            <EditOutlined />
                          </Button>
                        </Tooltip>
                      )}
                    </Paragraph>
                  </li>
                );
              })
            : K?.exceptionalMessages?.newsFeed}
        </ul>
      </Panel>
    </Collapse>
  );
};
export default NewsFeedsCard;
