import { Fragment, useEffect, useState } from "react";
import { Card, List, Typography } from "antd";
import { useRouter } from "next/router";
import { BellFilled } from "@ant-design/icons";
import moment from "moment";
import Link from "next/link";

import styles from "./campRecentActivities.module.scss";

import { getTopicActivityLogApi } from "../../../../network/api/campDetailApi";
import K from "../../../../constants";
import CustomSkelton from "../../../common/customSkelton";

const { Title, Text } = Typography;

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
      <Card
        title="Recent Activities"
        className={"activities " + styles.campActivities}
        actions={[
          <Fragment>
            <Link
              href={{
                pathname: "/activities",
                query: {
                  topic_num: router?.query?.camp[0]?.split("-")[0],
                  camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
                  tabName: "topic/camps",
                },
              }}
            >
              <a className={styles.viewAllLink}>
                <Text>View All</Text>
                <i className="icon-angle-right"></i>
              </a>
            </Link>
          </Fragment>,
        ]}
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
