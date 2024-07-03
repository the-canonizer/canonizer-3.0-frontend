import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Form, Row, message } from "antd";

import OTPVerify from "./UI/otp";
import { verifyOtp, resendOTPForRegistration } from "src/network/api/userApi";
import { AppDispatch, RootState } from "src/store";
import LeftContent from "./UI/leftContent";
import { setEmailForOTP, setIsNewUser } from "src/store/slices/authSlice";
import CustomSpinner from "components/shared/CustomSpinner";

const RegistrationOTP = () => {
  const { emailForOtp } = useSelector((state: RootState) => ({
    emailForOtp: state?.auth?.emailForOtp,
  }));

  const [isResend, setIsResend] = useState(false),
    [failedMsg, setFailedMsg] = useState(""),
    [isDisabled, setIsDisabled] = useState(true),
    [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>(),
    router = useRouter(),
    [otpForm] = Form.useForm();

  const values = Form.useWatch([], otpForm);

  useEffect(() => {
    otpForm
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [otpForm, values]);

  const onOTPSubmit = async (values: any) => {
    setLoading(true);
    let formBody = {
      username: emailForOtp?.trim(),
      otp: values.otp?.trim(),
      is_login: 0,
    };

    if (values.otp?.trim()) {
      let res = await verifyOtp(formBody);

      if (res) {
        setFailedMsg(res.message);
      }

      if (res && res?.status_code === 400) {
        setIsResend(true);
      }

      if (res && res.status_code === 403) {
        setIsResend(true);
        setFailedMsg(res.message);
      }

      if (res && res.status_code === 406) {
        message.error(res.message);
      }

      if (res && res.status_code === 200) {
        message.success(res.message);
        otpForm.resetFields();

        dispatch(setEmailForOTP(null));
        dispatch(setIsNewUser(true));

        router?.push({ pathname: "/category-preference" });
      }
    } else {
      otpForm.resetFields();
      otpForm.validateFields(["otp"]);
    }
    setLoading(false);
  };

  const onResendClick = async () => {
    setLoading(true);
    const res = await resendOTPForRegistration({ email: emailForOtp });

    if (res && res.status_code === 200) {
      message.success(res.message);
      setIsResend(false);
    }
    setLoading(false);
  };

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  return (
    <CustomSpinner key="registration-spinner" spinning={loading}>
      <Card bordered={false} className="bg-canGrey1 mt-0 lg:mt-10 h-full">
        <Row gutter={20}>
          <Col lg={12} md={24} xl={12} xs={24} className="hidden lg:block">
            <LeftContent onBrowseClick={onBrowseClick} />
          </Col>
          <Col lg={12} md={24} xl={12} xs={24}>
            <OTPVerify
              form={otpForm}
              onFinish={onOTPSubmit}
              isResend={isResend}
              failedMsg={failedMsg}
              onResendClick={onResendClick}
              isDisabled={isDisabled}
              onBrowseClick={onBrowseClick}
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default RegistrationOTP;