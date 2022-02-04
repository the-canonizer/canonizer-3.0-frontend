import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Form, message } from "antd";
import { AppDispatch } from "../../../store";
import {
  GetUserProfileInfo,
  UpdateUserProfileInfo,
  GetMobileCarrier,
  SendOTP,
  VerifyOTP,
} from "../../../network/services/auth/index";
import ProfileInfoUI from "./ProfileInfoUI";
const ProfileInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [formVerify] = Form.useForm();
  const [mobileCarrier, setMobileCarrier] = useState([]);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [oTP, setOTP] = useState();
  const [privateFlags, setPrivateFlags] = useState("");
  const [privateList, setPrivateList] = useState([]);
  const [publicList, setPublicList] = useState([]);

  //on update profile click
  const onFinish = async (values: any) => {
    values.private_flags = privateList.join();
    values.mobile_carrier = formVerify.getFieldValue("mobile_carrier");
    values.phone_number = formVerify.getFieldValue("phone_number");
    let res = await dispatch(UpdateUserProfileInfo(values));
    if (res && res.status_code === 200) {
      message.success(res.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  //Send OTP to mobile number
  const onVerifyClick = async (values: any) => {
    let res = await dispatch(SendOTP(values));
    if (res && res.status_code === 200) {
      message.success(res.message);
      setIsOTPModalVisible(true);
      console.log(res.data.otp);
      //setOTP(res.data.otp)
    }
  };
  const handleOTPCancel = () => {
    setIsOTPModalVisible(false);
  };
  //function to verify the OTP
  const onOTPBtnClick = async () => {
    let otpBody = {
      otp: oTP,
    };
    let res = await dispatch(VerifyOTP(otpBody));
    if (res && res.status_code === 200) {
      message.success(res.message);
      setIsOTPModalVisible(false);
    } else {
      message.error(res.message);
    }
  };
  const handleChangeOTP = (e) => {
    setOTP(e.target.value);
  };
  //private public selection of fields, create PrivateFlag list
  const handleselectAfter = (data) => (value) => {
    if (value == "private") {
      if (!privateList.includes(data)) {
        setPrivateList((oldArray) => [...oldArray, data]);
        publicList.splice(publicList.indexOf(data), 1);
      }
    } else if (value == "public") {
      if (!publicList.includes(data)) {
        setPublicList((oldArray) => [...oldArray, data]);
        privateList.splice(privateList.indexOf(data), 1);
      }
    }
  };
  useEffect(() => {
    async function fetchMobileCarrier() {
      let res = await dispatch(GetMobileCarrier());
      if (res != undefined) {
        setMobileCarrier(res.data);
      }
    }
    async function fetchUserProfileInfo() {
      let res = await dispatch(GetUserProfileInfo());
      if (res != undefined) {
        if (res.data != undefined) {
          const verify = {
            phone_number: res.data.phone_number,
            mobile_carrier: res.data.mobile_carrier,
          };
          formVerify.setFieldsValue(verify);
          //format date for datepicker
          res.data.birthday = moment(res.data.birthday, "YYYY-MM-DD");
          form.setFieldsValue(res.data);
          setPrivateFlags(res.data.private_flags);
          setPrivateList(res.data.private_flags.split(","));
        }
      }
    }
    fetchMobileCarrier();
    fetchUserProfileInfo();
  }, []);
  return (
    <ProfileInfoUI
      form={form}
      formVerify={formVerify}
      mobileCarrier={mobileCarrier}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onVerifyClick={onVerifyClick}
      onOTPBtnClick={onOTPBtnClick}
      isOTPModalVisible={isOTPModalVisible}
      handleOTPCancel={handleOTPCancel}
      oTP={oTP}
      handleChangeOTP={handleChangeOTP}
      handleselectAfter={handleselectAfter}
      privateFlags={privateFlags}
    ></ProfileInfoUI>
  );
};
export default ProfileInfo;
