import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Row, Col, Card } from "antd";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/router";

import RegistrationUi from "./UI";
import { register, getCountryCodes } from "src/network/api/userApi";
import { AppDispatch } from "src/store";
import LeftContent from "./UI/leftContent";
import { setEmailForOTP } from "src/store/slices/authSlice";
import CustomSpinner from "components/shared/CustomSpinner";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

const Registration = () => {
  const [country, setCountry] = useState([]),
    [isDisabled, setIsDisabled] = useState(true),
    [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>(),
    router = useRouter(),
    [form] = Form.useForm(),
    { executeRecaptcha } = useGoogleReCaptcha();

  const values = Form.useWatch([], form);

  const handleSumitForm = useCallback(
    (values) => {
      if (!executeRecaptcha) {
        openNotificationWithIcon(
          "Execute recaptcha not yet available",
          "error"
        );
        return;
      }
      executeRecaptcha("registrationFormSubmit").then((gReCaptchaToken) => {
        onFinish(values, gReCaptchaToken);
      });
    },
    [executeRecaptcha]
  );

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const onFinish = async (values: any, captchaKey: string) => {
    setLoading(true);
    if (captchaKey) {
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

      if (res && res.status_code === 406) {
        openNotificationWithIcon(res.message, "error");
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
        openNotificationWithIcon(res.message, "success");
        dispatch(setEmailForOTP(values.email?.trim()));
        form.resetFields();
        router?.push({
          pathname: "/registration/otp",
          query: { ...router?.query },
        });
      }
    }
    setLoading(false);
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
    setLoading(true);
    let response = await getCountryCodes();
    if (response && response.status_code === 200) {
      const codes_list = sort_unique(response.data);

      setCountry(codes_list);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCodes();
  }, []);

  const onBrowseClick = (e) => {
    e?.preventDefault();
    router?.back();
  };

  return (
    <CustomSpinner key="registration-spinner" spinning={loading}>
      <Card
        bordered={false}
        className="bg-canGrey1 mt-0 lg:mt-5 h-full flex justify-center items-center [&>.ant-card-body]:p-0 [&>.ant-card-body]:w-full [&_.ant-card-body]:pb-0 min-h-full tab:px-10"
      >
        <Row gutter={20}>
          <Col lg={12} md={24} xl={10} xs={24} className="hidden lg:block">
            <LeftContent onBrowseClick={onBrowseClick} />
          </Col>
          <Col lg={12} md={24} xl={14} xs={24}>
            <RegistrationUi
              form={form}
              onFinish={handleSumitForm}
              country={country}
              isDisabled={isDisabled}
              onBrowseClick={onBrowseClick}
            />
          </Col>
        </Row>
      </Card>
    </CustomSpinner>
  );
};

export default Registration;
