import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Form, message, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { forgotPasswordUpdate } from "src/network/api/userApi";
import CustomSpinner from "components/shared/CustomSpinner";
import LeftContent from "../Registration/UI/leftContent";
import { RootState } from "src/store";
import { setIsPasswordVerfied } from "src/store/slices/authSlice";
import ResetPasswordUI from "./UI";

const ResetPassword = () => {
  const { isPasswordVerfied } = useSelector((state: RootState) => ({
    isPasswordVerfied: state?.auth?.isPasswordVerfied,
  }));

  const router = useRouter(),
    dispatch = useDispatch();

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
        className="bg-canGrey1 mt-0 lg:mt-10 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full [&_.ant-card-body]:pb-0 min-h-full"
      >
        <Row gutter={20}>
          <Col lg={12} md={24} xl={12} xs={24} className="hidden lg:block">
            <LeftContent onBrowseClick={onBrowseClick} />
          </Col>
          <Col lg={12} md={24} xl={12} xs={24} className="bg-white rounded-lg">
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
