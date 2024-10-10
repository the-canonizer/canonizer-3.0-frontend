import { useRouter } from "next/router";
import { useState } from "react";
import ChangePasswordUI from "./ChangePasswordUI";
import { Form, message } from "antd";
import { changePassword } from "../../../network/api/userApi";
import { logout } from "../../../network/api/userApi";

const ChangePassword = () => {
  const router = useRouter();
  const [incorrectPasswordData, setIncorrectPasswordData] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    let formBody = {
      current_password: values.current_password.trim(),
      new_password: values.new_password.trim(),
      confirm_password: values.confirm_password.trim(),
    };

    try {
      let res = await changePassword(formBody);
      if (res && res.status_code === 200) {
        form.resetFields();
        message.success(res.message);
        //logout after success
        const logOutRes = await logout();
        if (logOutRes.status_code === 200) {
          router?.push("/login");
        }
      }
    } catch (e) {
      let msgs = e?.error?.data?.error;
      if (msgs) {
        let keys = Object.keys(msgs);
        keys.forEach((key) => {
          setIncorrectPasswordData(msgs[key][0]);
        });
      } else {
        setIncorrectPasswordData(e?.error?.data?.message);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    window.console.log("Faileds:", errorInfo);
  };

  return (
    <ChangePasswordUI
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      incorrectPasswordData={incorrectPasswordData}
      setIncorrectPasswordData={setIncorrectPasswordData}
    />
  );
};

export default ChangePassword;
