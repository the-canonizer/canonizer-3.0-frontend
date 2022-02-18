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
  GetAlgorithmsList,
  GetLanguageList,
} from "../../../network/api/userApi";
import ProfileInfoUI from "./ProfileInfoUI";

const ProfileInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [formVerify] = Form.useForm();
  const [mobileCarrier, setMobileCarrier] = useState([]);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [otp, setOTP] = useState();
  const [privateFlags, setPrivateFlags] = useState("");
  const [privateList, setPrivateList] = useState([]);
  const [publicList, setPublicList] = useState([]);
  const [algorithmList, setAlgorithmList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const publicPrivateArray = {
    first_name: "first_name",
    last_name: "last_name",
    middle_name: "middle_name",
    email: "email",
    address_1: "address_1",
    address_2: "address_2",
    postal_code: "postal_code",
    city: "city",
    state: "state",
    country: "country",
    birthday: "birthday",
    mobile_carrier: "mobile_carrier",
    phone_number: "phone_number",
  };

  const isPublicOrPrivate = (field_value) => {
    return privateList.includes(field_value) ? 0 : 1;
  };
  //on update profile click
  const onFinish = async (values: any) => {
    //Set Private Public flags
    values.first_name_bit = isPublicOrPrivate(publicPrivateArray.first_name);
    values.last_name_bit = isPublicOrPrivate(publicPrivateArray.last_name);
    values.middle_name_bit = isPublicOrPrivate(publicPrivateArray.middle_name);
    values.email_bit = isPublicOrPrivate(publicPrivateArray.email);
    values.address_1_bit = isPublicOrPrivate(publicPrivateArray.address_1);
    values.address_2_bit = isPublicOrPrivate(publicPrivateArray.address_2);
    values.postal_code_bit = isPublicOrPrivate(publicPrivateArray.postal_code);
    values.city_bit = isPublicOrPrivate(publicPrivateArray.city);
    values.state_bit = isPublicOrPrivate(publicPrivateArray.state);
    values.country_bit = isPublicOrPrivate(publicPrivateArray.country);
    values.birthday_bit = isPublicOrPrivate(publicPrivateArray.birthday);
    //End Set Private Public flags
    values.mobile_carrier = formVerify.getFieldValue(
      publicPrivateArray.mobile_carrier
    );
    values.phone_number = formVerify.getFieldValue(
      publicPrivateArray.phone_number
    );
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
      otp: otp,
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

    async function fetchAlgorithmsList() {
      let res = await dispatch(GetAlgorithmsList());
      if (res != undefined) {
        setAlgorithmList(res.data);
      }
    }
    async function fetchLanguageList() {
      let res = await dispatch(GetLanguageList());
      if (res != undefined) {
        setLanguageList(res.data);
      }
    }

    async function fetchUserProfileInfo() {
      let res = await dispatch(GetUserProfileInfo());
      if (res != undefined) {
        if (res.data != undefined) {
          const verify = {
            phone_number: res.data.phone_number,
            mobile_carrier:
              parseInt(res.data.mobile_carrier).toString() == "NaN"
                ? ""
                : parseInt(res.data.mobile_carrier),
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
    fetchMobileCarrier()
      .then(function () {
        return fetchAlgorithmsList();
      })
      .then(function () {
        return fetchLanguageList();
      })
      .then(function () {
        return fetchUserProfileInfo();
      });
  }, []);

  return (
    <ProfileInfoUI
      form={form}
      formVerify={formVerify}
      mobileCarrier={mobileCarrier}
      algorithmList={algorithmList}
      languageList={languageList}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onVerifyClick={onVerifyClick}
      onOTPBtnClick={onOTPBtnClick}
      isOTPModalVisible={isOTPModalVisible}
      handleOTPCancel={handleOTPCancel}
      otp={otp}
      handleChangeOTP={handleChangeOTP}
      handleselectAfter={handleselectAfter}
      privateFlags={privateFlags}
    />
  );
};

export default ProfileInfo;
