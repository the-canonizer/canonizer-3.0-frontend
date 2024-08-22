import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Col, Form, Row, message } from "antd";
import { useRouter } from "next/router";
import { LeftOutlined } from "@ant-design/icons";

import ForgotPasswordUI from "./UI";
import { forgotPasswordSendOTP } from "src/network/api/userApi";
import { AppDispatch } from "src/store";
import CustomSpinner from "components/shared/CustomSpinner";
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
        className="bg-canGrey1 mt-0 lg:mt-0 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full min-h-full tab:px-10"
      >
        <Row gutter={20}>
          <Col
            lg={24}
            md={24}
            xl={24}
            xs={24}
            className="hidden lg:block [&_.ftImage]:mb-0"
          >
            <Button
              type="link"
              className="h-[50px] text-sm w-2/12 text-canBlack flex items-start justify-start text-sm font-medium p-0 mb-4"
              onClick={onBrowseClick}
            >
              <LeftOutlined /> Go Back
            </Button>{" "}
          </Col>
          <Col
            lg={12}
            md={24}
            xl={12}
            xs={24}
            className="bg-white rounded-lg mx-auto"
          >
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
