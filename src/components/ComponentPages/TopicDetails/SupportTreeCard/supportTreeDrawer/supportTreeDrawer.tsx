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
import React, { useState } from "react";
function SupportTreeDrawer() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer
        closable={false}
        className="ch-drawer adding-supported-drawer"
        placement="right"
        onClose={onClose}
        open={open}
        width={730}
        footer={
          <div className="flex justify-center max-sm:flex-col gap-5">
            <Button
              size="large"
              className="min-w-[200px] gap-2 flex items-center justify-center border border-canBlue bg-[#98B7E61A] rounded-lg text-canBlack text-base font-medium"
            >
              Cancel
              <CloseOutlined />
            </Button>
            <Button
              size="large"
              type="primary"
              className=" min-w-[200px] bg-canBlue flex items-center justify-center hover:bg-canHoverBlue focus:bg-canHoverBlue hover:text-white font-medium text-white disabled:bg-disabled font-base rounded-lg"
            >
              Add Support
              <PlusOutlined />
            </Button>
          </div>
        }
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

        <Form form={form} layout="vertical" className="adding-support-form">
          <Alert
            className="border-0 rounded-lg warning-alert"
            description="You’re already supporting the Parent Camp: Agreement.
Adding support to this camp will remove your support from the parent camp."
            type="error"
            showIcon
            icon={<i className="icon-warning"></i>}
          />

          <Row gutter={16}>
            <Col span={24} sm={12}>
              <Form.Item
                label="Reason for adding support"
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
                    placeholder="Select reason from list"
                    className="w-100 cn-select"
                    size="large"
                    suffixIcon={<i className="icon-chevron-down"></i>}
                    onChange={handleChange}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },

                      {
                        value: "Yiminghe",
                        label: "yiminghe",
                      },
                    ]}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item
                label="Nickname"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <div className="thm-select">
                  <div className="prefix-icon">
                    <UserOutlined />
                  </div>
                  <Select
                    placeholder="Select your nickname from list"
                    className="w-100 cn-select"
                    size="large"
                    suffixIcon={<i className="icon-chevron-down"></i>}
                    onChange={handleChange}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },

                      {
                        value: "Yiminghe",
                        label: "yiminghe",
                      },
                    ]}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="Citation"
                label="Citation link"
                rules={[
                  {
                    required: true,
                  },
                ]}
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
        </Form>
      </Drawer>
    </>
  );
}
export default SupportTreeDrawer;