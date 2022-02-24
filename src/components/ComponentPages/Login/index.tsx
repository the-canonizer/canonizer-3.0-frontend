import { Fragment } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Form } from "antd";

import LoginUI from "./UI";

import {
  hideLoginModal,
  showForgotModal,
  showRegistrationModal,
} from "../../../store/slices/uiSlice";
import { login } from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import Spinner from "../../common/spinner/spinner";

const Login = ({ isModal }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const closeModal = () => dispatch(hideLoginModal());
  const openForgotPasswordModal = () => dispatch(showForgotModal());
  const openRegistration = () => dispatch(showRegistrationModal());

  const onFinish = async (values: any) => {
    let res = await login(values.username, values.password);
    if (res && res.status_code === 200) {
      form.resetFields();
      isModal ? closeModal() : "";

      router.push("/");
    }
    if (values.remember) {
      localStorage.setItem(
        "rememberme",
        JSON.stringify({
          username: values.username,
          password: values.password,
        })
      );
    }
  };

  const onOTPClick = async (e) => {
    e.preventDefault();
    const emailPhone = form.getFieldValue("username");
    if (emailPhone?.trim()) {
      // console.log("emailPhone", emailPhone);
    } else {
      form.validateFields(["username"]);
    }
  };

  return (
    <Fragment>
      <Spinner>
        <LoginUI
          form={form}
          onFinish={onFinish}
          closeModal={closeModal}
          isModal={isModal}
          openForgotPasswordModal={openForgotPasswordModal}
          openRegistration={openRegistration}
          onOTPClick={onOTPClick}
        />
      </Spinner>
    </Fragment>
  );
};

export default Login;
