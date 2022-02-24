import { Fragment, useState } from "react";
import { useRouter } from "next/router";
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
import Spinner from "../../common/spinner/spinner";

const ForgotPassword = ({ isModal, isTestScreen = 0 }) => {
  const [isScreen, setIsScreen] = useState(isTestScreen);
  const [formData, setFormData] = useState({ email_id: "" });

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const router = useRouter();

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
    isModal ? closeModal() : "";
    router.push("/login");
  };

  return (
    <Fragment>
      <Spinner>
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
      </Spinner>
    </Fragment>
  );
};

export default ForgotPassword;
