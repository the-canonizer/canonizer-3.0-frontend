import { BellFilled } from "@ant-design/icons";
import { Collapse, List, Popover, Typography } from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./campRecentActivities.module.scss";

import Image from "next/image";
import ReasonsActivity from "src/components/common/SupportReasonActivity";
import { RootState, store } from "src/store";
import { setCampActivityData } from "src/store/slices/recentActivitiesSlice";
import { getProperties } from "src/utils/generalUtility";
import K from "../../../../constants";
import { getTopicActivityLogApi } from "../../../../network/api/campDetailApi";
import CustomSkelton from "../../../common/customSkelton";

const { Text } = Typography;
const { Panel } = Collapse;

export default function CampRecentActivities() {
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.loggedInUser
  );
  const data = useSelector(
    (state: RootState) => state.recentActivities.campActivityData
  ); // Selector to access campActivityData
  const dispatch = useDispatch();

  const router = useRouter();
  // const [data, setData] = useState([]);
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
      store.dispatch(setCampActivityData(res?.data?.items));
      // setData(res?.data?.items);
      setHasShowViewAll(res?.data?.is_show_all_btn);
      setLoadingIndicator(false);
    }
    getTopicActivityLogCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.camp[1]?.split("-")[0] ?? 1]);

  return (
    <Fragment>
      <div className="camp_activity_new">
        <h3 className="lg:mb-5 mb-3 uppercase text-sm lg:text-base font-semibold text-canBlack">
          Camp activities
        </h3>
      </div>
      <div className="camp-recent lg:bg-canGray bg-transparent lg:py-8 lg:px-6 rounded-2xl">
        <div className="camp-recent-child d-flex justify-center flex-col items-center bg-white lg:px-7 px-3.5  rounded-xl border border-canGrey2 ">
          <div className="d-flex flex-col gap-1 w-full">
            {loadingIndicator ? (
              <CustomSkelton
                className=""
                skeltonFor="list"
                bodyCount={7}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : data ? (
              <List
                itemLayout="horizontal"
                className="activeListWrap [&_.ant-list-item-meta-avatar]:!hidden [&_.ant-list-item]:!py-4"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item className={styles.activitiesList}>
                    <List.Item.Meta
                      avatar={<BellFilled className={styles.bellIcon} />}
                      title={
                        <div>
                          <h4 className="text-base leading-[24px] mb-2.5 font-normal !break-words">
                            {" "}
                            {item?.description}
                          </h4>{" "}
                          {item?.log_name === "support" &&
                            getProperties(item)?.reason && (
                              <Popover
                                content={<ReasonsActivity CurrentItem={item} />}
                                placement="top"
                                className={styles.algoInfoIcon}
                              >
                                <i className="icon-info"></i>
                              </Popover>
                            )}
                        </div>
                      }
                      description={
                        <p className="text-xs font-normal leading-[15px] text-opacity-50">
                          {covertToTime(item?.updated_at)}
                        </p>
                      }
                      className={styles.listItem}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="flex items-center justify-center gap-3 flex-col pt-14 pb-14">
                {K?.exceptionalMessages?.noRecentActivityFound}
                <Image
                  src="/images/no-activity.svg"
                  alt="svg"
                  className="icon-topic"
                  height={81}
                  width={118}
                />
              </div>
            )}
          </div>

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
        </div>
      </div>
      {/* <Collapse
        defaultActiveKey={["1"]}
        expandIconPosition="right"
        className="topicDetailsCollapse news-feeds"
      >
        <Panel
          header={
            <h3 className="text-orange card_heading">
               Camp  Activities
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
          ) : !data ? (
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
                        {item?.log_name === "support" &&
                          getProperties(item)?.reason && (
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
      </Collapse>  */}
    </Fragment>
  );
}
