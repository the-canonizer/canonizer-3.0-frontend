import { Card, List, Spin } from "antd";
import { BellFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getTopicActivityLogApi } from "src/network/api/campDetailApi";

import styles from "./campRecentActivities.module.scss";
import { useEffect, useState } from "react";

const data1 = [
  {
    title: "Rohit has made the following post to the camp Agreement forum",
  },
  {
    title: (
      <>
        Vikram has just added their support to this camp:
        <br /> Software Development Team{" "}
      </>
    ),
  },
  {
    title: (
      <>
        Sunil has just removed their support from this camp :<br /> Software
        Development Team{" "}
      </>
    ),
  },
  {
    title: (
      <>
        Reena has just added their support to this camp :<br /> Scalability
        Architecture /Server Ar....{" "}
      </>
    ),
  },
  {
    title: <>Rohit had made the following post to the camp Agreement forum </>,
  },
  {
    title: (
      <>
        Vikram has just added their support to this camp :<br /> Software
        Development Team{" "}
      </>
    ),
  },
  {
    title: (
      <>
        Sunil has just removed their support from this camp :<br /> Software
        Development Team{" "}
      </>
    ),
  },
  {
    title: (
      <>
        Reena has just added their support to this camp :<br /> Scalability
        Architecture /Server Ar....{" "}
      </>
    ),
  },
  {
    title: "Rohit has made the following post to the camp Agreement forum",
  },
  {
    title: (
      <>
        Vikram has just added their support to this camp:
        <br /> Software Development Team{" "}
      </>
    ),
  },
  {
    title: (
      <>
        Sunil has just removed their support from this camp :<br /> Software
        Development Team{" "}
      </>
    ),
  },
];

export default function CampRecentActivities() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  useEffect(() => {
    async function getTopicActivityLogCall() {
      setLoadingIndicator(true);
      let a = await new Promise((r) => setTimeout(r, 5000));

      let reqBody = {
        topic_num: router?.query?.camp[0]?.split("-")[0],
        camp_num: router?.query?.camp[1]?.split("-")[0],
      };
      console.log("body =>", reqBody);
      let res = await getTopicActivityLogApi(reqBody);
      console.log("res1", res.data);
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
                  title={item.title}
                  description="Today 11:56"
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
