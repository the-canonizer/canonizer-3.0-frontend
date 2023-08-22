import { Fragment } from "react";
import { Card, Image, Typography } from "antd";
import moment from "moment";
import sanitizeHtml from "sanitize-html";
import { useSelector } from "react-redux";

import styles from "./HotTopic.module.scss";

import { RootState } from "src/store";
import { getTime } from "src/utils/generalUtility";

const { Text } = Typography;

function HotTopic({}) {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  return (
    <Fragment>
      <Card
        title={topicData?.title || "Hot Topic"}
        bordered={false}
        className={styles.hotopicCard}
        key={`data-card-${topicData?.id}`}
      >
        <div className={styles.imageSection}>
          <Text className={styles.date}>
            {moment(
              getTime(topicData?.updated_at || topicData?.created_at)
            ).format("MMMM DD, YYYY")}
          </Text>
          {topicData?.file_full_path && (
            <Image
              width={"100%"}
              height={350}
              src={topicData?.file_full_path}
              alt=""
              preview={false}
            />
          )}
          <div
            className={styles.imageLabel}
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(topicData?.description, {
                allowedAttributes: {
                  "*": [
                    "class",
                    "id",
                    "href",
                    "align",
                    "alt",
                    "center",
                    "bgcolor",
                    "src",
                    "title",
                    "style",
                    "rel",
                    "target",
                  ],
                },
              }),
            }}
          ></div>
        </div>
      </Card>
    </Fragment>
  );
}

export default HotTopic;
