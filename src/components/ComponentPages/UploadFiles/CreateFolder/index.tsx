import React from "react";
import { Button, Input, Form } from "antd";
const CreateFolder = ({
  editModal,
  createFolderForm,
  onFinish,
  validateMessages,
  rename,
  input,
  setRename,
  setInput,
}) => {
  return (
    <>
      <Form
        name={editModal ? "Edit your folder name" : "Create a Folder"}
        form={createFolderForm}
        onFinish={onFinish}
        validateMessages={validateMessages}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          label="Folder Name (Limit 15 Chars*)"
          name="folderName"
          rules={[
            { required: true },
            {
              pattern: new RegExp(/^[A-Z ]*$/i),
              message: "field does not accept numbers",
            },
          ]}
        >
          <Input
            type="text"
            value={editModal ? rename : input}
            onChange={(e) => {
              editModal ? setRename(e.target.value) : setInput(e.target.value);
            }}
            placeholder="Enter name of the Folder"
            maxLength={15}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="ant-btn ant-btn-orange ant-btn-lg"
            style={{
              width: "100%",
            }}
          >
            {editModal ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateFolder;
