import { Card, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { getDeleteNewsFeedApi } from "src/network/api/addEditNewsApi";
import { getNewsFeedApi } from "src/network/api/campDetailApi";
import { Spin } from "antd";

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed, reqBody, isLogin }) => {
  const [deleteNews, setDeleteNews] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteCamp = async (id) => {
    setLoading(true);
    const res = await getDeleteNewsFeedApi(id);

    if (res.status_code == 200) {
      const newsres = await getNewsFeedApi(reqBody);
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
                {!deleteNews && (
                  <Link
                    href={{
                      pathname: isLogin ? "/login" : "/news/edit",
                      query: reqBody,
                    }}
                  >
                    <a>
                      <i className={"icon-edit "}></i>Edit News
                    </a>
                  </Link>
                )}
                {!deleteNews && (
                  <a onClick={() => setDeleteNews(true)}>
                    <i className={"icon-delete"}></i>Delete News
                  </a>
                )}
              </>
            ) : null}
          </>
        }
      >
        <ul className="newsFeedsList">
          {newsFeed?.length
            ? newsFeed?.map((news) => {
                console.log("news data --> ", news);
                return (
                  <li key={news.id}>
                    <Paragraph>
                      <Link href={news?.link} passHref>
                        <a>{news?.display_text} </a>
                      </Link>

                      {deleteNews && (
                        <RiDeleteBinLine
                          style={{ marginLeft: "5px" }}
                          onClick={() => handleDeleteCamp(news.id)}
                        />
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
