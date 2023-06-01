import { Button, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { RootState } from "src/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "../topicDetails.module.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CustomSkelton from "../../../common/customSkelton";
import { setTopicName } from "src/store/slices/campDetailSlice";

const CampInfoBar = () => {
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const dispatch = useDispatch();
  const { topic_name, loading } = useSelector((state: RootState) => ({
    topic_name: state?.topicDetails?.topic_name,
    loading: state?.loading?.loading,
  }));
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
              onClick={() => {
                dispatch(setTopicName(null));
                router?.push(router?.asPath.replace("eventline", "topic"));
              }}
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
              {!topic_name || loading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="topic-skeleton"
                  isButton={false}
                />
              ) : (
                <span className="bold"> Topic : {topic_name}</span>
              )}
            </Typography.Paragraph>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default CampInfoBar;
