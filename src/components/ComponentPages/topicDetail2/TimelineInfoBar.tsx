import { Button, Spin, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import styles from "./topicDetails.module.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";

import useAuthentication from "../../../hooks/isUserAuthenticated";

const CampInfoBar = () => {
  const { isUserAuthenticated } = useAuthentication();

  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  //   const [payloadData, setPayloadData] = useState(payload);
  const [breadCrumbRes, setBreadCrumbRes] = useState({
    topic_name: "",
    bread_crumb: [],
  });
  const didMount = useRef(false);
  const router = useRouter();
  const { topicRecord, campRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );
  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );

  return (
    <>
      <div className={styles.topicDetailContentHead}>
        <Spin spinning={false}>
          <div className={styles.topicDetailContentHead_Left}>
            <Button
              className={styles.backButton}
              type="text"
              icon={<ArrowLeftOutlined />}
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
              <span className="bold"> Topic : Theories of Consciousness</span>
            </Typography.Paragraph>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default CampInfoBar;
