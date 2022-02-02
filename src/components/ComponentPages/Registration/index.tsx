import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, message } from "antd";
import { useRouter } from "next/router";

import RegistrationUi from "./UI";
import OTPVerify from "./UI/otp";
import { hideRegistrationModal } from "../../../store/slices/ui/uiSlice";
import { register, verifyOtp } from "../../../network/services/auth/index";
import { AppDispatch } from "../../../store";

const Registration = ({ isModal }) => {
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isReCaptchaRef, setIsReCaptchaRef] = useState(false);
  const [formData, setFormData] = useState({ email: "" });

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const router = useRouter();

  const closeModal = () => dispatch(hideRegistrationModal());

  const onReCAPTCHAChange = async (captchaCode) => {
    if (!captchaCode) {
      return;
    }

    // Else reCAPTCHA was executed successfully so proceed with the success status
    setIsCaptchaVerified(true);
  };

  const onFinish = async (values: any) => {
    if (isCaptchaVerified) {
      setFormData(values);
      let formBody = {
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirm,
        phone_number: values.phone,
        country_code: values.prefix,
      };
      let res = await dispatch(register(formBody));
      if (res && res.status_code === 200) {
        form.resetFields();
        message.success(res.message);

        // Reset the reCAPTCHA so that it can be executed again if user
        setIsReCaptchaRef(true);

        setIsOtpScreen(true);
      }
    }
  };

  const onOTPSubmit = async (values: any) => {
    let formBody = {
      username: formData.email,
      otp: values.otp,
    };

    let res = await dispatch(verifyOtp(formBody));

    if (res && res.status_code === 200) {
      otpForm.resetFields();

      setIsOtpScreen(false);

      closeModal();
      if (!isModal) {
        router.push("/");
      }
    }
  };

  return (
    <Fragment>
      {isOtpScreen ? (
        <OTPVerify
          form={otpForm}
          onFinish={onOTPSubmit}
          closeModal={closeModal}
          isModal={isModal}
        />
      ) : (
        <RegistrationUi
          form={form}
          onFinish={onFinish}
          closeModal={closeModal}
          isModal={isModal}
          onReCAPTCHAChange={onReCAPTCHAChange}
          resetCaptcha={isReCaptchaRef}
          showCaptchaError={isCaptchaVerified}
        />
      )}
    </Fragment>
  );
};

export default Registration;
