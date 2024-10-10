import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";

import NameConfirmation from "./UI/nameConfirmation";
import { hideSocialNamePopup } from "../../../store/slices/uiSlice";
import {
  verifyEmailOnSocial,
  SendOTPForVerify,
  resendOTPForRegistration,
} from "../../../network/api/userApi";
import { AppDispatch, RootState } from "../../../store";
import { setValue } from "../../../store/slices/utilsSlice";
import Spinner from "../../common/spinner/spinner";

const EmailPopup = ({ isModal = false }: any) => {
  const { socialKeys, rdType } = useSelector((state: RootState) => ({
    socialKeys: state.utils.social_login_keys,
    rdType: state.utils.redirect_type,
  }));

  const [isOTP, setIsOTP] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [formData, setFormData] = useState({});
  const [socialLoginKeys, setSocialLoginKeys] = useState(socialKeys);
  const [redirectType, setRedirectType] = useState(rdType);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => setSocialLoginKeys(socialKeys), [socialKeys]);
  useEffect(() => setRedirectType(rdType), [rdType]);

  const [form] = Form.useForm();

  const closeModal = () => {
    dispatch(hideSocialNamePopup());

    if (
      router?.pathname === "/login/[provider]/callback" ||
      router?.pathname === "/auth/[provider]"
    ) {
      router?.push("/");
    }

    form.resetFields();
    setIsOTP(false);
    setIsResend(false);
  };

  const onSubmit = async (values: any) => {
    let formBody = {
      first_name: values?.first_name?.trim(),
      last_name: values?.last_name?.trim(),
      email: socialLoginKeys?.email,
      code: socialLoginKeys?.code,
      provider: socialLoginKeys?.provider,
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_SECRET,
      type: "nameVerify",
    };

    setFormData({
      first_name: values?.first_name?.trim(),
      last_name: values?.last_name?.trim(),
      email: socialLoginKeys?.email,
    });

    let res = await SendOTPForVerify(formBody);

    if (res && res.status_code === 200) {
      form.resetFields();

      setIsOTP(true);
    }
  };

  const onOTPSubmit = async (values: any) => {
    let body = {
      email: formData["email"]?.trim(),
      first_name: formData["first_name"]?.trim(),
      last_name: formData["last_name"]?.trim(),
      otp: values.otp?.trim(),
      code: socialLoginKeys?.code,
      provider: socialLoginKeys?.provider,
      client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_ID,
      client_secret: process.env.NEXT_PUBLIC_AUTH_CLIENT_PASSWORD_SECRET,
      type: "nameVerify",
    };

    if (values.otp?.trim()) {
      let res = await verifyEmailOnSocial(body);

      if (res && res.status_code === 200) {
        form.resetFields();
        setIsOTP(false);
        setIsResend(false);
        isModal ? closeModal() : "";

        if (redirectType) {
          dispatch(setValue({ label: "redirect_type", value: false }));

          router?.push({
            pathname: "/settings",
            query: {
              tab: "profile",
            },
          });
        } else {
          router?.push("/");
        }
      }
    } else {
      form.resetFields(["otp"]);

      form.validateFields(["otp"]);
    }
  };

  // on resend click
  const onResendClick = async () => {
    let formBody = {
      email: formData["email"],
    };

    await resendOTPForRegistration(formBody);
  };

  return (
    <Fragment>
      <Spinner>
        <NameConfirmation
          form={form}
          onFinish={isOTP ? onOTPSubmit : onSubmit}
          closeModal={closeModal}
          isModal={isModal}
          isOTP={isOTP}
          onResendClick={onResendClick}
          isResend={isResend}
        />
      </Spinner>
    </Fragment>
  );
};

export default EmailPopup;
