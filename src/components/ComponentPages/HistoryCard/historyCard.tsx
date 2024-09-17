import {
  Badge,
  Button,
  Card,
  Checkbox,
  Collapse,
  Space,
  Tag,
  Tooltip,
  message,
  Modal,
} from "antd";

import {
  ExclamationCircleFilled,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuthentication from "src/hooks/isUserAuthenticated";
import HistoryCardDrawer from "./historyCardDrawer";
// import "./historyCard.scss";
import {
  setFilterCanonizedTopics,
  setViewThisVersion,
} from "src/store/slices/filtersSlice";
import { RootState } from "src/store";
import {
  agreeToChangeApi,
  changeCommitStatement,
  discardStatement,
  getChangeSupporters,
} from "src/network/api/history";
import { setChangeGoneLive } from "src/store/slices/campDetailSlice";
import Link from "next/link";
import moment from "moment";
import StatementHistory from "../HistoryContainer/Collapse/statementHistory";
import CampHistory from "../HistoryContainer/Collapse/campHistory";
import TopicHistory from "../HistoryContainer/Collapse/topicHistory";
import {
  convertToTime,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import HistoryComparison from "../HistoryContainer/Collapse/historyComparison";
import Timer from "../Timer";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import ObjectionDrawer from "./objectionDrawer";

const { Panel } = Collapse;

function HistoryCard({
  collapseKeys,
  userNickNameData,
  topicNamespaceId,
  campStatement,
  onSelectCompare,
  isDisabledCheck,
  changeAgree,
  changeDiscard,
  isChecked,
  setIsTreesApiCallStop,
  campHistoryItems,
  callManageCampApi,
  parentArchived,
  unarchiveChangeSubmitted,
  directarchived,
  compareMode = false,
  comparisonData = null,
  historyState = null,
  status = null,
  currentVersion = null,
  s1 = false,
  isMobileView = false,
  loadingIndicator = false,
  campStatementApiCall,
}: any) {
  const router = useRouter();
  const [commited, setCommited] = useState(false);
  const [isSelectChecked, setIsSelectChecked] = useState(false);
  const [collapseKey, setCollapseKey] = useState(collapseKeys);

  const [modal1Open, setModal1Open] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supporters, setSupporters] = useState([]);
  const [loadingChanges, setLoadingChanges] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerFor, setDrawerFor] = useState("");
  let drawerOptions = {
    topicObjection: "topicObjection",
    campObjection: "campObjection",
    statementObjection: "statementObjection",
  };
  const manageFor = router?.asPath?.split("/")?.at(1);

  const dispatch = useDispatch();
  const { isUserAuthenticated } = useAuthentication();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setDrawerFor("");
  };
  const handleViewThisVersion = (goLiveTime) => {
    setIsTreesApiCallStop(true);
    dispatch(setViewThisVersion(true));
    dispatch(
      setFilterCanonizedTopics({
        asofdate: goLiveTime,
        asof: "bydate",
      })
    );
  };
  const { algorithm, namespace_id, changeGoneLive } = useSelector(
    (state: RootState) => ({
      algorithm: state.filters?.filterObject?.algorithm,
      namespace_id: state.filters?.filterObject?.namespace_id,
      changeGoneLive: state?.topicDetails?.changeGoneLive,
    })
  );
  const historyOf = router?.asPath.split("/")[1];

  const getStatusClass = (status: any) => {
    switch (status) {
      case "live":
        return "live-wrapper";
      case "in_review":
        return "pending-wrapper";
      case "objected":
        return "objected-wrapper";
      case "old":
        return "previous-wrapper";
      default:
        return "";
    }
  };

  const commitChanges = async () => {
    setLoadingChanges(true);
    let reqBody = {
      type: historyOf,
      id: campStatement?.id,
      old_parent_camp_num: campStatement?.old_parent_camp_num ?? null,
      parent_camp_num: campStatement?.parent_camp_num ?? null,
    };

    let res = await changeCommitStatement(reqBody);
    if (res?.status_code === 200) {
      setCommited(true);
      dispatch(setChangeGoneLive(!changeGoneLive));
    }
    changeAgree();
    setLoadingChanges(false);
    // await getTreesApi(reqBodyForService);
  };

  const discardChanges = async () => {
    setLoadingChanges(true);
    let reqBody = {
      type: historyOf,
      id: campStatement?.id,
    };
    let res = await discardStatement(reqBody);
    if (res?.status_code === 200) {
      setCommited(true);
    }
    changeDiscard();
    setLoadingChanges(false);
  };

  const agreeWithChange = async () => {
    setLoadingChanges(true);
    setIsSelectChecked(true);
    let reqBody = {
      record_id: campStatement.id,
      topic_num: router?.query.camp?.at(0).split("-")?.at(0),
      camp_num:
        historyOf == "topic"
          ? 1
          : router?.query.camp && router?.query.camp?.at(1)?.split("-")?.at(0),
      change_for: historyOf,
      nick_name_id: userNickNameData?.at(0)?.id,
      user_agreed: campStatement?.agreed_to_change ? 0 : 1,
    };
    let res = await agreeToChangeApi(reqBody);
    if (res?.status_code == 200) {
      dispatch(setChangeGoneLive(!changeGoneLive));
      res?.data?.is_submitted
        ? message.success(res?.message)
        : message?.error(res?.message);
      setIsSelectChecked(false);
    }

    changeAgree();
    setLoadingChanges(false);
  };

  const submitUpdateRedirect = (historyOf: string) => {
    if (!isUserAuthenticated) {
      router?.push({
        pathname: "/login",
        query: { returnUrl: `/manage/${historyOf}/${campStatement?.id}` },
      });
    } else {
      router?.push(`/manage/${historyOf}/${campStatement?.id}`);
    }
  };

  const cancelConfirm = () => {
    Modal.confirm({
      title: "Do you want to discard this commit?",
      icon: <ExclamationCircleFilled />,
      content:
        "Please note that any unsaved changes will be lost if you cancel.",
      onOk() {
        discardChanges();
      },
    });
  };

  const objectionHandler = () => {
    showDrawer();
    if (manageFor == "topic") {
      setDrawerFor(drawerOptions.topicObjection);
    } else if (manageFor == "camp") {
      setDrawerFor(drawerOptions.campObjection);
    } else if (manageFor == "statement") {
      setDrawerFor(drawerOptions.statementObjection);
    }
  };

  return (
    <div
      className={`${compareMode ? "" : "csh-wrapper"} cn-wrapper ${
        compareMode
          ? getStatusClass(status)
          : getStatusClass(campStatement?.status)
      }`}
    >
      <div className="badge-wrapper">
        {!isMobileView && (
          <Badge
            className="cn-dot-badge ch-dot-history"
            color=""
            text={
              <>
                {compareMode ? (
                  <>
                    {currentVersion && "Current Version -"}
                    {convertToTime(comparisonData?.submit_time)
                      .split(",")
                      ?.at(0)}
                    ,
                    <span>
                      {" "}
                      {convertToTime(comparisonData?.submit_time)
                        .split(",")
                        ?.at(1)}
                    </span>
                  </>
                ) : (
                  <>
                    {campStatement?.status === "live" ? (
                      <>
                        {convertToTime(campStatement?.go_live_time)
                          .split(",")
                          ?.at(0)}
                        ,
                        <span>
                          {" "}
                          {convertToTime(campStatement?.go_live_time)
                            .split(",")
                            ?.at(1)}
                        </span>
                      </>
                    ) : (
                      <>
                        {convertToTime(campStatement?.submit_time)
                          .split(",")
                          ?.at(0)}
                        ,
                        <span>
                          {" "}
                          {convertToTime(campStatement?.submit_time)
                            .split(",")
                            ?.at(1)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </>
            }
          />
        )}

        {campStatement &&
          campStatement?.status == "in_review" &&
          !commited &&
          !!campStatement?.grace_period &&
          moment.now() < campStatement?.submit_time * 1000 + 3600000 && (
            <div className="tooltip-count">
              <Tooltip
                title={` Note: This countdown timer is the grace period in which
                      you can make minor changes to your
                      ${
                        historyOf == "topic"
                          ? "topic"
                          : historyOf == "camp"
                          ? "camp"
                          : "statement"
                      }
                      before other direct supporters are notified.`}
              >
                <InfoCircleOutlined />
              </Tooltip>
              <p>Grace period countdown</p>
              <Tag
                className={
                  "bg-canBlue_Opacity20 border-0 rounded-md inline-flex py-[3px] items-center"
                }
              >
                <Timer
                  unixTime={campStatement?.submit_time}
                  setCommited={setCommited}
                />
              </Tag>
            </div>
          )}
      </div>
      {!compareMode && (
        <Checkbox
          className="mb-[1.25rem] ch-checkbox"
          id={`select-to-compare-${campStatement?.id}`}
          onChange={onSelectCompare?.bind(this, campStatement)}
          disabled={isDisabledCheck}
          defaultChecked={isChecked}
          key={campStatement?.id}
        >
          Select to compare
        </Checkbox>
      )}
      <Card className="cn-card">
        {historyOf == " statement " ||
          (historyState == "statement" && (
            <Collapse
              expandIconPosition="end"
              className="ch-collapse"
              defaultActiveKey={["1"]}
              expandIcon={({ isActive }) =>
                isActive ? (
                  <i className="icon-up-arrow"></i>
                ) : (
                  <i className="icon-down-arrow"></i>
                )
              }
              ghost
            >
              <Panel header="" key="1">
                <div>
                  <h5 className="font-semibold text-canOrange mb-3">
                    Statement
                  </h5>
                  <div
                    className="text-canBlack pb-[1.25rem] editorContent"
                    dangerouslySetInnerHTML={{
                      __html: campStatement?.parsed_value,
                    }}
                  ></div>
                </div>
              </Panel>
            </Collapse>
          ))}

        {compareMode && (
          <HistoryComparison
            campStatement={comparisonData}
            topicNamespaceId={topicNamespaceId}
            s1={s1}
          />
        )}

        {!compareMode && historyOf == "statement" && (
          <StatementHistory
            campStatement={campStatement}
            topicNamespaceId={topicNamespaceId}
          />
        )}

        {!compareMode && historyOf == "camp" && (
          <CampHistory
            campStatement={campStatement}
            topicNamespaceId={topicNamespaceId}
          />
        )}
        {!compareMode && historyOf == "topic" && (
          <TopicHistory
            campStatement={campStatement}
            topicNamespaceId={topicNamespaceId}
          />
        )}

        {campStatement?.status == "in_review" &&
          (!campStatement?.grace_period || commited) &&
          isUserAuthenticated &&
          campStatement?.total_supporters > 1 && (
            <>
              <div className="agreement-wrapper">
                {(campStatement?.ifICanAgreeAndObject ||
                  campStatement?.ifICanAgreeAndObject == undefined) &&
                  !!(
                    campStatement?.ifIamSupporter != 0 ||
                    campStatement?.ifIAmExplicitSupporter
                  ) &&
                  isUserAuthenticated &&
                  !campStatement?.isAuthor && (
                    <>
                      <Checkbox
                        defaultChecked={campStatement?.agreed_to_change}
                        disabled={
                          // historyOf == "camp" ? !campStatement?.ifICanAgreeAndObject : false ||
                          parentArchived == 1 && directarchived == 0
                        }
                        onChange={agreeWithChange}
                      >
                        Agree With Change
                      </Checkbox>
                    </>
                  )}
                <Space>
                  {!!(
                    campStatement?.ifIamSupporter != 0 ||
                    campStatement?.ifIAmExplicitSupporter ||
                    campStatement?.isAuthor
                  ) && (
                    <>
                      <HistoryCardDrawer
                        onClick={async () => {
                          let req = {
                            topic_num: router?.query.camp[0].split("-")[0],
                            camp_num:
                              historyOf == "topic"
                                ? 1
                                : router?.query.camp[1].split("-")[0],
                            change_id: campStatement?.id,
                            type: historyOf,
                          };
                          let res = await getChangeSupporters(req);
                          if (res.status_code == 200) {
                            let supportersData = res?.data.supporters?.map(
                              (data, key) => {
                                return {
                                  key: key,
                                  status: data?.agreed,
                                  nickNameData: {
                                    name: data?.nick_name,
                                    path: `/user/supports/${
                                      data?.id || ""
                                    }?canon=${topicNamespaceId || ""}`,
                                  },
                                };
                              }
                            );
                            setSupporters(supportersData);
                          }
                          setIsModalOpen(true);
                        }}
                        displayText={
                          <p>
                            <u>
                              {campStatement?.agreed_supporters} out of{" "}
                              {campStatement?.total_supporters} required
                              supporters have agreed
                            </u>
                            {(campStatement?.ifICanAgreeAndObject ||
                              campStatement?.ifICanAgreeAndObject ==
                                undefined) &&
                              !!(
                                campStatement?.ifIamSupporter != 0 ||
                                campStatement?.ifIAmExplicitSupporter
                              ) &&
                              isUserAuthenticated &&
                              !campStatement?.isAuthor &&
                              campStatement?.total_supporters -
                                campStatement?.agreed_supporters ==
                                1 &&
                              !campStatement?.agreed_to_change && (
                                <>
                                  , Since you are the last hold out, the instant
                                  you agree, this will go live.
                                </>
                              )}
                          </p>
                        }
                        agreedSupporters={supporters?.filter(
                          (obj) => obj?.status === true
                        )}
                        notAgreedSupporters={supporters?.filter(
                          (obj) => obj?.status === false
                        )}
                      />
                    </>
                  )}
                </Space>
              </div>
            </>
          )}

        {!compareMode && (!campStatement?.grace_period || commited) && (
          <>
            <div className="cn-footer-btn">
              <div className="cn-card-btn">
                <PrimaryButton
                  size="large"
                  type="primary"
                  id={`submit-update-${campStatement?.id}`}
                  className="flex items-center justify-center text-sm gap-3.5 leading-none w-100"
                  onClick={() => {
                    campStatement?.is_archive == 1 &&
                    campStatement?.status == "live"
                      ? !isUserAuthenticated
                        ? router?.push({
                            pathname: "/login",
                            query: {
                              returnUrl: `/manage/${historyOf}/${campStatement?.id}`,
                            },
                          })
                        : callManageCampApi()
                      : submitUpdateRedirect(historyOf);
                  }}
                  disabled={
                    unarchiveChangeSubmitted ||
                    (campHistoryItems &&
                      campHistoryItems[0]?.status == "in_review" &&
                      !commited &&
                      !!campHistoryItems[0]?.grace_period) ||
                    (campHistoryItems?.at(0)?.status == "live" &&
                      campHistoryItems?.at(0)?.is_archive == 1 &&
                      campStatement.status == "old") ||
                    (parentArchived == 1 && directarchived == 0) ||
                    (parentArchived == 1 &&
                      directarchived == 1 &&
                      historyOf == "topic") ||
                    (campHistoryItems?.at(0)?.is_archive == 1 &&
                      campHistoryItems?.at(0)?.status == "live" &&
                      campStatement.status == "objected")
                      ? true
                      : false
                  }
                >
                  {(campStatement?.is_archive == 1 &&
                        campStatement?.status == "live")
                          ? "Un-Archive This Camp"
                          : "Edit Based on This" }
                  <i className="icon-edit"></i>
                </PrimaryButton>

                {campStatement?.status == "in_review" && (
                  <>
                    <Button
                      size="large"
                      // disabled={historyOf == "camp" ? !campStatement?.ifICanAgreeAndObject : false}
                      id={`object-change-${campStatement?.id}`}
                      className="flex items-center bg-canRed_Opacity10 border-canRed hover:border-canRed hover:text-canRed focus:text-canRed focus:border-canRed justify-center text-sm rounded-xl gap-3.5 leading-none w-100 font-medium"
                      onClick={() => objectionHandler()}
                    >
                      Object Changes
                      <i className="icon-thumb-down text-canRed"></i>
                    </Button>
                  </>
                )}
              </div>
              <div className="cn-link-btn">
                <Button
                  size="large"
                  type="link"
                  id={`view-this-version-${campStatement?.id}`}
                  className="flex items-center justify-center text-sm leading-none text-canBlack"
                  onClick={() =>
                    handleViewThisVersion(campStatement?.go_live_time)
                  }
                >
                  <Link
                    href={`/topic/${
                      replaceSpecialCharacters(
                        historyOf == "topic"
                          ? replaceSpecialCharacters(
                              campStatement?.topic_num +
                                "-" +
                                campStatement?.topic_name?.replace(/ /g, "-"),
                              "-"
                            )
                          : router?.query?.camp?.at(0),
                        "-"
                      ) +
                      "/" +
                      (historyOf != "topic"
                        ? historyOf == "camp"
                          ? replaceSpecialCharacters(
                              campStatement?.camp_num +
                                "-" +
                                campStatement?.camp_name?.replace(/ /g, "-"),
                              "-"
                            )
                          : replaceSpecialCharacters(
                              router?.query?.camp?.at(1),
                              "-"
                            )
                        : "1-Agreement")
                    }?algo=${algorithm}&asofdate=${
                      campStatement?.go_live_time
                    }&asof=bydate&canon=${namespace_id}&viewversion=${1}`}
                  >
                    View Version
                  </Link>
                  <EyeOutlined className="ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}

        {campStatement?.status == "in_review" &&
          !commited &&
          !!campStatement?.grace_period &&
          moment.now() < campStatement?.submit_time * 1000 + 3600000 && (
            <>
              <div className="cn-footer-btn">
                <div className="cn-card-btn">
                  <PrimaryButton
                    size="large"
                    type="primary"
                    id={`commit-change-${campStatement?.id}`}
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none min-w-[200px]"
                    onClick={commitChanges}
                    disabled={loadingChanges}
                  >
                    Commit Changes
                    <i className="icon-upload"></i>
                  </PrimaryButton>
                  <Button
                    size="large"
                    id={`edit-change-${campStatement?.id}`}
                    className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none btn-light-primary min-w-[200px]"
                  >
                    <Link
                      href={
                        historyOf == "camp"
                          ? `/manage/camp/${campStatement?.id}-update`
                          : historyOf == "topic"
                          ? `/manage/topic/${campStatement?.id}-update`
                          : `/manage/statement/${campStatement?.id}-update`
                      }
                    >
                      Edit Change
                    </Link>
                    <i className="icon-edit"></i>
                  </Button>
                </div>
                <div className="cn-link-btn">
                  <Button
                    type="link"
                    danger
                    size="large"
                    id={`commit-change-${campStatement?.id}`}
                    className="flex items-center justify-center gap-2 rounded-[10px] leading-none"
                    onClick={() => cancelConfirm()}
                    disabled={loadingChanges}
                  >
                    Delete
                    <i className="icon-delete"></i>
                  </Button>
                </div>
              </div>
            </>
          )}
      </Card>
      <ObjectionDrawer
        onClose={onClose}
        open={open}
        drawerFor={drawerFor}
        setDrawerFor={setDrawerFor}
        objectionId={campStatement?.id}
        getHistory={campStatementApiCall}
      />
    </div>
  );
}

export default HistoryCard;
