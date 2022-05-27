import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Form } from "antd";

import EmailConfirmation from "./UI/email";
import {
  hideSocialEmailPopup,
  showSocialEmailPopup,
} from "../../../store/slices/uiSlice";
import { verifyOtp } from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import Spinner from "../../common/spinner/spinner";

const EmailPopup = ({ isModal, isTest = false }) => {
  const [formData, setFormData] = useState({ email: "" });

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const router = useRouter();

  const closeModal = () => {
    dispatch(hideSocialEmailPopup());

    form.resetFields();
  };

  const onOTPSubmit = async (values: any) => {
    let formBody = {
      username: formData.email?.trim(),
      otp: values.otp?.trim(),
    };

    if (values.otp?.trim()) {
      let res = await verifyOtp(formBody);

      if (res && res.status_code === 200) {
        form.resetFields();

        isModal ? closeModal() : "";
      }
    }
  };

  return (
    <Fragment>
      <Spinner>
        <EmailConfirmation
          form={form}
          onFinish={onOTPSubmit}
          closeModal={closeModal}
          isModal={isModal}
        />
      </Spinner>
    </Fragment>
  );
};

export default EmailPopup;
