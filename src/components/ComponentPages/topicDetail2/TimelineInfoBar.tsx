import { Button, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./topicDetails.module.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CampInfoBar = () => {
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const router = useRouter();
  // console.log("rouref", router.query.camp[0].split("-").slice(1).join(" "));
  console.log("id ->", router.query.camp[0].split("-")[0]);

  console.log("id ->", router.query.camp[1].split("-")[0]);

  return (
    <>
      <div className={styles.topicDetailContentHead}>
        <Spin spinning={false}>
          <div className={styles.topicDetailContentHead_Left}>
            <Button
              className={styles.backButton}
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() =>
                router.push(router.asPath.replace("timelinetest", "topic"))
              }
            >
              Back
            </Button>
            <Typography.Paragraph
              className={
                "mb-0 " +
                `${
                  loadingIndicator
                    ? styles.topicTitleSkeleton
                    : styles.topicTitleStyle
                }`
              }
            >
              {" "}
              <span className="bold">
                {" "}
                Topic : {router.query.camp[0].split("-").slice(1).join(" ")}
              </span>
            </Typography.Paragraph>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default CampInfoBar;
