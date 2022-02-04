import { useDispatch } from "react-redux";
import { useState } from "react";
import ChangePasswordUI from "./ChangePasswordUI";
import { AppDispatch } from "../../../store";
import { Form, message } from "antd";
import { changePassword } from "../../../network/services/auth/index";
import { logout } from "../../../network/services/auth";

const ChangePassword = () => {
  const [formData, setFormData] = useState();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setFormData(values);

    let formBody = {
      current_password: values.current_password,
      new_password: values.new_password,
      confirm_password: values.confirm_password,
    };
    
    let res = await dispatch(changePassword(formBody));
    if (res && res.status_code === 200) {
      form.resetFields();
      message.success(res.message);
      //logout after success
      await dispatch(logout());
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    
    <ChangePasswordUI
    form={form}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}/>
    
  );
};

export default ChangePassword;
