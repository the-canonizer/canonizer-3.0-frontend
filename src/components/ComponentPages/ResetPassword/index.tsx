import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Form, Card } from "antd";
import { useSelector } from "react-redux";

import { forgotPasswordUpdate } from "src/network/api/userApi";
import CustomSpinner from "components/shared/CustomSpinner";
import { RootState } from "src/store";
import ResetPasswordUI from "./UI";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

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
      openNotificationWithIcon(res.message, "success");
      form.resetFields();
      router?.push({ pathname: "/login" });
    }

    setIsLoading(false);
  };

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.push({ pathname: "/forgot-password" });
  };

  return (
    <CustomSpinner key="forgot-password-spinner" spinning={isLoading}>
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
            <ResetPasswordUI
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

export default ResetPassword;
