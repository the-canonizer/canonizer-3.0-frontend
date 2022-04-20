import { Button, Card, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { deleteNewsDataApi } from "src/network/api/campNewsApi";
import { getNewsFeedApi } from "src/network/api/campDetailApi";
import { Spin } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed }) => {
  const isLogin = useAuthentication();
  const [deleteNews, setDeleteNews] = useState(false);
  const [editNews, setEditNews] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteCamp = async (id) => {
    setLoading(true);
    const res = await deleteNewsDataApi({
      newsfeed_id: id,
    });
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
                  <Button
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
                      {news?.display_text}

                      {!deleteNews && !editNews && (
                        <i> {news?.submitter_nick_name}</i>
                      )}
                      {deleteNews && (
                        <Button size="small" type="text"
                          danger
                          disabled={!news.owner_flag}
                          onClick={() => handleDeleteCamp(news?.id)}
                        >
                          <DeleteOutlined />
                        </Button>
                      )}
                      {/* {editNews && (
                        // <button disabled={!news.owner_flag}>
                        <Link
                          href={
                            isLogin
                              ? "/login"
                              : `/editnews/${router?.query?.camp[0]}/${router?.query?.camp[1]}/${news?.id}-id`
                            //  : router.asPath.replace("topic", "editnews")
                          }
                        >
                          <a>
                            <EditTwoTone />
                          </a>
                        </Link>
                        // </button>
                      )} */}
                      {editNews && (
                        <Button size="small" type="link"
                          disabled={!news.owner_flag}
                        >
                          <EditOutlined />
                        </Button>
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
