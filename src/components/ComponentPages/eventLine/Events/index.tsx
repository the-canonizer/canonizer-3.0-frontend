// import { useRouter } from "next/router";
import { useState, Fragment, useEffect } from "react";
import { BellFilled } from "@ant-design/icons";
import { Card, Empty, List, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setViewThisVersion } from "src/store/slices/filtersSlice";
import moment from "moment";
import { setFilterCanonizedTopics } from "../../../../store/slices/filtersSlice";
// import styles from "./topicDetails.module.scss";
import Link from "next/link";
import { RootState } from "src/store";
import activityStyle from "../../Home-old/CampRecentActivities/campRecentActivities.module.scss";
import CustomSkelton from "../../../common/customSkelton";

const { Title } = Typography;
const Events = ({ timelineDescript, loadingEvents }: any) => {
  const dispatch = useDispatch();
  const [check, setCheck] = useState(true);
  // const router = useRouter();
  const { viewThisVersion, filterObject, filterByScore } = useSelector(
    (state: RootState) => ({
      viewThisVersion: state?.filters?.viewThisVersionCheck,
      filterObject: state?.filters?.filterObject,
      filterByScore: state.filters?.filterObject?.filterByScore,
      loading: state?.loading?.loading,
    })
  );
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  // const urlPath = (id) => {
  //   let path = router?.asPath.replace("eventline", "topic");
  //   let main = path?.replace(path.split("/")[3], id);
  //   return main;
  // };
  const handleEvents = (goLiveTime, url) => {
    let isTopicPage = url.split("/")[1];
    if (isTopicPage == "topic") {
      dispatch(setViewThisVersion(true));
      dispatch(
        setFilterCanonizedTopics({
          asofdate: goLiveTime,
          asof: "bydate",
        })
      );
    }
  };
  useEffect(() => {
    setCheck(true);
    setTimeout(() => {
      setCheck(false);
    }, 500);
  }, [timelineDescript]);

  return (
    <>
      <div className="activites-wrapper">
        <Title level={5} className="uppercase">
          activities
        </Title>
        {loadingEvents || timelineDescript?.length == 0 ? (
          <>
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="topic-skeleton"
              isButton={false}
            />
          </>
        ) : timelineDescript?.length > 0 ? (
          <List itemLayout="horizontal" className="activity-list-wrap">
            {timelineDescript &&
              timelineDescript.map((title, key) => {
                return (
                  <Fragment key={key}>
                    <List.Item>
                      <List.Item.Meta
                        className={
                          activityStyle.activitiesList +
                          ` ${key == 0 ? "animated-text" : ""}`
                        }
                        title={
                          <>
                            hello
                            <Link
                              href={
                                title?.url?.split("/")[1] == "topic"
                                  ? `${
                                      title?.url
                                    }?score=${filterByScore}&algo=${
                                      filterObject?.algorithm
                                    }&asofdate=${
                                      title?.eventDate
                                    }&asof=bydate&canon=${
                                      filterObject?.namespace_id
                                    }${
                                      viewThisVersion ? "&viewversion=1" : ""
                                    }&is_tree_open=1`
                                  : title?.url
                              }
                            >
                              {title?.message}
                            </Link>
                          </>
                        }
                        description={covertToTime(title?.eventDate)}
                      />
                    </List.Item>
                  </Fragment>
                );
              })}
          </List>
        ) : (
          <Empty description="No Event Found!" />
        )}
      </div>
    </>
  );
};

export default Events;
