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
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
  Tag,
} from "antd";

import React, { useState } from "react";
const { TextArea } = Input;

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
  const preventDefault = (e) => {
    e.preventDefault();
    console.log("Clicked! But prevent default.");
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

        <Form form={form} layout="vertical" className="adding-support-form">
          <div className="support-content">
            <Alert
              className="border-0 rounded-lg warning-alert"
              description="You’re already supporting the Parent Camp: Agreement.
Adding support to this camp will remove your support from the parent camp."
              type="error"
              showIcon
              icon={<i className="icon-warning"></i>}
            />
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
                <Tag
                  className="rounded-full bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
                  closable
                  onClose={preventDefault}
                >
                  1 . Debating the theory
                </Tag>
              </div>
            </div>
            <div>
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
                  <Form.Item name="description" label="Description">
                    <TextArea className="thm-input" rows={4} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    className="mb-0"
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
            </div>
          </div>
          <div className="flex justify-center max-sm:flex-col gap-5 p-11 fixed right-0 max-w-[730px] w-full mt-0 bg-white z-50 bottom-0">
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
        </Form>
      </Drawer>
    </>
  );
}
export default SupportTreeDrawer;
