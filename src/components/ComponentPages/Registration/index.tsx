import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Form, message } from "antd";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import RegistrationUi from "./UI";
import OTPVerify from "./UI/otp";
import {
  hideRegistrationModal,
  showLoginModal,
} from "src/store/slices/uiSlice";
import {
  register,
  verifyOtp,
  getCountryCodes,
  resendOTPForRegistration,
} from "src/network/api/userApi";
import { AppDispatch } from "src/store";
import Spinner from "../../common/spinner/spinner";

const Registration = ({ isModal, isTest = false }: any) => {
  const [isOtpScreen, setIsOtpScreen] = useState(isTest);
  const [isResend, setIsResend] = useState(false);
  const [country, setCountry] = useState([]);
  const [formData, setFormData] = useState({ email: "" });
  const [failedMsg, setFailedMsg] = useState("");

  const dispatch = useDispatch<AppDispatch>(),
    router = useRouter(),
    [form] = Form.useForm(),
    [otpForm] = Form.useForm(),
    { executeRecaptcha } = useGoogleReCaptcha();

  const closeModal = () => {
    dispatch(hideRegistrationModal());

    isOtpScreen ? otpForm.resetFields() : form.resetFields();
    setIsOtpScreen(false);
  };

  const openLogin = () => dispatch(showLoginModal());

  const handleSumitForm = useCallback(
    (values) => {
      if (!executeRecaptcha) {
        message.error("Execute recaptcha not yet available");
        return;
      }
      executeRecaptcha("registrationFormSubmit").then((gReCaptchaToken) => {
        onFinish(values, gReCaptchaToken);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [executeRecaptcha]
  );

  const onFinish = async (values: any, captchaKey: string) => {
    if (captchaKey) {
      setFormData(values);
      let formBody = {
        first_name: values.first_name?.trim(),
        last_name: values.last_name?.trim(),
        email: values.email?.trim(),
        password: values.password,
        password_confirmation: values.confirm,
        phone_number: values.phone?.trim(),
        country_code: values.prefix?.split(" ")[0],
        captcha_token: captchaKey,
      };

      let res = await register(formBody);

      if (res && res.status_code === 403) {
        setIsOtpScreen(true);
        setIsResend(true);
        setFailedMsg(res.message);
      }
      if (res && res.status_code === 406) {
        message.error(res.message);
      }
      if (res && res.status_code === 400) {
        if (res?.error) {
          const errors_key = Object.keys(res.error);

          if (errors_key.length) {
            errors_key.forEach((key) => {
              let field_name = key;
              if (key === "phone_number") {
                field_name = "phone";
              } else if (key === "country_code") {
                field_name = "prefix";
              } else if (key === "password_confirmation") {
                field_name = "confirm";
              } else {
                field_name = key;
              }

              form.setFields([
                {
                  name: field_name,
                  value: values[field_name],
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

        router?.push({
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
            onFinish={handleSumitForm}
            closeModal={closeModal}
            isModal={isModal}
            country={country}
            openLogin={openLogin}
          />
        )}
      </Spinner>
    </Fragment>
  );
};

export default Registration;
