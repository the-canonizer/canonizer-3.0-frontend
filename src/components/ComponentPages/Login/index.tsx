import { Card, Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LoginUI from "./UI";

import CustomSpinner from "components/shared/CustomSpinner";
import { getNickNameList, login, resendOTPForRegistration } from "src/network/api/userApi";
import { AppDispatch, RootState } from "src/store";
import { setEmailForOTP, setUserNickNames } from "src/store/slices/authSlice";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import { setValue } from "src/store/slices/utilsSlice";
import LeftContent from "./UI/leftContent";

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

  const onFinish = async (values: any) => {
    setLoading(true);
    dispatch(setEmailForOTP(values.username?.trim()));

    const username = values.username?.trim();
    const pass = values.password?.trim();

    let res = await login(username, pass);

    if (res && res.status_code === 402) {
      setErrorMsg(res.message);
    }

    if (res && res.status_code === 200) {
      dispatch(
        setFilterCanonizedTopics({
          algorithm: res?.data?.user?.default_algo,
        })
      );

      form.resetFields();
      fetchNickNameList();

      closeModal();

      if (router?.query?.returnUrl) {
        router?.push(`${router?.query?.returnUrl}`);
      } else if (currentReturnUrl) {
        router?.push({ pathname: currentReturnUrl });
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

    setLoading(false);
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
    router?.back();
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
        bordered={false}
        className="bg-canGrey1 mt-0 lg:mt-5 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full [&_.ant-card-body]:pb-0 min-h-full tab:px-10"
      >
        <Row gutter={20}>
          <Col lg={12} md={24} xl={12} xs={24} className="hidden lg:block">
            <LeftContent onBrowseClick={onBrowseClick} />
          </Col>
          <Col lg={12} md={24} xl={12} xs={24}>
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
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default Login;
