import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Card, Col, Form, Row } from "antd";

import { resendOTPForRegistration, verifyOtp } from "src/network/api/userApi";
import { RootState } from "src/store";
import OTPVerify from "../Registration/UI/otp";
import messages from "src/messages";
import CustomSpinner from "components/shared/CustomSpinner";
import LeftContent from "../Registration/UI/leftContent";

const LoginOTP = () => {
  const { emailForOtp } = useSelector((state: RootState) => ({
    emailForOtp: state?.auth?.emailForOtp,
  }));

  const [isResend, setIsResend] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");
  const [isDisabled, setIsDisabled] = useState(true),
    [loading, setLoading] = useState(false);

  const router = useRouter();
  const [otpForm] = Form.useForm();
  const values = Form.useWatch([], otpForm);

  useEffect(() => {
    otpForm
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [otpForm, values]);

  const closeModal = () => {
    otpForm.resetFields();
  };

  const onOTPSubmit = async (values: any) => {
    setLoading(true);
    if (values.otp.trim()) {
      let formBody = {
        username: emailForOtp?.trim(),
        otp: values.otp,
        is_login: 1,
      };

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

      if (res && res.status_code === 200) {
        otpForm.resetFields();

        closeModal();

        if (router?.query.returnUrl) {
          router?.push(`${router?.query.returnUrl}`);
        } else {
          router?.push("/");
        }
      }
    } else {
      otpForm.resetFields();
      otpForm.validateFields(["otp"]);
    }
    setLoading(false);
  };

  const onResendClick = async () => {
    setLoading(true);
    let formBody = { email: emailForOtp };

    await resendOTPForRegistration(formBody);
    setLoading(false);
  };

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  return (
    <CustomSpinner key="login-otp-spinner" spinning={loading}>
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
              logMsg={messages?.labels?.otLabel}
              isDisabled={isDisabled}
              onBrowseClick={onBrowseClick}
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default LoginOTP;