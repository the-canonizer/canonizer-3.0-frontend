import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Input,
  Select,
  Typography,
  Tooltip,
} from "antd";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "antd/dist/antd.css";
import styles from "../addEditNews.module.scss";
import K from "../../../../constants";
import messages from "../../../../messages";
import {
  getAllUsedNickNames,
  getAllParentsCamp,
  getAllCampNickNames,
} from "../../../../network/api/campDetailApi";
import useAuthentication from "../../../../hooks/isUserAuthenticated";
import {
  getEditStatementApi,
  getEditCampApi,
  getEditTopicApi,
} from "../../../../network/api/campManageStatementApi";

import CustomSkelton from "../../../common/customSkelton";
import { getCurrentTopicRecordApi } from "../../../../network/api/campDetailApi";
import {
  updateStatementApi,
  updateTopicApi,
  updateCampApi,
} from "../../../../network/api/campManageStatementApi";

import { getCanonizedNameSpacesApi } from "../../../../network/api/homePageApi";
// "../../../network/api/homePageApi";

import CampInfoBar from "../../TopicDetails/CampInfoBar";
import PreventSubCamps from "../../../common/preventSubCampCheckbox";

import { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  replaceSpecialCharacters,
  allowedEmojies,
  emojiValidation,
  changeSlashToArrow,
} from "src/utils/generalUtility";
import DataNotFound from "../../DataNotFound/dataNotFound";

//Ckeditor
const Editorckl = dynamic(() => import("../../../common/editorck"), {
  ssr: false,
});

const EditorToolbarItems = [
  "heading",
  "|",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "superscript",
  "subscript",
  "|",
  "numberedList",
  "bulletedList",
  "alignment",
  "todoList",
  "|",
  "fontSize",
  "fontColor",
  "fontBackgroundColor",
  "highlight",
  "fontFamily",
  "|",
  "indent",
  "outdent",
  "|",
  "link",
  "autolink",
  "imageInsert",
  "blockQuote",
  "insertTable",
  "mediaEmbed",
  "|",
  "findAndReplace",
  "horizontalLine",
  "pageBreak",
  "specialCharacters",
  "|",
  "undo",
  "redo",
];

// let htmlToDraft: any = null;
// if (typeof window === "object") {
//   htmlToDraft = require("html-to-draftjs").default;
// }
const { Text } = Typography;

const { campAboutUrlRule, summaryRule, keywordsRule, patterns } = messages;

