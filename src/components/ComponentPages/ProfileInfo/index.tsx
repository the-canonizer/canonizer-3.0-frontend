import { useState, useEffect } from "react";
import moment from "moment";
import { Form, message } from "antd";
import isAuth from "../../../hooks/isUserAuthenticated";

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
import {
  geocodeByAddress,
  getLatLng,
  geocodeByPlaceId,
} from "react-places-autocomplete";

const ProfileInfo = () => {
  const [form] = Form.useForm();
  const [formVerify] = Form.useForm();
  const [mobileCarrier, setMobileCarrier] = useState([]);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [otp, setOTP] = useState("");
  const [privateFlags, setPrivateFlags] = useState("");
  const [privateList, setPrivateList] = useState([]);
  const [publicList, setPublicList] = useState([]);
  const [algorithmList, setAlgorithmList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [address, setAddress] = useState("");
  const [mobileVerified, setMobileVerified] = useState(0);
  const [mobileNumber, setMobileNumber] = useState(0);
  const [toggleVerifyButton, setToggleVerifyButton] = useState(0);
  const [disableButton, setDisableButton] = useState(false);

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
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  //on update profile click
  const onFinish = async (values: any) => {
    // console.log(values, 'valuessss')
    let birthday = values.birthday._d;
    setDisableButton(true);
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
    values.birthday = formatDate(birthday);

    //End Set Private Public flags
    values.mobile_carrier = formVerify.getFieldValue(
      publicPrivateArray.mobile_carrier
    );
    values.phone_number = formVerify.getFieldValue(
      publicPrivateArray.phone_number
    );
    values.address_1 = address;
    let res = await UpdateUserProfileInfo(values);
    if (res && res.status_code === 200) {
      message.success(res.message);
      setDisableButton(false);
    } else {
      setDisableButton(false);
    }
  };
  const isLogIn = isAuth();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //Send OTP to mobile number
  const onVerifyClick = async (values: any) => {
    let res = await SendOTP(values);
    if (res && res.status_code === 200) {
      message.success(res.message);
      setIsOTPModalVisible(true);
      setOTP("");
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

    let res = await VerifyOTP(otpBody);
    if (res && res.status_code === 200) {
      message.success(res.message);
      setIsOTPModalVisible(false);
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
  const handleAddressChange = (value) => {
    setAddress(value);
  };

  const handleAddressSelect = async (address, placeId) => {
    setAddress(address);
    const results = await geocodeByAddress(address);
    const [place] = await geocodeByPlaceId(placeId);
    const { long_name: postalCode = "" } =
      place.address_components.find((c) => c.types.includes("postal_code")) ||
      {};
    let city = "",
      country = "",
      state = "",
      address2 = "";

    for (const component of results[0].address_components) {
      const componentType = component.types[0];
      address2 = getAddress(componentType, address2, component);
      switch (componentType) {
        case "locality": {
          city = component.long_name;
          break;
        }
        case "administrative_area_level_1": {
          state = component.long_name;
          break;
        }
        case "country": {
          country = component.long_name;
          break;
        }
      }
    }
    address2 = address2.replace(/^,|,$/g, "");

    form.setFieldsValue({
      ["address_2"]: address2,
      ["postal_code"]: postalCode,
      ["city"]: city,
      ["state"]: state,
      ["country"]: country,
    });
  };
  const getAddress = (type, address, component) => {
    if (
      type.match(
        /^political|^neighborhood$|^sublocality_level_2$|^sublocality_level_1$/
      )
    ) {
      return address + ", " + component.long_name;
    } else {
      return address;
    }
  };
  const handleMobileNumberChange = (event) => {
    if (mobileNumber === event.target.value && mobileVerified) {
      setToggleVerifyButton(1);
    } else {
      setToggleVerifyButton(0);
    }
  };
  useEffect(() => {
    async function fetchMobileCarrier() {
      let res = await GetMobileCarrier();
      if (res != undefined) {
        setMobileCarrier(res.data);
      }
    }

    async function fetchAlgorithmsList() {
      let res = await GetAlgorithmsList();
      if (res != undefined) {
        setAlgorithmList(res.data);
      }
    }
    async function fetchLanguageList() {
      let res = await GetLanguageList();
      if (res != undefined) {
        setLanguageList(res.data);
      }
    }

    async function fetchUserProfileInfo() {
      let res = await GetUserProfileInfo();
      if (res != undefined) {
        if (res.data != undefined) {
          let profileData = res.data;
          const verify = {
            phone_number: profileData.phone_number,
            mobile_carrier:
              parseInt(profileData.mobile_carrier).toString() == "NaN"
                ? ""
                : parseInt(profileData.mobile_carrier),
          };
          formVerify.setFieldsValue(verify);
          //format date for datepicker
          profileData.birthday = moment(profileData.birthday, "YYYY-MM-DD");
          form.setFieldsValue(profileData);
          setPrivateFlags(profileData.private_flags);
          setPrivateList(
            profileData.private_flags
              ? profileData.private_flags.split(",")
              : ""
          );
          setAddress(profileData.address_1);
          setMobileNumber(profileData.phone_number);
          setToggleVerifyButton(profileData.mobile_verified);
          setMobileVerified(profileData.mobile_verified);
        }
      }
    }
    if (isLogIn) {
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
    }
  }, [isLogIn]);

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
      handleAddressChange={handleAddressChange}
      handleAddressSelect={handleAddressSelect}
      address={address}
      toggleVerifyButton={toggleVerifyButton}
      handleMobileNumberChange={handleMobileNumberChange}
      disableButton={disableButton}
    />
  );
};

export default ProfileInfo;
