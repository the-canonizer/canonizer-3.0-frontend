import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";

import LoginUI from "./UI";

import {
  hideLoginModal,
  showForgotModal,
  showRegistrationModal,
} from "src/store/slices/uiSlice";
import {
  getNickNameList,
  login,
  resendOTPForRegistration,
  verifyOtp,
} from "src/network/api/userApi";
import { AppDispatch, RootState } from "src/store";
import Spinner from "../../common/spinner/spinner";
import OTPVerify from "../Registration/UI/otp";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import { setValue } from "src/store/slices/utilsSlice";
import messages from "src/messages";
import { setUserNickNames } from "src/store/slices/authSlice";

const Login = ({ isModal, isTest = false }: any) => {
  const remember = useSelector((state: RootState) => state.utils.remember_me);

  const [isOtpScreen, setIsOtpScreen] = useState(isTest);
  const [isResend, setIsResend] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [failedMsg, setFailedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberValue, setRememberValue] = useState(remember);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const didMount = useRef(false);

  useEffect(() => setRememberValue(remember), [remember]);

  const closeModal = () => {
    dispatch(hideLoginModal());

    isOtpScreen ? otpForm.resetFields() : form.resetFields();
    setIsOtpScreen(false);
    setErrorMsg("");
  };

  const openForgotPasswordModal = () => dispatch(showForgotModal());
  const openRegistration = () => dispatch(showRegistrationModal());

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response?.status_code === 200) {
      dispatch(setUserNickNames(response?.data))
    }
  };


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
      fetchNickNameList()

      closeModal();

      if (router?.query?.returnUrl) {
        router?.push(`${router?.query?.returnUrl}`);
      } else if (router?.pathname === "/login") {
        router?.push("/");
      } else {
        closeModal();
      }
    }

    if (values.remember) {
      dispatch(
        setValue({
          label: "remember_me",
          value: {
            username: values.username?.trim(),
            password: values.password,
          },
        })
      );
    }
  };

  useEffect(() => {
    if (didMount?.current) {
      if (formData?.email && isOtpScreen) {
        setFormData({ email: "" });
        setIsOtpScreen(false);
      }
    } else didMount.current = true;
    //eslint-disable-next-line
  }, [router]);

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

        closeModal();

        if (router?.query.returnUrl) {
          router?.push(`${router?.query.returnUrl}`);
        } else if (!router?.pathname?.includes("/forum/")) {
          router?.push("/");
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
            logMsg={messages?.labels?.otLabel}
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
            rememberValue={rememberValue}
          />
        )}
      </Spinner>
    </Fragment>
  );
};

export default Login;
