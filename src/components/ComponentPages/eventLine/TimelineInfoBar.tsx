import { Button, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./topicDetails.module.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CampInfoBar = () => {
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const router = useRouter();

  return (
    <>
      <div className={styles.topicDetailContentHead}>
        <Spin spinning={false}>
          <div className={styles.topicDetailContentHead_Left}>
            <Button
              className={styles.backButton}
              size="small"
              type={"text"}
              ghost
              icon={<ArrowLeftOutlined />}
              onClick={() =>
                router.push(router.asPath.replace("eventline", "topic"))
              }
            />
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
