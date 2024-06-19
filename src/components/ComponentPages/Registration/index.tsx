import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, message, Row, Col, Card } from "antd";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import RegistrationUi from "./UI";
import {
  hideRegistrationModal,
  showLoginModal,
} from "src/store/slices/uiSlice";
import { register, getCountryCodes } from "src/network/api/userApi";
import { AppDispatch } from "src/store";
import Spinner from "src/components/common/spinner/spinner";
import LeftContent from "./UI/leftContent";

const Registration = ({ isModal }: any) => {
  const [country, setCountry] = useState([]);

  const dispatch = useDispatch<AppDispatch>(),
    [form] = Form.useForm(),
    { executeRecaptcha } = useGoogleReCaptcha();

  const closeModal = () => {
    dispatch(hideRegistrationModal());
    form.resetFields();
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
    [executeRecaptcha]
  );

  const onFinish = async (values: any, captchaKey: string) => {
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
      }
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
  }, []);

  return (
    <Spinner>
      <Card bordered={false} className="bg-greyBg mt-10">
        <Row gutter={20}>
          <Col lg={12} md={12} xs={24}>
            <LeftContent />
          </Col>
          <Col lg={12} md={12} xs={24}>
            <RegistrationUi
              form={form}
              onFinish={handleSumitForm}
              closeModal={closeModal}
              isModal={isModal}
              country={country}
              openLogin={openLogin}
            />
          </Col>
        </Row>
      </Card>
    </Spinner>
  );
};

export default Registration;
