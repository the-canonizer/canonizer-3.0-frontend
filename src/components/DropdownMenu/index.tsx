import {
  FileTextOutlined,
  HeartOutlined,
  PrinterOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { Menu, Tooltip } from "antd";
import Link from "next/link";
import { RootState } from "src/store";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAuthentication from "src/hooks/isUserAuthenticated";
import { getTreesApi, subscribeToCampApi } from "src/network/api/campDetailApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import K from "src/constants";
import CodeIcon from "components/shared/TopicOptions/codeIcon";
import GenerateModal from "components/common/generateScript";
import {
  setManageSupportStatusCheck,
  setManageSupportUrlLink,
  setOpenDrawerForManageSupport,
} from "src/store/slices/campDetailSlice";
import { setIsSupportModal } from "src/store/slices/topicSlice";
import { showLoginModal } from "src/store/slices/uiSlice";
import styles from "../ComponentPages/TopicDetails/topicDetails.module.scss";

const DropDownMenu = () => {
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
    currentGetCheckSupportExistsData,
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
    currentGetCheckSupportExistsData:
      state.topicDetails.currentGetCheckSupportExistsData,
  }));
  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );
  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );
  const didMount = useRef(false);

  const eventLinePath = () => {
    router?.push(router?.asPath.replace("topic", "eventline"));
  };
  const router = useRouter();
  let payload = history && {
    camp_num: router?.query?.camp?.at(1)?.split("-")?.at(0) ?? "1",
    topic_num: router?.query?.camp?.at(0)?.split("-")?.at(0),
  };
  const { isUserAuthenticated } = useAuthentication();
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
  const onPrintCamp = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    onPrint();

    setTimeout(() => {
      window.focus();
      window.print();
    }, 100);
  };
  useEffect(() => {
    window.onbeforeprint = () => onPrint();
  }, []);
  const dispatch = useDispatch();
  const onPrint = () => {
    const hiddenElem = document.querySelector(".currentCampRecords"),
      insideDiv = hiddenElem?.querySelector(".ant-collapse-item"),
      header: any = hiddenElem?.querySelector(".ant-collapse-header");

    if (!insideDiv?.classList?.contains("ant-collapse-item-active")) {
      header?.click();
    }

    setTimeout(() => {
      if (insideDiv?.classList?.contains("ant-collapse-item-active")) {
        header?.click();
      }
    }, 5000);
  };
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
      dispatch(setOpenDrawerForManageSupport(true));
    }
  };
  let isTopicPage = router?.pathname?.split("/")[1];
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

  const getButtonLabel = () => {
    if (!campStatement || campStatement.length === 0) {
      return K?.exceptionalMessages?.addCampStatementButton;
    } 
    const statement = campStatement[0];
  
    if (statement?.draft_record_id) {
      return "Edit Draft Statement";
    }
    if (statement?.parsed_value || statement?.grace_period_record_count > 0 || statement?.in_review_changes > 0 ) {
      return K?.exceptionalMessages?.manageCampStatementButton;
    }
    return K?.exceptionalMessages?.addCampStatementButton;
  };

  const getCreateCampUr = () => {
    const campQuery = router?.query?.camp;
    const manageSupportQuery = router?.query?.manageSupport;

    const firstValue = campQuery ? campQuery[0] : manageSupportQuery?.[0];
    const secondValue = campQuery
      ? campQuery[1] ?? "1-Agreement"
      : manageSupportQuery?.[1];

    if (campStatement?.length > 0) {
      const draftRecordId = campStatement[0]?.draft_record_id;
      const parsedValue = campStatement[0]?.parsed_value;

      if (draftRecordId) {
        return `/manage/statement/${draftRecordId}?is_draft=1`;
      } else if (parsedValue || campStatement?.at(0)?.grace_period_record_count>0 || campStatement?.at(0)?.in_review_changes > 0) {
        return `/statement/history/${replaceSpecialCharacters(
          firstValue,
          "-"
        )}/${replaceSpecialCharacters(secondValue, "-")}`;
      }
    }

    // Fallback for creating a statement if no draft or parsed value
    return `/create/statement/${replaceSpecialCharacters(
      firstValue,
      "-"
    )}/${replaceSpecialCharacters(secondValue, "-")}`;
  };

  return (
    <div>
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
                !!topicSubscriptionID && "!text-canBlue"
              }`}
            ></i>
          }
          onClick={() => {
            if (isUserAuthenticated) {
              campOrTopicScribe(true);
            } else {
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
                !!campSubscriptionID && "!text-canBlue"
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
            <Link
              href={isUserAuthenticated ? "#" : "/login"}
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
              }}
              passHref
            >
              <div
                className="topicDetailsCollapseFooter"
                onClick={(e) => {
                  if (isUserAuthenticated) {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleClickSupportCheck();
                  }
                }}
                style={{
                  pointerEvents:
                    asof == "bydate" || campRecord?.is_archive ? "none" : "all",
                }}
              >
                {isUserAuthenticated
                  ? currentGetCheckSupportExistsData?.is_delegator == 1 ||
                    currentGetCheckSupportExistsData?.support_flag != 1
                    ? K?.exceptionalMessages?.addSupport
                    : K?.exceptionalMessages?.manageSupport
                  : K?.exceptionalMessages?.directJoinSupport}
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
        <Menu.Item
          icon={<FileTextOutlined />}
          disabled={campRecord?.is_archive}
        >
          {isTopicPage && (
            <Link href={getCreateCampUr()}>
              <a>{getButtonLabel()}</a>
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
    </div>
  );
};

export default DropDownMenu;
