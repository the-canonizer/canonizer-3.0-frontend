import { Fragment, useEffect, useState } from "react";
import { List, Typography, Collapse, Popover } from "antd";
import { useRouter } from "next/router";
import { BellFilled } from "@ant-design/icons";
import moment from "moment";
import Link from "next/link";
import { useSelector } from "react-redux";

import styles from "./campRecentActivities.module.scss";

import { getTopicActivityLogApi } from "../../../../network/api/campDetailApi";
import K from "../../../../constants";
import CustomSkelton from "../../../common/customSkelton";
import { RootState } from "src/store";
import ReasonsActivity from "src/components/common/SupportReasonActivity";

const { Text } = Typography;
const { Panel } = Collapse;

export default function CampRecentActivities() {
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );

  const router = useRouter();
  const [data, setData] = useState([]);
  const [hasShowViewAll, setHasShowViewAll] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [userData, setUserData] = useState(loggedInUser);

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  useEffect(() => setUserData(loggedInUser), [loggedInUser]);

  useEffect(() => {
    async function getTopicActivityLogCall() {
      setLoadingIndicator(true);
      let reqBody = {
        topic_num: router?.query?.camp[0]?.split("-")[0],
        camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
      };
      let res = await getTopicActivityLogApi(reqBody);
      setData(res?.data?.items);
      setHasShowViewAll(res?.data?.is_show_all_btn);
      setLoadingIndicator(false);
    }
    getTopicActivityLogCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.camp[1]?.split("-")[0] ?? 1]);

  return (
    <Fragment>
      <Collapse
        defaultActiveKey={["1"]}
        expandIconPosition="right"
        className="topicDetailsCollapse news-feeds"
      >
        <Panel
          header={
            <h3 className="text-orange card_heading">
              Current Camp Recent Activities
            </h3>
          }
          className={"activities " + styles.campActivities}
          key="1"
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
                    title={
                      <Fragment>
                        {item?.description}{" "}
                        {item?.log_name === "support" && (
                          <Popover
                            content={<ReasonsActivity CurrentItem={item} />}
                            placement="top"
                            className={styles.algoInfoIcon}
                          >
                            <i className="icon-info"></i>
                          </Popover>
                        )}
                      </Fragment>
                    }
                    description={covertToTime(item?.updated_at)}
                    className={styles.listItem}
                  />
                </List.Item>
              )}
            />
          ) : (
            K?.exceptionalMessages?.noRecentActivityFound
          )}
          <div className={styles.footerLink}>
            {userData?.is_admin && hasShowViewAll ? (
              <Link
                href={{
                  pathname: "/activities",
                  query: {
                    topic_num: router?.query?.camp[0]?.split("-")[0],
                    camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
                  },
                }}
              >
                <a className={styles.viewAllLink}>
                  <Text>View All</Text>
                  <i className="icon-angle-right"></i>
                </a>
              </Link>
            ) : null}
          </div>
        </Panel>
      </Collapse>
    </Fragment>
  );
}
