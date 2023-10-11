import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, message } from "antd";
import { useRouter } from "next/router";

import ForgotPasswordUI from "./UI";

import { hideForgotModal } from "../../../store/slices/uiSlice";
import {
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
} from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import Spinner from "../../common/spinner/spinner";

const ForgotPassword = ({ isModal, isTestScreen = 0 }: any) => {
  const [isScreen, setIsScreen] = useState(isTestScreen);
  const [formData, setFormData] = useState({ email_id: "" });

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const router = useRouter();

  const closeModal = () => {
    dispatch(hideForgotModal());
    isScreen === 1 ? otpForm.resetFields() : form.resetFields();
    setIsScreen(0);
  };

  const onFinish = async (values: any) => {
    setFormData(values);
    let body = {
      email: values.email_id?.trim(),
    };
    let res = await forgotPasswordSendOTP(body);
    if (res && res.status_code === 200) {
      form.resetFields();
      message.success(res.message);
      // dispatch(setValue({ label: "email_id", value: formData?.email_id }));
      setIsScreen(1);
    }
  };

  const onOTPSubmit = async (values: any) => {
    if (values.otp.trim()) {
      let body = {
        username: formData.email_id?.trim(),
        otp: values.otp?.trim(),
      };

      let res = await forgotPasswordVerifyOTP(body);

      if (res && res.status_code === 200) {
        otpForm.resetFields();
        message.success(res.message);
        setIsScreen(0);
        isModal && closeModal();
        // dispatch(setValue({ label: "email_id", value: formData?.email_id }));
        localStorage.setItem("verified", formData?.email_id);
        router?.push({ pathname: "/reset-password" });
      }
    } else {
      if (isScreen === 1) {
        form.resetFields();
        form.validateFields(["otp"]);
      }
    }
  };

  return (
    <Fragment>
      <Spinner>
        <ForgotPasswordUI
          form={isScreen === 1 ? otpForm : form}
          onFinish={isScreen === 1 ? onOTPSubmit : onFinish}
          closeModal={closeModal}
          isModal={isModal}
          isScreen={isScreen}
        />
      </Spinner>
    </Fragment>
  );
};

export default ForgotPassword;
