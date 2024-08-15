import {
  CloseOutlined,
  MenuOutlined,
  MinusOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DraggableArea } from "react-draggable-tags";
import { useDispatch, useSelector } from "react-redux";
import { placeholders } from "src/messages/placeholder";

import {
  campSignApi,
  CheckCampSignApiCall,
  getAllRemovedReasons,
  getAllUsedNickNames,
  getCurrentCampRecordApi,
  getTopicActivityLogApi,
  getTreesApi,
} from "src/network/api/campDetailApi";
import {
  addDelegateSupportCamps,
  addSupport,
  removeSupportedCamps,
} from "src/network/api/userApi";
import { RootState, store } from "src/store";
import {
  GetActiveSupportTopic,
  GetCheckSupportExists,
} from "src/network/api/topicAPI";
import { openNotificationWithIcon } from "components/ComponentPages/notificationBar/notificationBar";
import queryParams from "src/utils/queryParams";
import { setCheckSupportExistsData } from "src/store/slices/campDetailSlice";
import moment from "moment";
import { setCampActivityData } from "src/store/slices/recentActivitiesSlice";
import DrawerBreadcrumbs from "./drawerBreadcrumbs";
import styles from "../../../ManageSupport/ManageSupportUI/ManageSupport.module.scss";

const { TextArea } = Input;

