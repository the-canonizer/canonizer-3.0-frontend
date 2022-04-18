import { Card, Typography } from "antd";
import Link from "next/link";
<<<<<<< HEAD
import { useState } from "react";
import { deleteNewsDataApi } from "src/network/api/campNewsApi";
import { getNewsFeedApi } from "src/network/api/campDetailApi";
import { Spin } from "antd";
import {
  DeleteOutlined,
  EditTwoTone,
  CloseSquareTwoTone,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
=======
import { DeleteOutlined } from "@ant-design/icons";
>>>>>>> caca3cb8ff8e5aca7c6f29cba365fd9d39fd21ef

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed }) => {
  const isLogin = useAuthentication();
  const [deleteNews, setDeleteNews] = useState(false);
  const [editNews, setEditNews] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteCamp = async (id) => {
    setLoading(true);
    const res = await deleteNewsDataApi(id);
    if (res?.status_code == 200) {
      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
      };
      await getNewsFeedApi(reqBody);
    }
    setLoading(false);
  };
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
                  // <Link
                  //   href={
                  //     isLogin
                  //       ? "/login"
                  //       : router.asPath.replace("topic", "editnews")
                  //   }
                  // >
                  <a
                    onClick={() => {
                      setEditNews(true);
                      setDeleteNews(false);
                    }}
                  >
                    <i className={"icon-edit "}></i>Edit News
                  </a>
                  // </Link>
                )}
                {!(deleteNews || editNews) && (
                  <a
                    onClick={() => {
                      setDeleteNews(true);
                      setEditNews(false);
                    }}
                  >
                    <i className={"icon-delete"}></i>Delete News
                  </a>
                )}
                {(deleteNews || editNews) && (
                  <a
                    onClick={() => {
                      setDeleteNews(false);
                      setEditNews(false);
                    }}
                  >
                    <i>
                      <CloseSquareTwoTone />
                    </i>
                    Cancel
                  </a>
                )}
              </>
            ) : null}
          </>
<<<<<<< HEAD
        }
      >
        <ul className="newsFeedsList">
          {newsFeed?.length
            ? newsFeed?.map((news) => {
                return (
                  <li key={news?.id}>
                    <Paragraph>
                      <a>{news?.display_text} </a>

                      {!deleteNews && !editNews && (
                        <i> nickname {news?.submitter_nick_name}</i>
                      )}
                      {deleteNews && (
                        <button
                          disabled={!news.delete_flag}
                          onClick={() => handleDeleteCamp(news?.id)}
                        >
                          <DeleteOutlined />
                        </button>
                      )}
                      {editNews && (
                        <Link
                          href={
                            isLogin
                              ? "/login"
                              : `/editnews/${router?.query?.camp[0]}/${router?.query?.camp[1]}/${news?.id}-id`
                            //  : router.asPath.replace("topic", "editnews")
                          }
                        >
                          <EditTwoTone />
                        </Link>
                      )}
                    </Paragraph>
                  </li>
                );
              })
            : "No News Found"}
        </ul>
      </Card>
    </Spin>
=======
        ) : null
      }
    >
      <ul className="newsFeedsList">
        {newsFeed?.length
          ? newsFeed?.map((news) => {
              return (
                <li key={news.id}>
                  <Paragraph>
                    <Link href={news?.link} passHref>
                      <>
                        <a>{news?.display_text}</a> <DeleteOutlined />
                      </>
                    </Link>
                  </Paragraph>
                </li>
              );
            })
          : "No News Found"}
      </ul>
    </Card>
>>>>>>> caca3cb8ff8e5aca7c6f29cba365fd9d39fd21ef
  );
};
export default NewsFeedsCard;
