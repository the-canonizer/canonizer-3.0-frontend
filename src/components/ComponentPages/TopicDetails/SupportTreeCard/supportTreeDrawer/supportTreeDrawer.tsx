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
import Breadcrumbs from "components/ComponentPages/Breadcrumbs/breadcrumbs";
import React, { useState } from "react";
function SupportTreeDrawer() {
  const [open, setOpen] = useState(false);
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
        className="ch-drawer"
        placement="right"
        onClose={onClose}
        open={open}
        width={730}
      >
        <div>
          <PageHeader
            className="px-0"
            onBack={() => null}
            backIcon={<i className="icon-back"></i>}
            title={
              <>
                Adding Support to camp:
                <span>Agreement </span>
              </>
            }
          />
        </div>

        <Form layout="vertical">
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
                <Select
                  defaultValue="lucy"
                  className="w-100"
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
                <Select
                  defaultValue="Select your nickname from list"
                  className="w-100"
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
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Citation link"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue="https:// "
                  className="w-100"
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
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
}
export default SupportTreeDrawer;
