import { useState, useEffect } from "react";
import { Form, Input, Button, Table, Tag, Modal, Row, Col, Space, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, RobotOutlined } from "@ant-design/icons";

import CommonCards from "components/shared/Card";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import { registerAiAgent, getAiAgentsList, deleteAiAgent, updateAiAgent } from "src/network/api/aiAgentApi";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

const AiAgentsUI = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    const res = await getAiAgentsList();
    if (res?.status_code === 200) {
      setAgents(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const onRegister = async (values) => {
    setRegisterLoading(true);
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name || "",
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
      country_code: "+1",
      type: "bot",
      parent_user_email: values.parent_user_email || undefined,
    };

    const res = await registerAiAgent(payload);
    if (res?.status_code === 200) {
      openNotificationWithIcon("Agent registered successfully! Check the agent's email for OTP verification.", "success");
      form.resetFields();
      fetchAgents();
    } else {
      const errorMsg = res?.message || "Registration failed";
      openNotificationWithIcon(errorMsg, "error");
    }
    setRegisterLoading(false);
  };

  const onEdit = (record) => {
    setEditingAgent(record);
    editForm.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
    });
  };

  const onEditSave = async (values) => {
    setEditLoading(true);
    const res = await updateAiAgent(editingAgent.id, {
      first_name: values.first_name,
      last_name: values.last_name,
      ...(values.password ? { password: values.password } : {}),
    });
    if (res?.status_code === 200) {
      openNotificationWithIcon("Agent updated successfully", "success");
      setEditingAgent(null);
      editForm.resetFields();
      fetchAgents();
    } else {
      openNotificationWithIcon(res?.message || "Update failed", "error");
    }
    setEditLoading(false);
  };

  const onDeactivate = (id) => {
    Modal.confirm({
      title: "Deactivate this agent?",
      content: "The agent will no longer be able to authenticate or perform actions.",
      okText: "Deactivate",
      okType: "danger",
      onOk: async () => {
        const res = await deleteAiAgent(id);
        if (res?.status_code === 200) {
          openNotificationWithIcon("Agent deactivated", "success");
          fetchAgents();
        }
      },
    });
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Space>
          <RobotOutlined className="text-canBlue" />
          <span className="font-medium">
            {record.first_name} {record.last_name}
          </span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-canLight">{text}</span>,
    },
    {
      title: "Nickname",
      key: "nickname",
      render: (_, record) => (
        <>
          {(record.nicknames || []).map((n) => (
            <Tag key={n.id} color="blue">
              {n.nick_name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.is_active ? "green" : "red"}>
          {record.is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.is_active ? (
            <>
              <Tooltip title="Edit agent">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                >
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Deactivate this agent">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDeactivate(record.id)}
                >
                  Deactivate
                </Button>
              </Tooltip>
            </>
          ) : (
            <span className="text-canLight">Deactivated</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <SectionHeading
        title="AI Agents"
        icon={<RobotOutlined />}
        infoContent="Register and manage AI agents that can act on Canonizer."
      />

      <Row gutter={16} className="mt-4">
        <Col xs={24} lg={8}>
          <CommonCards title="Register New Agent" className="mb-4">
            <Form form={form} layout="vertical" onFinish={onRegister}>
              <Form.Item
                name="first_name"
                label="Agent First Name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="e.g. ResearchBot" maxLength={100} />
              </Form.Item>

              <Form.Item name="last_name" label="Agent Last Name">
                <Input placeholder="e.g. v1" maxLength={100} />
              </Form.Item>

              <Form.Item
                name="email"
                label="Agent Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
                tooltip="The agent will receive an OTP at this email for verification"
              >
                <Input placeholder="e.g. mybot@example.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 8, message: "Minimum 8 characters" },
                ]}
              >
                <Input.Password placeholder="Min 8 chars, 1 number, 1 special" />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Confirm password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Repeat password" />
              </Form.Item>

              <Form.Item
                name="parent_user_email"
                label="Parent User Email (Optional)"
                rules={[
                  { type: "email", message: "Enter a valid email" },
                ]}
                tooltip="Link this agent to a human user. Leave empty for an independent agent."
              >
                <Input placeholder="owner@example.com" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={registerLoading}
                  icon={<PlusOutlined />}
                  block
                  className="bg-canBlue border-canBlue hocus:bg-canHoverBlue"
                >
                  Register Agent
                </Button>
              </Form.Item>
            </Form>
          </CommonCards>
        </Col>

        <Col xs={24} lg={16}>
          <CommonCards title="My Agents" className="mb-4">
            <Table
              columns={columns}
              dataSource={agents}
              rowKey="id"
              loading={loading}
              pagination={false}
              locale={{ emptyText: "No agents registered yet" }}
              size="middle"
            />
          </CommonCards>
        </Col>
      </Row>

      <Modal
        title="Edit Agent"
        visible={!!editingAgent}
        onCancel={() => {
          setEditingAgent(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={onEditSave}>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input maxLength={100} />
          </Form.Item>

          <Form.Item name="last_name" label="Last Name">
            <Input maxLength={100} />
          </Form.Item>

          <Form.Item
            name="password"
            label="New Password (leave blank to keep current)"
            rules={[
              { min: 8, message: "Minimum 8 characters" },
            ]}
          >
            <Input.Password placeholder="Leave blank to keep current password" />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Confirm New Password"
            dependencies={["password"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue("password") || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords do not match");
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={editLoading}
                className="bg-canBlue border-canBlue"
              >
                Save
              </Button>
              <Button onClick={() => {
                setEditingAgent(null);
                editForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AiAgentsUI;
