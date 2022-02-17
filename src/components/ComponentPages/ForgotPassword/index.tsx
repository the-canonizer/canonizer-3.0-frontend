import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, message } from "antd";

import ForgotPasswordUI from "./UI";

import { hideForgotModal } from "../../../store/slices/uiSlice";
import {
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
  forgotPasswordUpdate,
} from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import { redirectToLogin } from "../../../utils/generalUtility";

const ForgotPassword = ({ isModal, isTestScreen = 0 }) => {
  const [isScreen, setIsScreen] = useState(isTestScreen);
  const [formData, setFormData] = useState({ email_id: "" });

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const closeModal = () => dispatch(hideForgotModal());

  const onFinish = async (values: any) => {
    setFormData(values);
    let body = {
      email: values.email_id,
    };
    let res = await forgotPasswordSendOTP(body);
    if (res && res.status_code === 200) {
      form.resetFields();
      message.success(res.message);

      setIsScreen(1);
    }
  };

  const onOTPSubmit = async (values: any) => {
    let body = {
      username: formData.email_id,
      otp: values.otp,
    };

    let res = await forgotPasswordVerifyOTP(body);

    if (res && res.status_code === 200) {
      otpForm.resetFields();
      message.success(res.message);
      setIsScreen(2);
    }
  };

  const onPasswordSubmit = async (values: any) => {
    let body = {
      username: formData.email_id,
      new_password: values.password,
      confirm_password: values.confirm,
    };

    let res = await forgotPasswordUpdate(body);

    if (res && res.status_code === 200) {
      passwordForm.resetFields();
      setIsScreen(0);
    }
    isModal ? closeModal() : redirectToLogin();
  };

  return (
    <ForgotPasswordUI
      form={isScreen === 2 ? passwordForm : isScreen === 1 ? otpForm : form}
      onFinish={
        isScreen === 2
          ? onPasswordSubmit
          : isScreen === 1
          ? onOTPSubmit
          : onFinish
      }
      closeModal={closeModal}
      isModal={isModal}
      isScreen={isScreen}
    />
  );
};

export default ForgotPassword;
