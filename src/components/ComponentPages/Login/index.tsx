import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Form, Row } from "antd";

import LoginUI from "./UI";

import { login, resendOTPForRegistration } from "src/network/api/userApi";
import { AppDispatch, RootState } from "src/store";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import { setValue } from "src/store/slices/utilsSlice";
import { setManageSupportStatusCheck } from "src/store/slices/campDetailSlice";
import CustomSpinner from "components/shared/CustomSpinner";
import LeftContent from "../Registration/UI/leftContent";
import { setEmailForOTP } from "src/store/slices/authSlice";

const Login = () => {
  const remember = useSelector((state: RootState) => state.utils.remember_me);

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

        router.push({ pathname: "/login/otp" });
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
    router?.push("/forgot-password");
  };

  const onRegister = (e) => {
    e.preventDefault();
    router?.push("/registration");
  };

  return (
    <CustomSpinner key="login-spinner" spinning={loading}>
      <Card bordered={false} className="bg-canGrey1 mt-0 lg:mt-10">
        <Row gutter={20}>
          <Col lg={12} md={24} xl={12} xs={24} className="hidden lg:block">
            <LeftContent onBrowseClick={onBrowseClick} />
          </Col>
          <Col lg={12} md={24} xl={12}>
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
