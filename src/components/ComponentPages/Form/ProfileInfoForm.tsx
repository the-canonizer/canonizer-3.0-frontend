import { Fragment, useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Space,
  Modal,
  Drawer,
} from "antd";
import moment from "moment";
import {
  ArrowRightOutlined,
  CloseOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useSelector } from "react-redux";

import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";

import messages from "src/messages";
import CustomSkelton from "components/common/customSkelton";
import {
  EmailChangeVerificationOTP,
  ReplaceAndUpdateNewEmail,
  UpdateNewEmailVerification,
  getChangeEmailRequest,
} from "src/network/api/userApi";
import { RootState } from "src/store";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import PlacesAutocomplete from "react-places-autocomplete";
import React from "react";
import VerifyMobileNumberForm from "./VerifyMobileNumberForm";

const { Option } = Select;

function ProfileInfoForm({
  form,
  onFinish,
  handleselectAfter,
  privateFlags,
  disableButton,
  postalCodeDisable,
  viewEmail,
  userProfileData,
  handleAddressChange,
  address,
  handleAddressSelect,
  mobileCarrier,
  formVerify,
  isOTPModalVisible,
  setIsOTPModalVisible,
  handleOTPCancel,
  otp,
  handleChangeOTP,
  toggleVerifyButton,
  handleMobileNumberChange,
  userProfileSkeletonV,
  setOTP,
  setToggleVerifyButton,
  setAddress,
  getAddress1,
}: any) {
  const [step, setStep] = useState(0);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [newEmailOtp, setNewEmailOtp] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [afterSaveChangeDisable, setAfterSaveChangeDisable] = useState(false);
  const [newEmailOpen, setNewEmailOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [getOtpState, setGetOtpState] = useState(false);
  const [OtpBox, setOtpBox] = useState(new Array(6).fill(""));
  const [OtpBoxForNewEmail, setOtpBoxForNewEmail] = useState(
    new Array(6).fill("")
  );
  const [saveOtpValue, setSaveOtpValue] = useState("");
  const [loaded, setLoaded] = useState(false);

  const { disableButtonForProfileInfo, postalCodeDisableForProfileInfo } =
    useSelector((state: RootState) => ({
      disableButtonForProfileInfo:
        state.topicDetails.disableButtonForProfileInfo,
      postalCodeDisableForProfileInfo:
        state.topicDetails.postalCodeDisableForProfileInfo,
    }));
  useEffect(() => {
    const scripttag = document.createElement("script");
    scripttag.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
    scripttag.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(scripttag);
    return () => {
      document.body.removeChild(scripttag);
    };
  }, []);
  useEffect(() => {
    // Assuming `userProfileData` is the object containing initial values
    setInitialValues(userProfileData);
    setAfterSaveChangeDisable(false);

    form.setFieldsValue(userProfileData); // Set form fields to initial values
  }, [userProfileData]);

  const handleDiscard = () => {
    form.setFieldsValue(initialValues); // Reset form to initial values
    if (userProfileData?.address_1 == getAddress1 || getAddress1 == "") {
      setAddress(userProfileData.address_1); // Set to userProfileData's address if available
      setIsButtonDisabled(true);
    } else {
      setAddress(getAddress1); // Fallback to getAddress1
      setIsButtonDisabled(true);
    }
  };

  useEffect(() => {
    // Disable the button if the input value is empty or same as the previous value
    if (inputValue?.trim() === "" || inputValue === prevValue) {
      setIsButtonDisabled(true);
      setAfterSaveChangeDisable(false);
    } else {
      setIsButtonDisabled(false);
      setAfterSaveChangeDisable(false);
    }
  }, [inputValue, prevValue]);

  const handleChange = (e) => {
    const newValue = e?.target?.value;
    setPrevValue(inputValue); // Store the current value as previous before updating
    setInputValue(newValue); // Update the current value
    if (newValue) {
      setAfterSaveChangeDisable(false);
    }
  };

  const handleDiscardOnAddress1 = () => {
    setIsButtonDisabled(false);
    setAfterSaveChangeDisable(false);
  };
  const newEmailHandleClick = async () => {
    if (step === 0) {
      getEmailChaneRequest();
      setGetOtpState(true); // Set the OTP state when step 0 is executed
    } else if (step === 1) {
      const statusCode = await verifyEmail();
      if (statusCode === 200) {
        setUpdatedEmail("");
        setStep(2);
      }
    } else if (step === 2 && getOtpState) {
      const statusCode = await updateNewEmail();
      if (statusCode === 200) {
        setStep(3);
      }
    } else if (step === 3) {
      const statusCode = await replaceAndUpdateNewEmail();
      if (statusCode === 200) {
        setDrawerOpen(false);
        setStep(0);
      }
    }
  };

  const newEmailResendOtp = async () => {
    await updateNewEmail();
  };

  const handleNewEmailSetup = () => {
    setDrawerOpen(true);
    setNewEmailOpen(false);
    newEmailHandleClick();
    setStep(1);
    setSaveOtpValue("");
  };

  const onFinishFailed = (errorInfo) => {
    window.console.log("Failed:", errorInfo);
  };

  const publicOrPrivate = (val) => {
    return privateFlags
      ? privateFlags.includes(val)
        ? "private"
        : "public"
      : "public";
  };

  const selectAfter = (val, prvtPblc) => {
    return (
      <Select
        data-testid="selectAfterHandleselectAfter"
        defaultValue={prvtPblc}
        className="select-after [&_.ant-input-group-addon]:!w-[5rem]"
        onChange={handleselectAfter(val)}
        suffixIcon={
          <Image src="/images/caret-icon.svg" width={16} height={9} alt="" />
        }
      >
        <Option value="public">
          <Image src="/images/globe-icon.svg" width={24} height={24} alt="" />
        </Option>
        <Option value="private">
          <Image src="/images/private-icon.svg" width={24} height={16} alt="" />
        </Option>
      </Select>
    );
  };

  const handleCancel = () => {
    setStep(0);
  };

  const getEmailChaneRequest = async () => {
    await getChangeEmailRequest();
  };

  const verifyEmail = async () => {
    const reBody = {
      request_change: true,
      verify_email: false,
      otp: saveOtpValue,
    };
    try {
      const response = await EmailChangeVerificationOTP(reBody);
      return response.status_code;
    } catch (error) {
      console.error("Verification failed", error);
      return null;
    }
  };

  const updateNewEmail = async () => {
    const reqBody = {
      email: updatedEmail,
    };
    try {
      const response = await UpdateNewEmailVerification(reqBody);
      return response.status_code;
    } catch (error) {
      console.error("Verification failed", error);
      return null;
    }
  };

  const replaceAndUpdateNewEmail = async () => {
    const reqbody = {
      email: updatedEmail,
      set_primary: 1,
      otp: newEmailOtp,
    };
    try {
      const response = await ReplaceAndUpdateNewEmail(reqbody);
      return response.status_code;
    } catch (error) {
      console.error("Verification failed", error);
      return null;
    }
  };
  const inputRefs = useRef([]);
  const handleOtpBoxes = (e, index) => {
    const value = e.target.value;

    // Create a copy of the current OTP values
    const updatedOtpBox = [...OtpBox];

    // If a valid digit is entered, update the value in the current box
    if (!isNaN(value) && value.length === 1) {
      updatedOtpBox[index] = value;
      setOtpBox(updatedOtpBox);
      setSaveOtpValue(updatedOtpBox.join(""));

      // Move focus to the next input box if a digit is entered
      if (index < updatedOtpBox.length - 1 && e.target.nextSibling) {
        e.target.nextSibling.focus();
      }
    }

    // Handle backspace/delete case
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      // Clear the current box
      updatedOtpBox[index] = "";
      setOtpBox(updatedOtpBox);
      setSaveOtpValue(updatedOtpBox.join(""));

      // Move focus to the previous input box when backspace is pressed
      if (index > 0 && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const inputRefsForNewEmail = useRef([]);

  // Ensure that refs are initialized properly
  inputRefsForNewEmail.current = OtpBoxForNewEmail.map(
    (_, i) => inputRefsForNewEmail.current[i] ?? React.createRef()
  );

  const handleOtpBoxesForNewEmail = (e, index) => {
    const value = e.target.value;

    // Allow only numeric values or empty strings
    if (isNaN(value) && value !== "") return;

    const updatedOtpBox = [...OtpBoxForNewEmail];
    updatedOtpBox[index] = value;
    setOtpBoxForNewEmail(updatedOtpBox);
    setNewEmailOtp(updatedOtpBox.join(""));

    // Handle focus movement
    if (value && index < OtpBoxForNewEmail.length - 1) {
      inputRefsForNewEmail.current[index + 1]?.focus();
    } else if (
      e.nativeEvent.inputType === "deleteContentBackward" &&
      !value &&
      index > 0
    ) {
      inputRefsForNewEmail.current[index - 1]?.focus();
    }
  };
  useEffect(() => {
    // When step changes to 3, reset the OTP boxes
    if (step === 3) {
      setOtpBoxForNewEmail(new Array(6).fill("")); // Reset the OTP boxes to empty
      setNewEmailOtp(""); // Reset the concatenated OTP value
    }
  }, [step]);
  useEffect(() => {
    if (drawerOpen) {
      setOtpBox(new Array(6).fill("")); // Clear the OTP boxes
      setSaveOtpValue(""); // Optionally clear the concatenated OTP value
    }
  }, [drawerOpen]);

  const verifyHeading = "Verify OTP to change email address";
  const enterNewEmail = "Enter new email address";
  let headingText = "";

  if (step === 1) {
    headingText = verifyHeading;
  } else if (step === 2) {
    headingText = enterNewEmail;
  } else {
    headingText = enterNewEmail; // Default or fallback case
  }

  const titleContent = (
    <div
      className="flex flex-col items-start justify-center"
      id="title_content_section"
    >
      <div className="flex items-start gap-2.5" id="title_content">
        <LeftOutlined
          id="left_outlined"
          onClick={() => {
            setDrawerOpen(false);
            setStep(0);
            setOtpBox(Array(6).fill("")); // Reset OTP boxes to empty
            setSaveOtpValue(""); // Clear saved OTP value
          }}
          className="!mt-1"
        />

        <span
          className="text-lg font-normal text-canBlack mb-0"
          id="heading_text"
        >
          {headingText}
          <p className="text-canLight text-xs font-normal mt-1" id="otp_text">
            Enter the OTP you have received on your registered email address
          </p>
        </span>
      </div>
    </div>
  );

  if (privateFlags == "loading") {
    return (
      <div id="loader_profile_info">
        <CustomSkelton
          skeltonFor="profileInfoForm"
          bodyCount={7}
          stylingClass=""
          isButton={false}
        />
      </div>
    );
  }
  const renderFuncForGooglePlaces = ({
    getInputProps,
    suggestions,
    getSuggestionItemProps,
    loading,
  }) => (
    <div id="google_address_suggestion">
      <Input
        data-testid="auto_complete"
        id="selectAddress_1"
        addonAfter={selectAfter("address_1", publicOrPrivate("address_1"))}
        placeholder={messages.placeholders.addressLine1}
        size="large"
        {...getInputProps({
          placeholder: messages.placeholders.addressLine1,
        })}
        tabIndex={9}
        maxLength={255}
        // onChange={handleChange}
        className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
      />
      <div className="suggestion_loader">
        {loading && <div>Loading...</div>}
        {suggestions.map((suggestion, index) => {
          const style = suggestion.active
            ? {
                backgroundColor: "#f8f8f8",
                cursor: "pointer",
              }
            : {
                backgroundColor: "#ffffff",
                cursor: "pointer",
              };
          return (
            <div
              id="suggestion_description"
              className=" bg-white shadow-lg border border-canLightGrey p-2"
              {...getSuggestionItemProps(suggestion, {
                style,
              })}
              key={index}
            >
              {suggestion.description}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Fragment>
      <Form
        id="profile_info_form"
        name="profileInfo"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        scrollToFirstError
        className="profileInfoPointer"
      >
        <SectionHeading
          title="BASIC INFORMATION"
          icon={null}
          className="!mb-5 lg:mt-0 mt-10"
        />

        <Row
          gutter={{ xs: 0, sm: 0, md: 20, lg: 32 }}
          id="profile_info_row_first"
        >
          <Col
            md={12}
            sm={24}
            className="w-full"
            id="profile_info_col_first_name"
          >
            <Form.Item
              id="form_for_first_name"
              name="first_name"
              label={
                <>
                  {messages.labels.firstName}
                  <span className="required " id="asteriskFirstName">
                    *
                  </span>
                </>
              }
              className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray [&_.ant-input-affix-wrapper]:focus:!border-canGrey2 [&_.ant-input-affix-wrapper-focused]:!shadow-none  [&_.ant-input-affix-wrapper-focused]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!shadow-none"
              {...messages.firstNameRule}
            >
              <Input
                onChange={handleChange}
                prefix={
                  <Image
                    src="/images/nickname-user-icon.svg"
                    width={14}
                    height={16}
                    alt=""
                  />
                }
                className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 [&_.ant-input-affix-wrapper]:focus:!shadow-none text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                id="firstName"
                addonAfter={selectAfter(
                  "first_name",
                  publicOrPrivate("first_name")
                )}
                placeholder={messages.placeholders.firstName}
                size="large"
                tabIndex={4}
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col
            md={12}
            sm={24}
            className="w-full"
            id="profile_info_col_last_name"
          >
            <Form.Item
              id="form_for_last_name"
              name="last_name"
              label={
                <>
                  {messages.labels.lastName}
                  <span className="required" id="asteriskLastName">
                    *
                  </span>
                </>
              }
              className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray [&_.ant-input-affix-wrapper]:focus:!border-canGrey2 [&_.ant-input-affix-wrapper-focused]:!shadow-none  [&_.ant-input-affix-wrapper-focused]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!border-canGrey2 [&_.ant-input-affix-wrapper]:!shadow-none"
              {...messages.lastNameRule}
            >
              <Input
                onChange={handleChange}
                prefix={
                  <Image
                    src="/images/nickname-user-icon.svg"
                    width={14}
                    height={16}
                    alt=""
                  />
                }
                className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                id="lastName"
                addonAfter={selectAfter(
                  "last_name",
                  publicOrPrivate("last_name")
                )}
                placeholder={messages.placeholders.lastName}
                tabIndex={6}
                size="large"
                onKeyDown={(e) =>
                  e.key === " " && e.keyCode === 32 && e.preventDefault()
                }
                maxLength={100}
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={24} className="w-full" id="profile_info_col_email">
            <Form.Item
              id="form_for_email"
              className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray"
              name="email"
              label={messages.labels.email}
              {...messages.emailRule}
            >
              <EditOutlined
                id="profile_info_editoutline"
                className="email-edit-icon "
                onClick={() => {
                  setNewEmailOpen(true);
                }}
              />

              <Input
                onChange={handleChange}
                id="email"
                prefix={
                  <Image
                    src="/images/mail-icon.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                }
                className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input-affix-wrapper-disabled]:!bg-canDisabled [&_.ant-input]:!text-white [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                addonAfter={selectAfter("email", publicOrPrivate("email"))}
                placeholder={messages.placeholders.email}
                size="large"
                value={viewEmail}
                disabled
              />
            </Form.Item>
          </Col>
          <Col md={12} sm={24} className="w-full" id="profile_info_col_dob">
            <Form.Item
              id="form_for_dob"
              label="Date of Birth"
              className="mb-0 [&_.ant-form-item]:!border-none [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
            >
              <Input.Group compact className="!flex z-0">
                <span
                  className="flex absolute left-4 top-1/3 -translate-y-1/2 z-50 pointer-events-none border-none"
                  id="calender_image_icon"
                >
                  <Image src="/images/calender.svg" width={16} height={16} />
                </span>
                <Form.Item
                  id="form_for_date_picker"
                  name="birthday"
                  className=" [&_.ant-picker-large]:!h-[40px] w-full [&_.ant-picker]:rounded-tl-lg  [&_.ant-picker]:rounded-bl-lg text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                >
                  <DatePicker
                    id="profile_info_datepicker"
                    onChange={handleChange}
                    size="large"
                    suffixIcon={null}
                    tabIndex={8}
                    className="realtive w-full  [&_.ant-select-selector]:!border-none font-medium pl-14"
                    disabledDate={(current) => {
                      let customDate = moment().format("YYYY-MM-DD");
                      return (
                        current && current > moment(customDate, "YYYY-MM-DD")
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item
                  className="[&_.ant-select-selector]:!w-[5rem] "
                  id="form_for_birthday"
                >
                  <Select
                    id="profile_info_birthday"
                    data-testid="handleselectAfter"
                    size="large"
                    defaultValue={publicOrPrivate("birthday")}
                    onChange={handleselectAfter("birthday")}
                    className="mobile-select font-medium [&_.ant-select-selector]:!h-[40px] [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-br-lg [&_.ant-select-selector]:!rounded-tr-lg [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 [&_.ant-select-selection-item]:after:!hidden [&_.ant-select-selector]:!bg-canGray text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                    showSearch
                    optionFilterProp="children"
                    suffixIcon={
                      <Image
                        src="/images/caret-icon.svg"
                        width={16}
                        height={9}
                        alt=""
                      />
                    }
                  >
                    <Option value="public">
                      <Image
                        id="prifle_info_public_icon"
                        src="/images/globe-icon.svg"
                        width={24}
                        height={24}
                        alt=""
                      />
                    </Option>
                    <Option value="private">
                      <Image
                        id="prifle_info_private_icon"
                        src="/images/private-icon.svg"
                        width={24}
                        height={16}
                        alt=""
                      />
                    </Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col md={24} sm={24} className="w-full" id="profile_info_col_gender">
            <Form.Item
              id="form_for_gender"
              name="gender"
              label={messages.labels.gender}
              className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
            >
              <Radio.Group
                name="radiogroup"
                defaultValue={1}
                id="gender_radio_btn"
              >
                <Space
                  size="large"
                  className={styles.radio_Btn}
                  id="space_tag_radio_btn"
                >
                  <Radio value={0} id="male_radio_btn">
                    Male
                  </Radio>
                  <Radio value={1} id="female_radio_btn">
                    Female
                  </Radio>
                  <Radio value={2} id="other_radio_btn">
                    Other
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col md={24} id="profile_info_col_verify_mobile_number_form">
            <VerifyMobileNumberForm
              mobileCarrier={mobileCarrier}
              formVerify={formVerify}
              isOTPModalVisible={isOTPModalVisible}
              setIsOTPModalVisible={setIsOTPModalVisible}
              handleOTPCancel={handleOTPCancel}
              otp={otp}
              handleChangeOTP={handleChangeOTP}
              toggleVerifyButton={toggleVerifyButton}
              handleMobileNumberChange={handleMobileNumberChange}
              userProfileSkeletonV={userProfileSkeletonV}
              setOTP={setOTP}
              setToggleVerifyButton={setToggleVerifyButton}
            />
          </Col>
        </Row>

        <div
          className="border-t border-canGrey2 pt-10"
          id="profile_info_address_section"
        >
          <SectionHeading
            title="address INFORMATION"
            icon={null}
            className="!mb-5"
          />
          <Row gutter={30} id="profile_info_row_second">
            <Col
              md={12}
              sm={24}
              className="w-full"
              id="profile_info_col_address1"
            >
              <Form.Item
                id="form_for_address1"
                rules={[
                  // {
                  //   validator: (_, value) => {
                  //     if (!value) return Promise.resolve();

                  //     // Regular expressions to check for letters and digits
                  //     const letterOrDigitRegex = /[a-zA-Z0-9]/; // Checks if there's at least one letter or digit

                  //     if (!letterOrDigitRegex.test(value)) {
                  //       return Promise.reject(
                  //         "Address must contain at least one letter or number."
                  //       );
                  //     }

                  //     return Promise.resolve();
                  //   },
                  // },
                  {
                    pattern: /^\S.*$/,
                    message: "Address cannot start with a space",
                  },
                ]}
                name="address_1"
                label={messages.labels.addressLine1}
                className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              >
                <div className="reactDropdown" id="place_autocomplete_section">
                  {loaded ? (
                    <PlacesAutocomplete
                      value={address}
                      onChange={(value) => {
                        handleAddressChange(value);
                        handleDiscardOnAddress1();
                      }}
                      onSelect={handleAddressSelect}
                    >
                      {renderFuncForGooglePlaces}
                    </PlacesAutocomplete>
                  ) : null}
                </div>
              </Form.Item>
              <Form.Item
                id="form_for_city"
                name="city"
                label={messages.labels.city}
                className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              >
                <Input
                  prefix={
                    <Image
                      src="/images/location.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  }
                  onChange={handleChange}
                  id="selectCity"
                  addonAfter={selectAfter("city", publicOrPrivate("city"))}
                  placeholder={messages.placeholders.city}
                  className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 [.ant-input[disabled]]:!text-canBlack text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item
                id="form_for_country"
                name="country"
                label={messages.labels.country}
                className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              >
                <Input
                  prefix={
                    <Image
                      src="/images/location.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  }
                  onChange={handleChange}
                  id="selectCountry"
                  addonAfter={selectAfter(
                    "country",
                    publicOrPrivate("country")
                  )}
                  placeholder={messages.placeholders.country}
                  className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                  size="large"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col
              md={12}
              sm={24}
              className="w-full"
              id="profile_info_col_address_2"
            >
              <Form.Item
                id="form_for_address_2"
                rules={[
                  // {
                  //   validator: (_, value) => {
                  //     if (!value) return Promise.resolve();

                  //     // Regular expressions to check for letters and digits
                  //     const letterOrDigitRegex = /[a-zA-Z0-9]/; // Checks if there's at least one letter or digit

                  //     if (!letterOrDigitRegex.test(value)) {
                  //       return Promise.reject(
                  //         "Address must contain at least one letter or number."
                  //       );
                  //     }

                  //     return Promise.resolve();
                  //   },
                  // },
                  {
                    pattern: /^\S.*$/,
                    message: "Address cannot start with a space",
                  },
                ]}
                name="address_2"
                label={messages.labels.addressLine2}
                className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              >
                <Input
                  id="selectAddress_2"
                  addonAfter={selectAfter(
                    "address_2",
                    publicOrPrivate("address_2")
                  )}
                  onChange={handleChange}
                  placeholder={messages.placeholders.addressLine2}
                  size="large"
                  maxLength={255}
                  // onKeyDown={(e) => checkSpecialChar(e)}
                  className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                />
              </Form.Item>
              <Form.Item
                id="form_for_state"
                name="state"
                label={messages.labels.state}
                className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              >
                <Input
                  prefix={
                    <Image
                      src="/images/location.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  }
                  onChange={handleChange}
                  id="selectState"
                  addonAfter={selectAfter("state", publicOrPrivate("state"))}
                  placeholder={messages.placeholders.state}
                  size="large"
                  className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                  disabled
                />
              </Form.Item>
              <Form.Item
                id="form_for_postal_code"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      // Check if the value contains only digits
                      // if (!/^\d+$/.test(value)) {
                      //   return Promise.reject(
                      //     "Zip code must contain only numbers."
                      //   );
                      // }

                      // Check if the value consists only of zeros
                      if (/^0+$/.test(value)) {
                        return Promise.reject("Zip code cannot be all zeros.");
                      }

                      return Promise.resolve();
                    },
                  },
                  {
                    pattern: new RegExp("^[0-9-]+$"),
                    message: "Zip Code can only contain numbers and hyphens.",
                  },
                ]}
                name="postal_code"
                label={messages.labels.zipCode}
                className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              >
                <Input
                  prefix={
                    <Image
                      src="/images/location.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                  }
                  onChange={handleChange}
                  id="selectPostalCode"
                  addonAfter={selectAfter(
                    "postal_code",
                    publicOrPrivate("postal_code")
                  )}
                  placeholder={messages.placeholders.zipCode}
                  size="large"
                  className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                  maxLength={10}
                  disabled={
                    postalCodeDisable || postalCodeDisableForProfileInfo
                  }
                  autoComplete="off"
                  defaultValue={publicOrPrivate("postal_code")}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Form.Item
          id="form_for_discard_btn"
          className="!flex-col flex items-center lg:flex-row md:flex-row sm:flex-row xs:flex-col justify-center [&_.ant-form-item-control-input-content]:!flex lg:[&_.ant-form-item-control-input-content]:!flex-row lg:[&_.ant-form-item-control-input-content]:gap-5 mt-6 md:[&_.ant-form-item-control-input-content]:!flex-row [&_.ant-form-item-control-input-content]:!flex-col [&_.ant-form-item-control-input-content]:gap-2.5 md:[&_.ant-form-item-control-input-content]:!justify-center"
        >
          <SecondaryButton
            onClick={handleDiscard}
            disabled={afterSaveChangeDisable || isButtonDisabled}
            className="flex gap-2.5 items-center justify-center w-[12.5rem] h-auto"
          >
            Discard
            <CloseOutlined id="discrad_btn_closeoutlie" />
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              form.validateFields().then((values) => {
                setInitialValues(values);
                setAfterSaveChangeDisable(true);
              });
            }}
            id="profileUpdate"
            type="primary"
            htmlType="submit"
            data-testid="submitButton"
            tabIndex={12}
            disabled={disableButton || disableButtonForProfileInfo}
            className="flex gap-2.5 items-center justify-center w-[12.5rem] h-auto"
          >
            Save Changes <SaveOutlined id="save_btn_saveoutline" />
          </PrimaryButton>
        </Form.Item>
      </Form>
      <Modal
        open={newEmailOpen}
        onCancel={handleCancel}
        footer={null}
        closable={false}
        className="[&_.ant-modal-body]:!p-10 [&_.ant-modal-content]:!rounded-xl"
      >
        <h3
          className="text-base text-canBlack font-medium text-center"
          id="profile_info_modal_text_1"
        >
          Are you sure you want to change your email address?
        </h3>
        <p
          className="mt-2.5 text-canLight text-sm font-normal text-center"
          id="profile_info_modal_text_2"
        >
          You will need to verify your existing email address via OTP and then
          add a new address.
        </p>
        <div
          className="flex gap-4 justify-center items-center mt-10"
          id="profile_info_modal_cancel_btn"
        >
          <SecondaryButton
            className="flex gap-2.5 items-center justify-center w-[11.25rem] h-auto"
            onClick={() => {
              setNewEmailOpen(false);
            }}
          >
            Cancel
            <CloseOutlined />
          </SecondaryButton>
          <PrimaryButton
            onClick={handleNewEmailSetup}
            className="flex gap-2.5 items-center justify-center w-[11.25rem] h-auto"
            id="profile_info_modal_get_otp_btn"
          >
            Get OTP
            <ArrowRightOutlined id="profile_info_modal_arrowoutline" />
          </PrimaryButton>
        </div>
      </Modal>
      <Drawer
        closable={false}
        width={730}
        className="[&.ant-drawer-content-wrapper]:!w-[45rem]"
        open={drawerOpen}
        title={titleContent}
        id="profile_info_drawer"
      >
        <div
          className="flex flex-col w-full h-full lg:px-7"
          id="profile_info_drawer_section"
        >
          <div className="flex-1" id="profile_info_drawer_section_1">
            {step == 1 && (
              <Fragment>
                <p
                  className="mb-4 mt-14 text-sm font-medium text-canBlack"
                  id="profile_info_drawer_enter_otp_text"
                >
                  Enter OTP
                </p>
                <div
                  className="flex space-x-3"
                  id="profile_info_drawer_iinput_section"
                >
                  {OtpBox.map((data, i) => {
                    return (
                      <Input
                        id="profile_info_drawer_input"
                        ref={(el) => (inputRefs.current[i] = el)}
                        className="w-[40px] rounded-lg border border-canGrey2 focus:!shadow-none focus:!outline-none text-base font-semibold hover:border-canGrey2 focus-visible:!outline-transparent focus-visible:!border-canGrey2 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                        maxLength={1}
                        placeholder="*"
                        type="text"
                        key={i}
                        value={data}
                        onChange={(e) => {
                          handleOtpBoxes(e, i);
                        }}
                        onKeyDown={(e) => {
                          // Additional handling for backspace
                          if (e.key === "Backspace" && !data && i > 0) {
                            inputRefs.current[i - 1].focus();
                          }
                        }}
                      />
                    );
                  })}
                </div>
                <PrimaryButton
                  className="flex gap-2.5 items-center justify-center w-[11.25rem] h-auto mt-5"
                  onClick={getChangeEmailRequest}
                  id="profile_info_drawer_resend_btn"
                >
                  Resend OTP
                </PrimaryButton>
              </Fragment>
            )}

            {step == 2 && (
              <Fragment>
                <p
                  className="mt-14 text-sm font-medium text-canBlack mb-4"
                  id="profile_info_drawer_email_text"
                >
                  Email
                </p>

                <Input
                  onChange={(e) => {
                    setUpdatedEmail(e?.target?.value);
                  }}
                  id="profile_info_drawer_email_input"
                  prefix={
                    <Image
                      id="profile_info_drawer_dark_icon"
                      src="/images/mail-dark-icon.svg"
                      width={16}
                      height={16}
                      alt=""
                    />
                  }
                  className="rounded-lg text-base hover:!border-canGrey2 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-input-prefix]:!mr-2 font-medium text-canBlack [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input-affix-wrapper-disabled]:!bg-canDisabled  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 [&_.ant-input-affix-wrapper-lg]:!pr-0 [&_.ant-input-affix-wrapper-lg]:!bg-transparent text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                  addonAfter={selectAfter("email", publicOrPrivate("email"))}
                  placeholder="Enter new email"
                  size="large"
                  value={updatedEmail}
                />
              </Fragment>
            )}

            {step == 3 && (
              <div>
                <p
                  className="mt-14 text-sm font-medium text-canBlack mb-4"
                  id="profile_info_drawer_email_step_three_text"
                >
                  Email
                </p>
                <Input
                  onChange={(e) => {
                    setUpdatedEmail(e?.target?.value);
                  }}
                  id="profile_info_drawer_email_input_step_three_text"
                  prefix={
                    <Image
                      id="profile_info_drawer_dark_icon_2"
                      src="/images/mail-dark-icon.svg"
                      width={16}
                      height={16}
                      alt=""
                    />
                  }
                  className="mb-5 rounded-lg text-base hover:!border-canGrey2 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-input-prefix]:!mr-2 font-medium text-canBlack [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input]:!h-[3rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input-affix-wrapper-disabled]:!bg-canDisabled  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                  addonAfter={selectAfter("email", publicOrPrivate("email"))}
                  placeholder="Enter new email"
                  size="large"
                  value={updatedEmail}
                />
                <PrimaryButton
                  className="flex gap-2.5 items-center justify-center w-[11.25rem] h-auto mt-5"
                  onClick={newEmailResendOtp}
                  id="profile_info_drawer_resend_otp_btn"
                >
                  Resend OTP
                </PrimaryButton>

                <div
                  className="flex flex-col gap-4"
                  id="profile_info_drawer_enter_otp_btn_section"
                >
                  <p
                    className="mt-8 text-sm font-normal text-canBlack"
                    id="profile_info_drawer_enter_otp_text_2"
                  >
                    Enter OTP
                  </p>
                  <div
                    className="flex gap-2.5"
                    id="profile_info_drawer_input_section_2"
                  >
                    {OtpBoxForNewEmail.map((data, i) => {
                      return (
                        <Input
                          id="profile_info_drawer_input_2"
                          ref={(el) => (inputRefsForNewEmail.current[i] = el)}
                          className="w-[40px] rounded-lg border border-canGrey2 focus:!shadow-none focus:!outline-none text-base font-semibold hover:border-canGrey2 focus-visible:!outline-transparent focus-visible:!border-canGrey2 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                          maxLength={1}
                          type="text"
                          key={i}
                          value={data}
                          onChange={(e) => {
                            handleOtpBoxesForNewEmail(e, i);
                          }}
                          onKeyDown={(e) => {
                            // Additional handling for backspace
                            if (e.key === "Backspace" && !data && i > 0) {
                              inputRefsForNewEmail.current[i - 1]?.focus();
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="flex items-center justify-center gap-5 py-20"
            id="profile_info_drawer_btn_section"
          >
            <SecondaryButton
              className="flex gap-2.5 items-center justify-center w-[12.5rem] h-auto"
              onClick={() => {
                setDrawerOpen(false);
                setStep(0);
                setOtpBox(Array(6).fill("")); // Reset OTP boxes to empty
                setSaveOtpValue(""); // Clear saved OTP value
              }}
              id="profile_info_drawer_cancel_btn"
            >
              Cancel
              <CloseOutlined />
            </SecondaryButton>
            {step == 2 ? (
              <PrimaryButton
                onClick={() => {
                  newEmailHandleClick();
                  // setGetOtpState(true);
                  // setStep(3);
                }}
                className="flex gap-2.5 items-center justify-center h-auto"
                id="profile_info_drawer_get_otp_btn"
              >
                Get OTP
                <RightOutlined id="profile_info_drawer_get_otp_btn_right_outline" />
              </PrimaryButton>
            ) : (
              <PrimaryButton
                className="flex gap-2.5 items-center justify-center h-auto w-[12.5rem]"
                onClick={() => {
                  newEmailHandleClick();
                }}
                id="profile_info_drawer_verify_btn"
              >
                Verify OTP
                <RightOutlined id="profile_info_drawer_verify_btn_right_outline" />
              </PrimaryButton>
            )}
          </div>
        </div>
      </Drawer>
    </Fragment>
  );
}

export default ProfileInfoForm;
