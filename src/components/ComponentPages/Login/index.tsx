import { useDispatch } from "react-redux";
import { Form } from "antd";
import { useRouter } from "next/router";

import LoginUI from "./UI";

import { hideLoginModal, showForgotModal } from "../../../store/slices/uiSlice";
import { login } from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
// import { redirectToUrl } from "src/utils/generalUtility";

const Login = ({ isModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const router = useRouter();

  const closeModal = () => dispatch(hideLoginModal());
  const openForgotPasswordModal = () => dispatch(showForgotModal());

  const onFinish = async (values: any) => {
    let res = await login(values.username, values.password);
    if (res && res.status_code === 200) {
      form.resetFields();
      closeModal();
      if (!isModal) {
        // redirectToUrl(null, "/");
        router.push("/");
      }
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
    // try {
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <LoginUI
      form={form}
      onFinish={onFinish}
      closeModal={closeModal}
      isModal={isModal}
      openForgotPasswordModal={openForgotPasswordModal}
    />
  );
};

export default Login;
