import { useEffect, useState } from "react";
import { Card, List, Spin } from "antd";
import { BellFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import moment from "moment";
import { getTopicActivityLogApi } from "../../../../network/api/campDetailApi";
import K from "../../../../constants";
import styles from "./campRecentActivities.module.scss";

export default function CampRecentActivities() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  useEffect(() => {
    async function getTopicActivityLogCall() {
      setLoadingIndicator(true);

      let reqBody = {
        topic_num: router?.query?.camp[0]?.split("-")[0],
        camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
      };
      let res = await getTopicActivityLogApi(reqBody);
      setData(res?.data);
      setLoadingIndicator(false);
    }
    getTopicActivityLogCall();
  }, [router?.query?.camp[1]?.split("-")[0] ?? 1]);
  return (
    <>
      <Spin spinning={loadingIndicator} size="large">
        <Card
          title="Recent Activities"
          className={"activities " + styles.campActivities}
        >
          {data ? (
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
          ) : (
            K?.exceptionalMessages?.noRecentActivityFound
          )}
        </Card>
      </Spin>
    </>
  );
}
