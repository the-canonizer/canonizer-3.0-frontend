import {
  CloseCircleOutlined,
  CloseOutlined,
  MenuOutlined,
  PlusOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  message,
  PageHeader,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import dynamic from "next/dynamic";
import Breadcrumbs from "components/ComponentPages/Breadcrumbs/breadcrumbs";
import StructureIcon from "components/ComponentPages/CreateNewTopic/UI/structureIcon";
import SelectInputs from "components/shared/FormInputs/select";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DraggableArea } from "react-draggable-tags";
import { useSelector } from "react-redux";
import { labels } from "src/messages/label";
import { placeholders } from "src/messages/placeholder";

import {
  getAllRemovedReasons,
  getAllUsedNickNames,
} from "src/network/api/campDetailApi";
import { addSupport } from "src/network/api/userApi";
import { RootState } from "src/store";
import { GetActiveSupportTopic } from "src/network/api/topicAPI";
import { openNotificationWithIcon } from "components/ComponentPages/notificationBar/notificationBar";

const { TextArea } = Input;
const SupportTreeDrawerClientOnly = dynamic(
  () => import("./supportTreeDrawer"),
  {
    ssr: false,
  }
);

function SupportTreeDrawer({ onClose, open, topicList }: any) {
  const {
    reasons,
    currentGetCheckSupportExistsData,
    currentDelegatedSupportedClick,
    campRecord,
  } = useSelector((state: RootState) => ({
    reasons: state?.topicDetails?.removedReasons,
    currentGetCheckSupportExistsData:
      state.topicDetails.currentGetCheckSupportExistsData,
    currentDelegatedSupportedClick:
      state.supportTreeCard.currentDelegatedSupportedClick,
    campRecord: state?.topicDetails?.currentCampRecord,
  }));

  const router = useRouter();
  const [nickNameList, setNickNameList] = useState([]);
  const [availableReasons, setReasons] = useState(reasons);
  const [selectedValue, setSelectedValue] = useState(null);
  const [form] = Form.useForm();
  //GetCheckSupportExistsData check support_id is 0 or 1
  let supportedCampsStatus = currentGetCheckSupportExistsData;
  const [manageSupportRevertData, setManageSupportRevertData] = useState([]);
  const [manageSupportList, setManageSupportList] = useState([]);
  const [selectedtNickname, setSelectedtNickname] = useState("");
  const [topicSupportListData, setTopicSupportListData] = useState([]);
  const [tagsArrayList, setTagsArrayList] = useState([]);
  const [nictNameId, setNictNameId] = useState(null);
  const filteredList = manageSupportList?.map((obj: any, index: any) => {
    return {
      camp_num: obj.camp_num,
      order: index + 1, //obj.support_order,
    };
  });

  const filterList = (campNum, position) => {
    const index = filteredList.findIndex((obj) => obj.camp_num === campNum);
    filteredList[index] = {
      camp_num: campNum,
      order: position + 1,
    };
  };

  const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);

  console.log("topicList", topicList);

  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;

  const getCanonizedNicknameList = async () => {
    const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };

    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res?.status_code == 200) {
      setNickNameList(res?.data);
      setNictNameId(res?.data[0]?.id);
      form.setFieldsValue({
        nickname: res ? res?.data[0]?.nick_name : "",
      });
    }
  };

  const initialTags = [
    { id: 1, content: " 1 . Debating the theory" },
    { id: 2, content: " 2 . Debating the theory" },
    { id: 3, content: " 3 . Debating the theory" },
    { id: 4, content: " 4 . Debating the theory" },
  ];

  const onFinish = async (values) => {
    console.log("====================================");
    console.log("values", values);
    console.log("====================================");
    let addSupportId = {
      topic_num: topicNum,
      add_camp: { camp_num: 1, support_order: 1 },
      remove_camps: [],
      type: "direct",
      action: "add",
      nick_name_id: nictNameId,
      order_update: [{ camp_num: 1, order: 1 }],
    };
    let res = await addSupport(addSupportId);
    if (res && res.status_code == 200) {
      openNotificationWithIcon({ type: "success", message: res?.message });
      onClose(true);
      form.resetFields();
      setSelectedValue(null);
    }
  };

  const getReasons = async () => {
    await getAllRemovedReasons();
  };

  useEffect(() => {
    if (open) {
      getReasons();
      getCanonizedNicknameList();
    }
  }, [open]);

  useEffect(() => {
    setReasons(reasons);
  }, [reasons]);

  const preventDefault = (e) => {
    e.preventDefault();
    console.log("Clicked! But prevent default.");
  };

  return (
    <>
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
            onBack={() => null}
            backIcon={<i className="icon-back"></i>}
            title={
              <>
                Adding Support to camp:
                <span className="ml-1">Agreement </span>
              </>
            }
          />
          <Breadcrumb
            className="drawer-breadcrumbs ml-6"
            separator={
              <>
                <i className="icon-angle-right-arrow"></i>
              </>
            }
          >
            <Breadcrumb.Item href="">Canon: General</Breadcrumb.Item>
            <Breadcrumb.Item href="">
              Topic: Representationalist Books
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">This Camp</Breadcrumb.Item>
          </Breadcrumb>
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
            <div className="alert-wrapper">
              <Alert
                className="border-0 rounded-lg warning-alert"
                description="You’re already supporting the Parent Camp: Agreement.
            Adding support to this camp will remove your support from the parent camp."
                type="error"
                showIcon
                icon={<i className="icon-warning"></i>}
              />
              <div className="horizontal-chips">
                <Tag
                  className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                  closable={false}
                  onClose={preventDefault}
                >
                  New Research
                </Tag>
                <Tag
                  className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                  closable={false}
                  onClose={preventDefault}
                >
                  Debating the theory
                </Tag>
              </div>
            </div>

            <div className="checkbox-wrapper">
              <Form.Item label="Quick Action" className="mb-0">
                <Checkbox>Remove All Support</Checkbox>
              </Form.Item>
              <Button
                size="large"
                className="min-w-[200px] gap-2 flex items-center justify-center border border-canBlue bg-[#98B7E61A] rounded-lg text-canBlack text-base font-medium"
              >
                Clear All Changes
              </Button>
            </div>
            <div className="chips-wrapper">
              <p className="text-[#DB4F4F] mb-9">
                Note : To change support order of camp, drag & drop the camp box
                on your choice position.
              </p>
              <div className="vertical-chips">
                <DraggableArea
                  tags={initialTags}
                  render={({ tag, index }) => (
                    <div className="flex items-center gap-7">
                      <MenuOutlined className="text-sm text-[#777F93]" />
                      <Tag
                        className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                        closable={false}
                        onClose={preventDefault}
                      >
                        {tag.content}
                      </Tag>
                    </div>
                  )}
                  onChange={(tags) => console.log(tags)}
                />

                {/* <Tag
                  className="rounded-full bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                  closable
                  onClose={preventDefault}
                >
                  1 . Debating the theory
                </Tag> */}
              </div>
            </div>

            <div>
              <Row gutter={16}>
                <Col span={24} sm={12}>
                  <Form.Item
                    name="reason"
                    label="Reason for adding support"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please select a reason',
                    //   },
                    // ]}
                  >
                    <div className="thm-select">
                      <div className="prefix-icon">
                        <i className="icon-bar"></i>
                      </div>
                      <Select
                        className="w-100 cn-select"
                        size="large"
                        suffixIcon={<i className="icon-chevron-down"></i>}
                        placeholder="Select reason"
                        allowClear
                        value={selectedValue}
                        onChange={(value) => {
                          setSelectedValue(value);
                        }}
                        showSearch
                      >
                        {availableReasons?.map((res) => (
                          <Select.Option key={res?.id} value={res?.label}>
                            {res?.label}
                          </Select.Option>
                        ))}
                        <Select.Option key="custom_reason" value="custom">
                          Custom reason
                        </Select.Option>
                      </Select>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item
                    name="nickname"
                    label="Nickname"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please select a nickname',
                    //   },
                    // ]}
                  >
                    <div className="thm-select">
                      <div className="prefix-icon">
                        <UserOutlined />
                      </div>
                      <Select
                        placeholder="Select a nickname"
                        className="w-100 cn-select"
                        size="large"
                        suffixIcon={<i className="icon-chevron-down"></i>}
                        showSearch
                        value={selectedtNickname}
                        onChange={(value) => {
                          setSelectedtNickname(value);
                        }}
                      >
                        {nickNameList &&
                          nickNameList?.map((nick) => (
                            <Select.Option
                              key={nick?.id}
                              value={`${nick?.id}-(${nick?.nick_name})`}
                            >
                              {nick?.nick_name}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                  </Form.Item>
                </Col>
                {selectedValue && selectedValue == "custom" && (
                  <>
                    <Col span={24}>
                      <Form.Item name="description" label="Description">
                        <TextArea className="thm-input" rows={4} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="Citation" label="Citation link">
                        <Input
                          className="thm-input"
                          size="large"
                          placeholder="https://"
                          prefix={<i className="icon-link"></i>}
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}
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
            >
              Add Support
              <PlusOutlined />
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
}
export default SupportTreeDrawer;
