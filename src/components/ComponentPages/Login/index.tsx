import { Card, Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoginUI from "./UI";

import CustomSpinner from "components/shared/CustomSpinner";
import {
  getNickNameList,
  login,
  passkeyLoginOptions,
  passkeyLoginVerify,
  resendOTPForRegistration,
} from "src/network/api/userApi";
import { AppDispatch, RootState } from "src/store";
import { setEmailForOTP, setUserNickNames } from "src/store/slices/authSlice";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import { setValue } from "src/store/slices/utilsSlice";
import LeftContent from "./UI/leftContent";
import { getCookiesExpirationTime } from "src/utils/generalUtility";
import { getPasskeyErrorMessage, loadWebAuthn } from "src/utils/passkey";
import messages from "src/messages";

const Login = () => {
  const remember = useSelector((state: RootState) => state.utils.remember_me);
  const currentReturnUrl = useSelector(
    (state: RootState) => state?.auth?.currentReturnUrl
  );

  const [errorMsg, setErrorMsg] = useState(""),
    [isDisabled, setIsDisabled] = useState(true),
    [isOTPDisabled, setIsOTPDisabled] = useState(true),
    [loading, setLoading] = useState(false);

  const router = useRouter(),
    dispatch = useDispatch<AppDispatch>(),
    [form] = Form.useForm(),
    values = Form.useWatch([], form);

  const setvalueAndValidateForm = async () => {
    if (remember) {
      form.setFieldValue("username", remember.username);
      form.setFieldValue("password", remember.password);
    } else {
      form.setFieldValue("username", "");
      form.setFieldValue("password", "");
    }
  };

  useEffect(() => {
    setvalueAndValidateForm();
  }, [remember]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setIsOTPDisabled(true);
        setIsDisabled(true);
      })
      .catch((err) => {
        const errorFieldNames = err?.errorFields
          ?.map((field) => field.name)
          .flat();

        const isTouched = form.isFieldTouched("username");

        if (errorFieldNames.includes("username")) {
          setIsOTPDisabled(false);
        } else if (values?.username && isTouched) {
          setIsOTPDisabled(true);
        }

        if (errorFieldNames?.length) setIsDisabled(false);
      });
  }, [form, values]);

  const closeModal = () => {
    dispatch(setManageSupportStatusCheck(false));
    form.resetFields();
    setErrorMsg("");
  };

  const fetchNickNameList = async () => {
    let response = await getNickNameList();
    if (response && response?.status_code === 200) {
      dispatch(setUserNickNames(response?.data));
    }
  };

  // Shared post-login handling for password and passkey sign-in
  const onLoginSuccess = (res, username: string) => {
    document.cookie = "current_user=" + username + getCookiesExpirationTime();

    document.cookie =
      "isUserAuthenticated=" + true + getCookiesExpirationTime();

    dispatch(
      setFilterCanonizedTopics({
        algorithm: res?.data?.user?.default_algo,
      })
    );

    form.resetFields();

    fetchNickNameList();
  };

  const redirectAfterLogin = () => {
    const returnUrl: any = router?.query?.returnUrl;

    if (returnUrl) {
      router?.push(returnUrl);
    } else if (currentReturnUrl) {
      router?.push(currentReturnUrl);
    } else if (router?.pathname === "/login") {
      router?.push("/");
    }

    closeModal();
  };

  // Unverified account (402): shared by password and passkey sign-in
  const onUnverifiedAccount = (res) => {
    setErrorMsg(res.message);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    dispatch(setEmailForOTP(values.username?.trim()));

    const username = values.username?.trim();
    const pass = values.password?.trim();

    try {
      let res = await login(username, pass);

      if (res && res.status_code === 402) {
        onUnverifiedAccount(res);
      }

      if (res && res.status_code === 200) {
        onLoginSuccess(res, username);

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

        redirectAfterLogin();
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onPasskeyClick = async () => {
    setLoading(true);
    setErrorMsg("");

    // Passkeys are discoverable-only, so no email is sent
    try {
      const optionsRes = await passkeyLoginOptions();
      const { challenge_id, options } = optionsRes?.data || {};

      const { startAuthentication } = await loadWebAuthn();
      const credential = await startAuthentication(options);

      const res = await passkeyLoginVerify({ challenge_id, credential });

      if (res && res.status_code === 402) {
        onUnverifiedAccount(res);
      } else if (res && res.status_code === 200 && res.data?.user) {
        onLoginSuccess(res, res.data.user.email || "");
        redirectAfterLogin();
      } else {
        setErrorMsg(res?.message || messages.passkey.errors.loginFailed);
      }
    } catch (error) {
      setErrorMsg(
        getPasskeyErrorMessage(error, messages.passkey.errors.loginFailed)
      );
    } finally {
      setLoading(false);
    }
  };

  const onOTPClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailPhone = form.getFieldValue("username");

    if (emailPhone?.trim()) {
      setErrorMsg("");

      const res = await resendOTPForRegistration({ email: emailPhone });

      if (res && res.status_code === 200) {
        dispatch(setEmailForOTP(emailPhone?.trim()));

        router.push({ pathname: "/login/otp", query: { ...router?.query } });
      }
    } else {
      form.validateFields(["username"]);
    }
    setLoading(false);
  };

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.push("/");
  };

  const onForgotPasswordClick = (e) => {
    e.preventDefault();
    router?.push({ pathname: "/forgot-password", query: { ...router?.query } });
  };

  const onRegister = (e) => {
    e.preventDefault();
    router?.push({ pathname: "/registration", query: { ...router?.query } });
  };

  return (
    <CustomSpinner key="login-spinner" spinning={loading}>
      <Card
        id="login-card"
        bordered={false}
        className="bg-canGrey1 mt-0 lg:mt-5 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full [&_.ant-card-body]:pb-0 min-h-full tab:px-10"
      >
        <Row id="login-row" gutter={20}>
          <Col
            id="left-content-col"
            lg={12}
            md={24}
            xl={12}
            xs={24}
            className="hidden lg:block"
          >
            <LeftContent onBrowseClick={onBrowseClick} />
          </Col>
          <Col id="login-ui-col" lg={12} md={24} xl={12} xs={24}>
            <LoginUI
              form={form}
              onFinish={onFinish}
              onOTPClick={onOTPClick}
              errorMsg={errorMsg}
              onBrowseClick={onBrowseClick}
              isDisabled={isDisabled}
              isOTPDisabled={isOTPDisabled}
              onForgotPasswordClick={onForgotPasswordClick}
              onRegister={onRegister}
              loading={loading}
              onPasskeyClick={onPasskeyClick}
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default Login;
