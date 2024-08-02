import { useEffect, useState } from "react";
import { Form, Row, Col } from "antd";
import { useRouter } from "next/router";
import { FileTextOutlined, HomeOutlined } from "@ant-design/icons";

import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import { getEditStatementApi } from "src/network/api/campManageStatementApi";
import { updateStatementApi } from "src/network/api/campManageStatementApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import DataNotFound from "../DataNotFound/dataNotFound";
import Breadcrumbs from "components/shared/Breadcrumbs";
import CustomSpinner from "components/shared/CustomSpinner";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import ManageStatementUI from "./UI";
import StatementPreview from "./UI/preview";

function ManageStatements({ isEdit = false, add = false }) {
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
  const [initialFormValues, setInitialFormValues] = useState({});
  const [editorState, setEditorState] = useState("");
  const [existedTopic, setExistedTopic] = useState({
    data: null,
    url: "",
    status: false,
    topicName: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editCampStatementData, setEditCampStatementData] = useState("");
  const [isSaveDraft, setIsSaveDraft] = useState(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const update = router?.query?.statement?.at(0)?.split("-")[1] == "update";
  const isDraft = router?.query?.is_draft;
  // let editorTextLength = editorState.replace(/<(?!img\b)[^\s<>]*>/, "").length;

  // function normalizeHtml(html) {
  //   // Remove all whitespace between HTML tags
  //   return html?.trim()?.replace(/>\s+</g, "><");
  // }

  useEffect(() => {
    const backdata = editStatementData;
    console.log("---dkd---", values, backdata?.statement);

    // const isStatementDifferent =
    //   backdata?.statement?.value?.trim() !== values?.statement?.trim();
    // const isNicknameDifferent = backdata?.nick_name?.id !== values?.nick_name;
    // const isEditSummaryDifferent =
    //   backdata?.statement?.edit_summary !== values?.edit_summary;

    // Check if backdata and its nested properties are defined
    const statementValue = backdata?.statement?.value?.trim();
    const statementEditSummary = backdata?.statement?.edit_summary;
    const nickNameId = backdata?.nick_name?.id;

    const isStatementDifferent = statementValue !== values?.statement?.trim();
    const isNicknameDifferent = nickNameId !== values?.nick_name;
    const isEditSummaryDifferent =
      statementEditSummary !== values?.edit_summary;

    if (
      isEdit &&
      (isStatementDifferent || isNicknameDifferent || isEditSummaryDifferent)
    ) {
      setSubmitIsDisable(true);
    } else {
      setSubmitIsDisable(false);
    }
  }, [values, editStatementData, isEdit]);

  // useEffect(() => {
  //   const backdata = editStatementData;
  //   console.log("---dkd---", values, backdata?.statement);

  //   if (
  //     isEdit &&
  //     (normalizeHtml(backdata?.statement?.value) !==
  //       normalizeHtml(values?.statement) ||
  //       backdata?.nick_name?.id !== values?.nick_name ||
  //       backdata?.statement?.edit_summary !== values?.edit_summary)
  //   ) {
  //     setSubmitIsDisable(true);
  //   } else {
  //     setSubmitIsDisable(false);
  //   }
  // }, [values, editStatementData]);

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
        setInitialFormValues(form.getFieldsValue());
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

  const onFinish = async (values: any) => {
    setScreenLoading(true);
    setIsSaveDraft(false);

    const editInfo = editStatementData;
    const parent_camp = editInfo?.parent_camp;

    const res = await saveStatement(values);

    if (res?.status_code == 200) {
      if (!isEdit) {
        if (isSaveDraft) {
          router?.push({ pathname: topicURL() });
        } else {
          router?.push(
            router?.asPath?.replace("create/statement", "statement/history")
          );
        }
        return;
      } else if (isEdit) {
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
    const parent_camp = editInfo?.parent_camp;

    const reqBody: any = {
      topic_num: !isEdit
        ? router?.query?.statement[0]?.split("-")[0]
        : parent_camp[parent_camp?.length - 1]?.topic_num,
      topic_id: null,
      topic_name: !isEdit
        ? router?.query?.statement[0]?.split("-")[1]
        : parent_camp[parent_camp?.length - 1]?.topic_name,
      namespace_id: null,
      camp_num: !isEdit
        ? router?.query?.statement[1]?.split("-")[0]
        : parent_camp[parent_camp?.length - 1]?.camp_num,
      nick_name: values?.nick_name,
      note: values?.edit_summary?.trim(),
      submitter: !isEdit
        ? nickNameData[0]?.id
        : editInfo?.statement?.submitter_nick_id,
      statement: blocks,
      event_type: !isEdit ? "create" : update ? "edit" : "update",
      statement_id:
        update || isDraft ? router?.query?.statement[0]?.split("-")[0] : null,
      objection_reason: null,
      statement_update: update ? 1 : null,
      camp_id: null,
      camp_name: null,
      key_words: null,
      camp_about_url: null,
      camp_about_nick_id: null,
      parent_camp_num: null,
      old_parent_camp_num: null,
      camp_leader_nick_id: null,
    };

    if (isSaveDraft) {
      reqBody.is_draft = 1;
    } else {
      reqBody.is_draft = 0;
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
    setExistedTopic({
      ...existedTopic,
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

  const onNickNameSelect = (val) => {
    form.setFieldValue("nick_name", val);
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

  const onSaveDraftStatement = async (e) => {
    e?.preventDefault();
    setIsSaveDraft(true);

    const isValid = await form.validateFields();

    if (isValid) {
      form.submit();
    }
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
                label:
                  !isEdit || isDraft
                    ? "Adding a camp statement"
                    : "Updating camp statement",
              },
            ]}
          />
        </Col>
        <Col className="flex justify-end items-center" md={12}>
          {/* <Typography.Paragraph className="!mb-0 mr-7">
            Autosaved in 1 min ago <CloudUploadOutlined />
          </Typography.Paragraph> */}
          <SecondaryButton
            className="flex items-center justify-center py-2 px-8 h-auto"
            onClick={onSaveDraftStatement}
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
              onNickNameSelect={onNickNameSelect}
              editCampStatementData={editCampStatementData}
              onDiscardClick={onDiscardClick}
              isDisabled={isDisabled}
              onPreviewClick={onPreviewClick}
              isDraft={isDraft}
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
    </CustomSpinner>
  );
}

export default ManageStatements;