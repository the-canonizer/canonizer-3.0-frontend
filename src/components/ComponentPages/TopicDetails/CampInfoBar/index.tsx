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

const CampInfoBar = ({
  payload = null,
  isTopicPage = false,
  isTopicHistoryPage = false,
  getCheckSupportStatus = null,
}: any) => {
  const { isUserAuthenticated } = useAuthentication();

  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [payloadData, setPayloadData] = useState(payload);
  const [breadCrumbRes, setBreadCrumbRes] = useState({
    topic_name: "",
    bread_crumb: [],
  });
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
    viewThisVersionCheck,
  } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    is_admin: state?.auth?.loggedInUser?.is_admin,
    history: state?.topicDetails?.history,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    asof: state?.filters?.filterObject?.asof,
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
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
  }, [router, asofdate]);

  useEffect(() => {
    if (isTopicPage) {
      if (didMount.current) {
        setCampSubscriptionID(campRecord?.subscriptionId);
        setTopicSubscriptionID(topicRecord?.topicSubscriptionId);
      } else didMount.current = true;
    }
  }, [campRecord?.subscriptionId, topicRecord?.topicSubscriptionId]);

  useEffect(() => {
    if (isTopicPage) {
      dispatch(setManageSupportStatusCheck(false));
    }
  }, []);

  const handleClickSupportCheck = () => {
    dispatch(setManageSupportStatusCheck(true));
  };

  const onCampForumClick = () => {
    const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    const campName = campRecord?.camp_name?.replaceAll(" ", "-");
    router.push({
      pathname: `/forum/${topicRecord?.topic_num}-${replaceSpecialCharacters(
        topicName,
        "-"
      )}/${campRecord?.camp_num}-${replaceSpecialCharacters(
        campName,
        "-"
      )}/threads`,
    });
  };

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
          {router.pathname == "/support/[...manageSupport]" ? (
            <Link href={router.asPath.replace("support", "addnews")}>
              <a rel="noopener noreferrer" href="/add-news">
                Add News
              </a>
            </Link>
          ) : (
            <Link href={router.asPath.replace("topic", "addnews")}>
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
            router.push({
              pathname: "/login",
              query: { returnUrl: router.asPath },
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
            router.push({
              pathname: "/login",
              query: { returnUrl: router.asPath },
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
      <Menu.Item icon={<HeartOutlined />} disabled={asof == "bydate"}>
        {isTopicPage && (
          <Link href={router.asPath.replace("/topic/", "/support/")}>
            <a>
              <div
                className="topicDetailsCollapseFooter"
                onClick={handleClickSupportCheck}
              >
                {/* {K?.exceptionalMessages?.directJoinSupport} */}
                {getCheckSupportStatus?.support_flag == 1
                  ? K?.exceptionalMessages?.manageSupport
                  : K?.exceptionalMessages?.directJoinSupport}
              </div>
            </a>
          </Link>
        )}
      </Menu.Item>
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
      <Menu.Item icon={<FileTextOutlined />}>
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
    </Menu>
  );

  return (
    <>
      <div className={styles.topicDetailContentHead}>
        {/* {loadingIndicator ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={1}
            stylingClass=""
            isButton={false}
          /> */}

        <Spin spinning={false}>
          <div className={styles.topicDetailContentHead_Left}>
            <Typography.Paragraph
              className={
                "mb-0 " +
                `${
                  loadingIndicator
                    ? styles.topicTitleSkeleton
                    : styles.topicTitleStyle
                }`
              }
            >
              {" "}
              <span className="bold"> Topic : </span>
              {loadingIndicator ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="topic-skeleton"
                  isButton={false}
                />
              ) : isTopicHistoryPage ? (
                <>
                  {" "}
                  <Link
                    href={`/topic/${
                      payload?.topic_num
                    }-${replaceSpecialCharacters(
                      breadCrumbRes?.topic_name,
                      "-"
                    )}/1-Agreement`}
                  >
                    <a className={styles.boldBreadcrumb}>
                      {breadCrumbRes?.topic_name}
                    </a>
                  </Link>
                </>
              ) : (
                <span className={styles.boldBreadcrumb}>
                  {breadCrumbRes?.topic_name}
                </span>
              )}
              {"  "}
              {!!topicSubscriptionID && (
                <small>
                  <i className="icon-subscribe text-primary"></i>
                </small>
              )}
            </Typography.Paragraph>
            <div className={styles.breadcrumbLinks}>
              {" "}
              <Typography.Paragraph
                className={"mb-0 " + styles.topicTitleStyle}
              >
                <span className="bold mr-1">
                  {!isTopicHistoryPage ? "Camp :" : ""}{" "}
                </span>
                {loadingIndicator ? (
                  <CustomSkelton
                    skeltonFor="list"
                    bodyCount={1}
                    stylingClass="topic-skeleton"
                    isButton={false}
                  />
                ) : !isTopicHistoryPage ? (
                  breadCrumbRes ? (
                    breadCrumbRes?.bread_crumb?.map((camp, index) => {
                      return (
                        <Link
                          href={{
                            pathname: `/topic/${
                              payloadData?.topic_num
                            }-${replaceSpecialCharacters(
                              breadCrumbRes?.topic_name,
                              "-"
                            )}/${camp?.camp_num}-${replaceSpecialCharacters(
                              camp?.camp_name,
                              "-"
                            )}`,
                          }}
                          key={index}
                        >
                          <a>
                            <span className={styles.slashStyle}>
                              {" "}
                              {index !== 0 && "/"}{" "}
                            </span>
                            <span
                              className={
                                breadCrumbRes?.bread_crumb.length - 1 == index
                                  ? styles.greenIndicateText
                                  : styles.boldBreadcrumb
                              }
                            >{`${camp?.camp_name}`}</span>
                          </a>
                        </Link>
                      );
                    })
                  ) : (
                    "N/A"
                  )
                ) : null}
                {!!campSubscriptionID && !isTopicHistoryPage && (
                  <small style={{ alignSelf: "center", marginLeft: "10px" }}>
                    <i className="icon-subscribe text-primary"></i>
                  </small>
                )}
              </Typography.Paragraph>
            </div>
          </div>

          <div className={styles.topicDetailContentHead_Right}>
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
        </Spin>
      </div>
    </>
  );
};

export default CampInfoBar;
