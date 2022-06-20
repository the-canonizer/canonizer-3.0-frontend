import { Card, List, Spin } from "antd";
import { BellFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getTopicActivityLogApi } from "src/network/api/campDetailApi";

import styles from "./campRecentActivities.module.scss";
import { useEffect, useState } from "react";

export default function CampRecentActivities() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const covertToTime = (unixTime) => {
    let uTime = new Date(unixTime * 1000);
    var time = uTime.toLocaleTimeString();
    var convertedTime = "Today " + time;
    return " " + convertedTime;
  };

  useEffect(() => {
    async function getTopicActivityLogCall() {
      setLoadingIndicator(true);

      let reqBody = {
        topic_num: router?.query?.camp[0]?.split("-")[0],
        camp_num: router?.query?.camp[1]?.split("-")[0],
      };
      let res = await getTopicActivityLogApi(reqBody);
      setData(res?.data);
      setLoadingIndicator(false);
    }
    getTopicActivityLogCall();
  }, []);

  return (
    <>
      <Spin spinning={loadingIndicator} size="large">
        <Card
          title="Recent Activities"
          className={"activities " + styles.campActivities}
        >
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item className={styles.activitiesList}>
                <List.Item.Meta
                  avatar={<BellFilled className={styles.bellIcon} />}
                  title={item?.description}
                  description={covertToTime(item?.updated_at)}
                  className={styles.listItem}
                />
              </List.Item>
            )}
          />
        </Card>
      </Spin>
    </>
  );
}
