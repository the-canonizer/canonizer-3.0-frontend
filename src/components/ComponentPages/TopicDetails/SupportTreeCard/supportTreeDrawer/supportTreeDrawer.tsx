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
import { useDispatch, useSelector } from "react-redux";
import { labels } from "src/messages/label";
import { placeholders } from "src/messages/placeholder";

import {
  getAllRemovedReasons,
  getAllUsedNickNames,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import { addSupport } from "src/network/api/userApi";
import { RootState } from "src/store";
import {
  GetActiveSupportTopic,
  GetCheckSupportExists,
} from "src/network/api/topicAPI";
import { openNotificationWithIcon } from "components/ComponentPages/notificationBar/notificationBar";
import Link from "next/link";
import queryParams from "src/utils/queryParams";
import { setCheckSupportExistsData } from "src/store/slices/campDetailSlice";
import moment from "moment";

const { TextArea } = Input;

function SupportTreeDrawer({
  onClose,
  open,
  topicList,
  drawerFor,
  onRemoveFinish,
}: any) {
  const {
    reasons,
    currentGetCheckSupportExistsData,
    currentDelegatedSupportedClick,
    topicRecord,
    campRecord,
    asofdate,
    asof,
  } = useSelector((state: RootState) => ({
    reasons: state?.topicDetails?.removedReasons,
    currentGetCheckSupportExistsData:
      state.topicDetails.currentGetCheckSupportExistsData,
    currentDelegatedSupportedClick:
      state.supportTreeCard.currentDelegatedSupportedClick,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state?.filters?.filterObject?.asof,
  }));
  const dispatch = useDispatch();
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
  const [isTagDragged, setIsTagDragged] = useState(false);
  const [parentSupportDataList, setParentSupportDataList] = useState([]);
  const [updatePostion, setUpdatePostion] = useState<boolean>(false);
  const [supportOrder, setSupportOrder] = useState([]);

  const filteredList = manageSupportList?.map((obj: any, index: any) => {
    return {
      camp_num: obj.camp_num,
      order: index + 1, //obj.support_order,
    };
  });

  const transformDataForDraggable = (data) => {
    return data.map((item, index) => {
        return {
            id: item.camp_num,
            content: item.camp_name
        };
    });
  }

  const transformSupportOrderForAPI = (data) => {
    return data.map((item, index) => {
        return {
          camp_num: item.id,
          order: index + 1,
        };
    });
  }
  

  const filterList = (campNum, position) => {
    const index = filteredList.findIndex((obj) => obj.camp_num === campNum);
    filteredList[index] = {
      camp_num: campNum,
      order: position + 1,
    };
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setSelectedValue(value);
  };

  const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
  const camp_num = router?.query?.camp?.at(1)?.split("-")?.at(0);

  const reqBodyData: any = {
    topic_num: topicNum,
    camp_num: camp_num,
  };

  const getActiveSupportTopic = async() =>{
    let body = {
      topic_num: topicNum 
    }
    const response = await GetActiveSupportTopic(topicNum && body);

    let camp_data = 
      {
        id: camp_num,
        content: campRecord?.camp_name,
      }

    if(currentGetCheckSupportExistsData.support_flag == 0){
      setTagsArrayList([...transformDataForDraggable(response?.data),camp_data])
    }else if (currentGetCheckSupportExistsData.support_flag == 1){
      setTagsArrayList(transformDataForDraggable(response?.data))
    }
  }

  const reqBody = {
    topic_num: topicNum,
    camp_num: camp_num,
    as_of: asof,
    as_of_date:
      asof == "default" || asof == "review"
        ? Date.now() / 1000
        : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
  };

  console.log("topicList", topicList);
  console.log("drawerFor", drawerFor);
  console.log("tagsArrayList", tagsArrayList);

  const GetCheckStatusData = async () => {
    let response = await GetCheckSupportExists(queryParams(reqBodyData));

    if (response && response.status_code === 200) {
      if (response.data?.remove_camps) {
        setParentSupportDataList(response.data.remove_camps);

        dispatch(setCheckSupportExistsData(response.data));
      }
    }
  };

  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;

  const getCanonizedNicknameList = async () => {
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

  const onFinish = async (values) => {
    
    let addSupportId = {
      topic_num: topicNum,
      add_camp: { camp_num: camp_num, support_order: tagsArrayList?.length },
      remove_camps: [],
      type: "direct",
      action: "add",
      nick_name_id: nictNameId,
      order_update: transformSupportOrderForAPI(tagsArrayList),
    };
    console.log("add support payload", addSupportId) 
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

  // useEffect(() => {
  //   setIsTagDragged(false);
  // }, []);
  

  useEffect(() => {
    if (open) {
      getReasons();
      getCanonizedNicknameList();
      getCurrentCampRecordApi(reqBody);
      GetCheckStatusData()
      getActiveSupportTopic()
    }
  }, [open]);

  useEffect(() => {
    setReasons(reasons);
  }, [reasons]);

  const preventDefault = (e) => {
    e.preventDefault();
    console.log("Clicked! But prevent default.");
  };

  // useEffect(() => {
  //   if (manageSupportList?.length > 0) {
  //     const newTagList = manageSupportList.map((obj) => ({
  //       ...obj,
  //       id: obj.camp_num,
  //     }));
  //     let newTagsArrayList = newTagList;

  //     if (!isTagDragged && parentSupportDataList.length > 0) {
  //       const shouldArrayReverse = newTagList.every(
  //         (element) => element.support_order === newTagList.length
  //       );
  //       newTagsArrayList = shouldArrayReverse
  //         ? newTagList.slice().reverse()
  //         : newTagList;
  //     }
  //     setTagsArrayList(newTagsArrayList);
  //   }
  // }, [manageSupportList, parentSupportDataList, isTagDragged]);

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
        {drawerFor === "add" ? (
          <>
            <div className="page-breadcrums-wrapper">
              <PageHeader
                className="p-0 drawer-header"
                onBack={() => null}
                backIcon={<i className="icon-back"></i>}
                title={
                  <>
                    Adding Support to camp:
                    <span className="ml-1">{campRecord && campRecord?.camp_name} </span>
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
                  Topic: {topicRecord?.topic_name}
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  {campRecord?.camp_name}
                </Breadcrumb.Item>
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
                    Note : To change support order of camp, drag & drop the camp
                    box on your choice position.
                  </p>
                  {tagsArrayList?.length > 0 && (
                    <div className="vertical-chips">
                      <DraggableArea
                        tags={tagsArrayList}
                        render={({ tag, index }) => (
                          <div className="flex items-center gap-7">
                            <MenuOutlined className="text-sm text-[#777F93]" />
                            <Tag
                              className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                              closable={false}
                              onClose={preventDefault}
                            >
                              {filterList(tag.camp_num, index)}
                              <a
                                data-testid="styles_Bluecolor"
                                // className={styles.Bluecolor}
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.location.href = tag.link;
                                  // dispatch(setIsSupportModal(false));
                                }}
                              >
                                {`${index + 1}.${tag?.content}`}
                              </a>
                            </Tag>
                          </div>
                        )}
                        onChange={(tags) => {
                          setIsTagDragged(true);
                          setUpdatePostion(true);
                          // setManageSupportList(tags);
                          setTagsArrayList(tags)
                        }}
                      />
                    </div>
                  )}
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
                      </>
                    )}
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
          </>
        ) : drawerFor === "delegate" ? (
          <></>
        ) : drawerFor === "remove" ? (
          <>
            <div className="page-breadcrums-wrapper">
              <PageHeader
                className="p-0 drawer-header"
                onBack={() => null}
                backIcon={<i className="icon-back"></i>}
                title={
                  <>
                    Removing Support from camp:
                    <span> {campRecord?.camp_name} </span>
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
                {/* <Breadcrumb.Item href="">Canon: General</Breadcrumb.Item> */}
                <Breadcrumb.Item href="">
                  Topic: {topicRecord?.topic_name}
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  {campRecord?.camp_name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <Form
              form={form}
              layout="vertical"
              className="adding-support-form"
              onFinish={onRemoveFinish}
            >
              <div className="support-content">
                {/* <Alert
                      className="border-0 rounded-lg warning-alert"
                      description="You are about to remove your support from this camp. You can optionally add a helpful reason in the citation link."
                      showIcon
                      icon={<i className="icon-warning"></i>}
                    /> */}

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Reason for removing support"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <div className="thm-select">
                        <div className="prefix-icon">
                          <i className="icon-bar"></i>
                        </div>
                        <Select
                          placeholder={placeholders.nickName}
                          className="w-100 cn-select"
                          size="large"
                          suffixIcon={<i className="icon-chevron-down"></i>}
                          onChange={handleChange}
                        >
                          {availableReasons.map((res) => (
                            <Select.Option key={res.id} value={res.value}>
                              {res.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
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
                </Row>
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
                  Remove Support
                  <PlusOutlined />
                </Button>
              </div>
            </Form>
          </>
        ) : null}
      </Drawer>
    </>
  );
}
export default SupportTreeDrawer;

{
  /* <Tag
                  className="rounded-full bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                  closable
                  onClose={preventDefault}
                >
                  1 . Debating the theory
                </Tag> */
}
