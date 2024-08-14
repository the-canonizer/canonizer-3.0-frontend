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
import CustomSkelton from "../../../common/customSkelton";

import {
  setManageSupportStatusCheck,
  setManageSupportUrlLink,
  // setOpenConsensusTreePopup,
  setOpenDrawer,
} from "../../../../store/slices/campDetailSlice";
import { setOpenConsensusTreePopup } from "../../../../store/slices/hotTopicSlice";
import useAuthentication from "../../../../../src/hooks/isUserAuthenticated";
import {
  MoreOutlined,
  FileTextOutlined,
  HeartOutlined,
  PrinterOutlined,
  StockOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  replaceSpecialCharacters,
  isServer,
} from "../../../../utils/generalUtility";
import SocialShareUI from "../../../common/socialShare";
import GenerateModal from "src/components/common/generateScript";
import { setIsSupportModal } from "src/store/slices/topicSlice";
import { showLoginModal } from "src/store/slices/uiSlice";
import RefineFilter from "../../RefineFilter";
import LatestFilter from "../../LatestFilter";
import Image from "next/image";
import CampDisclaimer from "../../../common/CampDisclaimer";

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
  getCheckSupportStatus = null,
  onCreateCamp = () => {},
}: any) => {
  const { isUserAuthenticated } = useAuthentication();

  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [isCampBtnVisible, setIsCampBtnVisible] = useState(false);
  const didMount = useRef(false);
  const router = useRouter();

  const {
    topicRecord,
    campRecord,
    is_admin,
    asofdate,
    asof,
    algorithm,
    currentCampNode,
    tree,
    campExist,
    campStatement,
    selectedAlgorithm,
    is_camp_archive_checked,
    filteredScore,
    includeReview,
    is_checked,
    selectedAsOf,
    algorithms,
  } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    is_admin: state?.auth?.loggedInUser?.is_admin,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    asof: state?.filters?.filterObject?.asof,
    currentCampNode: state?.filters?.selectedCampNode,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
    campStatement: state?.topicDetails?.campStatement,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    is_camp_archive_checked: state?.utils?.archived_checkbox,
    includeReview: state?.filters?.filterObject?.includeReview,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    is_checked: state?.utils?.score_checkbox,
    selectedAsOf: state?.filters?.filterObject?.asof,
    algorithms: state.homePage?.algorithms,
  }));

  const { manageSupportStatusCheck } = useSelector((state: RootState) => ({
    manageSupportStatusCheck: state.topicDetails.manageSupportStatusCheck,
  }));
  const isMobile = window.matchMedia("(min-width: 1280px)").matches;
  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );

  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );
  const { openConsensusTreePopup } = useSelector((state: RootState) => ({
    openConsensusTreePopup: state.hotTopic.openConsensusTreePopup,
  }));
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

  const manageSupportPath = router?.asPath.replace("/topic/", "/support/");

  const handleClickSupportCheck = () => {
    dispatch(setManageSupportUrlLink(manageSupportPath));
    dispatch(setManageSupportStatusCheck(true));
    if (!isUserAuthenticated) {
      dispatch(setIsSupportModal(false));
      dispatch(showLoginModal());
    } else if (isUserAuthenticated && asof == "bydate") {
      dispatch(setIsSupportModal(false));
    } else if (isUserAuthenticated && campRecord?.is_archive) {
      dispatch(setIsSupportModal(false));
    } else {
      dispatch(setIsSupportModal(true));
    }
  };

  const onCampForumClick = () => {
    router?.push({
      pathname: `/forum/${router?.query?.camp[0]}/${
        router?.query?.camp[1] || "1"
      }/threads`,
    });
  };

  const eventLinePath = () => {
    router?.push(router?.asPath.replace("topic", "eventline"));
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

  const onPrint = () => {
    const hiddenElem = document.querySelector(".currentCampRecords"),
      insideDiv = hiddenElem?.querySelector(".ant-collapse-item"),
      header: any = hiddenElem?.querySelector(".ant-collapse-header");

    if (!insideDiv?.classList?.contains("ant-collapse-item-active")) {
      header.click();
    }

    setTimeout(() => {
      if (insideDiv?.classList?.contains("ant-collapse-item-active")) {
        header.click();
      }
    }, 5000);
  };

  useEffect(() => {
    window.onbeforeprint = () => onPrint();
  }, []);

  const onPrintCamp = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    onPrint();

    setTimeout(() => {
      window.focus();
      window.print();
    }, 100);
  };
  const showDrawer = () => {
    dispatch(setOpenDrawer(true));
  };
  const showConsensusTree = () => {
    dispatch(setOpenConsensusTreePopup(!openConsensusTreePopup));
  };
  const campForumDropdownMenu = (
    <Menu className={styles.campForumDropdownMenu}>
      <Menu.Item
        icon={
          <span className={styles.svgIconCode}>
            <StockOutlined />
          </span>
        }
      >
        {isTopicPage && (
          <a onClick={eventLinePath}>
            <span>Event Line</span>
          </a>
        )}
      </Menu.Item>
      {isUserAuthenticated && is_admin && (
        <Menu.Item key="0" icon={<i className="icon-newspaper"></i>}>
          {router?.pathname == "/support/[...manageSupport]" ? (
            <Link href={router?.asPath.replace("support", "addnews")}>
              Add News
            </Link>
          ) : (
            <Link href={router?.asPath.replace("topic", "addnews")}>
              Add News
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
        disabled={
          asof == "bydate" || campRecord?.is_archive || !isUserAuthenticated
        }
      >
        {isTopicPage && (
          <Link
            href="#"
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
            }}
            passHref
          >
            <div
              className="topicDetailsCollapseFooter"
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                handleClickSupportCheck();
              }}
              style={{
                pointerEvents:
                  asof == "bydate" || campRecord?.is_archive ? "none" : "all",
              }}
            >
              {getCheckSupportStatus?.is_delegator == 1 ||
              getCheckSupportStatus?.support_flag != 1
                ? K?.exceptionalMessages?.directJoinSupport
                : K?.exceptionalMessages?.manageSupport}
            </div>
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
      <Menu.Item icon={<FileTextOutlined />} disabled={campRecord?.is_archive}>
        {isTopicPage && !campStatement?.[0]?.draft_record_id && (
          <Link
            href={
              campStatement?.length > 0
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
              {campStatement?.length > 0
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
      <Menu.Item
        icon={
          <span className={styles.svgIconCode}>
            <PrinterOutlined />
          </span>
        }
      >
        {isTopicPage && (
          <a onClick={onPrintCamp}>
            <span>Print</span>
          </a>
        )}
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (router?.pathname.includes("/topic/")) {
      setIsCampBtnVisible(true);
    }
  }, [router?.pathname]);
  const lable = algorithms?.find((obj) => {
    return obj.algorithm_key == selectedAlgorithm;
  });
  return (
    <div
      className={`${styles.topicDetailContentHead} ${styles.inforBarHEad} printHIde`}
    >
      <Spin spinning={false}>
        <div
          className={`${styles.topicDetailContentHead_Left} ${styles.rightPanel}`}
        >
          <div className="btnsWrap w-full">
            {isCampBtnVisible &&
            currentCampNode?._isDisabled == 0 &&
            currentCampNode?.parentIsOneLevel == 0 &&
            (campRecord?.is_archive == 0 ||
              campRecord?.is_archive == undefined) ? (
              <Tooltip
                title={
                  tree && !tree["1"]?.is_valid_as_of_time
                    ? K.exceptionalMessages.createNewCampTooltipMsg
                    : ""
                }
              >
                <div>{!isMobile && <CampDisclaimer />}</div>
              </Tooltip>
            ) : null}
            <div className="flex lg:gap-6 gap-4  items-center lg:flex-nowrap flex-wrap lg:mb-5 mb-7">
              <Button
                onClick={showConsensusTree}
                className="xl:w-[277px] text-canBlack border border-canGrey2 py-2.5 lg:px-5 !h-[44px]  refine-btn  lg:!text-base !text-sm font-medium  flex items-center justify-between gap-2.5 rounded-lg   bg-canGray"
              >
                Consensus Tree
                <Image
                  src="/images/caret-icon.svg"
                  alt="svg"
                  height={7}
                  width={14}
                />
              </Button>
              <Button
                onClick={showDrawer}
                className="w-36hover:!text-canBlack gap-5 relative text-canBlack py-2.5 lg:px-5 h-[44px] rounded-lg w-auto  lg:text-base text-sm font-medium  flex items-center justify-center !border !border-canGrey2"
              >
                <span>Refine</span>
                <Image
                  src="/images/filter-con.svg"
                  alt="svg"
                  height={24}
                  width={24}
                />
                {(router.query.algo &&
                  selectedAlgorithm &&
                  lable?.algorithm_label !== undefined) ||
                is_camp_archive_checked ||
                is_checked ||
                selectedAsOf == "bydate" ||
                includeReview ||
                router?.query?.asof === "review" ||
                filteredScore != 0 ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-canRed absolute -top-1.5 -right-1.5"></div>
                ) : null}
              </Button>
              {(router.query.algo &&
                selectedAlgorithm &&
                lable?.algorithm_label !== undefined) ||
              is_camp_archive_checked ||
              is_checked ||
              selectedAsOf == "bydate" ||
              includeReview ||
              router?.query?.asof === "review" ||
              filteredScore != 0 ? (
                <LatestFilter />
              ) : null}
            </div>
          </div>
          <div
            className={`${styles.topicDetailContentHead_Right} ${styles.leftPanel}`}
          >
            <Typography.Paragraph
              className={"mb-0 campInfoRight " + styles.topicTitleStyle}
            >
              {isTopicPage && <RefineFilter />}
            </Typography.Paragraph>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default InfoBar;
