import { Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { subscribeToCampApi } from "../../../../network/api/campDetailApi";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import { Dropdown, Menu, Button } from "antd";
import K from "src/constants";

import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import {
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
  getCampBreadCrumbApi,
} from "src/network/api/campDetailApi";
import {
  MoreOutlined,
  FileTextOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const CampInfoBar = ({ payload, isTopicPage }) => {
  const isLogin = useAuthentication();

  const didMount = useRef(false);
  const router = useRouter();
  const { topicRecord, campRecord, campStatement, asofdate, asof, algorithm } =
    useSelector((state: RootState) => ({
      topicRecord: state?.topicDetails?.currentTopicRecord,
      campRecord: state?.topicDetails?.currentCampRecord,

      campStatement: state?.topicDetails?.campStatement,

      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,

      asof: state?.filters?.filterObject?.asof,
    }));
  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );
  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );

  useEffect(() => {
    console.log("useeffect1");
    async function getTreeApiCall() {
      payload?.setLoadingIndicator(true);
      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +router?.query?.camp?.at(1)?.split("-")?.at(0),
        as_of: asof,
        asofdate:
          asof == ("default" || asof == "review")
            ? Date.now() / 1000
            : asofdate,
        algorithm: algorithm,
        update_all: 1,
      };

      await Promise.all([
        getCurrentTopicRecordApi(reqBody),
        getCurrentCampRecordApi(reqBody),
      ]);
      payload?.setLoadingIndicator(false);
    }
    async function getBreedCrumbApiCall() {
      let reqBody = {
        topic_num: payload?.topic_num,
        camp_num: payload?.camp_num,
      };
      console.log("request body 2222===============>", reqBody);
      let res = await getCampBreadCrumbApi(reqBody);
      console.log("res of breed camp====>", res);
    }

    if (isTopicPage) {
      getTreeApiCall();
    } else {
      getBreedCrumbApiCall();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    asofdate,
    algorithm,
    isTopicPage ? +router?.query?.camp[1]?.split("-")[0] : "",
  ]);

  useEffect(() => {
    console.log("useeffect1");
    if (isTopicPage) {
      if (didMount.current) {
        setCampSubscriptionID(campRecord?.subscriptionId);
        setTopicSubscriptionID(topicRecord?.topicSubscriptionId);
      } else didMount.current = true;
    }
  }, [campRecord?.subscriptionId, topicRecord?.topicSubscriptionId]);

  const onCampForumClick = () => {
    const topicName = topicRecord?.topic_name.replaceAll(" ", "-");
    const campName = campRecord?.camp_name.replaceAll(" ", "-");
    router.push({
      pathname: `/forum/${topicRecord?.topic_num}-${topicName}/${campRecord?.camp_num}-${campName}/threads`,
    });
  };

  const campOrTopicScribe = (isTopic: Boolean) => {
    const reqBody = {
      topic_num: campRecord.topic_num,
      camp_num: isTopic ? 0 : campRecord.camp_num,
      checked: isTopic ? !topicSubscriptionID : !campSubscriptionID,
      subscription_id: isTopic ? topicSubscriptionID : campSubscriptionID,
    };
    subscribeToCampApi(reqBody, isTopic);
  };

  const campForumDropdownMenu = (
    <Menu className={styles.campForumDropdownMenu}>
      <Menu.Item key="0" icon={<i className="icon-newspaper"></i>}>
        <Link
          href={isLogin ? router.asPath.replace("topic", "addnews") : "/login"}
        >
          <a rel="noopener noreferrer" href="/add-news">
            Add News
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={
          <i
            className={`icon-subscribe ${
              !!topicSubscriptionID && "text-primary"
            }`}
          ></i>
        }
        onClick={() => {
          if (isLogin) {
            campOrTopicScribe(true);
          } else {
            payload?.setLoadingIndicator(true);
            router.push("/login");
          }
          // campOrTopicScribe(true)
        }}
      >
        {!!topicSubscriptionID
          ? " Unsubscribe to Entire Topic"
          : " Subscribe to Entire Topic"}
      </Menu.Item>
      <Menu.Item
        icon={
          <i
            className={`icon-subscribe ${
              !!campSubscriptionID && "text-primary"
            }`}
          ></i>
        }
        disabled={!!campSubscriptionID && campRecord?.flag == 2 ? true : false}
        onClick={
          () => {
            if (isLogin) {
              campOrTopicScribe(false);
            } else {
              payload?.setLoadingIndicator(true);
              router.push("/login");
            }
          }

          // campOrTopicScribe(false)
        }
      >
        {!!campSubscriptionID && campRecord?.flag !== 2 ? (
          "Unsubscribe to the Camp"
        ) : !!campSubscriptionID && campRecord?.flag == 2 ? (
          <Tooltip
            title={`You are subscribed to ${campRecord?.subscriptionCampName}`}
          >
            Subscribe to the Camp
          </Tooltip>
        ) : (
          "Subscribe to the Camp"
        )}
      </Menu.Item>
      <Menu.Item icon={<HeartOutlined />}>Directly Join and Support </Menu.Item>
      <Menu.Item icon={<i className="icon-camp"></i>}>
        Manage/Edit the Camp
      </Menu.Item>
      <Menu.Item icon={<i className="icon-topic"></i>}>
        Manage/Edit the Topic
      </Menu.Item>
      <Menu.Item icon={<FileTextOutlined />}>
        {K?.exceptionalMessages?.manageCampStatementButton}
      </Menu.Item>
    </Menu>
  );
  console.log("payload 222=> ", payload);
  //   console.log(" topicRecord ", topicRecord),
  //   console.log("  campRecord", campRecord),
  //   console.log("campStatement", campStatement);
  // console.log(
  //   "route=>1 ",
  //   campRecord?.parentCamps?.map((camp, index) => {
  //     console.log(
  //       "data=>",
  //       router.query?.camp?.at(0),
  //       "/",
  //       camp?.camp_num,
  //       "-",
  //       camp?.camp_name
  //     );
  //   })
  // );

  // console.log("change path ", +router?.query?.camp[1]?.split("-")[0]);

  // console.log("initial path ", router?.query);
  return (
    <>
      <div className={styles.topicDetailContentHead}>
        <div className={styles.topicDetailContentHead_Left}>
          <Typography.Paragraph className={"mb-0 " + styles.topicTitleStyle}>
            {" "}
            <span className="bold"> Topic: </span>
            {topicRecord && topicRecord?.topic_name}{" "}
            {!!topicSubscriptionID && (
              <small>
                <i className="icon-subscribe text-primary"></i>
              </small>
            )}
          </Typography.Paragraph>
          <div className={styles.breadcrumbLinks}>
            {" "}
            <span className="bold mr-1"> Camp : </span>
            {campRecord
              ? campRecord.parentCamps?.map((camp, index) => {
                  return (
                    <Link
                      href={`${router.query?.camp?.at(0)}/${
                        camp?.camp_num
                      }-${camp?.camp_name?.split(" ").join("-")}`}
                      key={camp?.camp_num}
                    >
                      <a>
                        {index !== 0 && "/ "}
                        {`${camp?.camp_name}`}
                      </a>
                    </Link>
                  );
                })
              : null}
            {!!campSubscriptionID && (
              <small style={{ alignSelf: "center", marginLeft: "10px" }}>
                <i className="icon-subscribe text-primary"></i>
              </small>
            )}
          </div>
        </div>

        <div className={styles.topicDetailContentHead_Right}>
          {isTopicPage && (
            <>
              <Button
                type="primary"
                className={styles.btnCampForum}
                onClick={onCampForumClick}
              >
                Camp Forum
              </Button>
              <Dropdown
                className={styles.campForumDropdown}
                placement="bottomRight"
                overlay={campForumDropdownMenu}
                trigger={["click"]}
              >
                <a
                  className={styles.iconMore}
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreOutlined />
                </a>
              </Dropdown>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CampInfoBar;
