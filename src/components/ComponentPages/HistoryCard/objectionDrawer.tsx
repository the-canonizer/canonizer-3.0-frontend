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
import { getEditCampApi, getEditStatementApi, getEditTopicApi, updateCampApi, updateStatementApi, updateTopicApi } from "src/network/api/campManageStatementApi";

const { TextArea } = Input;

function ObjectionDrawer({
  onClose,
  open,
  drawerFor,
  setDrawerFor,
  objectionId,
}: any) {
  const { topicRecord, campRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  const dispatch = useDispatch();
  const router = useRouter();

  const [form] = Form.useForm();

  const [nickNameList, setNickNameList] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedtNickname, setSelectedtNickname] = useState("");
  const [nictNameId, setNictNameId] = useState(null);
  const [loader, setLoader] = useState(false);

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
    }

    let res = null;
    let fieldSValuesForForm = null;

    if(drawerFor === "topicObjection") {
      res = await getEditTopicApi(payload);
      fieldSValuesForForm = {
        nick_name: res?.data?.nick_name?.at(0)?.id,
        topic_name: res?.data?.topic?.topic_name,
      }
    }else if (drawerFor === "campObjection") {
      res = await getEditCampApi(payload);
      fieldSValuesForForm = {
        nick_name: res?.data?.nick_name?.at(0)?.id,
        camp_name: res?.data?.camp?.camp_name,
      }
    }else if (drawerFor === "statementObjection") {
      res = await getEditStatementApi(payload);
      fieldSValuesForForm = {
        nick_name: res?.data?.nick_name?.at(0)?.id,
      }
    }
    form.setFieldsValue(fieldSValuesForForm);
  }

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
      event_type: "objection",
      objection_reason: values?.objection_reason,
    }
    let res = null;
    if (drawerFor === "topicObjection") {
      res = await updateTopicApi(payload);
    }else if(drawerFor === "campObjection") {
      res = await updateCampApi(payload);
    }else if(drawerFor === "statementObjection") {
      res = await updateStatementApi(payload);
    }
    setLoader(false);
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
                  label="Your objection reason"
                >
                  <TextArea className="thm-input" rows={4} />
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
            type="primary"
            htmlType="submit"
            className=" min-w-[200px] bg-canBlue flex items-center justify-center hover:bg-canHoverBlue focus:bg-canHoverBlue hover:text-white font-medium text-white disabled:bg-disabled font-base rounded-lg"
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
