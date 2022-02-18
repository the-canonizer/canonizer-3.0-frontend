import { useState } from "react";
import { Table, Input, Select, Form, Typography, Button, Modal } from "antd";
import Icon, { PlusCircleOutlined } from "@ant-design/icons";
import styles from "./NickName.module.scss";
import messages from "../../../../messages";

const originData = [];
const { Option } = Select;

for (let i = 0; i < 5; i++) {
  originData.push({
    key: i.toString(),
    srNo: "0" + (i + 1).toString(),
    nickNameId: `${501 + i}`,
    nickName: `Amanda ${i}`,
    visibilityStatus: `Public`,
  });
}

export default function NickNameUI({
  add_edit_form,
  addEditBtn,
  addEditTitle,
  isNickNameModalVisible,
  editNickName,
  nickNameForm,
  handleAddNickName,
  handleNickNameCancel,
}) {
  const [data, setData] = useState(originData);
  const columns = [
    {
      title: "Sr",
      dataIndex: "srNo",
      width: "5%",
    },
    {
      title: "Nick Name ID",
      dataIndex: "nickNameId",
      width: "20%",
    },
    {
      title: "Nick Name",
      dataIndex: "nickName",
      width: "40%",
    },
    {
      title: "Visibility Status",
      dataIndex: "visibilityStatus",
      width: "20%",
    },
    {
      title: "",
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => editNickName(record)}>
            Edit
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
              dataSource={data}
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
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item name="nick_name" label={messages.labels.nickName}>
              <Input placeholder="" value="" size="large" />
            </Form.Item>
            <Form.Item
              name="visibility_status"
              label={messages.labels.visibilityStatus}
            >
              <Select defaultValue="public" size="large">
                <Option value="public">Public</Option>
                <Option value="private">Private</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
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
