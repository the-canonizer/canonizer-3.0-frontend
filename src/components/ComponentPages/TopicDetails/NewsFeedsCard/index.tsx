import { Card, Typography } from "antd";
import Link from "next/link";
import { DeleteOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

const NewsFeedsCard = ({ newsFeed }) => {
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
      className="canCard mb-3"
      title={
        <h3 className="heading-color">
          <i className={"icon-fi-document"} /> News Feeds
        </h3>
      }
      extra={
        newsFeed?.length ? (
          <>
            {" "}
            <a>
              <i className={"icon-edit"}></i>Edit News
            </a>{" "}
            <a>
              <i className={"icon-delete"}></i>Delete News
            </a>
          </>
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
                      <><a>{news?.display_text}</a>  <DeleteOutlined /></>
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
