import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from 'moment';
import { Form, message } from "antd";
import { AppDispatch } from "../../../store";
import { GetUserProfileInfo, UpdateUserProfileInfo } from "../../../network/services/auth/index";
import ProfileInfoUI from "./ProfileInfoUI";
const ProfileInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    let res = await dispatch(UpdateUserProfileInfo(values));
    if (res && res.status_code === 200) {
      message.success(res.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    async function fetchUserProfileInfo() {
      let res = await dispatch(GetUserProfileInfo());
      //format date for datepicker
      res.data.birthday=moment(res.data.birthday, 'YYYY-MM-DD');
      form.setFieldsValue(res.data);
      
    }
    fetchUserProfileInfo()
  }, []);
  return (
    <ProfileInfoUI
    form={form}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    ></ProfileInfoUI>
  );
};
export default ProfileInfo;
