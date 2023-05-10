import NickNameUI from "./NickNameUI";
import { useState, useEffect } from "react";
import { Form, message } from "antd";
import {
  addNickName,
  updateNickName,
  getNickNameList,
} from "../../../network/api/userApi";

const NickName = () => {
  const [add_edit_form] = Form.useForm();
  const [nickNameForm] = Form.useForm();
  const [isNickNameModalVisible, setIsNickNameModalVisible] = useState(false);
  const [addEditTitle, setAddEditTitle] = useState("");
  const [addEditBtn, setAddEditBtn] = useState("");
  const [nickNameList, setNickNameList] = useState([]);
  const [selectedNickNameList, setSelectedNickNameList] = useState([]);
  const create = "Create";
  const [disableButton, setDisableButton] = useState(false);
  const [getNickNamesLoadingIndicator, setGetNickNamesIndicator] =
    useState(false);

  const editNickName = (record) => {
    setAddEditTitle("Edit Nickname");
    setAddEditBtn("Update");
    setIsNickNameModalVisible(true);
    setSelectedNickNameList(record);
    add_edit_form.setFieldsValue({
      nick_name: record.nick_name.replace(/\s\s+/g, " "),
      visibility_status: record.private.toString(),
    });
  };

  const handleNickNameCancel = () => {
    setIsNickNameModalVisible(false);
  };

  const handleAddNickName = () => {
    add_edit_form.resetFields();
    setAddEditTitle("Add New Nickname");
    setIsNickNameModalVisible(true);
    setAddEditBtn("Create");
  };

  const onAddUpdateNickName = async (values: any) => {
    var formBody = {};
    setDisableButton(true);
    if (addEditBtn == create) {
      formBody = {
        nick_name: values.nick_name.replace(/\s\s+/g, " "),
        visibility_status:
          parseInt(values.visibility_status).toString() == "NaN"
            ? 0
            : parseInt(values.visibility_status),
      };
      let res = await addNickName(formBody);
      if (res && res.status_code === 200) {
        nickNameForm.resetFields();
        setIsNickNameModalVisible(false);
        message.success(res.message);
        setDisableButton(false);
      } else {
        setDisableButton(false);
      }
    } else {
      formBody = {
        visibility_status:
          parseInt(values.visibility_status).toString() == "NaN"
            ? 0
            : parseInt(values.visibility_status),
      };
      if (selectedNickNameList) {
        let nickNameId = "/" + selectedNickNameList["id"];
        let res = await updateNickName(formBody, nickNameId);
        if (res && res.status_code === 200) {
          setIsNickNameModalVisible(false);
          message.success(res.message);
          setDisableButton(false);
        } else {
          setDisableButton(false);
        }
      }
    }
    fetchNickNameList();
  };

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
    }
  };
  useEffect(() => {
    (async () => {
      setGetNickNamesIndicator(true);
      await fetchNickNameList();
      setGetNickNamesIndicator(false);
    })();
  }, []);

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
      onAddUpdateNickName={onAddUpdateNickName}
      nickNameList={nickNameList}
      disableButton={disableButton}
      getNickNamesLoadingIndicator={getNickNamesLoadingIndicator}
    />
  );
};

export default NickName;
