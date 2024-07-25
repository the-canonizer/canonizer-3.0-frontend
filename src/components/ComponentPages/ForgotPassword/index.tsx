import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Col, Form, Row, message } from "antd";
import { useRouter } from "next/router";

import ForgotPasswordUI from "./UI";
import { forgotPasswordSendOTP } from "src/network/api/userApi";
import { AppDispatch } from "src/store";
import CustomSpinner from "components/shared/CustomSpinner";
import LeftContent from "../Registration/UI/leftContent";
import { setPasswordEmail } from "src/store/slices/authSlice";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false),
    [isDisabled, setIsDisabled] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const router = useRouter();

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const onFinish = async (values: { email_id: string }) => {
    setIsLoading(true);
    const email = values.email_id?.trim();

    const res = await forgotPasswordSendOTP({ email });

    if (res && res.status_code === 200) {
      router?.push({ pathname: "/forgot-password/otp" });
      form.resetFields();
      message.success(res.message);
      dispatch(setPasswordEmail(email));
    }
    setIsLoading(false);
  };

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  return (
    <CustomSpinner key="forgot-password-spinner" spinning={isLoading}>
      <Card
        bordered={false}
        className="bg-canGrey1 mt-0 lg:mt-10 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full [&_.ant-card-body]:pb-0 min-h-full"
      >
        <Row gutter={20}>
          <Col lg={12} md={24} xl={12} xs={24} className="hidden lg:block">
            <LeftContent onBrowseClick={onBrowseClick} />
          </Col>
          <Col lg={12} md={24} xl={12} xs={24} className="bg-white rounded-lg">
            <ForgotPasswordUI
              form={form}
              onFinish={onFinish}
              isDisabled={isDisabled}
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default ForgotPassword;
