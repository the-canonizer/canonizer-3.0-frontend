import React from "react";
import { Button, Input, Form } from "antd";
import { labels } from "../../../../messages/label";
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
        name={editModal ? "Edit your folder name" : labels.CreateaFolder}
        form={createFolderForm}
        onFinish={onFinish}
        validateMessages={validateMessages}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          label={labels.FolderName}
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
