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
  Button,
} from "antd";
import moment from "moment";
import {
  ArrowRightOutlined,
  CalendarOutlined,
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
}:any) {
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
    <div className="flex flex-col items-start justify-center">
      <div className="flex items-start gap-2.5">
        <LeftOutlined
          onClick={() => {
            setDrawerOpen(false);
            setStep(0);
            setOtpBox(Array(6).fill("")); // Reset OTP boxes to empty
            setSaveOtpValue(""); // Clear saved OTP value
          }}
          className="!mt-1"
        />

        <span className="text-lg font-normal text-canBlack mb-0">
          {headingText}
          <p className="text-canLight text-xs font-normal mt-1">
            Enter the OTP you have received on your registered email address
          </p>
        </span>
      </div>
    </div>
  );

  if (privateFlags == "loading") {
    return (
      <div>
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
    <div>
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
      <div className="">
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

        <Row gutter={{ xs: 0, sm: 0, md: 20, lg: 32 }}>
          <Col md={12} sm={24} className="w-full">
            <Form.Item
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
          <Col md={12} sm={24} className="w-full">
            <Form.Item
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
          <Col md={12} sm={24} className="w-full">
            <Form.Item
              className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6 [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray"
              name="email"
              label={messages.labels.email}
              {...messages.emailRule}
            >
              <EditOutlined
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
          <Col md={12} sm={24} className="w-full">
            <Form.Item
              label="Date of Birth"
              className="mb-0 [&_.ant-form-item]:!border-none [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
            >
              <Input.Group compact className="!flex">
                <Form.Item
                  name="birthday"
                  className=" [&_.ant-picker-large]:!h-[40px] w-full [&_.ant-picker]:rounded-tl-lg  [&_.ant-picker]:rounded-bl-lg text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                >
                  <DatePicker
                    onChange={handleChange}
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                    tabIndex={8}
                    className="realtive w-full  [&_.ant-select-selector]:!border-none font-medium pl-14"
                    disabledDate={(current) => {
                      let customDate = moment().format("YYYY-MM-DD");
                      return (
                        current && current > moment(customDate, "YYYY-MM-DD")
                      );
                    }}
                  />
                  {/* <span className="flex absolute left-3 top-1/2 -translate-y-1/2  text-gray-500 pointer-events-none">
                    <Image
                      src="/images/profile-calendar-icon.svg"
                      width={24}
                      height={24}
                      alt="calendar icon"
                    />
                  </span> */}
                </Form.Item>
                <Form.Item className="[&_.ant-select-selector]:!w-[5rem] ">
                  <Select
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
                        src="/images/globe-icon.svg"
                        width={24}
                        height={24}
                        alt=""
                      />
                    </Option>
                    <Option value="private">
                      <Image
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
          <Col md={24} sm={24} className="w-full">
            <Form.Item
              name="gender"
              label={messages.labels.gender}
              className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
            >
              <Radio.Group name="radiogroup" defaultValue={1}>
                <Space size="large" className={styles.radio_Btn}>
                  <Radio value={0} tabIndex={7}>
                    Male
                  </Radio>
                  <Radio value={1}>Female</Radio>
                  <Radio value={2}>Other</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <div className="border-t border-canGrey2 pt-10">
          <SectionHeading
            title="address INFORMATION"
            icon={null}
            className="!mb-5"
          />
          <Row gutter={30}>
            <Col md={12} sm={24} className="w-full">
              <Form.Item
                name="address_1"
                label={messages.labels.addressLine1}
                className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6 [&_.ant-input-group-addon]:!bg-canGray text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
              >
                <div className="reactDropdown">
                  {loaded ? (
                    <PlacesAutocomplete
                      value={address}
                      onChange={handleAddressChange}
                      onSelect={handleAddressSelect}
                    >
                      {renderFuncForGooglePlaces}
                    </PlacesAutocomplete>
                  ) : null}
                </div>
              </Form.Item>
              <Form.Item
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
            <Col md={12} sm={24} className="w-full">
              <Form.Item
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
                  className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input-affix-wrapper]:!h-[40px] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg  [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
                />
              </Form.Item>
              <Form.Item
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
                  maxLength={255}
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
        <Form.Item className="!flex-col flex items-center lg:flex-row md:flex-row sm:flex-row xs:flex-col justify-center [&_.ant-form-item-control-input-content]:!flex lg:[&_.ant-form-item-control-input-content]:!flex-row lg:[&_.ant-form-item-control-input-content]:gap-5 mt-6 md:[&_.ant-form-item-control-input-content]:!flex-row [&_.ant-form-item-control-input-content]:!flex-col [&_.ant-form-item-control-input-content]:gap-2.5 md:[&_.ant-form-item-control-input-content]:!justify-center">
          <SecondaryButton
            onClick={handleDiscard}
            disabled={afterSaveChangeDisable || isButtonDisabled}
            className="flex gap-2.5 items-center justify-center w-[12.5rem] h-auto"
          >
            Discard
            <CloseOutlined />
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
            Save Changes <SaveOutlined />
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
        <h3 className="text-base text-canBlack font-medium text-center">
          Are you sure you want to change your email address?
        </h3>
        <p className="mt-2.5 text-canLight text-sm font-normal text-center">
          You will need to verify your existing email address via OTP and then
          add a new address.
        </p>
        <div className="flex gap-4 justify-center items-center mt-10">
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
          >
            Get OTP
            <ArrowRightOutlined />
          </PrimaryButton>
        </div>
      </Modal>
      <Drawer
        closable={false}
        width={730}
        className="[&.ant-drawer-content-wrapper]:!w-[45rem]"
        open={drawerOpen}
        title={titleContent}
      >
        <div className="flex flex-col w-full h-full lg:px-7">
          <div className="flex-1">
            {step == 1 && (
              <Fragment>
                <p className="mb-4 mt-14 text-sm font-medium text-canBlack">
                  Enter OTP
                </p>
                <div className="flex space-x-3">
                  {OtpBox.map((data, i) => {
                    return (
                      <Input
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
                >
                  Resend OTP
                </PrimaryButton>
              </Fragment>
            )}

            {step == 2 && (
              <Fragment>
                <p className="mt-14 text-sm font-medium text-canBlack mb-4">
                  Email
                </p>

                <Input
                  onChange={(e) => {
                    setUpdatedEmail(e?.target?.value);
                  }}
                  id="email"
                  prefix={
                    <Image
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
                <p className="mt-14 text-sm font-medium text-canBlack mb-4">
                  Email
                </p>
                <Input
                  onChange={(e) => {
                    setUpdatedEmail(e?.target?.value);
                  }}
                  id="email"
                  prefix={
                    <Image
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
                >
                  Resend OTP
                </PrimaryButton>

                <div className="flex flex-col gap-4">
                  <p className="mt-8 text-sm font-normal text-canBlack">
                    Enter OTP
                  </p>
                  <div className="flex gap-2.5">
                    {OtpBoxForNewEmail.map((data, i) => {
                      return (
                        <Input
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
          <div className="flex items-center justify-center gap-5 py-20">
            <SecondaryButton
              className="flex gap-2.5 items-center justify-center w-[12.5rem] h-auto"
              onClick={() => {
                setDrawerOpen(false);
                setStep(0);
                setOtpBox(Array(6).fill("")); // Reset OTP boxes to empty
                setSaveOtpValue(""); // Clear saved OTP value
              }}
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
              >
                Get OTP
                <RightOutlined />
              </PrimaryButton>
            ) : (
              <PrimaryButton
                className="flex gap-2.5 items-center justify-center h-auto w-[12.5rem]"
                onClick={() => {
                  newEmailHandleClick();
                }}
              >
                Verify OTP
                <RightOutlined />
              </PrimaryButton>
            )}
          </div>
        </div>
      </Drawer>
    </Fragment>
  );
}

export default ProfileInfoForm;
