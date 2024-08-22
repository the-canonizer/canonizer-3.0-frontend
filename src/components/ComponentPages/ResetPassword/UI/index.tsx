import { Fragment } from "react";
import { Form, Typography } from "antd";
import { ArrowRightOutlined, LockOutlined } from "@ant-design/icons";

import messages from "src/messages";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import LogoHeader from "components/common/headers/logoHeader";

const { Title } = Typography;

const ResetPasswordUI = ({ form, onFinish, isDisabled }) => {
  return (
    <Form
      form={form}
      name="setPassword"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      validateTrigger={messages.formValidationTypes()}
      className="h-full flex flex-col p-5"
    >
      <div className="flex justify-center items-center text-center flex-col mb-6 mt-6">
        <LogoHeader />
      </div>
      <Title
        level={4}
        className="text-sm text-center text-canBlack font-medium"
        id="create-pass-title"
      >
        {messages.labels.createPassword}
      </Title>

      <div className="text-center mt-10 w-10/12 mx-auto md:w-8/12">
        <Inputs
          name="password"
          label={
            <Fragment>
              {messages.labels.newPassword}
              <span className="required">*</span>
            </Fragment>
          }
          rules={messages.passwordRule}
          type="password"
          placeholder={messages.placeholders.newPassword}
          prefix={<LockOutlined />}
          inputMode="password"
        />
        <Inputs
          name="confirm"
          label={
            <Fragment>
              {messages.labels.confirmPassword}
              <span className="required">*</span>
            </Fragment>
          }
          dependencies={["password"]}
          rules={messages.confirmPasswordRule}
          type="password"
          placeholder={messages.placeholders.confirmPassword}
          prefix={<LockOutlined />}
          inputMode="password"
        />
        <Form.Item className="text-center mt-10">
          <PrimaryButton
            htmlType="submit"
            className="h-[40px] text-sm rounded-lg !w-10/12 lg:!w-6/12 flex items-center justify-center mx-auto"
            data-testid="submitButton"
            id="save-btn"
            disabled={!isDisabled}
          >
            Save <ArrowRightOutlined />
          </PrimaryButton>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ResetPasswordUI;
