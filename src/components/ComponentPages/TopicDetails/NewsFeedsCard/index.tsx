import { Button, Card, Typography, Tooltip, Popconfirm } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteNewsApi } from "src/network/api/campNewsApi";
import { getNewsFeedApi } from "src/network/api/campDetailApi";
import { Spin } from "antd";
import { DeleteOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import { RootState } from "src/store";
import { useSelector } from "react-redux";

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed }) => {
  const isLogin = useAuthentication();
  const [deleteNews, setDeleteNews] = useState(false);
  const [editNews, setEditNews] = useState(false);
  const [loading, setLoading] = useState(false);
  const tokenBearer = useSelector((state: RootState) => state?.auth?.token);
  const router = useRouter();

  const handleDeleteCamp = async (id) => {
    setLoading(true);
    const res = await deleteNewsApi(
      {
        newsfeed_id: id,
      },
      tokenBearer
    );
    if (res?.status_code == 200) {
      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
      };
      await getNewsFeedApi(reqBody);
    }
    setLoading(false);
  };

  useEffect(() => {
    setDeleteNews(false);
    setEditNews(false);
  }, [newsFeed]);

  return (
    <Spin spinning={loading} size="large">
      <Card
        className="canCard mb-3"
        title={
          <h3 className="heading-color">
            <i className={"icon-fi-document"} /> News Feeds
          </h3>
        }
        extra={
          <>
            {newsFeed?.length ? (
              <>
                {!(deleteNews || editNews) && (
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
                    <i className={"icon-edit "}></i>Edit News
                  </Button>
                )}
                {!(deleteNews || editNews) && (
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
                    <i className={"icon-delete"}></i>Delete News
                  </Button>
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
                      <Link href={news.link} passHref>
                        <a target="_blank" rel="noopener noreferrer">
                          {news?.display_text}
                        </a>
                      </Link>

                      {!deleteNews && !editNews && (
                        <i> {news?.submitter_nick_name}</i>
                      )}
                      {deleteNews && (
                        <Tooltip
                          title={news.owner_flag ? "" : "must owner to delete"}
                        >
                          <Popconfirm
                            disabled={!news.owner_flag}
                            placement="topLeft"
                            title="Are you sure to delete this task?"
                            onConfirm={() => handleDeleteCamp(news?.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              size="small"
                              type="text"
                              danger
                              disabled={!news.owner_flag}
                            >
                              <DeleteOutlined />
                            </Button>
                          </Popconfirm>
                        </Tooltip>
                      )}

                      {editNews && (
                        <Tooltip
                          title={news.owner_flag ? "" : "must owner to edit"}
                        >
                          <Button
                            size="small"
                            type="link"
                            disabled={!news.owner_flag}
                            onClick={() =>
                              router.push(
                                `/editnews/${router?.query?.camp[0]}/${router?.query?.camp[1]}/${news?.id}-id`
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
            : "No News Found"}
        </ul>
      </Card>
    </Spin>
  );
};
export default NewsFeedsCard;
