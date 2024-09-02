import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Col, Form, Row } from "antd";
import { useRouter } from "next/router";

import ForgotPasswordUI from "./UI";
import { forgotPasswordSendOTP } from "src/network/api/userApi";
import { AppDispatch } from "src/store";
import CustomSpinner from "components/shared/CustomSpinner";
import { setPasswordEmail } from "src/store/slices/authSlice";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

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
      openNotificationWithIcon(res.message, "success");
      dispatch(setPasswordEmail(email));
    }
    setIsLoading(false);
  };

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.push({ pathname: "/login" });
  };

  return (
    <CustomSpinner key="forgot-password-spinner" spinning={isLoading}>
      <Card
        bordered={false}
        className="bg-canGrey1 mt-0 lg:mt-0 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full min-h-full tab:px-10"
      >
        <Row gutter={20}>
          <Col
            lg={13}
            md={24}
            xl={13}
            xs={24}
            className="bg-white rounded-lg mx-auto"
          >
            <ForgotPasswordUI
              form={form}
              onFinish={onFinish}
              isDisabled={isDisabled}
              onBrowseClick={onBrowseClick}
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default ForgotPassword;
