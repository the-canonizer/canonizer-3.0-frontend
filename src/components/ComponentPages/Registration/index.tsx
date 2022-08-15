import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Form, message } from "antd";

import RegistrationUi from "./UI";
import OTPVerify from "./UI/otp";
import {
  hideRegistrationModal,
  showLoginModal,
} from "../../../store/slices/uiSlice";
import {
  register,
  verifyOtp,
  getCountryCodes,
  resendOTPForRegistration,
} from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import Spinner from "../../common/spinner/spinner";

const Registration = ({ isModal, isTest = false }) => {
  const [isOtpScreen, setIsOtpScreen] = useState(isTest);
  const [isResend, setIsResend] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isReCaptchaRef, setIsReCaptchaRef] = useState(false);
  const [country, setCountry] = useState([]);
  const [formData, setFormData] = useState({ email: "" });
  const [failedMsg, setFailedMsg] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();

  const router = useRouter();

  const closeModal = () => {
    dispatch(hideRegistrationModal());

    isOtpScreen ? otpForm.resetFields() : form.resetFields();
    setIsOtpScreen(false);
  };

  const openLogin = () => dispatch(showLoginModal());

  const onReCAPTCHAChange = async (captchaCode) => {
    if (!captchaCode) {
      return;
    }

    // Else reCAPTCHA was executed successfully so proceed with the success status
    setIsCaptchaVerified(true);
  };

  const onFinish = async (values: any) => {
    if (isCaptchaVerified) {
      setFormData(values);
      let formBody = {
        first_name: values.first_name?.trim(),
        last_name: values.last_name?.trim(),
        email: values.email?.trim(),
        password: values.password,
        password_confirmation: values.confirm,
        phone_number: values.phone?.trim(),
        country_code: values.prefix?.split(" ")[0],
      };

      let res = await register(formBody);

      if (res && res.status_code === 403) {
        setIsOtpScreen(true);
        setIsResend(true);
        setIsReCaptchaRef(true);
        setFailedMsg(res.message);
      }
      if (res && res.status_code === 400) {
        if (res?.error) {
          const errors_key = Object.keys(res.error);

          if (errors_key.length) {
            errors_key.forEach((key) => {
              form.setFields([
                {
                  name: key,
                  value: values[key],
                  errors: [res.error[key]],
                },
              ]);
            });
          }
        }
      }

      if (res && res.status_code === 200) {
        form.resetFields();
        message.success(res.message);

        // Reset the reCAPTCHA so that it can be executed again if user
        setIsReCaptchaRef(true);

        setIsOtpScreen(true);
      }
    }
  };

  const onOTPSubmit = async (values: any) => {
    let formBody = {
      username: formData.email?.trim(),
      otp: values.otp?.trim(),
      is_login: 0,
    };

    if (values.otp?.trim()) {
      let res = await verifyOtp(formBody);

      if (res) {
        setFailedMsg(res.message);
      }

      if (res && res.status_code === 200) {
        otpForm.resetFields();

        setIsOtpScreen(false);
        isModal ? closeModal() : "";

        router.push({
          pathname: "/settings",
          query: {
            tab: "profile",
          },
        });
      }
    } else {
      otpForm.resetFields();

      otpForm.validateFields(["otp"]);
    }
  };

  const sort_unique = (arr: Object[]) => {
    const key = "phone_code";

    if (arr.length === 0) return arr;

    arr = arr.sort((a, b) => a[key] - b[key]);

    var ret = [arr[0]];

    for (var i = 1; i < arr.length; i++) {
      if (arr[i - 1] !== arr[i]) {
        ret.push(arr[i]);
      }
    }

    var flags = [],
      output = [],
      l = arr.length,
      j;
    for (j = 0; j < l; j++) {
      if (flags[arr[j][key]]) continue;
      flags[arr[j][key]] = true;
      output.push(arr[j]);
    }

    return output;
  };

  const getCodes = async () => {
    let response = await getCountryCodes();
    if (response && response.status_code === 200) {
      const codes_list = sort_unique(response.data);
     
      setCountry(codes_list);
    }
  };

  useEffect(() => {
    getCodes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // on resend click
  const onResendClick = async () => {
    let formBody = {
      email: formData.email,
    };

    await resendOTPForRegistration(formBody);
  };

  return (
    <Fragment>
      <Spinner>
        {isOtpScreen ? (
          <OTPVerify
            form={otpForm}
            onFinish={onOTPSubmit}
            closeModal={closeModal}
            isModal={isModal}
            isResend={isResend}
            failedMsg={failedMsg}
            onResendClick={onResendClick}
          />
        ) : (
          <RegistrationUi
            form={form}
            onFinish={onFinish}
            closeModal={closeModal}
            isModal={isModal}
            onReCAPTCHAChange={onReCAPTCHAChange}
            resetCaptcha={isReCaptchaRef}
            showCaptchaError={isCaptchaVerified}
            country={country}
            openLogin={openLogin}
          />
        )}
      </Spinner>
    </Fragment>
  );
};

export default Registration;
