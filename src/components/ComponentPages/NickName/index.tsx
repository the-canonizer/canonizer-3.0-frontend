import NickNameUI from "./NickNameUI";
import { useState } from "react";
import { Form } from "antd";

const NickName = () => {
  const [add_edit_form] = Form.useForm();
  const [nickNameForm] = Form.useForm();
  const [isNickNameModalVisible, setIsNickNameModalVisible] = useState(false);
  const [addEditTitle, setAddEditTitle] = useState("");
  const [addEditBtn, setAddEditBtn] = useState("");

  const editNickName = (record) => {
    setAddEditTitle("Edit New Nick Name");
    setAddEditBtn("Update");
    setIsNickNameModalVisible(true);
    add_edit_form.setFieldsValue({
      nick_name: record.nickName,
      visibility_status: record.visibilityStatus,
    });
  };

  const handleNickNameCancel = () => {
    setIsNickNameModalVisible(false);
  };

  const handleAddNickName = () => {
    add_edit_form.resetFields();
    setAddEditTitle("Add New Nick Name");
    setIsNickNameModalVisible(true);
    setAddEditBtn("Create");
  };

  return (
    <NickNameUI
      nickNameForm={nickNameForm}
      add_edit_form={add_edit_form}
      addEditTitle={addEditTitle}
      addEditBtn={addEditBtn}
      isNickNameModalVisible={isNickNameModalVisible}
      editNickName={editNickName}
      handleAddNickName={handleAddNickName}
      handleNickNameCancel={handleNickNameCancel}
    />
  );
};

export default NickName;
