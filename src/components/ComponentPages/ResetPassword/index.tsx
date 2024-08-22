import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Form, message, Card, Button } from "antd";
import { useSelector } from "react-redux";

import { forgotPasswordUpdate } from "src/network/api/userApi";
import CustomSpinner from "components/shared/CustomSpinner";
import LeftContent from "../Registration/UI/leftContent";
import { RootState } from "src/store";
import ResetPasswordUI from "./UI";
import { LeftOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const { isPasswordVerfied } = useSelector((state: RootState) => ({
    isPasswordVerfied: state?.auth?.isPasswordVerfied,
  }));

  const router = useRouter();

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false),
    [isDisabled, setIsDisabled] = useState(true);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    const res = await forgotPasswordUpdate({
      username: isPasswordVerfied,
      new_password: values.password,
      confirm_password: values.confirm,
    });

    if (res && res.status_code === 200) {
      message.success(res.message);
      form.resetFields();
      router?.push({ pathname: "/login" });
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
        className="bg-canGrey1 mt-0 lg:mt-5 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full min-h-full tab:px-10"
      >
        <Row gutter={20}>
          <Col lg={24} md={24} xl={24} xs={24} className="hidden lg:block">
            <Button
              type="link"
              className="h-[50px] text-sm w-2/12 text-canBlack flex items-start justify-start text-sm font-medium p-0 mb-4"
              onClick={onBrowseClick}
            >
              <LeftOutlined /> Go Back
            </Button>
          </Col>
          <Col
            lg={12}
            md={24}
            xl={12}
            xs={24}
            className="bg-white rounded-lg mx-auto"
          >
            <ResetPasswordUI
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

export default ResetPassword;
