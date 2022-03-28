import { Card, Typography } from "antd";
import Link from "next/link";
import styles from "../campTree.module.scss";
import Router, { useRouter } from "next/router";

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed, reqBody }) => {
  const router = useRouter();
  console.log("req body in index -newsfeedcard-", reqBody);
  console.log("newsfeed data -newsfeedcard-", newsFeed);
  const newsMockResponse = [
    {
      id: 1,
      news: ` New Video: "Consciousness: Not a Hard Problem Just a Color Problem"`,
      link: "www.canonizer.com",
    },
    {
      id: 2,
      news: ` Consciousness can only be apprehended in agreement with the hard
    sciences, and the result is very different from what most would expect`,
      link: "www.canonizer.com",
    },
  ];

  return (
    <Card
      className="canCard"
      title={
        <div className="cardHeader">
          {" "}
          <h3 className="heading-color">
            <i className={"icon-fi-document " + styles.iconMr} />
            News Feeds
          </h3>
        </div>
      }
      extra={
        <div className="cardActions">
          {" "}
          {/* <a
            onClick={() =>
              Router.push({
                pathname: "/updatenews/${}",
                query: reqBody,
              })
            }
          >
            <i className={"icon-edit " + styles.iconMr}></i>Edit News
          </a> */}
          <Link
            href={{
              pathname: "/updatenews/camp",
              query: reqBody,
            }}
          >
            <a>
              <i className={"icon-edit " + styles.iconMr}></i>Edit News
            </a>
          </Link>{" "}
          <a>
            <i className={"icon-delete " + styles.iconMr}></i>Delete News
          </a>
        </div>
      }
    >
      {newsFeed?.map((news) => {
        return (
          <Paragraph key={news.id}>
            <Link href={news?.link} passHref>
              <a>{news?.display_text}</a>
            </Link>
          </Paragraph>
        );
      })}
    </Card>
  );
};
export default NewsFeedsCard;
