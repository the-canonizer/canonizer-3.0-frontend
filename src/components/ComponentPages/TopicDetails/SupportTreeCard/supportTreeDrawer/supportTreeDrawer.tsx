import {
  CloseOutlined,
  PlusOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
} from "antd";
import Breadcrumbs from "components/ComponentPages/Breadcrumbs/breadcrumbs";
import StructureIcon from "components/ComponentPages/CreateNewTopic/UI/structureIcon";
import SelectInputs from "components/shared/FormInputs/select";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { placeholders } from "src/messages/placeholder";
import { getAllRemovedReasons, getAllUsedNickNames } from "src/network/api/campDetailApi";
import { addSupport } from "src/network/api/userApi";
import { RootState } from "src/store";

function SupportTreeDrawer({ onClose, open }: any) {
  const reasons = useSelector(
    (state: RootState) => state?.topicDetails?.removedReasons
  );
  const router = useRouter();
  const [nickNameList, setNickNameList] = useState([]);
  const [availableReasons, setReasons] = useState(reasons);
  const [selectedValue, setSelectedValue] = useState(null);
  const [form] = Form.useForm();



  const getCanonizedNicknameList = async () => {
    const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);
    const body = { topic_num: topicNum };

    let res = await getAllUsedNickNames(topicNum && body);
    if (res && res?.status_code == 200) {
      setNickNameList(res.data);
      form.setFieldsValue({
        nickname: res?.data?.nick_name
      })
    }
  };




  const getReasons = async () => {
    await getAllRemovedReasons();
  };

  const onSelectChange = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    getReasons();
    getCanonizedNicknameList()
  }, []);

  useEffect(() => {
    setReasons(reasons);
  }, [reasons]);


  const onFinish = () => {

  }

  console.log("hello")


  return (
    <>
      {/* <Button type="primary" onClick={showDrawer}>
        Open close
      </Button> */}
      <Drawer
        closable={false}
        className="ch-drawer adding-supported-drawer"
        placement="right"
        onClose={onClose}
        open={open}
        contentWrapperStyle={{ maxWidth: "730px", width: "100%" }}
      // footer={
      //   <div className="flex justify-center max-sm:flex-col gap-5">
      //     <Button
      //       size="large"
      //       className="min-w-[200px] gap-2 flex items-center justify-center border border-canBlue bg-[#98B7E61A] rounded-lg text-canBlack text-base font-medium"
      //       onClick={() => onClose()}
      //     >
      //       Cancel
      //       <CloseOutlined />
      //     </Button>
      //     <Button
      //       size="large"
      //       type="primary"
      //       htmlType="submit"
      //       className=" min-w-[200px] bg-canBlue flex items-center justify-center hover:bg-canHoverBlue focus:bg-canHoverBlue hover:text-white font-medium text-white disabled:bg-disabled font-base rounded-lg"
      //     >
      //       Add Support
      //       <PlusOutlined />
      //     </Button>
      //   </div>
      // }
      >
        <div className="page-breadcrums-wrapper">
          <PageHeader
            className="p-0 drawer-header"
            onBack={() => null}
            backIcon={<i className="icon-back"></i>}
            title={
              <>
                Adding Support to camp:
                <span>Agreement </span>
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
        // validateTrigger={messages.formValidationTypes()}
        >
          <div className="support-content">


            {/* <Alert
            className="border-0 rounded-lg warning-alert"
            description="You’re already supporting the Parent Camp: Agreement.
Adding support to this camp will remove your support from the parent camp."
            type="error"
            showIcon
            icon={<i className="icon-warning"></i>}
          /> */}

            <Row gutter={16}>
              <Col span={24} sm={12}>
                <Form.Item
                  name="reason"
                  label="Reason for adding support"
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please select a reason',
                    },
                  ]}
                >
                  <Select
                    className="w-100 cn-select"
                    size="large"
                    suffixIcon={<i className="icon-chevron-down"></i>}
                    onChange={onSelectChange}
                  >
                    {availableReasons?.map((res) => (
                      <Select.Option key={res?.id} value={`${res?.id}-(${res?.label})`}>
                        {res?.label}
                      </Select.Option>
                    ))}
                    <Select.Option key="custom_reason" value="custom">
                      Custom reason
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  name="nickname"
                  label="Nickname"
                  rules={[
                    {
                      required: true,
                      message: 'Please select a nickname',
                    },
                  ]}
                >
                  <Select
                    placeholder="Select a nickname"
                    className="w-100 cn-select"
                    size="large"
                    suffixIcon={<i className="icon-chevron-down"></i>}
                    showSearch
                  >
                    {nickNameList?.map((nick) => (
                      <Select.Option key={nick.id} value={nick.id} >
                        {nick.nick_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Citation"
                  label="Citation link"
                >
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
          <div className="flex justify-center max-sm:flex-col gap-5">
            <Button
              size="large"
              className="min-w-[200px] gap-2 flex items-center justify-center border border-canBlue bg-[#98B7E61A] rounded-lg text-canBlack text-base font-medium"
              onClick={() => {
                onClose()
                form.resetFields()
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
