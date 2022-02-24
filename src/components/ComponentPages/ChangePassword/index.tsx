import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import ChangePasswordUI from "./ChangePasswordUI";
import { AppDispatch } from "../../../store";
import { Form, message } from "antd";
import { changePassword } from "../../../network/api/userApi";
import { logout } from "../../../network/api/userApi";

const ChangePassword = () => {
  const router = useRouter();

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
      const logOutRes = await logout();
      if (logOutRes.status_code === 200) {
        router.push("/");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <ChangePasswordUI
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    />
  );
};

export default ChangePassword;
