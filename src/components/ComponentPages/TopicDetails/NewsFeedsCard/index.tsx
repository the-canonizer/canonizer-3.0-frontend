import { Card, Typography } from "antd";
import Link from "next/link";

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed, reqBody, isLogin }) => {
  return (
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
              <Link href="/">
                <a>
                  <i className={"icon-delete"}></i>Delete News
                </a>
              </Link>
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
                      <a>{news?.display_text}</a>
                    </Link>
                  </Paragraph>
                </li>
              );
            })
          : "No News Found"}
      </ul>
    </Card>
  );
};
export default NewsFeedsCard;
