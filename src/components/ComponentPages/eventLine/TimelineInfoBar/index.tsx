import { Button, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";

import styles from "../topicDetails.module.scss";

import { RootState } from "src/store";
import { setTopicName } from "src/store/slices/campDetailSlice";
import CustomSkelton from "../../../common/customSkelton";

const CampInfoBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { topic_name, loading } = useSelector((state: RootState) => ({
    topic_name: state?.topicDetails?.topic_name,
    loading: state?.loading?.loading,
  }));
  const camp = router?.query?.camp[0] || "";
  const urlTopicName = camp.substring(camp.indexOf("-") + 1).replace(/-/g, " ");

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
                  // loadingIndicator
                  //   ? styles.topicTitleSkeleton :
                  styles.topicTitleStyle
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
                <span className="bold">
                  {" "}
                  Topic : {urlTopicName ? urlTopicName : topic_name}
                </span>
              )}
            </Typography.Paragraph>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default CampInfoBar;
