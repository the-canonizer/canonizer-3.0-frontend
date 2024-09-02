import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Form, Row } from "antd";
import { useRouter } from "next/router";

import ForgotPasswordOTPUI from "./UI/password-otp";

import {
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
} from "src/network/api/userApi";
import { AppDispatch, RootState } from "src/store";
import CustomSpinner from "components/shared/CustomSpinner";
import {
  setIsPasswordVerfied,
  setPasswordEmail,
} from "src/store/slices/authSlice";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

const ForgotPassword = () => {
  const { passwordEmail } = useSelector((state: RootState) => ({
    passwordEmail: state?.auth?.passwordEmail,
  }));

  const [isLoading, setIsLoading] = useState(false),
    [isDisabled, setIsDisabled] = useState(true),
    [isResend, setIsResend] = useState(true),
    [timer, setTimer] = useState(120);

  const dispatch = useDispatch<AppDispatch>();
  const [otpForm] = Form.useForm();
  const router = useRouter();

  const values = Form.useWatch([], otpForm);

  useEffect(() => {
    let interval = null;
    if (isResend) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isResend]);

  useEffect(() => {
    otpForm
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [otpForm, values]);

  const onRsendClick = async () => {
    setIsLoading(true);
    setIsResend(false);

    const res = await forgotPasswordSendOTP({ email: passwordEmail });

    if (res.status_code === 200) {
      openNotificationWithIcon(res.message, "success");
      setIsResend(true);

      setTimer(120);
    }

    setIsLoading(false);
  };

  const onOTPSubmit = async (values: { otp: string }) => {
    setIsLoading(true);
    setIsResend(false);
    const otp = values?.otp?.trim();
    if (otp) {
      const userEmail = passwordEmail?.trim();

      const res = await forgotPasswordVerifyOTP({
        username: userEmail,
        otp: otp,
      });

      if (res.status_code === 403) {
        setIsResend(true);
        setTimer(0);
      }

      if (res.status_code === 200) {
        openNotificationWithIcon(res.message, "success");
        otpForm.resetFields();

        dispatch(setIsPasswordVerfied(userEmail));

        dispatch(setPasswordEmail(null));

        router?.push({ pathname: "/reset-password" });
      }
    } else {
      otpForm.validateFields(["otp"]);
    }

    setIsLoading(false);
  };

  const onChangeOtp = (val: string) => {
    otpForm.setFields([
      { name: "otp", touched: true, validated: true, value: val },
    ]);
  };

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.push({ pathname: "/forgot-password" });
  };

  return (
    <CustomSpinner key="registration-spinner" spinning={isLoading}>
      <Card
        bordered={false}
        className="bg-canGrey1 mt-0 lg:mt-5 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full min-h-full tab:px-10"
      >
        <Row gutter={20}>
          <Col
            lg={13}
            md={24}
            xl={13}
            xs={24}
            className="bg-white rounded-lg mx-auto"
          >
            <ForgotPasswordOTPUI
              form={otpForm}
              onFinish={onOTPSubmit}
              isDisabled={isDisabled}
              onChangeOtp={onChangeOtp}
              isResend={isResend}
              onRsendClick={onRsendClick}
              timer={timer}
              onBrowseClick={onBrowseClick}
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default ForgotPassword;
