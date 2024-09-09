import {
  ArrowRightOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
} from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeholders } from "src/messages/placeholder";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import { RootState } from "src/store";
import DrawerBreadcrumbs from "../TopicDetails/SupportTreeCard/supportTreeDrawer/drawerBreadcrumbs";
import { campNameRule, topicNameRule } from "src/messages/validationRules";
import AlignIcon from "../CreateNewTopic/UI/alignIcon";
import { labels } from "src/messages/label";
import Inputs from "components/shared/FormInputs";
import {
  getEditCampApi,
  getEditStatementApi,
  getEditTopicApi,
  updateCampApi,
  updateStatementApi,
  updateTopicApi,
} from "src/network/api/campManageStatementApi";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";
import { allowedEmojies } from "src/utils/generalUtility";
import K from "src/constants";

const { TextArea } = Input;

function ObjectionDrawer({
  onClose,
  open,
  drawerFor,
  setDrawerFor,
  objectionId,
}: any) {
  const { topicRecord, campRecord, namespace_id } = useSelector(
    (state: RootState) => ({
      topicRecord: state?.topicDetails?.currentTopicRecord,
      campRecord: state?.topicDetails?.currentCampRecord,
      namespace_id: state.filters?.filterObject?.namespace_id,
    })
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const [form] = Form.useForm();

  const [nickNameList, setNickNameList] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedtNickname, setSelectedtNickname] = useState("");
  const [nictNameId, setNictNameId] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentCamp, setCurrentCamp] = useState(null);
  const [currentCampStatement, setCurrentCampStatement] = useState(null);
  const [loader, setLoader] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({});
  const [submitIsDisable, setSubmitIsDisable] = useState(true);

  const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
  const topic_name = router?.query?.camp?.at(0)?.split("-")?.slice(1).join("-");

  const getCanonizedNicknameList = async () => {
    const body = { topic_num: topicNum };
    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res?.status_code == 200) {
      setNickNameList(res?.data);
      setNictNameId(res?.data?.at(0)?.id);
    }
  };

  const getEditData = async () => {
    let payload = {
      record_id: objectionId,
      event_type: "objection",
    };

    let res = null;
    let fieldSValuesForForm = null;

    if (drawerFor === "topicObjection") {
      res = await getEditTopicApi(payload);

      fieldSValuesForForm = {
        nick_name: res?.data?.nick_name?.at(0)?.id,
        topic_name: res?.data?.topic?.topic_name,
      };

      const topicData = res?.data?.topic;
      setCurrentTopic(topicData);
    } else if (drawerFor === "campObjection") {
      res = await getEditCampApi(payload);

      fieldSValuesForForm = {
        nick_name: res?.data?.nick_name?.at(0)?.id,
        camp_name: res?.data?.camp?.camp_name,
      };

      const campData = res?.data?.camp;
      setCurrentCamp(campData);
    } else if (drawerFor === "statementObjection") {
      res = await getEditStatementApi(payload);

      fieldSValuesForForm = {
        nick_name: res?.data?.nick_name?.at(0)?.id,
      };

      const campStatementData = res?.data?.statement;
      setCurrentCampStatement(campStatementData);
    }
    form.setFieldsValue(fieldSValuesForForm);
  };

  const handleformvalues = () => {
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
    if (open) {
      getCanonizedNicknameList();
      getEditData();
    }
  }, [open]);

  const onFinish = async (values) => {
    setLoader(true);

    let payload = {
      namespace_id: null,
      nick_name: null,
      submitter: null,
      topic_id: null,
      topic_name: null,
      topic_num: null,
      event_type: "objection",
      objection_reason: null,
      camp_id: null,
      camp_name: null,
      camp_num: null,
      statement_id: null,
      statement: null,
    };
    let res = null;
    let status = "";
    if (drawerFor === "topicObjection") {
      payload.namespace_id = namespace_id;
      payload.nick_name = values.nick_name;
      payload.submitter = currentTopic?.submitter_nick_id;
      payload.topic_id = currentTopic?.id;
      payload.topic_name = values.topic_name?.trim();
      payload.topic_num = currentTopic?.topic_num;
      payload.event_type = "objection";
      payload.objection_reason = values?.objection_reason;
      res = await updateTopicApi(payload);

    } else if (drawerFor === "campObjection") {
      payload.namespace_id = namespace_id;
      payload.nick_name = values.nick_name;
      payload.submitter = currentCamp?.submitter_nick_id;
      payload.topic_id = currentCamp?.id;
      payload.topic_name = values.topic_name?.trim();
      payload.topic_num = currentCamp?.topic_num;
      payload.event_type = "objection";
      payload.objection_reason = values?.objection_reason;
      payload.camp_id = currentCamp?.id;
      payload.camp_name = currentCamp?.camp_name;
      payload.camp_num = currentCamp?.camp_num;
      res = await updateCampApi(payload);

    } else if (drawerFor === "statementObjection") {
      payload.namespace_id = namespace_id;
      payload.nick_name = values?.nick_name;
      payload.submitter = currentCampStatement?.submitter_nick_id;
      payload.topic_id = currentCampStatement?.id;
      payload.topic_name = values?.topic_name?.trim();
      payload.topic_num = currentCampStatement?.topic_num;
      payload.event_type = "objection";
      payload.objection_reason = values?.objection_reason;
      payload.camp_id = currentCampStatement?.id;
      payload.camp_name = currentCampStatement?.camp_name;
      payload.camp_num = currentCampStatement?.camp_num;
      payload.statement_id = currentCampStatement?.id;
      payload.statement = values?.objection_reason;
      res = await updateStatementApi(payload);
    }
    setLoader(false);
    if (res?.status_code == 200) {
      status = "success";
    }

    if (res?.status_code == 400) {
      status = "error";
    }

    openNotificationWithIcon(res?.message, status);
    
    setDrawerFor("");
    onClose();
  };

  return (
    <Drawer
      closable={false}
      className="ch-drawer adding-supported-drawer"
      placement="right"
      onClose={onClose}
      open={open}
      contentWrapperStyle={{ maxWidth: "730px", width: "100%" }}
    >
      <div className="page-breadcrums-wrapper">
        <PageHeader
          className="p-0 drawer-header"
          onBack={() => onClose()}
          backIcon={<i className="icon-back"></i>}
          title={"Object to this proposed change"}
        />
        <DrawerBreadcrumbs
          topicRecord={topicRecord}
          campRecord={campRecord}
          topic_name={topic_name}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        className="adding-support-form"
        autoComplete="off"
        scrollToFirstError
        onValuesChange={handleformvalues}
        onFinish={onFinish}
      >
        <div className="support-content">
          <div>
            <Row gutter={16}>
              <Col span={24} sm={12}>
                <Form.Item name="nick_name" label="Nickname">
                  <div className="thm-select">
                    <div className="prefix-icon">
                      <UserOutlined />
                    </div>
                    <Select
                      placeholder="Select a nickname"
                      className="w-100 cn-select"
                      size="large"
                      defaultValue={nickNameList?.at(0)?.nick_name}
                      suffixIcon={<i className="icon-chevron-down"></i>}
                      showSearch
                      value={
                        selectedtNickname
                          ? selectedtNickname
                          : nickNameList?.at(0)?.nick_name
                      }
                      onChange={(value) => {
                        setSelectedtNickname(value);
                      }}
                    >
                      {nickNameList?.map((nick) => {
                        return (
                          <Select.Option key={nick.id} value={nick.id}>
                            {nick.nick_name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                </Form.Item>
              </Col>

              <Col span={24} sm={12}>
                <Form.Item>
                  {drawerFor === "topicObjection" ? (
                    <>
                      <Inputs
                        name="topic_name"
                        label={
                          <>
                            {labels.cr_topic_name}
                            <span className="required">*</span>
                          </>
                        }
                        rules={topicNameRule}
                        placeholder={placeholders.topicName}
                        size={"large"}
                        maxLength={30}
                        prefix={
                          <div className="pr-3">
                            <AlignIcon fill="#242B37" />
                          </div>
                        }
                        dataid="topic-name"
                        key="topic-name-key"
                        disabled={true}
                      />
                    </>
                  ) : drawerFor === "campObjection" ? (
                    <>
                      <Inputs
                        name="camp_name"
                        label={
                          <>
                            {labels.cr_camp_name}
                            <span className="required">*</span>
                          </>
                        }
                        rules={campNameRule}
                        placeholder={placeholders.campName}
                        size={"large"}
                        maxLength={30}
                        prefix={
                          <div className="pr-3">
                            <AlignIcon fill="#242B37" />
                          </div>
                        }
                        dataid="camp-name"
                        key="camp-name-key"
                        disabled={true}
                      />
                    </>
                  ) : null}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="objection_reason"
                  label={
                    <>
                      Your Objection Reason{" "}
                      <span className="required">*</span>{" "}
                      <small>(Limit 100 Char) </small>
                    </>
                  }
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
                >
                  <TextArea className="thm-input" rows={4}  maxLength={100} required/>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
        <div className="flex justify-center max-sm:flex-col gap-5 p-11 fixed right-0 max-w-[730px] w-full mt-0 bg-white z-50 bottom-0">
          <Button
            size="large"
            className="min-w-[200px] gap-2 flex items-center justify-center border border-canBlue bg-[#98B7E61A] rounded-lg text-canBlack text-base font-medium"
            onClick={() => {
              onClose();
              form.resetFields();
              setSelectedValue(null);
            }}
          >
            Cancel
            <CloseOutlined />
          </Button>
          <Button
            size="large"
            disabled={submitIsDisable}
            htmlType="submit"
           className="flex items-center gap-2 min-w-[200px] bg-canRed_Opacity10 border-canRed hover:border-canRed hover:text-canRed focus:text-canRed focus:border-canRed justify-center text-base rounded-lg leading-none w-100 font-medium"
            loading={loader}
          >
            Submit Objection
            <ArrowRightOutlined />
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}
export default ObjectionDrawer;
