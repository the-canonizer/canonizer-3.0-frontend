import { useEffect, useState } from "react";
import { Form, Row, Col } from "antd";
import { useRouter } from "next/router";
import { FileTextOutlined, HomeOutlined } from "@ant-design/icons";

import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import useAuthentication from "src/hooks/isUserAuthenticated";
import {
  getEditStatementApi,
  updateStatementApi,
} from "src/network/api/campManageStatementApi";
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
  const [editorState, setEditorState] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editCampStatementData, setEditCampStatementData] = useState("");
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(false);

  const values = Form.useWatch([], form);

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
      JSON.stringify(statementValue) ===
      JSON.stringify(values?.statement?.trim());
    const isNicknameDifferent = nickNameId === values?.nick_name;
    const isEditSummaryDifferent =
      statementEditSummary === values?.edit_summary;

    if (
      isEdit &&
      isStatementDifferent &&
      isNicknameDifferent &&
      isEditSummaryDifferent
    ) {
      setSubmitIsDisable(true);
    } else {
      setSubmitIsDisable(false);
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

    if (isEdit) {
      router?.push({ pathname: getBackURL() });
      return;
    }

    router.push({ pathname: getBackURL() });
  };

  const autoSave = async (isAutosave, data) => {
    setIsAutoSave(isAutosave)
    
    const editInfo = editStatementData;
    const parentCamp = editInfo?.parent_camp;

    const topicNum = router?.query?.statement?.at(0)?.split("-")?.at(0);
    const topicName = router?.query?.statement?.at(0)?.split("-")?.at(1);
    const campNum = router?.query?.statement?.at(1)?.split("-")?.at(0);
    const lastParentCamp = parentCamp?.[parentCamp.length - 1];

    let payload = {
      ...data,
      statement_id: topicNum,
      statement: data?.statement ? data?.statement: localStorage.getItem("autosaveContent")
    }

    if (!isEdit) {
      payload.topic_num = topicNum;
      payload.topic_name = topicName;
      payload.camp_num = campNum;
      payload.submitter = nickNameData?.at(0)?.id;
    } else {
      payload.topic_num = lastParentCamp?.topic_num;
      payload.topic_name = lastParentCamp?.topic_name;
      payload.camp_num = lastParentCamp?.camp_num;
      payload.submitter = editInfo?.statement?.submitter_nick_id;
    }
    
    if (navigator.onLine) {
      await updateStatementApi(payload);
      localStorage.removeItem('autosaveContent'); // Clear local storage on successful save
      setIsAutoSave(false);
    }else{
      localStorage.setItem('autosaveContent', payload?.statement); // Save to local storage if offline
    }
   
  }

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
    if(isAutoSave) {
        autoSave(isAutoSave, values)
    }
    else{
      setScreenLoading(true);
      setIsSaveDraft(false);
  
      const editInfo = editStatementData;
      const parent_camp = editInfo?.parent_camp;

      const campNum = router?.query?.statement?.at(1)?.split("-")?.at(0);

      let payload = {
        ...values,
        camp_num: campNum

      }
  
      const res = await saveStatement(payload);
  
      if (res?.status_code == 200) {
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
    }
  };

  // const saveStatement = async (values) => {
  //   const blocks = editorState;
  //   const editInfo = editStatementData;
  //   const parent_camp = editInfo?.parent_camp;

  //   const reqBody: any = {
  //     topic_num: !isEdit
  //       ? router?.query?.statement[0]?.split("-")[0]
  //       : parent_camp[parent_camp?.length - 1]?.topic_num,
  //     topic_id: null,
  //     topic_name: !isEdit
  //       ? router?.query?.statement[0]?.split("-")[1]
  //       : parent_camp[parent_camp?.length - 1]?.topic_name,
  //     namespace_id: null,
  //     camp_num: !isEdit
  //       ? router?.query?.statement[1]?.split("-")[0]
  //       : parent_camp[parent_camp?.length - 1]?.camp_num,
  //     nick_name: values?.nick_name,
  //     note: values?.edit_summary?.trim(),
  //     submitter: !isEdit
  //       ? nickNameData[0]?.id
  //       : editInfo?.statement?.submitter_nick_id,
  //     statement: blocks,
  //     statement_id:
  //       update || isDraft ? router?.query?.statement[0]?.split("-")[0] : null,
  //     objection_reason: null,
  //     statement_update: update ? 1 : null,
  //     camp_id: null,
  //     camp_name: null,
  //     key_words: null,
  //     camp_about_url: null,
  //     camp_about_nick_id: null,
  //     parent_camp_num: null,
  //     old_parent_camp_num: null,
  //     camp_leader_nick_id: null,
  //   };

  //   if (isDraft && isEdit) {
  //     reqBody.event_type = "edit";
  //   } else if (isDraft && !isSaveDraft) {
  //     reqBody.event_type = "create";
  //   } else if (isSaveDraft && !isEdit) {
  //     reqBody.event_type = "create";
  //   } else if (update) {
  //     reqBody.event_type = "edit";
  //   } else if (!isEdit && !isSaveDraft) {
  //     reqBody.event_type = "create";
  //   } else {
  //     reqBody.event_type = "update";
  //   }

  //   if (isSaveDraft) {
  //     reqBody.is_draft = 1;
  //   } else {
  //     reqBody.is_draft = 0;
  //     if (isDraft) {
  //       reqBody.event_type = "create";
  //     }
  //     // if (!isEdit) {
  //     //   reqBody.event_type = "create";
  //     // } else if (update) {
  //     //   reqBody.event_type = "edit";
  //     // } else {
  //     //   reqBody.event_type = "update";
  //     // }
  //   }

  //   const res = await updateStatementApi(reqBody);

  //   return res;
  // };

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
      reqBody.submitter = nickNameData[0]?.id;
    } else {
      reqBody.topic_num = lastParentCamp?.topic_num;
      reqBody.topic_name = lastParentCamp?.topic_name;
      reqBody.camp_num = lastParentCamp?.camp_num;
      reqBody.submitter = editInfo?.statement?.submitter_nick_id;
    }

    if (update || isDraft) {
      reqBody.statement_id = topicNum;
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
              autoSave={autoSave}
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