export default function AddOrManage({ add }: any) {
  const { isUserAuthenticated } = useAuthentication();
  const router = useRouter();
  const [notFoundStatus, setNotFoundStatus] = useState({
    status: false,
    name: "",
  });
  const [editStatementData, setEditStatementData] = useState({ data: null });
  const [submitIsDisable, setSubmitIsDisable] = useState(true);
  const [submitIsDisableCheck, setSubmitIsDisableCheck] = useState(true);
  const [nickNameData, setNickNameData] = useState([]);
  const [campLeaderData, setCampLeaderData] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  const [payloadBreadCrumb, setPayloadBreadCrumb] = useState({
    topic_num: "",
    camp_num: "",
  });
  const [originalData, setOriginalData] = useState({ name_space: null });
  const [parentCamp, setParentCamps] = useState([]);

  const [editorState, setEditorState] = useState("");

  const [campNickName, setCampNickName] = useState([]);
  const [canNameSpace, setCanNameSpace] = useState([]);
  const [options, setOptions] = useState([...messages.preventCampLabel]);
  const [initialOptions, setInitialOptions] = useState([]);
  const [editCampStatementData, setEditCampStatementData] = useState("");
  // const [statementResponseDisable, setStatementResponseDisable] =
  //   useState(false);
  const [existedTopic, setExistedTopic] = useState({
    data: null,
    url: "",
    status: false,
  });
  const [form] = Form.useForm();
  let objection = router?.query?.statement?.at(0)?.split("-")[1] == "objection";
  let update = router?.query?.statement?.at(0)?.split("-")[1] == "update";
  let manageFormOf = router?.asPath.split("/")[2];
  // let editorTextLength = editorState.replace(/<(?!img\b)[^\s<>]*>/, "").length;

  const onFinish = async (values: any) => {
    setScreenLoading(true);
    let res;
    let editInfo = editStatementData?.data;
    let parent_camp = editInfo?.parent_camp;
    options.map((op) => (values[op.id] = op.checked ? 1 : 0));
    res = await addOrManageStatement(values);

    if (res?.status_code == 200) {
      if (add) {
        router?.push(
          router?.asPath.replace("create/statement", "statement/history")
        );
        return;
      } else {
        let route =
          manageFormOf == "topic"
            ? `${editInfo?.topic?.topic_num}-${replaceSpecialCharacters(
                editInfo?.topic?.topic_name,
                "-"
              )}`
            : `${editInfo?.topic?.topic_num}-${replaceSpecialCharacters(
                editInfo?.topic?.topic_name,
                "-"
              )}/${
                parent_camp[parent_camp?.length - 1]?.camp_num
              }-${replaceSpecialCharacters(
                parent_camp[parent_camp?.length - 1]?.camp_name,
                "-"
              )}`;
        if (manageFormOf == "camp") {
          router?.push(`/camp/history/${route}`);
          return;
        } else if (manageFormOf == "statement") {
          router?.push(`/statement/history/${route}`);
          return;
        } else if (manageFormOf == "topic") {
          router?.push(`/topic/history/${route}`);
          return;
        }
      }
      const oldOptions = [...options];
      await oldOptions.map((op) => {
        op.checked = false;
      });
      setOptions(oldOptions);
    }
    setScreenLoading(false);
  };

  const addOrManageStatement = async (values) => {
    const blocks = editorState;
    let editInfo = editStatementData?.data;
    let parent_camp = editInfo?.parent_camp;
    let reqBody = {
      topic_num: add
        ? router?.query?.statement[0]?.split("-")[0]
        : manageFormOf == "topic"
        ? editInfo?.topic?.topic_num
        : parent_camp[parent_camp?.length - 1]?.topic_num,
      topic_id: manageFormOf == "topic" ? editInfo?.topic?.id : null,
      topic_name: manageFormOf == "topic" ? values?.topic_name : null,
      namespace_id:
        manageFormOf == "topic"
          ? values?.name_space
            ? values?.name_space
            : editInfo?.topic?.namespace_id
          : null,
      camp_num: add
        ? router?.query?.statement[1]?.split("-")[0]
        : manageFormOf == "topic"
        ? null
        : parent_camp[parent_camp?.length - 1]?.camp_num,
      nick_name: values?.nick_name,
      note: values?.edit_summary?.trim(),
      submitter: add
        ? nickNameData[0]?.id
        : manageFormOf == "camp"
        ? editInfo?.camp?.submitter_nick_id
        : manageFormOf == "topic"
        ? editInfo?.topic?.submitter_nick_id
        : editInfo?.statement?.submitter_nick_id,
      statement: blocks, //JSON.stringify(convertToRaw(contentState)),//values?.statement?.blocks[0].text.trim(),
      event_type: add
        ? "create"
        : update
        ? "edit"
        : objection
        ? "objection"
        : "update",
      statement_id:
        (objection || update) && manageFormOf == "statement"
          ? router?.query?.statement[0]?.split("-")[0]
          : null,
      objection_reason: objection ? values?.objection_reason : null,
      statement_update: update && manageFormOf == "statement" ? 1 : null,
      camp_id: manageFormOf == "camp" ? editInfo?.camp?.id : null,
      camp_name: manageFormOf == "camp" ? values.camp_name : null,
      key_words: manageFormOf == "camp" ? values.keywords : null,
      camp_about_url: manageFormOf == "camp" ? values?.camp_about_url : null,
      camp_about_nick_id:
        manageFormOf == "camp"
          ? objection
            ? editInfo?.camp?.camp_about_nick_id
            : values?.camp_about_nick_name
          : null,
      parent_camp_num:
        manageFormOf == "camp" && editInfo?.parent_camp.length > 1
          ? values?.parent_camp_num
          : null,
      old_parent_camp_num:
        manageFormOf == "camp" ? editInfo?.camp?.parent_camp_num : null,
      camp_leader_nick_id:
        values?.camp_leader_nick_id && manageFormOf == "camp"
          ? values?.camp_leader_nick_id
          : null,
    };
    let res;
    if (manageFormOf == "camp") {
      options.map((op) => (reqBody[op.id] = op.checked ? 1 : 0));
      res = await updateCampApi(reqBody);
      if (res.status_code == 200) {
        // setStatementResponseDisable(true);
      }
    } else if (manageFormOf == "statement") {
      res = await updateStatementApi(reqBody);
      if (res.status_code == 200) {
        // setStatementResponseDisable(true);
      }
    } else if (manageFormOf == "topic") {
      res = await updateTopicApi(reqBody);
      if (res.status_code == 200) {
        // setStatementResponseDisable(true);
      }

      if (res?.status_code == 400) {
        let url = null;

        if ("existed_topic_reference" in res.error) {
          let topicId = res?.error?.existed_topic_reference?.topic_num;
          let topicName = replaceSpecialCharacters(
            res?.error?.existed_topic_reference?.topic_name,
            "_"
          );
          url = `/topic/${topicId}-${topicName}/1-Agreement`;

          setExistedTopic({
            ...existedTopic,
            data: res?.error?.topic_name,
            url: url,
            status: true,
          });
        }
      }
    }

    return res;
  };
  const fetchCampNickNameList = async () => {
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
  };
  const fetchNameSpaceList = async () => {
    let response = await getCanonizedNameSpacesApi();
    if (response && response.status_code === 200) {
      // setCanNameSpace(response?.data);

      let filteredNamespace = [];

      if (
        originalData?.name_space &&
        (originalData?.name_space === 16 || originalData?.name_space === 19)
      ) {
        filteredNamespace = response.data;
      } else {
        filteredNamespace = response?.data?.filter(
          (n: { id: number }) => n?.id !== 16 && n?.id !== 19
        );
      }

      setCanNameSpace(filteredNamespace);
    }
  };
  const fetchParentsCampList = async (
    topic_num: number,
    parent_camp_num: number,
    camp_num: number
  ) => {
    const body = { topic_num, parent_camp_num, camp_num };
    let res = await getAllParentsCamp(body);
    if (res && res.status_code === 200) {
      setParentCamps(res.data);
    }
  };
  // const isJSON = (str) => {
  //   try {
  //     return JSON.parse(str) && !!str;
  //   } catch (e) {
  //     return false;
  //   }
  // };

  useEffect(() => {
    setScreenLoading(true);
    async function nickNameListApiCall() {
      let res;
      if (!add) {
        let getDataPayload = {
          record_id: router?.query?.statement?.at(0)?.split("-")[0],
          event_type: objection ? "objection" : "edit",
        };
        if (manageFormOf == "statement") {
          res = await getEditStatementApi(getDataPayload);
          if (res && res?.status_code == 404) {
            setNotFoundStatus({ status: true, name: "Statement" });
          }
          if (res && res.status_code == 200) {
            setEditCampStatementData(res?.data?.statement?.note);
          }
          if (
            res?.data?.statement?.parsed_value &&
            !res?.data?.statement?.parsed_value?.startsWith("<p>") &&
            !res?.data?.statement?.parsed_value?.startsWith("<div>")
          )
            res.data.statement.parsed_value = `<div><div/>${res.data?.statement?.parsed_value}`;
          const editor_statement = res?.data?.statement?.parsed_value;
          // const contentBlocks = htmlToDraft(res.data.statement.parsed_value);
          // const contentState = ContentState.createFromBlockArray(
          //   contentBlocks.contentBlocks
          // );
          setEditorState(`${editor_statement}`);

          if (
            res?.data?.statement?.go_live_time <
              Math.floor(new Date().getTime() / 1000) &&
            objection
          ) {
            router?.back();
          } else {
            setPayloadBreadCrumb({
              camp_num: res?.data?.statement?.camp_num ?? "1",
              topic_num: res?.data?.statement?.topic_num,
            });
          }
        } else if (manageFormOf == "camp") {
          res = await getEditCampApi(getDataPayload);
          if (
            res?.data?.camp?.go_live_time <
              Math.floor(new Date().getTime() / 1000) &&
            objection
          ) {
            router?.back();
          } else {
            fetchCampNickNameList();
            if (res?.data?.camp?.parent_camp_num) {
              fetchParentsCampList(
                res?.data?.camp?.topic_num,
                res?.data?.camp?.parent_camp_num,
                res?.data?.camp?.camp_num
              );
            }
            setPayloadBreadCrumb({
              camp_num: res?.data?.camp?.camp_num ?? "1",
              topic_num: res?.data?.camp?.topic_num,
            });
          }
          if (
            res?.status_code == 200 &&
            res?.data?.eligible_camp_leaders?.length > 0
          ) {
            setCampLeaderData(res?.data?.eligible_camp_leaders);
          }
        } else if (manageFormOf == "topic") {
          res = await getEditTopicApi(getDataPayload);
          if (
            res?.data?.topic?.go_live_time <
              Math.floor(new Date().getTime() / 1000) &&
            objection
          ) {
            router?.back();
          } else {
            // fetchNameSpaceList();
            setPayloadBreadCrumb({
              topic_num: res?.data?.topic?.topic_num,
              camp_num: "1",
            });
          }
        } else {
          res = await getEditStatementApi(getDataPayload);
        }
        if (res && res.status_code === 200) {
          setEditStatementData(res);
        }
      } else {
        await getCurrentTopicRecordApi({
          topic_num: router?.query?.statement?.at(0).split("-")[0],
          camp_num: router?.query?.statement?.at(1).split("-")[0] ?? "1",
        });
        setPayloadBreadCrumb({
          camp_num: router?.query?.statement?.at(1).split("-")[0] ?? "1",
          topic_num: router?.query?.statement?.at(0).split("-")[0],
        });
      }
      const reqBody = {
        topic_num: add
          ? router?.query?.statement?.at(0)?.split("-")[0]
          : res?.data?.topic?.topic_num,
      };
      const result = await getAllUsedNickNames(reqBody);
      if (result?.status_code == 200) {
        let fieldSValuesForForm = add
          ? {
              nick_name: result?.data?.at(0)?.id,
            }
          : (objection || update) && manageFormOf == "statement"
          ? {
              nick_name: res?.data?.nick_name?.at(0)?.id,
              parent_camp_num: res?.data?.statement?.camp_num,
              statement: res?.data?.statement?.parsed_value,
              edit_summary: res?.data?.statement?.note,
            }
          : manageFormOf == "camp"
          ? {
              nick_name: res?.data?.nick_name?.at(0)?.id,
              statement: res?.data?.camp?.note,
              parent_camp_num: res?.data?.camp?.parent_camp_num,
              camp_name: res?.data?.camp?.camp_name,
              keywords: res?.data?.camp?.key_words,
              camp_about_url: res?.data?.camp?.camp_about_url,
              camp_about_nick_name:
                res?.data?.camp?.camp_about_nick_id > 0
                  ? res?.data?.camp?.camp_about_nick_id
                  : null,
              edit_summary: update ? res?.data?.camp?.note : null,
            }
          : manageFormOf == "topic"
          ? {
              nick_name: res?.data?.nick_name[0]?.id,
              topic_name: res?.data?.topic?.topic_name,
              name_space: res?.data?.topic?.namespace_id,
            }
          : {
              nick_name: res?.data?.nick_name[0]?.id,
              statement: res?.data?.statement?.parsed_value,
              parent_camp_num: res?.data?.statement?.camp_num,
            };

        form.setFieldsValue(fieldSValuesForForm);

        setInitialFormValues(form?.getFieldsValue());

        const og: any = { ...fieldSValuesForForm };
        setOriginalData(og);

        setNickNameData(result?.data);
        if (manageFormOf == "topic" || manageFormOf == "camp") {
          const oldOptions = [...options];

          await oldOptions.map((op) => {
            if (op.id === "is_disabled") {
              op.checked =
                res?.data[manageFormOf]?.is_disabled === 1 ? true : false;
            }
            if (op.id === "is_one_level") {
              op.checked =
                res?.data[manageFormOf]?.is_one_level === 1 ? true : false;
            }
            if (op.id === "is_archive") {
              op.checked =
                res?.data[manageFormOf]?.is_archive === 1 ? true : false;
              op.tooltip = op.checked
                ? "Unarchive the camp."
                : "Archive the camp.";
              if (
                res?.data[manageFormOf]?.direct_archive === 0 &&
                res?.data[manageFormOf]?.is_archive === 0
              )
                op.disable = false;
              else if (
                res?.data[manageFormOf]?.direct_archive === 0 &&
                res?.data[manageFormOf]?.is_archive === 1
              ) {
                op.disable = true;
              } else if (
                res?.data[manageFormOf]?.direct_archive === 1 &&
                res?.data[manageFormOf]?.is_archive === 1
              ) {
                op.disable = false;
              }
            }
          });

          setOptions(oldOptions);
          setInitialOptions([
            {
              checked: oldOptions[0]?.checked,
              disable: oldOptions[0]?.disable,
            },
            {
              checked: oldOptions[1]?.checked,
              disable: oldOptions[1]?.disable,
            },
            {
              checked: oldOptions[2]?.checked,
              disable: oldOptions[2]?.disable,
            },
          ]);
        }
      }
      setScreenLoading(false);
    }
    isUserAuthenticated
      ? nickNameListApiCall()
      : router?.push({
          pathname: "/login",
          query: { returnUrl: router?.asPath },
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let formTitle = () => {
    let update: string;
    if (manageFormOf == "statement") {
      update = "Statement Update";
    } else if (manageFormOf == "camp") {
      update = "Camp Update";
    } else if (manageFormOf == "topic") {
      update = "Topic Update";
    }
    return update;
  };

  // checkbox
  useEffect(() => {
    return () => {
      const oldOptions = [...options];
      oldOptions.map((op) => {
        op.checked = false;
      });

      setOptions(oldOptions);
      setInitialOptions([
        {
          checked: oldOptions[0]?.checked,
          disable: oldOptions[0]?.disable,
        },
        {
          checked: oldOptions[1]?.checked,
          disable: oldOptions[1]?.disable,
        },
        {
          checked: oldOptions[2]?.checked,
          disable: oldOptions[2]?.disable,
        },
      ]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toolTipContent = "This camp is under review";

  const onCheckboxChange = async (e: CheckboxChangeEvent) => {
    const oldOptions = [...options];

    await oldOptions.map((op) => {
      if (op.id === e.target.value) {
        op.checked = e.target.checked;
      } else {
        op.checked = false;
      }
      op.tooltip =
        op.id === "is_archive"
          ? op.checked
            ? "Unarchive the camp."
            : "Archive the camp."
          : op.tooltip;
    });
    setOptions(oldOptions);
    if (
      oldOptions[0]?.checked == initialOptions[0]?.checked &&
      oldOptions[0]?.disable == initialOptions[0]?.disable &&
      oldOptions[1]?.checked == initialOptions[1]?.checked &&
      oldOptions[1]?.disable == initialOptions[1]?.disable &&
      oldOptions[2]?.checked == initialOptions[2]?.checked &&
      oldOptions[2]?.disable == initialOptions[2]?.disable
    ) {
      setSubmitIsDisableCheck(true);
    } else {
      setSubmitIsDisableCheck(false);
    }
  };
  const extra = () => {
    if (manageFormOf == "camp" && !objection) {
      return (
        <PreventSubCamps
          options={options}
          onCheckboxChange={onCheckboxChange}
        />
      );
    } else {
      return null;
    }
  };

  const onEditorStateChange = (changedata: any) => {
    const datachangec = `${changedata}`;
    setEditorState(datachangec);
    if (manageFormOf == "statement") {
      form.setFieldsValue({ statement: datachangec });
      handleformvalues();
    }
  };

  const handleformvalues = () => {
    setExistedTopic({
      data: null,
      url: "",
      status: false,
    });
    let initialFormStatus = {
      statement: "",
      edit_summary: "",
    } as any;

    let nowFormStatus = {
      statement: "",
      edit_summary: "",
    } as any;

    initialFormStatus = Object.keys(initialFormValues).reduce((acc, key) => {
      acc[key] =
        initialFormValues[key] === null || undefined
          ? ""
          : initialFormValues[key];
      return acc;
    }, {});
    if (initialFormStatus?.edit_summary == null || undefined) {
      initialFormStatus.edit_summary = "";
    }
    if (initialFormStatus?.statement == null || undefined) {
      initialFormStatus.statement = "";
    }
    if (typeof initialFormStatus.edit_summary == "string") {
      initialFormStatus.edit_summary = initialFormStatus.edit_summary.trim();
    }
    if (typeof initialFormStatus.statement == "string") {
      initialFormStatus.statement = initialFormStatus.statement.trim();
    }
    nowFormStatus = Object.keys(form?.getFieldsValue()).reduce((acc, key) => {
      acc[key] =
        form?.getFieldsValue()[key] === null || undefined
          ? ""
          : form?.getFieldsValue()[key];
      return acc;
    }, {});
    if (nowFormStatus?.parent_camp_num) {
      delete nowFormStatus.parent_camp_num;
    }
    if (nowFormStatus?.edit_summary == null || undefined) {
      nowFormStatus.edit_summary = "";
    }
    if (nowFormStatus?.statement == null || undefined) {
      nowFormStatus.statement = "";
    }
    if (typeof nowFormStatus.edit_summary == "string") {
      nowFormStatus.edit_summary = nowFormStatus.edit_summary.trim();
    }
    if (typeof nowFormStatus.statement == "string") {
      nowFormStatus.statement = nowFormStatus.statement.trim();
    }
    if (JSON.stringify(nowFormStatus) == JSON.stringify(initialFormStatus)) {
      setSubmitIsDisable(true);
    } else {
      setSubmitIsDisable(false);
    }
  };

  useEffect(() => {
    if (manageFormOf == "topic") {
      fetchNameSpaceList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalData]);

  return (
    <>
      {notFoundStatus?.status ? (
        <DataNotFound name={notFoundStatus?.name} backURL={"/"} />
      ) : (
        <div className={styles.topicDetailContentWrap}>
          <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
            {/* <SideBarNoFilter /> */}
          </aside>

          <div className="pageContentWrap">
            {!!payloadBreadCrumb?.camp_num && (
              <CampInfoBar
                payload={payloadBreadCrumb}
                isTopicHistoryPage={manageFormOf == "topic" ? true : false}
              />
            )}
            <Card
              title={
                add
                  ? K?.exceptionalMessages?.addCampStatement
                  : !objection
                  ? formTitle()
                  : K?.exceptionalMessages?.objectionStatementHeading
              }
              className={styles.card}
              extra={extra()}
            >
              <Form
                form={form}
                layout={"vertical"}
                validateTrigger={messages.formValidationTypes()}
                initialValues={{
                  available_for_child: 0,
                }}
                onValuesChange={handleformvalues}
                onFinish={onFinish}
              >
                <Row gutter={28}>
                  <Col xs={24} sm={24} xl={12}>
                    {/* Nickname=================================================================== */}
                    <Form.Item
                      className={styles.formItem}
                      label={
                        <>
                          Nickname <span className="required">*</span>
                        </>
                      }
                      name="nick_name"
                      rules={[
                        {
                          required: true,
                          message:
                            K?.exceptionalMessages?.selectNickNameErrorMsg,
                        },
                      ]}
                    >
                      {screenLoading ? (
                        <CustomSkelton
                          skeltonFor="list"
                          bodyCount={1}
                          stylingClass="listSkeleton"
                          isButton={false}
                        />
                      ) : (
                        <Select
                          value={nickNameData[0]?.id}
                          size="large"
                          showSearch
                          optionFilterProp="children"
                        >
                          {!!nickNameData &&
                            nickNameData?.map((names) => (
                              <Select.Option value={names.id} key={names?.id}>
                                {names?.nick_name}
                              </Select.Option>
                            ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  {/* paraent Camp -----------------------===============--------------------------*/}
                  {manageFormOf == "camp" && (
                    <>
                      {parentCamp.length >= 1 && (
                        <Col xs={24} sm={24} xl={12}>
                          <Form.Item
                            className={`${styles.formItem} mb-2`}
                            label={
                              <>
                                Parent Camp <span className="required">*</span>
                              </>
                            }
                            name="parent_camp_num"
                            rules={[
                              {
                                required: true,
                                message:
                                  K?.exceptionalMessages
                                    ?.selectNickNameErrorMsg,
                              },
                            ]}
                          >
                            {screenLoading ? (
                              <CustomSkelton
                                skeltonFor="list"
                                bodyCount={1}
                                stylingClass="listSkeleton"
                                isButton={false}
                              />
                            ) : (
                              <Select
                                showSearch
                                size={"large"}
                                placeholder="Parent camp"
                                // data-id="parent-camp"
                                disabled={objection}
                                optionFilterProp="children"
                                onChange={() => {
                                  setSubmitIsDisable(false);
                                }}
                                filterOption={(input, option) =>
                                  (
                                    (option?.children as any)?.props
                                      ?.children ?? ""
                                  )
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              >
                                {parentCamp.map((camp) =>
                                  camp?.camp_num !==
                                  editStatementData?.data?.camp?.camp_num ? (
                                    <Select.Option
                                      value={camp.camp_num}
                                      key={camp.id}
                                      disabled={
                                        camp.parent_change_in_review == true
                                          ? true
                                          : false
                                      }
                                    >
                                      <Tooltip
                                        title={
                                          camp.parent_change_in_review == true
                                            ? toolTipContent
                                            : null
                                        }
                                      >
                                        {camp.camp_name}
                                      </Tooltip>
                                    </Select.Option>
                                  ) : (
                                    ""
                                  )
                                )}
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      )}
                      {/* camp name -------------------------------------------------------- -----------------------*/}
                      <Col xs={24} sm={24} xl={12}>
                        <Form.Item
                          className={`${styles.formItem} mb-2`}
                          label={
                            <>
                              Camp Name <span className="required">*</span>
                              <span className={styles.small}>
                                (Limit 30 Chars)
                              </span>
                            </>
                          }
                          name="camp_name"
                          rules={[
                            {
                              required: true,
                              message: K?.exceptionalMessages?.campNameReqErr,
                            },
                            {
                              pattern: /[^ \s]/,
                              message: K?.exceptionalMessages?.campNameReqErr,
                            },
                            emojiValidation(patterns.emoji_restrication),
                          ]}
                        >
                          {screenLoading ? (
                            <CustomSkelton
                              skeltonFor="list"
                              bodyCount={1}
                              stylingClass="listSkeleton"
                              isButton={false}
                            />
                          ) : (
                            <Input
                              disabled={!!(parentCamp.length < 1 || objection)}
                              maxLength={30}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      {/* keywords  --------------------------------------------------- */}
                      <Col xs={24} sm={24} xl={12}>
                        {!objection && (
                          <Form.Item
                            className={`${styles.formItem} mb-2`}
                            label={<>Keywords</>}
                            name="keywords"
                            {...keywordsRule}
                          >
                            {screenLoading ? (
                              <CustomSkelton
                                skeltonFor="list"
                                bodyCount={1}
                                stylingClass="listSkeleton"
                                isButton={false}
                              />
                            ) : (
                              <Input />
                            )}
                          </Form.Item>
                        )}
                      </Col>

                      {/* Camp Leader =================================================================== */}

                      <Col xs={24} sm={24} xl={12}>
                        <Form.Item
                          className={styles.formItem}
                          label={<>Camp Leader</>}
                          name="camp_leader_nick_id"
                        >
                          {screenLoading ? (
                            <CustomSkelton
                              skeltonFor="list"
                              bodyCount={1}
                              stylingClass="listSkeleton"
                              isButton={false}
                            />
                          ) : (
                            <Select
                              showSearch
                              size={"large"}
                              placeholder="Camp Leader"
                              // data-id="parent-camp"
                              disabled={objection}
                              optionFilterProp="children"
                              onChange={() => {
                                setSubmitIsDisable(false);
                              }}
                              filterOption={(input, option) =>
                                (
                                  (option?.children as any)?.props?.children ??
                                  ""
                                )
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                            >
                              {campLeaderData?.length > 0 &&
                                campLeaderData?.map((lead) => (
                                  <Select.Option
                                    value={lead.nick_name_id}
                                    key={lead?.nick_name_id}
                                  >
                                    {lead?.nick_name}
                                  </Select.Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  {/* Topic name =========================================== */}
                  {manageFormOf == "topic" && (
                    <>
                      <Col xs={24} sm={24} xl={12}>
                        <Form.Item
                          className={`${styles.formItem} mb-2`}
                          label={
                            <>
                              Topic Name <span className="required">*</span>
                              <span className={styles.small}>
                                (Limit 30 Chars)
                              </span>
                            </>
                          }
                          name="topic_name"
                          rules={[
                            {
                              required: true,
                              message: K?.exceptionalMessages?.topicNameReqErr,
                            },
                            {
                              pattern: /[^ \s]/,
                              message: K?.exceptionalMessages?.topicNameReqErr,
                            },
                            emojiValidation(patterns.emoji_restrication),
                          ]}
                        >
                          {screenLoading ? (
                            <CustomSkelton
                              skeltonFor="list"
                              bodyCount={1}
                              stylingClass="listSkeleton"
                              isButton={false}
                            />
                          ) : (
                            <Input disabled={objection} maxLength={30} />
                          )}
                        </Form.Item>
                        {existedTopic?.status == true && (
                          <a
                            className={styles.topicNameWarning}
                            onClick={() => router.push(existedTopic?.url)}
                          >
                            {existedTopic?.data}
                          </a>
                        )}
                      </Col>
                      {/* Name space -------------------------------------------------------------------- */}
                      {!objection && (
                        <Col xs={24} sm={24} xl={12}>
                          <Form.Item
                            className={`${styles.formItem} namespace_in mb-2`}
                            label={
                              <>
                                Canon <span className="required">*</span>
                                <span className={styles.small}>
                                  (General is recommended, unless you know
                                  otherwise)
                                </span>
                              </>
                            }
                            name="name_space"
                            rules={[
                              {
                                required: true,
                                message:
                                  K?.exceptionalMessages
                                    ?.selectNickNameErrorMsg,
                              },
                            ]}
                          >
                            {screenLoading ? (
                              <CustomSkelton
                                skeltonFor="list"
                                bodyCount={1}
                                stylingClass="listSkeleton"
                                isButton={false}
                              />
                            ) : (
                              <Select
                                size={"large"}
                                placeholder="Name Space"
                                showSearch
                                optionFilterProp="children"
                              >
                                {canNameSpace.map((camp) => (
                                  <Select.Option value={camp.id} key={camp.id}>
                                    {changeSlashToArrow(camp.label)}
                                  </Select.Option>
                                ))}
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      )}
                    </>
                  )}
                  {/* statement================================================================================ */}
                  {manageFormOf == "statement" && !objection && (
                    <Col xs={24} xl={24}>
                      <Form.Item
                        className={`${styles.formItem} mb-2`}
                        name="statement"
                        label={
                          <>
                            Statement <span className="required">*</span>
                          </>
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              K?.exceptionalMessages?.statementRequiredErrorMsg,
                          },
                          {
                            pattern: /[^ \s]/,
                            message:
                              K?.exceptionalMessages?.statementRequiredErrorMsg,
                          },

                          // allowedEmojies(), this needs to be moved to validation file
                        ]}
                      >
                        {screenLoading ? (
                          <CustomSkelton
                            bodyCount
                            stylingClass
                            isButton
                            height={250}
                            skeltonFor="video"
                          />
                        ) : (
                          <Editorckl
                            editorState={editorState}
                            oneditorchange={onEditorStateChange}
                            placeholder="Write Your Statement Here"
                            items={EditorToolbarItems}
                          ></Editorckl>
                        )}
                      </Form.Item>
                    </Col>
                  )}

                  <Col xs={24} xl={24}>
                    {/* object reason  =================================================================================? */}
                    {objection ? (
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message:
                              K?.exceptionalMessages?.objectionRequireErrorMsg,
                          },
                          {
                            pattern: /[^ \s]/,
                            message: K?.exceptionalMessages?.objectionIsRequire,
                          },
                          allowedEmojies(),
                        ]}
                        className={styles.formItem}
                        name="objection_reason"
                        label={
                          <>
                            Your Objection Reason{" "}
                            <span className="required">*</span>{" "}
                            <small>(Limit 100 Char) </small>
                          </>
                        }
                      >
                        {screenLoading ? (
                          <CustomSkelton
                            skeltonFor="list"
                            bodyCount={1}
                            stylingClass="listSkeleton"
                            isButton={false}
                          />
                        ) : (
                          <Input.TextArea
                            size="large"
                            rows={1}
                            maxLength={100}
                          />
                        )}
                      </Form.Item>
                    ) : (
                      <>
                        {/* edit sumaruy ========================================================================================= */}
                        <Form.Item
                          className={styles.formItem}
                          name="edit_summary"
                          label={
                            <>
                              Edit Summary{" "}
                              <small className={styles.small}>
                                (Briefly describe your changes)
                              </small>
                            </>
                          }
                          {...summaryRule}
                        >
                          {screenLoading ? (
                            <CustomSkelton
                              bodyCount
                              stylingClass
                              isButton
                              height={200}
                              skeltonFor="video"
                            />
                          ) : (
                            <Input.TextArea
                              size="large"
                              rows={7}
                              defaultValue={String(editCampStatementData)}
                            />
                          )}
                        </Form.Item>
                        {manageFormOf == "camp" && (
                          <Text type="danger">
                            The following fields are rarely used and are for
                            advanced users only.
                          </Text>
                        )}
                        {/* Camp about url ===================================================== ----------------- */}
                        {manageFormOf == "camp" && (
                          <>
                            <Form.Item
                              className={`${styles.formItem} mb-2`}
                              label={
                                <>
                                  Camp About URL
                                  <span className={styles.small}>
                                    (Limit 1024 Chars)
                                  </span>
                                </>
                              }
                              name="camp_about_url"
                              // rules={[
                              //   {
                              //     pattern: /[^ \s]/,
                              //     message: "Enter a valid link",
                              //   },
                              // ]}

                              {...campAboutUrlRule}
                            >
                              {screenLoading ? (
                                <CustomSkelton
                                  skeltonFor="list"
                                  bodyCount={1}
                                  stylingClass="listSkeleton"
                                  isButton={false}
                                />
                              ) : (
                                <Input maxLength={1024} />
                              )}
                            </Form.Item>
                            {/* cmap about Nickname ========================================== --------------------- */}
                            <Form.Item
                              className={`${styles.formItem} mb-2`}
                              label={<>Camp About Nickname</>}
                              name="camp_about_nick_name"
                            >
                              {screenLoading ? (
                                <CustomSkelton
                                  skeltonFor="list"
                                  bodyCount={1}
                                  stylingClass="listSkeleton"
                                  isButton={false}
                                />
                              ) : (
                                <Select
                                  size={"large"}
                                  placeholder="--Select Camp About Nickname"
                                  // data-id="parent-camp"
                                  showSearch
                                  optionFilterProp="children"
                                >
                                  {campNickName.map((camp) => (
                                    <Select.Option
                                      value={camp.id}
                                      key={camp.id}
                                    >
                                      {camp.nick_name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              )}
                            </Form.Item>
                          </>
                        )}
                      </>
                    )}
                  </Col>
                  <Col xs={24} xl={24}>
                    <Form.Item className="mb-0">
                      {screenLoading ? (
                        <>
                          <div className="manage-form-btnwrap">
                            <CustomSkelton
                              skeltonFor="list"
                              bodyCount={1}
                              stylingClass="listSkeleton"
                              isButton={false}
                            />
                            {!objection && (
                              <>
                                <CustomSkelton
                                  skeltonFor="list"
                                  bodyCount={1}
                                  stylingClass="listSkeleton"
                                  isButton={false}
                                />{" "}
                                <CustomSkelton
                                  skeltonFor="list"
                                  bodyCount={1}
                                  stylingClass="listSkeleton"
                                  isButton={false}
                                />
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            size="large"
                            className={`btn-orange mr-3 ${styles.btnSubmit}`}
                            htmlType="submit"
                            disabled={submitIsDisable && submitIsDisableCheck}
                            id="update-submit-btn"
                          >
                            {add
                              ? K?.exceptionalMessages?.submitStatementButton
                              : !objection
                              ? K?.exceptionalMessages?.submitUpdateButton
                              : "Submit Objection"}
                          </Button>
                          {!objection && (
                            <>
                              <Button
                                htmlType="button"
                                className="cancel-btn mr-3"
                                type="ghost"
                                size="large"
                                onClick={() => {
                                  let backdata = editStatementData?.data;
                                  setScreenLoading(true);
                                  add
                                    ? router.push(
                                        `/topic/${replaceSpecialCharacters(
                                          router?.query?.statement[0],
                                          "-"
                                        )}/${replaceSpecialCharacters(
                                          router?.query?.statement[1],
                                          "-"
                                        )}`
                                      )
                                    : router?.push(
                                        manageFormOf == "camp"
                                          ? `/camp/history/${
                                              backdata?.topic?.topic_num
                                            }-${replaceSpecialCharacters(
                                              backdata?.topic?.topic_name,
                                              "-"
                                            )}/${
                                              backdata?.parent_camp[
                                                backdata?.parent_camp.length - 1
                                              ].camp_num
                                            }-${replaceSpecialCharacters(
                                              backdata?.parent_camp[
                                                backdata?.parent_camp.length - 1
                                              ].camp_name,
                                              "-"
                                            )}`
                                          : manageFormOf == "statement"
                                          ? `/statement/history/${
                                              backdata?.topic?.topic_num
                                            }-${replaceSpecialCharacters(
                                              backdata?.topic?.topic_name,
                                              "-"
                                            )}/${
                                              backdata?.parent_camp[
                                                backdata?.parent_camp.length - 1
                                              ].camp_num
                                            }-${replaceSpecialCharacters(
                                              backdata?.parent_camp[
                                                backdata?.parent_camp.length - 1
                                              ].camp_name,
                                              "-"
                                            )}`
                                          : `/topic/history/${
                                              backdata?.topic?.topic_num
                                            }-${replaceSpecialCharacters(
                                              backdata?.topic?.topic_name,
                                              "-"
                                            )}`
                                      );
                                }}
                                id="update-cancel-btn"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
