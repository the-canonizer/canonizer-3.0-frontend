import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, message } from "antd";

import ForgotPasswordUI from "./UI";
import OTPVerify from "./UI/otp";
import PasswordUI from "./UI/password";

import { hideForgotModal } from "../../../store/slices/uiSlice";
import {
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
  forgotPasswordUpdate,
} from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import { redirectToLogin } from "src/utils/generalUtility";

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

    if (isModal) {
      closeModal();
    } else {
      redirectToLogin();
    }
  };

  return (
    <Fragment>
      {isScreen === 0 && (
        <ForgotPasswordUI
          form={form}
          onFinish={onFinish}
          closeModal={closeModal}
          isModal={isModal}
        />
      )}
      {isScreen === 1 && (
        <OTPVerify
          form={otpForm}
          onFinish={onOTPSubmit}
          closeModal={closeModal}
          isModal={isModal}
        />
      )}
      {isScreen === 2 && (
        <PasswordUI
          form={passwordForm}
          onFinish={onPasswordSubmit}
          closeModal={closeModal}
          isModal={isModal}
        />
      )}
    </Fragment>
  );
};

export default ForgotPassword;
