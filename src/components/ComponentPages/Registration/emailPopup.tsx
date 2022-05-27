import { Fragment } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Form } from "antd";

import EmailConfirmation from "./UI/email";
import { hideSocialEmailPopup } from "../../../store/slices/uiSlice";
import { verifyOtp } from "../../../network/api/userApi";
import { AppDispatch } from "../../../store";
import Spinner from "../../common/spinner/spinner";

const EmailPopup = ({ isModal = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const router = useRouter();

  const closeModal = () => {
    dispatch(hideSocialEmailPopup());

    form.resetFields();
  };

  const onSubmit = async (values: any) => {
    let formBody = {
      email: values?.email?.trim(),
    };
    console.log(
      "🚀 ~ file: emailPopup.tsx ~ line 28 ~ onSubmit ~ formBody",
      formBody
    );

    // let res = await verifyOtp(formBody);

    // if (res && res.status_code === 200) {
    //   form.resetFields();

    //   isModal ? closeModal() : "";
    // }
  };

  return (
    <Fragment>
      <Spinner>
        <EmailConfirmation
          form={form}
          onFinish={onSubmit}
          closeModal={closeModal}
          isModal={isModal}
        />
      </Spinner>
    </Fragment>
  );
};

export default EmailPopup;