function SupportTreeDrawer({
  onClose,
  open,
  topicList,
  drawerFor,
  setDrawerFor,
  onRemoveFinish,
  selectNickId: getDelegateId,
  delegateNickName,
  handleCancelSupportCamps,
  getCheckStatusAPI,
}: any) {
  const {
    reasons,
    currentGetCheckSupportExistsData,
    currentDelegatedSupportedClick,
    topicRecord,
    campRecord,
    asofdate,
    asof,
    algorithm,
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
    algorithm: state.filters?.filterObject?.algorithm,
  }));
  const dispatch = useDispatch();
  const router = useRouter();
  const [nickNameList, setNickNameList] = useState([]);
  const [availableReasons, setReasons] = useState(reasons);
  const [selectedValue, setSelectedValue] = useState(null);
  const [form] = Form.useForm();
  //GetCheckSupportExistsData check support_id is 0 or 1
  let supportedCampsStatus = currentGetCheckSupportExistsData;
  const [selectedtNickname, setSelectedtNickname] = useState("");
  const [tagsArrayList, setTagsArrayList] = useState([]);
  const [nictNameId, setNictNameId] = useState(null);
  const [parentSupportDataList, setParentSupportDataList] = useState([]);
  const [campIds, setcampIds] = useState([]);
  const [isQuickActionSelected, setIsQuickActionSelected] = useState(false);
  const [signCampData, setSignCampData] = useState(null);

  const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
  const camp_num = router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1;
  const CheckDelegatedOrDirect =
    currentDelegatedSupportedClick.delegatedSupportClick;

  const topic_name = router?.query?.camp?.at(0)?.split("-")?.slice(1).join("-");
  const topic_num = router?.query?.camp?.at(0)?.split("-")?.at(0);

  const transformDataForDraggable = (data) => {
    return data?.map((item, index) => {
      return {
        id: item.camp_num,
        content: item.camp_name,
        disabled: false,
        link: item.link,
      };
    });
  };

  const transformSupportOrderForAPI = (data) => {
    return data?.map((item, index) => {
      return {
        camp_num: item?.id,
        order: index + 1,
      };
    });
  };

  const shouldRemoveSupport = () => {
    return !!(
      tagsArrayList?.filter((item) => item.disabled == true).length > 0
    );
  };

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const reqBodyData: any = {
    topic_num: topicNum,
    camp_num: camp_num,
  };

  const getActiveSupportTopic = async () => {
    let body = {
      topic_num: topicNum,
    };
    const response = await GetActiveSupportTopic(topicNum && body);

    let camp_data: any = {
      id: Number(camp_num),
      content: campRecord?.camp_name,
      disabled: false,
    };

    if (currentGetCheckSupportExistsData?.warning) {
      setTagsArrayList([camp_data]);
    } else {
      if (currentGetCheckSupportExistsData.support_flag == 0) {
        setTagsArrayList([
          ...transformDataForDraggable(response?.data),
          camp_data,
        ]);
      } else if (currentGetCheckSupportExistsData.support_flag == 1) {
        setTagsArrayList(transformDataForDraggable(response?.data));
      }
    }
  };

  function getCampNums(camps) {
    return camps?.map((camp) => camp.camp_num);
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

  const GetCheckStatusData = async () => {
    if (CheckDelegatedOrDirect && getDelegateId) {
      reqBodyData.delegated_nick_name_id = getDelegateId;
    }
    let response = await GetCheckSupportExists(queryParams(reqBodyData));

    if (response && response?.status_code === 200) {
      if (response?.data?.remove_camps) {
        const campsIds = getCampNums(response?.data?.remove_camps);
        setcampIds(campsIds);
        setParentSupportDataList(response?.data?.remove_camps);
        dispatch(setCheckSupportExistsData(response?.data));
      }
    }
  };

  const getCanonizedNicknameList = async () => {
    const body = { topic_num: topicNum };
    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res?.status_code == 200) {
      setNickNameList(res?.data);
      setNictNameId(res?.data[0]?.id);
    }
  };

  const TagList = ({ name }) => {
    return (
      <Tag
        className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
        closable={false}
        onClose={(e) => e.preventDefault()}
      >
        {name}
      </Tag>
    );
  };

  const removeAllSupportHandler = async (e) => {
    setIsQuickActionSelected(e?.target?.checked);
    let res = null;

    if (e?.target?.checked) {
      res = tagsArrayList?.map((item, index) => {
        return {
          ...item,
          disabled: true,
        };
      });
    } else {
      res = tagsArrayList?.map((item, index) => {
        return {
          ...item,
          disabled: false,
        };
      });
    }
    setTagsArrayList(res);
  };

  const clearChangesHandler = () => {
    setIsQuickActionSelected(false);

    let res = tagsArrayList?.map((item, index) => {
      return {
        ...item,
        disabled: false,
      };
    });
    setTagsArrayList(res);
  };

  const removeSupportFromCamps = () => {
    let remove_camps = tagsArrayList?.filter((item) => item?.disabled == true);
    let remove_camps_ids = [];

    if (remove_camps?.length > 0) {
      remove_camps?.map((item) => {
        remove_camps_ids.push(item?.id);
      });
    }
    if (campIds?.length > 0) {
      campIds?.map((item) => {
        remove_camps_ids.push(item);
      });
    }
    return remove_camps_ids;
  };

  const addSupportMethod = async (values) => {
    if (shouldRemoveSupport() && supportedCampsStatus?.support_flag == 1) {
      let payload = {
        topic_num: reqBodyData.topic_num,
        remove_camps: removeSupportFromCamps(),
        type: "direct",
        action: removeSupportFromCamps()?.length > 0 ? "partial" : "add",
        nick_name_id: nictNameId,
        order_update: transformSupportOrderForAPI(tagsArrayList),
      };

      let res = await removeSupportedCamps(payload);
      if (res && res.status_code == 200) {
        openNotificationWithIcon(res?.message);
        await handleCancelSupportCamps({ isCallApiStatus: true });
        getCurrentCampRecordApi(reqBody);
        setDrawerFor("");
        onClose();
        // await callDetailPageApis();
        form.resetFields();
        setSelectedValue(null);
      }
    } else if (
      shouldRemoveSupport() &&
      supportedCampsStatus?.support_flag == 0
    ) {
      openNotificationWithIcon(
        "You are not supporting this camp. So, you can`t remove support"
      );
    } else {
      let payload = {
        topic_num: topicNum,
        add_camp:
          drawerFor == "directAdd"
            ? { camp_num: camp_num, support_order: tagsArrayList?.length }
            : {},
        remove_camps: removeSupportFromCamps(),
        type: "direct",
        action: removeSupportFromCamps()?.length > 0 ? "partial" : "add",
        nick_name_id: nictNameId,
        order_update: transformSupportOrderForAPI(tagsArrayList),
        reason_summary: values?.description,
        reasons: selectedValue,
      };

      let res = await addSupport(payload);
      if (res && res.status_code == 200) {
        openNotificationWithIcon(res?.message);
        await handleCancelSupportCamps({ isCallApiStatus: true });
        getCurrentCampRecordApi(reqBody);
        setDrawerFor("");
        onClose();
        form.resetFields();
        setSelectedValue(null);
      }
    }
  };

  const addDelegateMethod = async () => {
    const addDelegatedSupport = {
      nick_name_id: nictNameId,
      delegated_nick_name_id: getDelegateId,
      topic_num: topicNum,
    };

    let res = await addDelegateSupportCamps(addDelegatedSupport);
    if (res && res.status_code == 200) {
      openNotificationWithIcon(res?.message);
      await handleCancelSupportCamps({ isCallApiStatus: true });
      getCurrentCampRecordApi(reqBody);
      setDrawerFor("");
      onClose();
    }
  };

  const onFinish = async (values) => {
    if (drawerFor === "delegateAdd") {
      await addDelegateMethod();
    } else if (drawerFor === "directAdd" || drawerFor === "manageSupport") {
      await addSupportMethod(values);
    } else if (drawerFor === "signPetition") {
      signPetitionHandler();
    }
  };

  const getReasons = async () => {
    await getAllRemovedReasons();
  };

  const getSignPetitionData = async () => {
    let res = await CheckCampSignApiCall(topic_num, camp_num);

    if (res?.status_code == 200 && !!res?.data) {
      setSignCampData(res?.data);
    }
  };

  const signPetitionHandler = async () => {
    let reqBody = {
      topic_num,
      camp_num,
      nick_name_id: nickNameList?.at(0)?.id,
    };

    let res = await campSignApi(reqBody);
    if (res?.status_code == 200) {
      const reqBodyForService = {
        topic_num,
        camp_num,
        asOf: asof,
        asofdate:
          asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
        algorithm: algorithm,
        update_all: 1,
        fetch_topic_history: +router?.query?.topic_history,
      };

      let reqBody = {
        as_of: asof,
        as_of_date: asofdate,
        topic_num: +router?.query?.camp[0]?.split("-")[0],
        camp_num: +router?.query?.camp[1]?.split("-")[0],
      };
      await getTreesApi(reqBodyForService);
      await getCurrentCampRecordApi(reqBody);

      await getCheckStatusAPI();
    }
  };

  useEffect(() => {
    if (open) {
      if (
        drawerFor === "directAdd" ||
        drawerFor === "manageSupport" ||
        drawerFor === "directRemove"
      ) {
        getReasons();
      }

      if (
        drawerFor === "directAdd" ||
        drawerFor === "delegateAdd" ||
        drawerFor === "manageSupport"
      ) {
        getCanonizedNicknameList();
        getCurrentCampRecordApi(reqBody);
        GetCheckStatusData();
        getActiveSupportTopic();
      }

      if (drawerFor === "signPetition") {
        getCanonizedNicknameList();
        getSignPetitionData();
      }
    }
  }, [open]);

  useEffect(() => {
    setReasons(reasons);
  }, [reasons]);

  const enableDisableTagsHandler = (data) => {
    let res = tagsArrayList?.map((item, index) => {
      if (item?.id == data?.id) {
        return {
          ...item,
          disabled: item.disabled ? false : true,
        };
      } else {
        return {
          ...item,
        };
      }
    });
    setTagsArrayList(res);
  };

  const checkAllTagsSelected = () => {
    return (
      tagsArrayList?.filter((item) => item.disabled == true)?.length ==
      tagsArrayList?.length
    );
  };

  const renderPageHeaderTitle = () => {
    return (
      <>
        {drawerFor === "manageSupport" ? (
          "Manage Support"
        ) : drawerFor === "delegateAdd" ? (
          <>
            Delegating Support to
            <span className="ml-1">{delegateNickName || ""}</span>
          </>
        ) : drawerFor === "directAdd" ? (
          <>
            Adding Support to camp:
            <span className="ml-1">{campRecord && campRecord?.camp_name}</span>
          </>
        ) : drawerFor === "directRemove" ? (
          <>
            Removing Support from camp:
            <span> {campRecord?.camp_name} </span>
          </>
        ) : drawerFor === "signPetition" ? (
          <>Sign Camp Petition</>
        ) : null}
      </>
    );
  };

  const renderSubmitBtnText = () => {
    if (drawerFor === "manageSupport") {
      return "Update";
    } else if (drawerFor === "delegateAdd") {
      return "Delegate Support";
    } else if (drawerFor === "directAdd") {
      return "Add Support";
    } else if (drawerFor === "directRemove") {
      return "Remove Support";
    } else if (drawerFor === "signPetition") {
      return "Sign Petition";
    } else {
      return;
    }
  };

  useEffect(() => {
    checkAllTagsSelected()
      ? setIsQuickActionSelected(true)
      : setIsQuickActionSelected(false);
  }, [checkAllTagsSelected()]);

  const validationTypeColor = (type) => {
    if (type === "info") {
      return styles.info;
    } else if (type === "warning") {
      return styles.warning;
    }
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
            onBack={() => onClose()}
            backIcon={<i className="icon-back"></i>}
            title={renderPageHeaderTitle()}
          />
          <DrawerBreadcrumbs
            topicRecord={topicRecord}
            campRecord={campRecord}
            topic_name={topic_name}
          />
        </div>
        {drawerFor === "directAdd" ||
        drawerFor === "delegateAdd" ||
        drawerFor === "manageSupport" ? (
          <>
            <Form
              form={form}
              layout="vertical"
              className="adding-support-form"
              autoComplete="off"
              scrollToFirstError
              onFinish={onFinish}
            >
              <div className="support-content">
                {drawerFor !== "manageSupport" && (
                  <>
                    {currentGetCheckSupportExistsData &&
                      currentGetCheckSupportExistsData?.warning && (
                        <div className="alert-wrapper">
                          <Alert
                            className="border-0 rounded-lg warning-alert"
                            description={
                              currentGetCheckSupportExistsData?.warning
                            }
                            type="error"
                            showIcon
                            icon={<i className="icon-warning"></i>}
                          />
                          {parentSupportDataList &&
                            parentSupportDataList.length > 0 && (
                              <div className="horizontal-chips">
                                {parentSupportDataList?.map((item, index) => (
                                  <TagList key={index} name={item?.camp_name} />
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                  </>
                )}
                {drawerFor !== "delegateAdd" && (
                  <div className="checkbox-wrapper">
                    <Form.Item label="Quick Action" className="mb-0">
                      <Checkbox
                        checked={isQuickActionSelected}
                        onChange={(e) => {
                          removeAllSupportHandler(e);
                        }}
                      >
                        Remove All Support
                      </Checkbox>
                    </Form.Item>
                    <Button
                      size="large"
                      className="min-w-[200px] gap-2 flex items-center justify-center border border-canBlue bg-[#98B7E61A] rounded-lg text-canBlack text-base font-medium"
                      onClick={() => {
                        clearChangesHandler();
                      }}
                    >
                      Clear All Changes
                    </Button>
                  </div>
                )}
                <div className="chips-wrapper">
                  <p className="text-[#DB4F4F] mb-9">
                    Note : To change support order of camp, drag & drop the camp
                    box on your choice position.
                  </p>
                  {tagsArrayList?.length > 0 && (
                    <div className="vertical-chips">
                      <DraggableArea
                        tags={tagsArrayList}
                        render={({ tag, index }) => {
                          return (
                            <div className="flex items-center gap-7">
                              {tagsArrayList?.at(index)?.disabled ? (
                                <>
                                  <Tag
                                    className="rounded-full bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                                    closable={true}
                                    onClose={() => {
                                      enableDisableTagsHandler(tag);
                                      setIsQuickActionSelected(false);
                                    }}
                                  >
                                    {`${index + 1}.${tag?.content}`}
                                  </Tag>
                                </>
                              ) : (
                                <>
                                  <MenuOutlined className="text-sm text-[#777F93]" />
                                  <Tag
                                    className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                                    closable={true}
                                    onClose={() => {
                                      enableDisableTagsHandler(tag);
                                      setIsQuickActionSelected(false);
                                    }}
                                  >
                                    <a
                                      data-testid="styles_Bluecolor"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = tag.link;
                                      }}
                                    >
                                      {`${index + 1}.${tag?.content}`}
                                    </a>
                                  </Tag>
                                </>
                              )}
                            </div>
                          );
                        }}
                        onChange={(tags) => {
                          setTagsArrayList(tags);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  {drawerFor === "delegateAdd" && (
                    <p className="text-base font-medium mb-5 text-canBlack">
                      If you still wish to delegate support to{" "}
                      <a href="#" className="text-canBlue">
                        {delegateNickName} -
                      </a>{" "}
                    </p>
                  )}
                  <Row gutter={16}>
                    {drawerFor !== "delegateAdd" && (
                      <Col span={24} sm={12}>
                        <Form.Item
                          name="reason"
                          label="Reason for adding support"
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
                    )}

                    <Col span={24} sm={12}>
                      <Form.Item name="nickname" label="Nickname">
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
                    {selectedValue && selectedValue == "custom" && (
                      <>
                        <Col span={24}>
                          <Form.Item name="description" label="Description">
                            <TextArea className="thm-input" rows={4} />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                    {drawerFor !== "delegateAdd" && (
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
                  {renderSubmitBtnText()}
                  <PlusOutlined />
                </Button>
              </div>
            </Form>
          </>
        ) : drawerFor === "directRemove" || drawerFor === "delegateRemove" ? (
          <>
            <Form
              form={form}
              layout="vertical"
              className="adding-support-form"
              onFinish={onRemoveFinish}
            >
              <div className="support-content">
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
                          placeholder={placeholders.selectReason}
                          className="w-100 cn-select"
                          size="large"
                          suffixIcon={<i className="icon-chevron-down"></i>}
                          onChange={handleChange}
                        >
                          {availableReasons?.map((res) => (
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
                  {renderSubmitBtnText()}
                  <MinusOutlined />
                </Button>
              </div>
            </Form>
          </>
        ) : drawerFor === "signPetition" ? (
          <>
            <Form
              form={form}
              layout="vertical"
              className="adding-support-form"
              autoComplete="off"
              scrollToFirstError
              onFinish={onFinish}
            >
              <div className="support-content">
                {signCampData ? (
                  <>
                    <div className="alert-wrapper">
                      {/* <Alert
                      className="border-0 rounded-lg info-alert"
                      description={
                        "The camp leader of this camp is mary-doe. If you continue, your support will be delegated to the camp leader"
                      }
                      type="info"
                      showIcon
                      icon={<i className="icon-info"></i>}
                    /> */}
                      <span
                        className={validationTypeColor(
                          signCampData?.warning_type
                        )}
                        id="getSupportStatusDataWarning"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: signCampData?.warning,
                          }}
                        ></div>
                      </span>

                      {signCampData?.remove_camps?.length > 0 &&
                        signCampData?.remove_camps?.map((tag) => {
                          return (
                            <>
                              <Tag className="rounded-full bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack">
                                {`${tag.support_order}.${tag.camp_name}`}
                              </Tag>
                            </>
                          );
                        })}
                    </div>
                  </>
                ) : null}
                <div>
                  <Row gutter={16}>
                    <Col span={24} sm={12}>
                      <Form.Item name="nickname" label="Nickname">
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
                  {renderSubmitBtnText()}
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
