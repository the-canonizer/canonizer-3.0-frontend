import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, message } from "antd";
import { geocodeByAddress, geocodeByPlaceId } from "react-places-autocomplete";
import moment from "moment";

import isAuth from "src/hooks/isUserAuthenticated";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import {
  GetUserProfileInfo,
  UpdateUserProfileInfo,
  GetMobileCarrier,
  GetAlgorithmsList,
  GetLanguageList,
} from "src/network/api/userApi";
import { formatDate } from "components/common/FormatDate";
import {
  setGlobalUserProfileData,
  setGlobalUserProfileDataEmail,
  setAddForProfileInfo,
  setUserLanguageList,
  setPrivateListForProfileInfo,
  setUpdateAddressForProfileInfo,
  setAddressForProfileInfo,
  setPostalCodeDisableForProfileInfo,
  setZipCodeForProfileInfo,
  setBirthdayForProfileInfo,
  setGlobalUserProfileDataLastName,
} from "src/store/slices/campDetailSlice";
import { RootState } from "src/store";
import ProfileInfoForm from "../Form/ProfileInfoForm";

type UpdateAddress = {
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  email?: string;
};

const ProfileInfo = () => {
  const [form] = Form.useForm();
  const [formVerify] = Form.useForm();
  const dispatch = useDispatch();
  const [mobileCarrier, setMobileCarrier] = useState([]);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [otp, setOTP] = useState("");
  const [privateFlags, setPrivateFlags] = useState("loading");
  const [privateList, setPrivateList] = useState([]);
  const [publicList, setPublicList] = useState([]);
  const [algorithmList, setAlgorithmList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [address, setAddress] = useState("");
  const [mobileVerified, setMobileVerified] = useState(0);
  const [mobileNumber, setMobileNumber] = useState(0);
  const [toggleVerifyButton, setToggleVerifyButton] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [postalCodeDisable, setPostalCodeDisable] = useState(false);
  const [updateAddress, setUpdateAddress] = useState<UpdateAddress>({});
  const [zipCode, setZipCode] = useState(false);
  const [add, setAdd] = useState(false);
  const [userProfileSkeleton, setUserProfileSkeleton] = useState(false);
  const [userProfileSkeletonV, setUserProfileSkeletonV] = useState(true);
  const [viewEmail, setViewEmail] = useState("");
  const [userProfileData, setUserProfileData] = useState("");

  const { addForProfileInfo, zipCodeForProfileInfo } = useSelector(
    (state: RootState) => ({
      disableButtonForProfileInfo:
        state.topicDetails.disableButtonForProfileInfo,
      addForProfileInfo: state.topicDetails.addForProfileInfo,
      zipCodeForProfileInfo: state.topicDetails.zipCodeForProfileInfo,
    })
  );

  const publicPrivateArray = {
    first_name: "first_name",
    last_name: "last_name",
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
    let birthday = values.birthday?._d;
    let code = values.postal_code;
    setDisableButton(true);
    setPostalCodeDisable(true);
    //Set Private Public flags
    values.first_name_bit = isPublicOrPrivate(publicPrivateArray.first_name);
    values.last_name_bit = isPublicOrPrivate(publicPrivateArray.last_name);
    values.email_bit = isPublicOrPrivate(publicPrivateArray.email);
    values.address_1_bit = isPublicOrPrivate(publicPrivateArray.address_1);
    values.address_2_bit = isPublicOrPrivate(publicPrivateArray.address_2);
    values.postal_code_bit = isPublicOrPrivate(publicPrivateArray.postal_code);
    values.state_bit = isPublicOrPrivate(publicPrivateArray.state);
    values.country_bit = isPublicOrPrivate(publicPrivateArray.country);
    values.birthday_bit = isPublicOrPrivate(publicPrivateArray.birthday);
    values.city_bit = isPublicOrPrivate(publicPrivateArray.city);
    //values.birthday = formatDate(birthday);
    if (birthday == "" || birthday == null) {
      values.birthday = "";
    } else {
      values.birthday = formatDate(birthday);
    }
    dispatch(setBirthdayForProfileInfo(formatDate(birthday)));
    //End Set Private Public flags
    values.mobile_carrier = formVerify.getFieldValue(
      publicPrivateArray.mobile_carrier
    );
    values.phone_number = formVerify.getFieldValue(
      publicPrivateArray.phone_number
    );
    values.address_1 = address;
    values.postal_code = code;
    values = { ...values, ...updateAddress };

    let res = await UpdateUserProfileInfo(values);
    if (res && res.status_code === 200) {
      message.success(res.message);
      if (values?.default_algo) {
        dispatch(
          setFilterCanonizedTopics({
            algorithm: values?.default_algo,
          })
        );
      }
      setDisableButton(false);
      setAdd(false);
      dispatch(setAddForProfileInfo(false));
      setZipCode(false);
      dispatch(setZipCodeForProfileInfo(false));
    } else {
      setDisableButton(false);
      setAdd(false);
      dispatch(setAddForProfileInfo(false));
      setZipCode(false);
      dispatch(setZipCodeForProfileInfo(false));
    }
  };

  const { isUserAuthenticated } = isAuth();

  //Send OTP to mobile number
  // const onVerifyClick = async (values: any) => {
  //   let res = await SendOTP(values);
  //   if (res && res.status_code === 200) {
  //     message.success(res.message);
  //     setIsOTPModalVisible(true);
  //     setOTP("");
  //     //setOTP(res.data.otp)
  //   }
  // };

  const handleOTPCancel = () => {
    setIsOTPModalVisible(false);
  };

  //function to verify the OTP
  // const onOTPBtnClick = async () => {
  //   let otpBody = {
  //     otp: otp,
  //   };

  //   let res = await VerifyOTP(otpBody);
  //   if (res && res.status_code === 200) {
  //     message.success(res.message);
  //     setIsOTPModalVisible(false);
  //   }
  // };

  const handleChangeOTP = (e) => {
    setOTP(e.target.value);
  };

  //private public selection of fields, create PrivateFlag list
  const handleselectAfter = (data) => (value) => {
    if (value == "private") {
      if (!privateList.includes(data)) {
        setPrivateList((oldArray) => [...oldArray, data]);
        dispatch(
          setPrivateListForProfileInfo((oldArray) => [...oldArray, data])
        );
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
    if (zipCode && !add && !addForProfileInfo && zipCodeForProfileInfo) {
      setAddress(value);
      dispatch(setAddressForProfileInfo(value));
      setPostalCodeDisable(false);
      dispatch(setPostalCodeDisableForProfileInfo(false));
    } else {
      setAddress(value);
      dispatch(setAddressForProfileInfo(value));
      setPostalCodeDisable(false);
      dispatch(setPostalCodeDisableForProfileInfo(false));
      let postalCode = "";
      form.setFieldsValue({
        ["postal_code"]: postalCode,
      });
    }
  };

  const handleAddressSelect = async (address, placeId) => {
    setAddress(address);
    dispatch(setAddressForProfileInfo(address));
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
    setPostalCodeDisable(!!postalCode);
    dispatch(setPostalCodeDisableForProfileInfo(!!postalCode));
    form.setFieldsValue({
      ["address_2"]: address2,
      ["postal_code"]: postalCode,
      ["city"]: city,
      ["state"]: state,
      ["country"]: country,
    });
    const updateAdd: UpdateAddress = {
      city: city,
      state: state,
      country: country,
      email: updateAddress?.email,
      // postal_code: updateAddress?.postal_code
    };
    if (postalCode) updateAdd.postal_code = postalCode;
    setUpdateAddress(updateAdd);
    dispatch(setUpdateAddressForProfileInfo(updateAdd));
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
      // let res = await GetMobileCarrier();
      // if (res != undefined) {
      //   setMobileCarrier(res.data);
      // }
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
        dispatch(setUserLanguageList(res.data));
      }
    }

    async function fetchUserProfileInfo() {
      let res = await GetUserProfileInfo();
      if (res != undefined) {
        if (res.data != undefined) {
          let profileData = res.data;
          setViewEmail(profileData?.email);
          setUserProfileData(profileData);
          dispatch(setGlobalUserProfileData(profileData?.first_name));
          dispatch(setGlobalUserProfileDataLastName(profileData?.last_name));
          dispatch(setGlobalUserProfileDataEmail(profileData?.email));
          const verify = {
            phone_number: profileData.phone_number,
            mobile_carrier:
              parseInt(profileData.mobile_carrier).toString() == "NaN"
                ? ""
                : parseInt(profileData.mobile_carrier),
          };
          formVerify.setFieldsValue(verify);
          //format date for datepicker
          if (profileData.birthday != null && profileData.birthday != "")
            profileData.birthday = moment(profileData.birthday, "YYYY-MM-DD");
          if (profileData.postal_code) {
            setPostalCodeDisable(true);
            dispatch(setPostalCodeDisableForProfileInfo(true));
          }
          form.setFieldsValue(profileData);
          setPrivateFlags(profileData.private_flags);
          setPrivateList(
            profileData.private_flags
              ? profileData.private_flags.split(",")
              : ""
          );
          dispatch(
            setPrivateListForProfileInfo(
              profileData.private_flags
                ? profileData.private_flags.split(",")
                : ""
            )
          );

          setAddress(profileData.address_1);
          dispatch(setAddressForProfileInfo(profileData.address_1));
          setMobileNumber(profileData.phone_number);
          setToggleVerifyButton(profileData.mobile_verified);
          setMobileVerified(profileData.mobile_verified);
          const updateAddress: UpdateAddress = {
            city: profileData.city,
            state: profileData.state,
            country: profileData.country,
            email: profileData?.email,
            // postal_code: profileData?.postal_code,
          };
          if (profileData.postalCode)
            updateAddress.postal_code = profileData.postalCode;
          if (profileData.postal_code !== "") {
            setZipCode(true);
            dispatch(setZipCodeForProfileInfo(true));
          }
          if (profileData.address_1 !== "") {
            setAdd(true);
            dispatch(setAddForProfileInfo(true));
          }
          setUpdateAddress(updateAddress);
          dispatch(setUpdateAddressForProfileInfo(updateAddress));
        }
      }
    }
    if (isUserAuthenticated) {
      fetchMobileCarrier()
        .then(async function () {
          return await fetchAlgorithmsList(), setUserProfileSkeletonV(false);
        })
        .then(async function () {
          return await fetchLanguageList();
        })
        .then(async function () {
          return await fetchUserProfileInfo(), setUserProfileSkeleton(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  return (
    <ProfileInfoForm
      form={form}
      onFinish={onFinish}
      handleselectAfter={handleselectAfter}
      privateFlags={privateFlags}
      disableButton={disableButton}
      postalCodeDisable={postalCodeDisable}
      viewEmail={viewEmail}
      userProfileData={userProfileData}
    />
  );
};

export default ProfileInfo;
