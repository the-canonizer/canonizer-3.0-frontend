import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Form } from "antd";

import LoginUI from "./UI";

import {
  hideLoginModal,
  showForgotModal,
  showRegistrationModal,
} from "../../../store/slices/uiSlice";
import {
  login,
  resendOTPForRegistration,
  verifyOtp,
} from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import Spinner from "../../common/spinner/spinner";
import OTPVerify from "../Registration/UI/otp";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";

const Login = ({ isModal, isTest = false }) => {
  const [isOtpScreen, setIsOtpScreen] = useState(isTest);
  const [isResend, setIsResend] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [failedMsg, setFailedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();

  const closeModal = () => {
    dispatch(hideLoginModal());

    isOtpScreen ? otpForm.resetFields() : form.resetFields();
    setIsOtpScreen(false);
    setErrorMsg("");
  };

  const openForgotPasswordModal = () => dispatch(showForgotModal());
  const openRegistration = () => dispatch(showRegistrationModal());

  const onFinish = async (values: any) => {
    setFormData({ email: values.username });

    // const username = values.username?.trim().split(" ").join("");
    const username = values.username?.trim();
    const pass = values.password?.trim();

    let res = await login(username, pass);

    if (res && res.status_code === 402) {
      setErrorMsg(res.message);
    }

    if (res && res.status_code === 403) {
      setIsOtpScreen(true);
      setIsResend(true);
      setFailedMsg(res.message);
    }

    if (res && res.status_code === 200) {
      dispatch(
        setFilterCanonizedTopics({
          algorithm: res?.data?.user?.default_algo,
        })
      );
      form.resetFields();

      isModal ? closeModal() : "";

      if (router.query.returnUrl) {
        router.push(`${router.query.returnUrl}`);
      } else {
        if (!router.pathname?.includes("/forum/")) {
          router.push("/");
        } else {
          closeModal();
        }
      }
    }

    if (values.remember) {
      localStorage.setItem(
        "rememberme",
        JSON.stringify({
          username: values.username?.trim(),
          password: values.password,
        })
      );
    }
  };

  const onOTPClick = async (e) => {
    e.preventDefault();
    const emailPhone = form.getFieldValue("username");
    if (emailPhone?.trim()) {
      setErrorMsg("");
      let formBody = { email: emailPhone };

      const res = await resendOTPForRegistration(formBody);
      if (res && res.status_code === 200) {
        setFormData({ email: emailPhone });
        setIsOtpScreen(true);
      }
    } else {
      form.validateFields(["username"]);
    }
  };

  const onOTPSubmit = async (values: any) => {
    if (values.otp.trim()) {
      let formBody = {
        username: formData.email?.trim(),
        otp: values.otp,
        is_login: 1,
      };

      let res = await verifyOtp(formBody);

      if (res) {
        setFailedMsg(res.message);
      }

      if (res && res.status_code === 200) {
        otpForm.resetFields();
        setIsOtpScreen(false);
        isModal ? closeModal() : "";

        if (router.query.returnUrl) {
          router.push(`${router.query.returnUrl}`);
        } else {
          if (!router.pathname?.includes("/forum/")) {
            router.push("/");
          }
        }
      }
    } else {
      otpForm.resetFields();
      otpForm.validateFields(["otp"]);
    }
  };

  // on resend click
  const onResendClick = async () => {
    let formBody = { email: formData.email };

    await resendOTPForRegistration(formBody);
  };

  return (
    <Fragment>
      <Spinner>
        {isOtpScreen ? (
          <OTPVerify
            form={otpForm}
            onFinish={onOTPSubmit}
            closeModal={closeModal}
            isModal={isModal}
            isResend={isResend}
            failedMsg={failedMsg}
            onResendClick={onResendClick}
            logMsg="Note: Verification code has been sent to your registered email address."
          />
        ) : (
          <LoginUI
            form={form}
            onFinish={onFinish}
            closeModal={closeModal}
            isModal={isModal}
            openForgotPasswordModal={openForgotPasswordModal}
            openRegistration={openRegistration}
            onOTPClick={onOTPClick}
            errorMsg={errorMsg}
          />
        )}
      </Spinner>
    </Fragment>
  );
};

export default Login;
