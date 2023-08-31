import { Spin, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTreesApi,
  subscribeToCampApi,
} from "../../../../network/api/campDetailApi";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import { Dropdown, Menu, Button } from "antd";
import K from "../../../../constants";
import moment from "moment";
import CustomSkelton from "../../../common/customSkelton";

import { setManageSupportStatusCheck } from "../../../../store/slices/campDetailSlice";

import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import { getCampBreadCrumbApi } from "../../../../network/api/campDetailApi";
import {
  MoreOutlined,
  FileTextOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  replaceSpecialCharacters,
  isServer,
} from "../../../../utils/generalUtility";
import SocialShareUI from "../../../common/socialShare";
import GenerateModal from "src/components/common/generateScript";

const CodeIcon = () => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#000000"
  >
    <rect x="8" y="12" width="48" height="40" />
    <polyline points="40 40 48 32 40 24" />
    <polyline points="24 24 16 32 24 40" />
    <line x1="34" y1="22" x2="30" y2="42" />
  </svg>
);

const InfoBar = ({
  payload = null,
  isTopicPage = false,
  // isTopicHistoryPage = false,
  getCheckSupportStatus = null,
  onCreateCamp = () => {},
}: any) => {
  const { isUserAuthenticated } = useAuthentication();

  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [payloadData, setPayloadData] = useState(payload);
  const [breadCrumbRes, setBreadCrumbRes] = useState({
    topic_name: "",
    bread_crumb: [],
  });
  const [isCampBtnVisible, setIsCampBtnVisible] = useState(false);
  const didMount = useRef(false);
  const router = useRouter();

  const {
    topicRecord,
    campRecord,
    is_admin,
    history,
    asofdate,
    asof,
    algorithm,
    currentCampNode,
    tree,
    campExist,
  } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    is_admin: state?.auth?.loggedInUser?.is_admin,
    history: state?.topicDetails?.history,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    asof: state?.filters?.filterObject?.asof,
    currentCampNode: state?.filters?.selectedCampNode,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
  }));

  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );
  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );
  useEffect(() => {
    setPayloadData(payload);
    async function getBreadCrumbApiCall() {
      setLoadingIndicator(true);
      let reqBody = {
        topic_num: payload?.topic_num,
        camp_num: payload?.camp_num,
        as_of: router?.pathname == "/topic/[...camp]" ? asof : "default",
        as_of_date:
          asof == "default" || asof == "review"
            ? Date.now() / 1000
            : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
      };
      let res = await getCampBreadCrumbApi(reqBody);
      setBreadCrumbRes(res?.data);
      setLoadingIndicator(false);
    }
    if (payload && Object.keys(payload).length > 0) {
      getBreadCrumbApiCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.asPath, asofdate]);

  useEffect(() => {
    if (isTopicPage) {
      if (didMount.current) {
        setCampSubscriptionID(campRecord?.subscriptionId);
        setTopicSubscriptionID(topicRecord?.topicSubscriptionId);
      } else didMount.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campRecord?.subscriptionId, topicRecord?.topicSubscriptionId]);

  useEffect(() => {
    if (isTopicPage) {
      dispatch(setManageSupportStatusCheck(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickSupportCheck = () => {
    dispatch(setManageSupportStatusCheck(true));
  };

  const onCampForumClick = () => {
    // const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    // const campName = campRecord?.camp_name?.replaceAll(" ", "-");
    router?.push({
      pathname: `/forum/${router?.query?.camp[0]}/${router?.query?.camp[1]}/threads`,
    });
  };

  // const eventLinePath = () => {
  //   router?.push(router?.asPath.replace("topic", "eventline"));
  // };
  // const eventLinePath2 = () => {
  //   router.push(router.asPath.replace("support", "eventline"));
  // };

  const campOrTopicScribe = async (isTopic: Boolean) => {
    const reqBodyForService = {
      topic_num: +router?.query?.camp?.[0]?.split("-")[0],
      camp_num: +(router?.query?.camp?.[1]?.split("-")[0] ?? 1),
      asOf: asof,
      asofdate:
        asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
      algorithm: algorithm,
      update_all: 1,
    };
    const reqBody = {
      topic_num: campRecord.topic_num ?? payload?.topic_num,
      camp_num: isTopic ? 0 : campRecord.camp_num,
      checked: isTopic ? !topicSubscriptionID : !campSubscriptionID,
      subscription_id: isTopic ? topicSubscriptionID : campSubscriptionID,
    };
    let result = await subscribeToCampApi(reqBody, isTopic);
    if (result?.status_code === 200) {
      getTreesApi(reqBodyForService);
    }
  };
  const campForumDropdownMenu = (
    <Menu className={styles.campForumDropdownMenu}>
      {isUserAuthenticated && is_admin && (
        <Menu.Item key="0" icon={<i className="icon-newspaper"></i>}>
          {router?.pathname == "/support/[...manageSupport]" ? (
            <Link href={router?.asPath.replace("support", "addnews")}>
              <a rel="noopener noreferrer" href="/add-news">
                Add News
              </a>
            </Link>
          ) : (
            <Link href={router?.asPath.replace("topic", "addnews")}>
              <a rel="noopener noreferrer" href="/add-news">
                Add News
              </a>
            </Link>
          )}
        </Menu.Item>
      )}
      <Menu.Item
        icon={
          <i
            className={`icon-subscribe ${
              !!topicSubscriptionID && "text-primary"
            }`}
          ></i>
        }
        onClick={() => {
          if (isUserAuthenticated) {
            campOrTopicScribe(true);
          } else {
            setLoadingIndicator(true);
            router?.push({
              pathname: "/login",
              query: { returnUrl: router?.asPath },
            });
          }
        }}
      >
        {topicSubscriptionID
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
        disabled={
          (!!campSubscriptionID && campRecord?.flag == 2) ||
          campRecord?.length == 0
            ? true
            : false
        }
        onClick={() => {
          if (isUserAuthenticated) {
            campOrTopicScribe(false);
          } else {
            setLoadingIndicator(true);
            router?.push({
              pathname: "/login",
              query: { returnUrl: router?.asPath },
            });
          }
        }}
      >
        {!!campSubscriptionID && campRecord?.flag !== 2 ? (
          "Unsubscribe to the Camp"
        ) : !!campSubscriptionID && campRecord?.flag == 2 ? (
          <Tooltip
            title={`You are subscribed to ${campRecord?.subscriptionCampName}`}
          >
            Subscribe to the Camp
          </Tooltip>
        ) : campRecord?.length == 0 ? (
          <Tooltip
            title={`You can't modify history, please go to the current state. `}
          >
            Subscribe to the Camp
          </Tooltip>
        ) : (
          "Subscribe to the Camp"
        )}
      </Menu.Item>
      <Menu.Item
        icon={<HeartOutlined />}
        disabled={asof == "bydate" || campRecord?.is_archive}
      >
        {isTopicPage && (
          <Link href={router?.asPath?.replace("/topic/", "/support/")}>
            <a>
              <div
                className="topicDetailsCollapseFooter"
                onClick={handleClickSupportCheck}
              >
                {/* {K?.exceptionalMessages?.directJoinSupport} */}
                {getCheckSupportStatus?.is_delegator == 1 ||
                getCheckSupportStatus?.support_flag != 1
                  ? K?.exceptionalMessages?.directJoinSupport
                  : K?.exceptionalMessages?.manageSupport}
              </div>
            </a>
          </Link>
        )}
      </Menu.Item>
      {/* {isCampBtnVisible &&
      currentCampNode?._isDisabled == 0 &&
      currentCampNode?.parentIsOneLevel == 0 &&
      campRecord?.is_archive == 0 ? (
        <Tooltip
          title={
            tree && !tree["1"]?.is_valid_as_of_time
              ? K.exceptionalMessages.createNewCampTooltipMsg
              : ""
          }
        >
          <Menu.Item
            icon={<i className="icon-camp"></i>}
            className={styles.createCampBtn}
            onClick={onCreateCamp}
            disabled={
              (tree && !tree["1"]?.is_valid_as_of_time) ||
              (campExist && !campExist?.camp_exist)
                ? true
                : false
            }
            key="create-camp-btn"
          >
            Create New Camp
          </Menu.Item>
        </Tooltip>
      ) : null} */}
      <Menu.Item icon={<i className="icon-camp"></i>}>
        {isTopicPage && (
          <Link
            href={`/camp/history/${replaceSpecialCharacters(
              router?.query?.camp
                ? router?.query?.camp[0]
                : router?.query?.manageSupport?.at(0),
              "-"
            )}/${replaceSpecialCharacters(
              router?.query?.camp
                ? router?.query?.camp[1] ?? "1-Agreement"
                : router?.query?.manageSupport?.at(1),
              "-"
            )}`}
          >
            <a>{K?.exceptionalMessages?.manageCampButton}</a>
          </Link>
        )}
      </Menu.Item>
      <Menu.Item icon={<i className="icon-topic"></i>}>
        {isTopicPage && (
          <Link
            href={`/topic/history/${replaceSpecialCharacters(
              router?.query?.camp
                ? router?.query?.camp[0]
                : router?.query?.manageSupport?.at(0),
              "-"
            )}`}
          >
            <a>{K?.exceptionalMessages?.manageTopicButton} </a>
          </Link>
        )}
      </Menu.Item>
      <Menu.Item icon={<FileTextOutlined />} disabled={campRecord?.is_archive}>
        {isTopicPage && (
          <Link
            href={
              history?.items?.length > 0
                ? `/statement/history/${replaceSpecialCharacters(
                    router?.query?.camp
                      ? router?.query?.camp[0]
                      : router?.query?.manageSupport[0],
                    "-"
                  )}/${replaceSpecialCharacters(
                    router?.query?.camp
                      ? router?.query?.camp[1] ?? "1-Agreement"
                      : router?.query?.manageSupport[1],
                    "-"
                  )}`
                : `/create/statement/${replaceSpecialCharacters(
                    router?.query?.camp
                      ? router?.query?.camp[0]
                      : router?.query?.manageSupport?.at(0),
                    "-"
                  )}/${replaceSpecialCharacters(
                    router?.query?.camp
                      ? router?.query?.camp[1] ?? "1-Agreement"
                      : router?.query?.manageSupport?.at(1),
                    "-"
                  )}`
            }
          >
            <a>
              {history?.items?.length > 0
                ? K?.exceptionalMessages?.manageCampStatementButton
                : K?.exceptionalMessages?.addCampStatementButton}
            </a>
          </Link>
        )}
      </Menu.Item>
      <Menu.Item
        icon={
          <span className={styles.svgIconCode}>
            <CodeIcon />
          </span>
        }
      >
        {isTopicPage && (
          <GenerateModal
            topic_num={payload?.topic_num}
            camp_num={payload?.camp_num}
          />
        )}
      </Menu.Item>
    </Menu>
  );

  // const campRoute = () => {
  //   router?.push("/create/topic");
  // };
  useEffect(() => {
    if (router?.pathname.includes("/topic/")) {
      // setIsPanelCollapse(true);
      setIsCampBtnVisible(true);
    }
  }, [router?.pathname]);

  return (
    <>
      <div
        className={`${styles.topicDetailContentHead} ${styles.inforBarHEad}`}
      >
        <Spin spinning={false}>
          <div
            className={`${styles.topicDetailContentHead_Left} ${styles.rightPanel}`}
          >
            <div className="btnsWrap">
              {/* <Button size="large" className="mb-3 btn" onClick={campRoute}>
                <i className="icon-topic"></i> Create Topic
              </Button> */}
              {isCampBtnVisible &&
              currentCampNode?._isDisabled == 0 &&
              currentCampNode?.parentIsOneLevel == 0 &&
              campRecord?.is_archive == 0 ? (
                <Tooltip
                  title={
                    tree && !tree["1"]?.is_valid_as_of_time
                      ? K.exceptionalMessages.createNewCampTooltipMsg
                      : ""
                  }
                >
                  <Button
                    className="btn"
                    size="large"
                    disabled={
                      (tree && !tree["1"]?.is_valid_as_of_time) ||
                      (campExist && !campExist?.camp_exist)
                        ? true
                        : false
                    }
                    onClick={onCreateCamp}
                  >
                    <i className="icon-camp"></i> Create New Camp
                  </Button>
                </Tooltip>
              ) : null}
            </div>
            <div
              className={`${styles.topicDetailContentHead_Right} ${styles.leftPanel}`}
            >
              <Typography.Paragraph
                className={"mb-0 campInfoRight " + styles.topicTitleStyle}
              >
                {isTopicPage && (
                  <Fragment>
                    {loadingIndicator ? (
                      <>
                        <div className="socail-skeleton mr-3">
                          <CustomSkelton
                            skeltonFor="list"
                            bodyCount={1}
                            stylingClass="skeleton-item"
                            isButton={false}
                            circle={true}
                          />
                          <CustomSkelton
                            skeltonFor="list"
                            bodyCount={1}
                            stylingClass="skeleton-item"
                            isButton={false}
                            circle={true}
                          />
                          <CustomSkelton
                            skeltonFor="list"
                            bodyCount={1}
                            stylingClass="skeleton-item"
                            isButton={false}
                            circle={true}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="cam-social-ot">
                        <SocialShareUI
                          campName={campRecord?.camp_name}
                          campUrl={!isServer() && window?.location?.href}
                        />
                      </div>
                    )}
                    {loadingIndicator ? (
                      <CustomSkelton
                        skeltonFor="list"
                        bodyCount={1}
                        stylingClass="header-skeleton-btn"
                        // stylingClass="skeleton-item"
                        isButton={false}
                      />
                    ) : (
                      <>
                        <Button
                          type="primary"
                          className={styles.btnCampForum}
                          onClick={onCampForumClick}
                          id="camp-forum-btn"
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
                  </Fragment>
                )}
              </Typography.Paragraph>
            </div>
          </div>
        </Spin>
      </div>
    </>
  );
};

export default InfoBar;
