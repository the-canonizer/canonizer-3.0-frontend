import { useEffect, useState } from "react";
import { Form, Row, Col, Typography, Modal } from "antd";
import { useRouter } from "next/router";
import {
  CloudUploadOutlined,
  ExclamationCircleFilled,
  FileTextOutlined,
  HomeOutlined,
} from "@ant-design/icons";
// import OpenAI from "openai";

import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import {
  getEditStatementApi,
  postStatementCountApi,
  updateStatementApi,
} from "src/network/api/campManageStatementApi";
import {
  epochToMinutes,
  replaceSpecialCharacters,
} from "src/utils/generalUtility";
import DataNotFound from "../DataNotFound/dataNotFound";
import Breadcrumbs from "components/shared/Breadcrumbs";
import CustomSpinner from "components/shared/CustomSpinner";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import ManageStatementUI from "./UI";
import StatementPreview from "./UI/preview";
import StatementAIPreview from "./UI/aiPreview";
// import { openNotificationWithIcon } from "components/common/notification/notificationBar";

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
  const [editStatementData, setEditStatementData] = useState(null);
  const [submitIsDisable, setSubmitIsDisable] = useState(false);
  const [nickNameData, setNickNameData] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);
  const [editorState, setEditorState] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editCampStatementData, setEditCampStatementData] = useState("");
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

  const values = Form.useWatch([], form);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  // const [isGenerating, setIsGenerating] = useState(false);

  const getEpochTime = () => {
    return Math.floor(Date.now() / 1000);
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      setTime((prevTime) => ({
        ...prevTime,
        current_time: getEpochTime(),
      }));

      let timeDifference = getEpochTime() - time?.last_save_time;

      if (epochToMinutes(time?.last_save_time) == 0) {
        setAutoSaveDisplayMessage("");
      } else if (epochToMinutes(timeDifference) == 0) {
        setAutoSaveDisplayMessage("Saved just now");
      } else {
        setAutoSaveDisplayMessage(
          `Saved ${epochToMinutes(timeDifference)} min ago`
        );
      }
    };

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
      JSON.stringify(statementValue) !=
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

  const getBackURL = () => {
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

    const createHistoryURL = () =>
      `/statement/history/${
        backdata?.topic?.topic_num
      }-${replaceSpecialCharacters(backdata?.topic?.topic_name, "-")}/${
        lastParentCamp?.camp_num
      }-${replaceSpecialCharacters(lastParentCamp?.camp_name, "-")}`;

    if (isEdit) {
      return is_draft ? topicURL() : createHistoryURL();
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

      if (isEdit) {
        const editRes = await getEditStatementApi({
          record_id: router?.query?.statement?.[0]?.split("-")[0],
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
        } else if (editRes?.status_code === 200) {
          const statement = editRes.data.statement;
          if (
            statement?.parsed_value &&
            !statement.parsed_value.startsWith("<p>") &&
            !statement.parsed_value.startsWith("<div>")
          ) {
            statement.parsed_value = `<div><div/>${statement.parsed_value}`;
          }
          setEditCampStatementData(editRes?.data?.statement?.note);
          setEditStatementData(editRes.data);
          setEditorState(statement?.parsed_value);
          editData = editRes.data;
        }
      }

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
  }, [isUserAuthenticated]);

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
    if (!isEdit || isDraft) {
      setIsAutoSaving(true);
      setStatement(data?.statement);
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

      setIsAutoSaving(false);
    }
  };

  const saveDraftHandler = async () => {
    setIsSavingDraft(true);

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
    } else {
      localStorage.setItem("autosaveContent", payload?.statement); // Save to local storage if offline

      setTime({
        ...time,
        last_save_time: getEpochTime(),
      });
    }

    setTimeout(() => setIsSavingDraft(false), 2000);
    router.push(
      `/topic/${getTopicAndCampIds().topicNum}-${
        getTopicAndCampIds().topicName
      }/${getTopicAndCampIds().campNum}`
    );
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
        title: "Do you want to discard this change?",
        icon: <ExclamationCircleFilled />,
        okText: "Publish Anyway",
        cancelText: "Review Other Statements",
        onCancel: () => { router.push({ pathname: getBackURL() });},	
        content:
          "The draft you have created is based on anolder version. Multiple versions have been published since then. Checkout the newer versions before publishing your statement.",
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
      } else if (isEdit) {
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
    const blocks = editorState;
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
      statement: blocks,
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

  const onEditorStateChange = (changedata: any) => {
    const datachangec = `${changedata}`;
    setEditorState(datachangec);
    form.setFieldsValue({ statement: datachangec });
    handleformvalues();
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

  return (
    <CustomSpinner key="create-statemnt-spinner" spinning={screenLoading}>
      <Row
        className="bg-canGray rounded-lg [&_nav]:p-0 [&_nav]:mb-0 py-5 px-4"
        gutter={20}
      >
        <Col md={12} className="flex justify-start items-center">
          <Breadcrumbs
            items={[
              { icon: <HomeOutlined className="text-canBlack" />, href: "/" },
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
            ]}
          />
        </Col>
        <Col className="flex justify-end items-center" md={12}>
          <Typography.Paragraph className="!mb-0 mr-7">
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
            className="flex items-center justify-center py-2 px-8 h-auto"
            onClick={saveDraftHandler}
            loading={isSavingDraft}
          >
            Save As Draft
            <FileTextOutlined />
          </SecondaryButton>
        </Col>
      </Row>
      <Row gutter={20} className="mt-5">
        <Col md={20}>
          {notFoundStatus?.status ? (
            <DataNotFound name={notFoundStatus?.name} backURL={"/"} />
          ) : (
            <ManageStatementUI
              form={form}
              handleformvalues={handleformvalues}
              onFinish={onFinish}
              screenLoading={screenLoading}
              nickNameData={nickNameData}
              isEdit={isEdit}
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
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
    </CustomSpinner>
  );
}

export default ManageStatements;
