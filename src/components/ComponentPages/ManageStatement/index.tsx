import { useEffect, useRef, useState } from "react";
import {
  Form,
  Row,
  Col,
  Typography,
  Modal,
  Breadcrumb,
  Popover,
  Tooltip,
  Tag,
  Button,
} from "antd";
import { useRouter } from "next/router";
import {
  CloudUploadOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  FileTextOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
// import OpenAI from "openai";

import {
  getAllUsedNickNames,
  getCampBreadCrumbApi,
} from "src/network/api/campDetailApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import {
  getEditStatementApi,
  postStatementCountApi,
  updateStatementApi,
} from "src/network/api/campManageStatementApi";
import {
  changeSlashToArrow,
  convertToSlug,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import DataNotFound from "../DataNotFound/dataNotFound";
import CustomSpinner from "components/shared/CustomSpinner";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import ManageStatementUI from "./UI";
import StatementPreview from "./UI/preview";
import StatementAIPreview from "./UI/aiPreview";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Link from "next/link";
import { getHistoryApi } from "src/network/api/history";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import K from "src/constants";

// const systemPropPt = `You are a text converter for a website where people put their opinions on various topics, while writing and posting the content they are given a feature of Improve with AI, Your role is to improve that text accordingly.

// If the topic suggests a science theme then follow the users leads and convert accordingly, similarly go with the users content theme and magically convert text. Do not lose essence of and meaning behind the user's real intent. Convert text in such a way that it's more readable and bit concise, like a good page from a book, everything well put and organized.`;

function ManageStatements({ isEdit = false }) {
  // const openai = new OpenAI({
  //   apiKey: process?.env?.NEXT_PUBLIC_OPENAI_API_KEY || "",
  //   dangerouslyAllowBrowser: true,
  // });

  const router = useRouter();
  const [form] = Form.useForm();

  const { isUserAuthenticated } = useAuthentication();

  const [notFoundStatus, setNotFoundStatus] = useState({
    status: false,
    name: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [editStatementData, setEditStatementData] = useState(null);
  const [submitIsDisable, setSubmitIsDisable] = useState(true);
  const [nickNameData, setNickNameData] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);
  const [editorState, setEditorState] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editCampStatementData, setEditCampStatementData] = useState("");
  type CampType = { camp_name?: string; [key: string]: any };
  const [editCampName, setEditCampName] = useState<CampType | string>("");
  const [editTopicName, setEditTopicName] = useState("");
  const [topic_num, setTopicNum] = useState("");
  const [topicId, setTopicId] = useState("");
  const [recordId, setRecordId] = useState("");
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const [time, setTime] = useState({
    current_time: null,
    last_save_time: null,
  });
  const [autoSaveDisplayMessage, setAutoSaveDisplayMessage] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [statement, setStatement] = useState(null);
  const [isPrePopupLoading] = useState(false);
  const [isAIPreviewOpen, setIsAIPreviewOpen] = useState(false);
  const [improvedContent, setImprovedContent] = useState(null);
  const [isTopicPage, setIsTopicPage] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [tagsArrayList, setTagsArrayList] = useState([]);
  const tagsToShow = showAll ? tagsArrayList : tagsArrayList?.slice(0, 4);

  const values = Form.useWatch([], form);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const isFirstRender = useRef(true);
  const didMount = useRef(false);

  const getEpochTime = () => {
    return Math.floor(Date.now() / 1000);
  };

  const hasArchivedCamp = (data) => {
    return data?.some((camp) => camp?.camp_is_archive === 1);
  };

  const {
    campRecord,
    topicRecord,
    asofdate,
    asof,
    currentGetCheckSupportExistsData,
    campStatement,
  } = useSelector((state: RootState) => ({
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state?.filters?.filterObject?.asof,
    currentGetCheckSupportExistsData:
      state.topicDetails.currentGetCheckSupportExistsData,
    campRecord: state?.topicDetails?.currentCampRecord,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campStatement: state?.topicDetails?.campStatement,
  }));
  const [campSubscriptionID, setCampSubscriptionID] = useState(
    campRecord?.subscriptionId
  );
  const [topicSubscriptionID, setTopicSubscriptionID] = useState(
    topicRecord?.topicSubscriptionId
  );

  const getBreadCrumbApiCall = async () => {
    const topicNum =
      router?.query?.statement?.[0]?.split("-")?.at(0) ||
      currentGetCheckSupportExistsData?.topic_num;
    const campNum =
      router?.query?.statement?.[1]?.split("-")?.at(0) ||
      currentGetCheckSupportExistsData?.camp_num;

    let reqBody = {
      topic_num: topicNum,
      camp_num: campNum,
      as_of: router?.pathname == "/topic/[...camp]" ? asof : "default",
      as_of_date:
        asof == "default" || asof == "review"
          ? Date.now() / 1000
          : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
    };

    let res = await getCampBreadCrumbApi(reqBody);

    if (hasArchivedCamp(res?.data?.bread_crumb)) {
      router.push(`/topic/${reqBody?.topic_num}/${reqBody?.camp_num}`);
    }
  };

  const warningText = (
    <div className="popoverParent">
      <span>Some changes are currently under review in this camp.</span>
    </div>
  );

  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };

  const campHrefForPopover = `/camp/history/${
    topicRecord?.topic_num
  }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/1-Agreement`;

  const handleTopicUrl = () => {
    const fullPath = `/topic/history/${
      topicRecord?.topic_num
    }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/1-Agreement`;
    router?.push({ pathname: fullPath });
  };

  const campHref = `/camp/history/${
    topicRecord?.topic_num
  }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/${
    campRecord?.camp_num
  }-${replaceSpecialCharacters(campRecord?.camp_name, "-")}`;

  const handleNavigation = () => {
    const urlPart = `/camp/history/${
      topic_num || topicId
    }-${replaceSpecialCharacters(editTopicName || "", "-")}`;
    const url = `${urlPart}/1-Agreement`;
    router.push(url);
  };

  const topicContent = (
    <div className="popoverParent">
      <Row>
        <Col span={24} className="relative">
          <div className="popover_header flex justify-between gap-1 items-center">
            <div>
              <span className="text-xs 2xl:text-sm text-canLight mb-1.5 font-normal capitalize">
                Topic Name:
              </span>
              <p className="font-bold mb-5 text-sm text-canBlack">
                {!!topicSubscriptionID && (
                  <Tooltip
                    title="You have subscribed to the entire topic."
                    key="camp_subscribed_icon"
                  >
                    <small style={{ alignSelf: "center" }}>
                      <i className="icon-subscribe text-canBlue"></i>
                    </small>
                  </Tooltip>
                )}{" "}
                {topicRecord && topicRecord?.topic_name?.length > 50
                  ? `${topicRecord?.topic_name.substring(0, 20)}....`
                  : topicRecord?.topic_name}
              </p>
            </div>
          </div>
          <hr className="horizontal_line my-5" />
          <Row gutter={1} className="pb-[4.5rem]">
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-canLight text-xs 2xl:text-sm capitalize">
                Author:
              </span>
              <Link
                href={{
                  pathname: `/user/supports/${topicRecord?.submitter_nick_id}`,
                  query: { canon: topicRecord?.namespace_id || 1 },
                }}
              >
                <a className="!text-canBlue text-sm font-medium underline hover:!text-canHoverBlue">
                  {topicRecord?.submitter_nick_name}
                </a>
              </Link>
            </Col>
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Submitted On:
              </span>
              <span className="text-sm 2xl !text-black font-medium">
                {topicRecord && covertToTime(topicRecord?.submit_time)}
              </span>
            </Col>
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Submitted By:
              </span>
              <Link
                href={{
                  pathname: `/user/supports/${topicRecord?.submitter_nick_id}`,
                  query: { canon: topicRecord?.namespace_id || 1 },
                }}
              >
                <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-medium">
                  {topicRecord?.submitter_nick_name}
                </a>
              </Link>
            </Col>
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Go Live Time:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord && covertToTime(topicRecord?.go_live_time)}
              </span>
            </Col>
            <Col md={12} sm={12} xs={12} className="flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Canon:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
              </span>
            </Col>
            {tagsArrayList && tagsArrayList?.length > 0 ? (
              <Col md={24} sm={24} xs={24} className="mt-3">
                <span className="text-xs 2xl:text-sm text-canLight capitalize">
                  Tags:
                </span>
                <div className="vertical-chips mt-2 flex flex-wrap gap-2">
                  {tagsToShow?.map((item: any, index) => (
                    <div key={index}>
                      <Tag
                        className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                        closable={false}
                      >
                        <span data-testid="styles_Bluecolor">
                          {item?.content}
                        </span>
                      </Tag>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  {tagsArrayList && tagsArrayList?.length > 4 && (
                    <Button
                      type="link"
                      className=" text-canBlue view-toggle-btn"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </div>
              </Col>
            ) : null}
          </Row>
          <div className="content-btn-wrap">
            <PrimaryButton
              className="mx-auto flex items-center justify-center font-medium h-auto gap-1"
              onClick={() => handleTopicUrl()}
            >
              {K?.exceptionalMessages?.manageTopicButton}
              <EditOutlined />
            </PrimaryButton>
          </div>
        </Col>
      </Row>
    </div>
  );

  const campContent = (
    <div className="popoverParent">
      <Row>
        <Col span={24} className="relative">
          <div className="popover_header flex justify-between gap-1 items-center">
            <div>
              <span className="text-xs 2xl:text-sm text-canLight mb-1.5 font-normal capitalize">
                Camp Name:
              </span>
              <p className="font-bold mb-5 text-sm text-canBlack line-clamp-1 overflow-hidden">
                {!!topicRecord?.agreement_camp_record?.subscriptionId && (
                  <Tooltip
                    title="You have subscribed to this camp."
                    key="camp_subscribed_icon"
                  >
                    <small style={{ alignSelf: "center" }}>
                      <i className="icon-subscribe text-canBlue"></i>
                    </small>
                  </Tooltip>
                )}{" "}
                <Link
                  href={`/topic/${
                    topicRecord?.topic_num
                  }-${replaceSpecialCharacters(topicRecord?.topic_name, "-")}/${
                    campRecord?.camp_num
                  }-${replaceSpecialCharacters(campRecord?.camp_name, "-")}`}
                >
                  {topicRecord?.agreement_camp_record &&
                  topicRecord?.agreement_camp_record?.camp_name?.length > 50
                    ? `${topicRecord?.agreement_camp_record?.camp_name.substring(
                        0,
                        20
                      )}....`
                    : topicRecord?.agreement_camp_record?.camp_name}
                </Link>
              </p>
            </div>
            {topicRecord?.agreement_camp_record?.in_review_changes > 0 && (
              <Popover
                content={warningText}
                className="title-popover"
                placement="bottomLeft"
                overlayClassName="warning-popover"
                id="section-popover"
              >
                <Tag
                  className="text-[#DD841C] ml-3 mr-0 bg-[#F19C391A] py-1.5 px-4 text-sm border-0 rounded-full cursor-pointer"
                  onClick={() => handleNavigation()}
                  id="section-tag"
                >
                  Under Review
                </Tag>
              </Popover>
            )}
          </div>
          <hr className="horizontal_line my-5" />
          <Row gutter={1} className="pb-[4.5rem]">
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Submitted By:
              </span>
              <Link
                href={{
                  pathname: `/user/supports/${topicRecord?.agreement_camp_record?.submitter_nick_id}`,
                  query: { canon: topicRecord?.namespace_id || 1 },
                }}
              >
                <a className="author-name !text-canBlue hover:!text-canHoverBlue text-sm font-medium underline">
                  {topicRecord?.agreement_camp_record?.submitter_nick_name}
                </a>
              </Link>
            </Col>
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Submitted On:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord?.agreement_camp_record &&
                  covertToTime(topicRecord?.agreement_camp_record?.submit_time)}
              </span>
            </Col>
            {topicRecord?.agreement_camp_record?.camp_about_nick_name && (
              <>
                <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
                  <span className="text-xs 2xl:text-sm text-canLight capitalize">
                    Camp about nickname:
                  </span>
                  <Link
                    href={{
                      pathname: `/user/supports/${topicRecord?.agreement_camp_record?.camp_about_nick_id}`,
                      query: { canon: topicRecord?.namespace_id || 1 },
                    }}
                  >
                    <a className="text-sm !text-canBlue hover:!text-canHoverBlue font-medium">
                      {topicRecord?.agreement_camp_record &&
                        topicRecord?.agreement_camp_record
                          ?.camp_about_nick_name}
                    </a>
                  </Link>
                </Col>
              </>
            )}
            {topicRecord?.agreement_camp_record?.camp_about_url && (
              <Col
                md={12}
                sm={12}
                xs={12}
                className="mb-3 flex flex-col break-words"
              >
                <span className="text-xs 2xl:text-sm text-canLight capitalize">
                  Camp about URL:
                </span>
                <a
                  href={
                    topicRecord?.agreement_camp_record &&
                    topicRecord?.agreement_camp_record?.camp_about_url
                  }
                  className="text-sm block !text-canBlue hover:!text-canHoverBlue font-medium"
                  target="_blank"
                  rel="noreferrer"
                >
                  {topicRecord?.agreement_camp_record &&
                    topicRecord?.agreement_camp_record?.camp_about_url}
                </a>
              </Col>
            )}
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Single level camps only:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord?.agreement_camp_record &&
                topicRecord?.agreement_camp_record.is_one_level == 0
                  ? "No"
                  : "Yes"}
              </span>
            </Col>
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Disable additional sub camps:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord?.agreement_camp_record &&
                topicRecord?.agreement_camp_record.is_disabled == 0
                  ? "No"
                  : "Yes"}
              </span>
            </Col>
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Camp archive:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord?.agreement_camp_record &&
                topicRecord?.agreement_camp_record.is_archive == 0
                  ? "No"
                  : "Yes"}
              </span>
            </Col>
            <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Go live time:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord?.agreement_camp_record &&
                  covertToTime(
                    topicRecord?.agreement_camp_record?.go_live_time
                  )}
              </span>
            </Col>
            <Col md={12} sm={12} xs={12} className=" flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Canon:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
              </span>
            </Col>
            <Col md={12} sm={12} xs={12} className=" flex flex-col">
              <span className="text-xs 2xl:text-sm text-canLight capitalize">
                Topic Name:
              </span>
              <span className="text-sm text-canBlack font-medium">
                {topicRecord && topicRecord?.topic_name?.length > 50
                  ? `${topicRecord?.topic_name.substring(0, 20)}....`
                  : topicRecord?.topic_name}
              </span>
            </Col>
            {topicRecord?.agreement_camp_record?.camp_leader_nick_name && (
              <Col md={12} sm={12} xs={12} className=" flex flex-col mt-4">
                <span className="text-xs 2xl:text-sm text-canLight capitalize">
                  Camp Leader:
                </span>
                <Link
                  className="flex flex-wrap"
                  href={{
                    pathname: `/user/supports/${topicRecord?.agreement_camp_record?.camp_leader_nick_id}`,
                    query: {
                      canon: topicRecord?.namespace_id,
                    },
                  }}
                >
                  <span className="!text-canBlue cursor-pointer font-medium">
                    {topicRecord?.agreement_camp_record?.camp_leader_nick_name}
                  </span>
                </Link>
              </Col>
            )}
          </Row>
          <div className="content-btn-wrap">
            <PrimaryButton className="flex items-center justify-center h-auto mx-auto gap-1">
              <Link href={campHrefForPopover}>
                <a className="flex items-center justify-center h-auto mx-auto gap-1">
                  <span className="flex items-center justify-center h-auto mx-auto gap-1">
                    {K?.exceptionalMessages?.manageCampButton}
                    <EditOutlined />
                  </span>
                </a>
              </Link>
            </PrimaryButton>
          </div>
        </Col>
      </Row>
    </div>
  );

  const contentForCamp = (
    <div className="popoverParent">
      <Row gutter={5}>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Submitted By:
          </span>
          <Link
            href={{
              pathname: `/user/supports/${campRecord?.submitter_nick_id}`,
              query: { canon: topicRecord?.namespace_id || 1 },
            }}
          >
            <a className="author-name !text-canBlue hover:!text-canHoverBlue text-sm font-medium underline">
              {campRecord?.submitter_nick_name}
            </a>
          </Link>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Submitted On:
          </span>
          <span className="text-sm text-canBlack font-medium">
            {campRecord && covertToTime(campRecord?.submit_time)}
          </span>
        </Col>
        {campRecord?.camp_about_nick_name && (
          <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
            <span className="text-xs 2xl:text-sm text-canLight capitalize">
              Camp about nickname:
            </span>
            <Link
              href={{
                pathname: `/user/supports/${campRecord?.camp_about_nick_id}`,
                query: { canon: topicRecord?.namespace_id || 1 },
              }}
            >
              <a className="text-sm !text-canBlue hover:!text-canHoverBlue font-medium">
                {campRecord && campRecord?.camp_about_nick_name}
              </a>
            </Link>
          </Col>
        )}
        {campRecord?.camp_about_url && (
          <Col
            md={12}
            sm={12}
            xs={12}
            className="mb-3 flex flex-col break-words"
          >
            <span className="text-xs 2xl:text-sm text-canLight capitalize">
              Camp about URL:
            </span>
            <a
              href={campRecord && campRecord?.camp_about_url}
              className="text-sm block !text-canBlue hover:!text-canHoverBlue font-medium"
              target="_blank"
              rel="noreferrer"
            >
              {campRecord && campRecord?.camp_about_url}
            </a>
          </Col>
        )}
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Single level camps only:
          </span>
          <span className="text-sm text-canBlack font-medium">
            {campRecord && campRecord?.is_one_level == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Disable additional sub camps:
          </span>
          <span className="text-sm text-canBlack font-medium">
            {campRecord && campRecord?.is_disabled == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Camp archive:
          </span>
          <span className="text-sm text-canBlack font-medium">
            {campRecord && campRecord?.is_archive == 0 ? "No" : "Yes"}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className="mb-3 flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Go live time:
          </span>
          <span className="text-sm text-canBlack font-medium">
            {campRecord && covertToTime(campRecord?.go_live_time)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Canon:
          </span>
          <span className="text-sm text-canBlack font-medium">
            {topicRecord && changeSlashToArrow(topicRecord?.namespace_name)}
          </span>
        </Col>
        <Col md={12} sm={12} xs={12} className=" flex flex-col">
          <span className="text-xs 2xl:text-sm text-canLight capitalize">
            Topic Name:
          </span>
          <span className="text-sm text-canBlack font-medium">
            {topicRecord && topicRecord?.topic_name?.length > 50
              ? `${topicRecord?.topic_name?.substring(0, 20)}....`
              : topicRecord?.topic_name}
          </span>
        </Col>
        {campRecord?.camp_leader_nick_name && (
          <Col md={12} sm={12} xs={12} className=" flex flex-col mt-4">
            <span className="text-xs 2xl:text-sm text-canLight capitalize">
              Camp Leader:
            </span>
            <Link
              className="flex flex-wrap"
              href={{
                pathname: `/user/supports/${campRecord?.camp_leader_nick_id}`,
                query: {
                  canon: topicRecord?.namespace_id,
                },
              }}
            >
              <span className="!text-canBlue cursor-pointer font-medium">
                {campRecord?.camp_leader_nick_name}
              </span>
            </Link>
          </Col>
        )}
      </Row>
      <hr className="horizontal_line my-5" />
      <PrimaryButton className="flex items-center justify-center h-auto mx-auto gap-1">
        <Link href={campHref}>
          <a className="flex items-center justify-center h-auto mx-auto gap-1">
            <span className="flex items-center justify-center h-auto mx-auto gap-1">
              {K?.exceptionalMessages?.manageCampButton}
              <EditOutlined />
            </span>
          </a>
        </Link>
      </PrimaryButton>
    </div>
  );

  const transformDataForTags = (data) => {
    return data?.map((item, index) => {
      return {
        id: item.id,
        content: item.title,
      };
    });
  };

  useEffect(() => {
    setTagsArrayList(transformDataForTags(topicRecord?.tags));
  }, [topicRecord]);

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
    getBreadCrumbApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    const updateCurrentTime = () => {
      setTime((prevTime) => ({
        ...prevTime,
        current_time: getEpochTime(),
      }));

      setAutoSaveDisplayMessage(
        `Saved ${moment.unix(time?.last_save_time).fromNow()}`
      );
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip running on initial render
    }

    const interval = setInterval(updateCurrentTime, 700);

    return () => clearInterval(interval);
  }, [time?.last_save_time, time?.current_time]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const update = router?.query?.statement?.at(0)?.split("-")[1] == "update";
  const isDraft = router?.query?.is_draft;

  useEffect(() => {
    const backdata = editStatementData;

    // Check if backdata and its nested properties are defined
    const statementValue = backdata?.statement?.value?.trim();
    const statementEditSummary = backdata?.statement?.edit_summary || "";
    const nickNameId = backdata?.nick_name[0]?.id;

    const isStatementDifferent =
      JSON.stringify(statementValue) !==
      JSON.stringify(values?.statement?.trim());
    const isNicknameDifferent =
      nickNameId != values?.nick_name && values?.nick_name;
    const isEditSummaryDifferent = statementEditSummary != values?.edit_summary;

    if (
      isEdit &&
      (isStatementDifferent || isNicknameDifferent || isEditSummaryDifferent)
    ) {
      setSubmitIsDisable(false);
    } else {
      setSubmitIsDisable(true);
    }
  }, [values, editStatementData, isEdit]);

  const topicURL = () => {
    const backdata = editStatementData;
    const lastParentCamp =
      backdata?.parent_camp?.[backdata.parent_camp.length - 1];

    return `/topic/${backdata?.topic?.topic_num}-${replaceSpecialCharacters(
      backdata?.topic?.topic_name,
      "-"
    )}/${lastParentCamp?.camp_num}-${replaceSpecialCharacters(
      lastParentCamp?.camp_name,
      "-"
    )}`;
  };

  const getBackURL = (typ: string = "") => {
    const backdata = editStatementData;
    const { is_draft, statement }: any = router?.query || {};
    const [statementPart0, statementPart1] = statement || [];
    const lastParentCamp =
      backdata?.parent_camp?.[backdata.parent_camp.length - 1];

    const createTopicURL = (part0, part1) =>
      `/topic/${replaceSpecialCharacters(
        part0,
        "-"
      )}/${replaceSpecialCharacters(part1, "-")}`;

    const createHistoryURL = (t) => {
      if (t === "topic") {
        return `/manage/${t}/${recordId}`;
      } else {
        return `/manage/${t}/${topicId}`;
      }
    };

    // `/statement/history/${
    //   backdata?.topic?.topic_num
    // }-${replaceSpecialCharacters(backdata?.topic?.topic_name, "-")}/${
    //   lastParentCamp?.camp_num
    // }-${replaceSpecialCharacters(lastParentCamp?.camp_name, "-")}`;

    if (isEdit) {
      return is_draft ? topicURL() : createHistoryURL(typ);
    }

    return createTopicURL(statementPart0, statementPart1);
  };

  const onDiscardClick = (e) => {
    e?.preventDefault();

    setScreenLoading(true);
    const topicNum = isEdit
      ? editStatementData?.topic?.topic_num
      : router?.query?.statement?.at(0)?.split("-")?.at(0);
    const campNum = isEdit
      ? editStatementData?.statement?.camp_num
      : router?.query?.statement?.at(1)?.split("-")?.at(0);

    localStorage.removeItem(`draft_record_id-${topicNum}-${campNum}`);

    if (isEdit) {
      router?.push({ pathname: getBackURL() });
      return;
    }

    router.push({ pathname: getBackURL() });
  };

  useEffect(() => {
    const fetchData = async () => {
      setScreenLoading(true);

      let editData, nickNames;
      let noStatus = false;

      if (isEdit) {
        const routerStatementId = Number(
          router?.query?.statement?.[0]?.split("-")?.[0]
        );
        const reduxStatementId = Number(campStatement?.[0]?.id);

        const editRes = await getEditStatementApi({
          record_id: !reduxStatementId
            ? campStatement?.[0]?.draft_record_id
              ? routerStatementId
              :  !campStatement?.[0]?.submitter_nick_name ? routerStatementId  : routerStatementId + 1 
            :  reduxStatementId,
          event_type: "edit",
          
        });
        if (
          editRes?.status_code === 200 &&
          !!editRes?.data?.statement?.is_draft
        ) {
          setTime({
            ...time,
            last_save_time: editRes?.data?.statement?.submit_time,
          });
        }

        if (editRes?.status_code === 404) {
          setNotFoundStatus({ status: true, name: "Statement" });
          noStatus = true;
        } else if (editRes?.status_code === 200) {
          const statement = editRes.data.statement;
          if (
            statement?.parsed_value &&
            !statement.parsed_value.startsWith("<p>") &&
            !statement.parsed_value.startsWith("<div>")
          ) {
            statement.parsed_value;
          }
          setEditCampStatementData(editRes?.data?.statement?.note);
          setEditStatementData(editRes.data);
          setEditorState(statement?.parsed_value);
          setEditCampName(
            editRes?.data?.parent_camp.find(
              (p) => p.camp_num == router?.query?.statement[1]
            )
          );
          setEditTopicName(editRes?.data?.topic?.topic_name);
          setTopicNum(editRes?.data?.topic?.topic_num);
          setTopicId(editRes?.data?.topic?.id);
          editData = editRes.data;
        }
      }

      if (noStatus === false) {
        const nickNameRes = await getAllUsedNickNames({
          topic_num: isEdit
            ? editData?.topic?.topic_num
            : router?.query?.statement?.[0]?.split("-")[0],
        });

        if (nickNameRes?.status_code === 200) {
          nickNames = nickNameRes.data;
          const formData = isEdit
            ? {
                nick_name: editData?.nick_name?.[0]?.id,
                parent_camp_num: editData?.statement?.camp_num,
                statement: editData?.statement?.parsed_value,
                edit_summary: editData?.statement?.note,
              }
            : {
                nick_name: nickNameRes.data?.[0]?.id,
              };

          form.setFieldsValue(formData);
          setNickNameData(nickNames);
        }
      }

      setScreenLoading(false);
    };

    if (isUserAuthenticated) {
      fetchData();
    } else {
      router.push({
        pathname: "/login",
        query: { returnUrl: router?.asPath },
      });
    }
  }, [isUserAuthenticated, campStatement?.[0]?.id]);

  const getTopicAndCampIds = () => {
    const topicNum = isEdit
      ? editStatementData?.topic?.topic_num
      : router?.query?.statement?.at(0)?.split("-")?.at(0);
    const topicName = isEdit
      ? editStatementData?.topic?.topic_name
      : router?.query?.statement?.at(0)?.split("-")?.at(1);
    const campNum = isEdit
      ? editStatementData?.statement?.camp_num
      : router?.query?.statement?.at(1)?.split("-")?.at(0);

    return {
      topicNum,
      topicName,
      campNum,
    };
  };

  const autoSave = async (data) => {
    setStatement(data?.statement);
    if (!isEdit || isDraft) {
      setIsAutoSaving(true);
      let payload = {
        ...data,
        statement: data?.statement
          ? data?.statement
          : localStorage.getItem("autosaveContent"),
      };

      if (
        !localStorage.getItem(
          `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
            getTopicAndCampIds()?.campNum
          }`
        ) &&
        !editStatementData?.statement?.id
      ) {
        payload.topic_num = getTopicAndCampIds()?.topicNum;
        payload.topic_name = getTopicAndCampIds()?.topicName;
        payload.camp_num = getTopicAndCampIds()?.campNum;
        payload.submitter = nickNameData?.at(0)?.id;
        payload.event_type = "create";
        payload.statement_id = null;
        payload.is_draft = true;
      } else {
        payload.topic_num = getTopicAndCampIds()?.topicNum;
        payload.topic_name = getTopicAndCampIds()?.topicName;
        payload.camp_num = getTopicAndCampIds()?.campNum;
        payload.submitter = nickNameData?.at(0)?.id;
        payload.event_type = "edit";
        payload.statement_id = editStatementData
          ? editStatementData?.statement?.id
          : localStorage.getItem(
              `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
                getTopicAndCampIds()?.campNum
              }`
            );
        payload.is_draft = true;
      }

      if (navigator.onLine) {
        if (payload?.statement) {
          let res = await updateStatementApi(payload);

          if (res?.data?.draft_record_id) {
            localStorage.setItem(
              `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
                getTopicAndCampIds()?.campNum
              }`,
              res?.data?.draft_record_id +
                "-" +
                getTopicAndCampIds()?.topicNum +
                "-" +
                getTopicAndCampIds()?.campNum
            );
          }

          localStorage.removeItem("autosaveContent"); // Clear local storage on successful save

          setTime({
            ...time,
            last_save_time: getEpochTime(),
          });
        }
      } else {
        localStorage.setItem("autosaveContent", payload?.statement); // Save to local storage if offline

        setTime({
          ...time,
          last_save_time: getEpochTime(),
        });
      }

      setTimeout(() => {
        setIsAutoSaving(false);
      }, 1000);
    }
  };

  const saveDraftHandler = async () => {
    setIsSavingDraft(true);

    const redirectToDetailPage = () => {
      router.push(
        `/topic/${getTopicAndCampIds().topicNum}-${convertToSlug(
          getTopicAndCampIds().topicName
        )}/${getTopicAndCampIds().campNum}`
      );
    };

    let payload = {
      camp_num: null,
      event_type: null,
      nick_name: null,
      statement: null,
      statement_id: null,
      submitter: null,
      topic_name: null,
      topic_num: null,
      is_draft: false,
    };

    if (
      !localStorage.getItem(
        `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
          getTopicAndCampIds()?.campNum
        }`
      )
    ) {
      payload.topic_num = getTopicAndCampIds()?.topicNum;
      payload.topic_name = getTopicAndCampIds()?.topicName;
      payload.camp_num = getTopicAndCampIds()?.campNum;
      payload.submitter = values?.nick_name;
      payload.event_type = "create";
      payload.statement_id = null;
      payload.statement = statement
        ? statement
        : isEdit && statement?.length > 0
        ? statement
        : editStatementData?.statement?.parsed_value;
      payload.nick_name = values?.nick_name;
      payload.is_draft = true;
    } else {
      payload.topic_num = getTopicAndCampIds()?.topicNum;
      payload.topic_name = getTopicAndCampIds()?.topicName;
      payload.camp_num = getTopicAndCampIds()?.campNum;
      payload.submitter = values?.nick_name;
      payload.event_type = "edit";
      payload.statement_id = Number(
        localStorage
          .getItem(
            `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
              getTopicAndCampIds()?.campNum
            }`
          )
          ?.split("-")
          ?.at(0)
      );
      payload.statement = statement
        ? statement
        : editStatementData?.statement?.parsed_value;
      payload.nick_name = values?.nick_name;
      payload.is_draft = true;
    }

    if (navigator.onLine) {
      let res = await updateStatementApi(payload);

      if (res?.data?.draft_record_id) {
        localStorage.setItem(
          `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
            getTopicAndCampIds()?.campNum
          }`,
          res?.data?.draft_record_id +
            "-" +
            getTopicAndCampIds()?.topicNum +
            "-" +
            getTopicAndCampIds()?.campNum
        );
      }

      localStorage.removeItem("autosaveContent"); // Clear local storage on successful save

      setTime({
        ...time,
        last_save_time: getEpochTime(),
      });
      if (res?.status_code == 200) {
        redirectToDetailPage();
      }
    } else {
      localStorage.setItem("autosaveContent", payload?.statement); // Save to local storage if offline

      setTime({
        ...time,
        last_save_time: getEpochTime(),
      });
      redirectToDetailPage();
    }

    setTimeout(() => setIsSavingDraft(false), 2000);
  };

  const onFinish = async (values: any) => {
    setScreenLoading(true);
    setIsSaveDraft(false);

    let payload = {
      topic_num: getTopicAndCampIds()?.topicNum,
      camp_num: getTopicAndCampIds()?.campNum,
      statement_id: localStorage
        .getItem(
          `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
            getTopicAndCampIds()?.campNum
          }`
        )
        ?.split("-")
        ?.at(0),
    };

    let res = null;

    if (
      localStorage
        .getItem(
          `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
            getTopicAndCampIds()?.campNum
          }`
        )
        ?.split("-")
        ?.at(0)
    ) {
      res = await postStatementCountApi(payload);
    }

    if (res?.data?.post_changes_count > 0) {
      Modal.confirm({
        title: "Do you want to publish this change?",
        icon: <ExclamationCircleFilled />,
        width: 600,
        okText: "Publish Anyway",
        cancelText: "Review Other Statements",
        onCancel: () => {
          router.push(
            `/statement/history/${getTopicAndCampIds()?.topicNum}-${
              getTopicAndCampIds()?.topicName
            }/${getTopicAndCampIds()?.campNum}`
          );
        },
        content:
          "The draft you have created is based on an older version. Multiple versions have been published since then. Checkout the newer versions before publishing your statement.",
        async onOk() {
          try {
            const editInfo = editStatementData;
            const parent_camp = editInfo?.parent_camp;

            let payload = {
              ...values,
              topic_num: getTopicAndCampIds()?.topicNum,
              topic_name: getTopicAndCampIds()?.topicName,
              camp_num: getTopicAndCampIds()?.campNum,
            };

            const res = await saveStatement(payload);

            if (res?.status_code == 200) {
              localStorage.removeItem(
                `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
                  getTopicAndCampIds()?.campNum
                }`
              );

              if (!isEdit) {
                if (isSaveDraft) {
                  router?.push(
                    router?.asPath?.replace("create/statement", "topic")
                  );
                } else {
                  router?.push(
                    router?.asPath?.replace(
                      "create/statement",
                      "statement/history"
                    )
                  );
                }
                return;
              } else if (isEdit) {
                const route = `${
                  editInfo?.topic?.topic_num
                }-${replaceSpecialCharacters(
                  editInfo?.topic?.topic_name,
                  "-"
                )}/${
                  parent_camp[parent_camp?.length - 1]?.camp_num
                }-${replaceSpecialCharacters(
                  parent_camp[parent_camp?.length - 1]?.camp_name,
                  "-"
                )}`;
                router?.push(`/statement/history/${route}`);
                return;
              }
              return;
            } else if (isEdit) {
              if (isSaveDraft) {
                router?.push({ pathname: topicURL() });
                return;
              }

              const route = `${
                editInfo?.topic?.topic_num
              }-${replaceSpecialCharacters(editInfo?.topic?.topic_name, "-")}/${
                parent_camp[parent_camp?.length - 1]?.camp_num
              }-${replaceSpecialCharacters(
                parent_camp[parent_camp?.length - 1]?.camp_name,
                "-"
              )}`;
              router?.push(`/statement/history/${route}`);
              return;
            }
          } catch (e) {
            return console.log("Oops errors!");
          }
        },
      });
    } else {
      const editInfo = editStatementData;
      const parent_camp = editInfo?.parent_camp;

      let payload = {
        ...values,
        topic_num: getTopicAndCampIds()?.topicNum,
        topic_name: getTopicAndCampIds()?.topicName,
        camp_num: getTopicAndCampIds()?.campNum,
      };
      const res = await saveStatement(payload);

      if (res?.status_code == 200) {
        localStorage.removeItem(
          `draft_record_id-${getTopicAndCampIds()?.topicNum}-${
            getTopicAndCampIds()?.campNum
          }`
        );

        if (!isEdit) {
          if (isSaveDraft) {
            router?.push(router?.asPath?.replace("create/statement", "topic"));
          } else {
            router?.push(
              router?.asPath?.replace("create/statement", "statement/history")
            );
          }
          return;
        } else if (isEdit) {
          // if (isSaveDraft) {
          //   router?.push({ pathname: topicURL() });
          //   return;
          // }

          const route = `${
            editInfo?.topic?.topic_num
          }-${replaceSpecialCharacters(editInfo?.topic?.topic_name, "-")}/${
            parent_camp[parent_camp?.length - 1]?.camp_num
          }-${replaceSpecialCharacters(
            parent_camp[parent_camp?.length - 1]?.camp_name,
            "-"
          )}`;
          router?.push(`/statement/history/${route}`);
          return;
        }
        return;
      } else if (isEdit && res?.status_code === 200) {
        if (isSaveDraft) {
          router?.push({ pathname: topicURL() });
          return;
        }

        const route = `${editInfo?.topic?.topic_num}-${replaceSpecialCharacters(
          editInfo?.topic?.topic_name,
          "-"
        )}/${
          parent_camp[parent_camp?.length - 1]?.camp_num
        }-${replaceSpecialCharacters(
          parent_camp[parent_camp?.length - 1]?.camp_name,
          "-"
        )}`;
        router?.push(`/statement/history/${route}`);
        return;
      }
    }
    setScreenLoading(false);
  };

  const saveStatement = async (values) => {
    const editInfo = editStatementData;
    const parentCamp = editInfo?.parent_camp;

    const topicNum = router?.query?.statement[0]?.split("-")[0];
    const topicName = router?.query?.statement[0]?.split("-")[1];
    const campNum = router?.query?.statement[1]?.split("-")[0];
    const lastParentCamp = parentCamp?.[parentCamp.length - 1];

    const reqBody: any = {
      namespace_id: null,
      nick_name: values?.nick_name,
      note: values?.edit_summary?.trim(),
      statement: statement || values.statement,
      objection_reason: null,
      camp_id: null,
      camp_name: null,
      key_words: null,
      camp_about_url: null,
      camp_about_nick_id: null,
      parent_camp_num: null,
      old_parent_camp_num: null,
      camp_leader_nick_id: null,
    };

    if (!isEdit) {
      reqBody.topic_num = topicNum;
      reqBody.topic_name = topicName;
      reqBody.camp_num = campNum;
      reqBody.submitter = values?.nick_name;
    } else {
      reqBody.topic_num = lastParentCamp?.topic_num;
      reqBody.topic_name = lastParentCamp?.topic_name;
      reqBody.camp_num = lastParentCamp?.camp_num;
      reqBody.submitter = editInfo?.statement?.submitter_nick_id;
    }

    if (update || isDraft || isEdit) {
      reqBody.statement_id = editStatementData
        ? editStatementData?.statement?.id
        : localStorage
            .getItem(`draft_record_id-${topicNum}-${campNum}`)
            ?.split("-")
            ?.at(0);
      // reqBody.statement_id = localStorage
      //   .getItem(`draft_record_id-${topicNum}-${campNum}`)
      //   ?.split("-")
      //   ?.at(0);
    } else {
      reqBody.statement_id = null;
    }

    reqBody.statement_update = update ? 1 : null;

    if (isDraft && isEdit) {
      reqBody.event_type = "edit";
    } else if (isDraft || (!isEdit && !isSaveDraft)) {
      reqBody.event_type = "create";
    } else if (update) {
      reqBody.event_type = "edit";
    } else {
      reqBody.event_type = "update";
    }

    reqBody.is_draft = isSaveDraft ? true : false;

    if (!isSaveDraft && isDraft) {
      reqBody.event_type = "create";
    }
    const res = await updateStatementApi(reqBody);
    return res;
  };

  const handleformvalues = () => {
    const cleanValues = (values) =>
      Object.keys(values).reduce((acc, key) => {
        acc[key] = values[key] ?? "";
        if (typeof acc[key] === "string") {
          acc[key] = acc[key].trim();
        }
        return acc;
      }, {});

    const nowFormStatus: any = cleanValues(form?.getFieldsValue());

    if (nowFormStatus.parent_camp_num) {
      delete nowFormStatus.parent_camp_num;
    }
  };

  const onPreveiwClose = (e) => {
    e?.preventDefault();
    setIsPreviewOpen(false);
    setIsPopupLoading(false);
  };

  const onPreviewClick = (e) => {
    e?.preventDefault();
    setIsPopupLoading(true);
    setIsPreviewOpen(true);
    setIsPopupLoading(false);
  };

  // const onImproveClick = async (e, editor) => {
  //   e?.preventDefault();
  //   setIsGenerating(true);

  //   try {
  //     if (!openai || !openai.chat || !openai.chat.completions) {
  //       openNotificationWithIcon(
  //         "OpenAI API key is not configured or is invalid.",
  //         "error"
  //       );
  //       return;
  //     }

  //     const completion = await openai.chat.completions.create({
  //       model: "gpt-4o-mini",
  //       messages: [
  //         { role: "system", content: systemPropPt },
  //         { role: "user", content: editorState },
  //       ],
  //     });

  //     const improvedContent = completion?.choices?.[0]?.message;

  //     if (!improvedContent) {
  //       openNotificationWithIcon(
  //         "Failed to retrieve content from OpenAI.",
  //         "error"
  //       );
  //       return;
  //     }

  //     console.log("Result:", improvedContent);

  //     setIsAIPreviewOpen(true);
  //     setImprovedContent(improvedContent);
  //   } catch (error) {
  //     openNotificationWithIcon(`Error during AI improvement!`, "error");
  //     return;
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const onAiPreveiwClose = (e) => {
    e?.preventDefault();
    setIsAIPreviewOpen(false);
    setImprovedContent(null);
  };

  const onInsertClick = (e) => {
    e?.preventDefault();
    setEditorState(improvedContent?.content);
    onAiPreveiwClose(e);
  };

  const title2 = (
    <div className="popover_header">
      <span className="text-xs 2xl:text-sm text-canLight mb-1 capitalize">
        Camp Name:
      </span>
      <p className="font-bold mb-5 text-sm text-canBlack line-clamp-1 overflow-hidden">
        <Link
          href={`/topic/${topicRecord?.topic_num}-${replaceSpecialCharacters(
            topicRecord?.topic_name,
            "-"
          )}/${campRecord?.camp_num}-${replaceSpecialCharacters(
            campRecord?.camp_name,
            "-"
          )}`}
        >
          {campRecord && campRecord?.camp_name?.length > 50
            ? `${campRecord?.camp_name?.substring(0, 20)}....`
            : campRecord?.camp_name}
        </Link>
      </p>
    </div>
  );

  const campStatementApiCall = async (topic_num: string | number) => {
    try {
      const reqBody = {
        topic_num: topic_num,
        camp_num: 1,
        type: "all",
        per_page: 4,
        page: 1,
      };
      let res = await getHistoryApi(reqBody, 1, "topic");

      if (res?.status_code == 200) {
        setRecordId(res?.data?.live_record_id);
      }
    } catch (error) {
      /**/
    }
  };

  useEffect(() => {
    if (topic_num === undefined || topic_num === null) return;
    const fetchCampStatement = async () => {
      await campStatementApiCall(topic_num);
    };
    fetchCampStatement();
  }, [topic_num]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia("(min-width: 992px)").matches);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <div>
      {notFoundStatus?.status ? null : (
        <Row
          id="breadcrumb-row"
          className="bg-canGray rounded-lg [&_nav]:p-0 [&_nav]:mb-0 py-5 px-4"
          gutter={20}
        >
          <Col
            id="breadcrumb-col"
            md={12}
            className="flex justify-start items-center"
          >
            {/* <Breadcrumbs
              id="breadcrumbs"
              items={[
                // {
                //   icon: <HomeOutlined className="text-canBlack" />,
                //   href: "/",
                // },
                {
                  href: getBackURL(),
                  label:
                    !isEdit || isDraft ? "Topic Details" : "Statement History",
                },
                {
                  label: !isEdit
                    ? "Adding a camp statement"
                    : "Updating camp statement",
                },
                {
                  label: !isEdit
                    ? editTopicName
                    : editTopicName,
                },
                {
                  label: !isEdit
                    ? editCampName
                    : editCampName,
                },
              ]}
            /> */}

            <Breadcrumb
              className="cn-breadcrumbs"
              separator={
                <i className="icon-angle-right-arrow !leading-[0]"></i>
              }
            >
              {isEdit ? (
                <>
                  <Breadcrumb.Item className="flex items-center gap-1.5">
                    <Link href={getBackURL("topic")}>
                      <a className="!break-all hover:!text-canHoverBlue">
                        {editStatementData?.topic?.topic_name}
                      </a>
                    </Link>
                    {isMobile && (
                      <Popover
                        placement="bottom"
                        content={topicContent}
                        className="title-popover"
                        overlayClassName="max-lg:hidden popover-content-wrap"
                      >
                        <InfoCircleOutlined />
                      </Popover>
                    )}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className="flex gap-1.5">
                    <Link href={getBackURL("camp")}>
                      <a className="!break-all hover:!text-canHoverBlue">
                        {editStatementData?.parent_camp?.length > 0
                          ? editStatementData.parent_camp[
                              editStatementData.parent_camp.length - 1
                            ].camp_name
                          : null}
                      </a>
                    </Link>

                    {isMobile && (
                      <Popover
                        content={contentForCamp}
                        title={title2}
                        overlayClassName="max-lg:hidden"
                      >
                        <InfoCircleOutlined />
                      </Popover>
                    )}
                  </Breadcrumb.Item>
                </>
              ) : (
                <Breadcrumb.Item className="flex gap-1.5">
                  <Link href={getBackURL("camp")}>
                    <a className="!break-all hover:!text-canHoverBlue">
                      Adding a camp statement
                    </a>
                  </Link>

                  {isMobile && (
                    <Popover
                      content={contentForCamp}
                      title={title2}
                      overlayClassName="max-lg:hidden"
                    >
                      <InfoCircleOutlined />
                    </Popover>
                  )}
                </Breadcrumb.Item>
              )}

              {/* {typeof editCampName === "object" &&
                editCampName !== null &&
                "camp_name" in editCampName && (
                  <Breadcrumb.Item className="flex gap-1.5">
                    <Link href={getBackURL("camp")}>
                      <a className="!text-canGreen !break-all hover:!text-canHoverBlue">
                        {typeof editCampName === "object" &&
                        editCampName !== null
                          ? (editCampName && editCampName.camp_name) ?? ""
                          : editCampName ?? ""}
                      </a>
                    </Link>
                    {isMobile && (
                      <Popover
                        placement="bottom"
                        content={campContent}
                        overlayClassName="max-lg:hidden"
                      >
                        <InfoCircleOutlined />
                      </Popover>
                    )}
                  </Breadcrumb.Item>
                )} */}
            </Breadcrumb>
          </Col>
          <Col
            id="save-draft-col"
            className="flex justify-end items-center"
            md={12}
          >
            <Typography.Paragraph id="auto-save-message" className="!mb-0 mr-7">
              {isAutoSaving ? (
                "Saving ..."
              ) : (
                <>
                  {autoSaveDisplayMessage && (
                    <>
                      {autoSaveDisplayMessage + " "}
                      <CloudUploadOutlined />
                    </>
                  )}
                </>
              )}
            </Typography.Paragraph>
            <SecondaryButton
              id="save-draft-button"
              className="flex items-center justify-center py-2 px-8 h-auto"
              onClick={saveDraftHandler}
              loading={isSavingDraft}
            >
              Save As Draft
              <FileTextOutlined />
            </SecondaryButton>
          </Col>
        </Row>
      )}
      <Row id="main-content-row" gutter={20} className="mt-5">
        <Col id="main-content-col" md={20}>
          {notFoundStatus?.status ? (
            <DataNotFound
              id="data-not-found"
              name={notFoundStatus?.name}
              backURL={"/"}
            />
          ) : (
            <ManageStatementUI
              form={form}
              handleformvalues={handleformvalues}
              onFinish={onFinish}
              screenLoading={screenLoading}
              nickNameData={nickNameData}
              isEdit={isEdit}
              editorState={editorState}
              setEditorState={setEditorState}
              submitIsDisable={submitIsDisable}
              editCampStatementData={editCampStatementData}
              onDiscardClick={onDiscardClick}
              isDisabled={isDisabled}
              onPreviewClick={onPreviewClick}
              isDraft={isDraft}
              autoSave={autoSave}
              isAutoSaving={isAutoSaving}
              values={values}
              // onImproveClick={onImproveClick}
              // isGenerating={isGenerating}
            />
          )}
        </Col>
      </Row>
      <StatementPreview
        isLoading={isPopupLoading}
        isVisible={isPreviewOpen}
        statement={editorState}
        onPreveiwClose={onPreveiwClose}
      />
      <StatementAIPreview
        isLoading={isPrePopupLoading}
        isVisible={isAIPreviewOpen}
        statement={improvedContent?.content}
        onPreveiwClose={onAiPreveiwClose}
        onInsertClick={onInsertClick}
      />
    </div>
  );
}

export default ManageStatements;
