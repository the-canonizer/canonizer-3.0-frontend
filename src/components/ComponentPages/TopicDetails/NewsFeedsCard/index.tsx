import { Card, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { deleteNewsDataApi } from "src/network/api/campNewsApi";
import { getNewsFeedApi } from "src/network/api/campDetailApi";
import { Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed }) => {
  const isLogin = useAuthentication();
  const [deleteNews, setDeleteNews] = useState(false);
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
                {!deleteNews && (
                  <Link
                    href={
                      isLogin
                        ? "/login"
                        : router.asPath.replace("topic", "editnews")
                    }
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
                return (
                  <li key={news.id}>
                    <Paragraph>
                      <Link href={news?.link} passHref>
                        <a>{news?.display_text} </a>
                      </Link>

                      {deleteNews && (
                        <DeleteOutlined
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
