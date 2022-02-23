import { useState } from "react";
import { Table, Input, Select, Form, Typography, Button, Modal } from "antd";
import Icon, { PlusCircleOutlined } from "@ant-design/icons";
import styles from "./NickName.module.scss";
import messages from "../../../../messages";

const { Option } = Select;

export default function NickNameUI({
  add_edit_form,
  addEditBtn,
  addEditTitle,
  isNickNameModalVisible,
  editNickName,
  nickNameForm,
  handleAddNickName,
  handleNickNameCancel,
  onAddUpdateNickName,
  nickNameList,
}) {
  const isDisable = addEditBtn == "Update";
  const columns = [
    {
      title: "Sr",
      dataIndex: "srNo",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Nick Name ID",
      dataIndex: "id",
      width: "20%",
    },
    {
      title: "Nick Name",
      dataIndex: "nick_name",
      width: "40%",
    },
    {
      title: "Visibility Status",
      dataIndex: "private",
      width: "20%",
      render: (text, record, index) => (text == 0 ? "Public" : "Private"),
    },
    {
      title: "",
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => editNickName(record)}>
            edit
          </Typography.Link>
        );
      },
    },
  ];

  return (
    <>
      <section className={styles.nick_name}>
        <Form form={nickNameForm} component={false}>
          <Form.Item>
            <Table
              dataSource={nickNameList}
              columns={columns}
              rowClassName="editable-row"
              pagination={false}
            />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={handleAddNickName}
              type="primary"
              style={{
                marginBottom: 16,
              }}
              className="ant-btn ant-btn-orange ant-btn-lg"
            >
              {messages.labels.addnewNickName}
              <Icon component={() => <PlusCircleOutlined />} />
            </Button>
          </Form.Item>
        </Form>

        <Modal
          title={addEditTitle}
          visible={isNickNameModalVisible}
          footer=""
          onCancel={handleNickNameCancel}
          width={400}
        >
          <Form
            name="add_edit_form"
            form={add_edit_form}
            onFinish={onAddUpdateNickName}
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item
              name="nick_name"
              label={messages.labels.nickName}
              {...messages.nickNameRule}
            >
              <Input
                placeholder=""
                value=""
                size="large"
                disabled={isDisable}
              />
            </Form.Item>
            <Form.Item
              name="visibility_status"
              label={messages.labels.visibilityStatus}
            >
              <Select defaultValue="0" size="large">
                <Option value="0">Public</Option>
                <Option value="1">Private</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                data-testid="submitButton"
                className="ant-btn ant-btn-orange ant-btn-lg"
                style={{
                  width: "100%",
                }}
              >
                {addEditBtn}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </>
  );
}
