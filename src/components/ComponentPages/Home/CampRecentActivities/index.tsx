import { useEffect, useState } from "react";
import { Card, List, Switch, Typography } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { BellFilled } from "@ant-design/icons";
import moment from "moment";

import styles from "./campRecentActivities.module.scss";

import { getTopicActivityLogApi } from "../../../../network/api/campDetailApi";
import K from "../../../../constants";
import CustomSkelton from "../../../common/customSkelton";
import { RootState } from "src/store";

const { Title } = Typography;

export default function CampRecentActivities() {
  const { loggedInUser } = useSelector((state: RootState) => ({
    loggedInUser: state.auth.loggedInUser,
  }));

  const router = useRouter();
  const [data, setData] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  useEffect(() => {
    async function getTopicActivityLogCall() {
      setLoadingIndicator(true);
      let reqBody = {
        topic_num: router?.query?.camp[0]?.split("-")[0],
        camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
        is_admin_show_all: isChecked ? "all" : "",
      };
      let res = await getTopicActivityLogApi(reqBody);
      setData(res?.data);
      setLoadingIndicator(false);
    }
    getTopicActivityLogCall();
  }, [isChecked, router?.query?.camp[1]?.split("-")[0] ?? 1]);

  const onChange = () => setIsChecked(!isChecked);

  return (
    <>
      <Card
        title="Recent Activities"
        className={"activities " + styles.campActivities}
        extra={
          loggedInUser?.is_admin ? (
            <Title className={styles.switchButton} level={4}>
              <span>Show All</span>
              <Switch checked={isChecked} size="small" onChange={onChange} />
            </Title>
          ) : null
        }
      >
        {loadingIndicator ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={7}
            stylingClass="listSkeleton"
            isButton={false}
          />
        ) : data ? (
          <List
            itemLayout="horizontal"
            className="activeListWrap"
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
    </>
  );
}
