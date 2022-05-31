import { Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { subscribeToCampApi } from "src/network/api/campDetailApi";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import { Dropdown, Menu, Button } from "antd";

import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import {
  MoreOutlined,
  FileTextOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const CampInfoBar = ({
  setLoadingIndicator,
  campSubscriptionID,
  topicSubscriptionID,
}) => {
  const isLogin = useAuthentication();

  const router = useRouter();
  const dispatch = useDispatch();
  const { topicRecord, campRecord } = useSelector((state: RootState) => ({
    asof: state?.filters?.filterObject?.asof,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

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
            setLoadingIndicator(true);
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
              setLoadingIndicator(true);
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
        Manage/Edit Camp Statement{" "}
      </Menu.Item>
    </Menu>
  );
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
                      href={`${router.query.camp.at(0)}/${
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
            <a className={styles.iconMore} onClick={(e) => e.preventDefault()}>
              <MoreOutlined />
            </a>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default CampInfoBar;
