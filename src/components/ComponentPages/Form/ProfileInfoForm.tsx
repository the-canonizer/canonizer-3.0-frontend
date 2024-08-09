import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
  Space,
  Modal,
} from "antd";
import moment from "moment";
import PlacesAutocomplete from "react-places-autocomplete";

import style from "./style.module.scss";

import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";
import messages from "../../../messages";
import CustomSkelton from "../../common/customSkelton";
import ImageUploader from "../../ComponentPages/ImageUploader";
import VerifyMobileNumber from "./VerifyMobileNumberForm";
import {
  EmailChangeVerificationOTP,
  ReplaceAndUpdateNewEmail,
  UpdateNewEmailVerification,
  getChangeEmailRequest,
} from "src/network/api/userApi";
import { EditOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const { Title } = Typography;
const { Option } = Select;

function ProfileInfoForm({
  form,
  onFinish,
  handleselectAfter,
  privateFlags,
  algorithmList,
  languageList,
  handleAddressChange,
  handleAddressSelect,
  address,
  disableButton,
  postalCodeDisable,
  mobileCarrier,
  handleMobileNumberChange,
  formVerify,
  isOTPModalVisible,
  setIsOTPModalVisible,
  handleOTPCancel,
  handleChangeOTP,
  toggleVerifyButton,
  userProfileSkeletonV,
  setOTP,
  otp,
  setToggleVerifyButton,
  viewEmail,
  userProfileData,
}: any) {
  // eslint-disable-next-line no-unused-vars
  const [gmapsLoaded, setgmapsLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [newEmailId, setNewEmailId] = useState(false);
  const [step, setStep] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [newEmailOtp, setNewEmailOtp] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [afterSaveChangeDisable, setAfterSaveChangeDisable] = useState(false);

  useEffect(() => {
    setgmapsLoaded(true);
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
    if (inputValue.trim() === "" || inputValue === prevValue) {
      setIsButtonDisabled(true);
      setAfterSaveChangeDisable(false);
    } else {
      setIsButtonDisabled(false);
      setAfterSaveChangeDisable(false);
    }
  }, [inputValue, prevValue]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setPrevValue(inputValue); // Store the current value as previous before updating
    setInputValue(newValue); // Update the current value
    if(newValue){
      setAfterSaveChangeDisable(false);
    }
    
    console.log("Prabhakar")
  };

  const listOfOption = (optionList, algoOrLang): any => {
    let option = [];
    optionList.length > 0 &&
      optionList.map((item) => {
        if (algoOrLang == "algorithms") {
          option.push(
            <Option key={item.algorithm_key} value={item.algorithm_key}>
              {item.algorithm_label}
            </Option>
          );
        } else if (algoOrLang == "languages") {
          option.push(
            <Option key={item.id} value={item.name}>
              {item.name}
            </Option>
          );
        }
      });
    return option;
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
      />
      <div>
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

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scripttag = document.createElement("script");
    scripttag.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
    scripttag.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(scripttag);
    return () => {
      document.body.removeChild(scripttag);
    };
  }, []);
  const handleCancel = () => {
    setOpen(false);
    setStep(0);
  };

  const getEmailChaneRequest = async () => {
    await getChangeEmailRequest();
  };

  const verifyEmail = async () => {
    const reBody = {
      request_change: true,
      verify_email: false,
      otp: generatedOtp,
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

  const handleClick = async () => {
    if (step === 1) {
      const statusCode = await verifyEmail();
      if (statusCode == 200) {
        setUpdatedEmail("");
        setStep(2);
      }
    } else if (step === 2) {
      const statusCode = await updateNewEmail();
      if (statusCode == 200) {
        setStep(3);
      }
    } else if (step === 3) {
      const statusCode = await replaceAndUpdateNewEmail();
      if (statusCode == 200) {
        setStep(4);
      }
    } else if (step === 4) {
      setOpen(false); // Close the modal
    }
  };
  // @ts-ignore
  if (privateFlags != "loading")
    return (
      <div>
        {/* <div>
          <div className={style.imageWrapper}>
            <div id="upload-profile">
              <ImageUploader />
            </div>
          </div>
        </div> */}
        <Form
          name="profileInfo"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          scrollToFirstError
          className="profileInfoPointer"
        >
          <Title
            level={4}
            className=" uppercase font-semibold text-canBlack !mb-5 !text-base"
          >
            BASIC INFORMATION
          </Title>
          <div className={style.profileCardWrapper}>
            <div className="">
              <Row>
                <Col md={24}>
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
                        className="!text-sm font-normal text-canBlack [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6"
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
                          className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input]:!h-[3.25rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0
                        [&_.ant-input-affix-wrapper-lg]:!pl-4 "
                          id="firstName"
                          addonAfter={selectAfter(
                            "first_name",
                            publicOrPrivate("first_name")
                          )}
                          placeholder={messages.placeholders.firstName}
                          size="large"
                          tabIndex={4}
                          onKeyDown={(e) =>
                            e.key === " " &&
                            e.keyCode === 32 &&
                            e.preventDefault()
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
                        className="!text-sm font-normal text-canBlack [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6"
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
                          className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input]:!h-[3.25rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0
                        [&_.ant-input-affix-wrapper-lg]:!pl-4"
                          id="lastName"
                          addonAfter={selectAfter(
                            "last_name",
                            publicOrPrivate("last_name")
                          )}
                          placeholder={messages.placeholders.lastName}
                          tabIndex={6}
                          size="large"
                          onKeyDown={(e) =>
                            e.key === " " &&
                            e.keyCode === 32 &&
                            e.preventDefault()
                          }
                          maxLength={100}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12} sm={24} className="w-full">
                      <Form.Item
                        className="!text-sm font-normal text-canBlack [&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6"
                        name="email"
                        label={messages.labels.email}
                        {...messages.emailRule}
                      >
                        <EditOutlined
                          className="email-edit-icon "
                          onClick={() => {
                            getEmailChaneRequest();
                            setOpen(true);
                            setNewEmailId(false);
                            setStep(1);
                            setGeneratedOtp("");
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
                          className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input]:!h-[3.25rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input-affix-wrapper-disabled]:!bg-canDisabled [&_.ant-input]:!text-white [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0
                        [&_.ant-input-affix-wrapper-lg]:!pl-4"
                          addonAfter={selectAfter(
                            "email",
                            publicOrPrivate("email")
                          )}
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
                        className="mb-0 [&_.ant-form-item]:!border-none "
                      >
                        <Input.Group compact className={styles.date_picker}>
                          <Form.Item
                            name="birthday"
                            className=" [&_.ant-picker-large]:!h-[3.25rem] w-full [&_.ant-picker]:rounded-tl-lg  [&_.ant-picker]:rounded-bl-lg "
                          >
                            <DatePicker
                              onChange={handleChange}
                              size="large"
                              suffixIcon={null}
                              tabIndex={8}
                              className="w-full  [&_.ant-select-selector]:!border-none font-medium"
                              disabledDate={(current) => {
                                let customDate = moment().format("YYYY-MM-DD");
                                return (
                                  current &&
                                  current > moment(customDate, "YYYY-MM-DD")
                                );
                              }}
                            />
                          </Form.Item>
                          <Form.Item className="[&_.ant-select-selector]:!w-[5rem]">
                            <Select
                              data-testid="handleselectAfter"
                              size="large"
                              defaultValue={publicOrPrivate("birthday")}
                              onChange={handleselectAfter("birthday")}
                              className="mobile-select font-medium [&_.ant-select-selector]:!h-[3.25rem] [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-br-lg [&_.ant-select-selector]:!rounded-tr-lg [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0 [&_.ant-input-affix-wrapper-lg]:!pl-4 [&_..ant-select-selection-item]:after:!hidden"
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
                      <Form.Item name="gender" label={messages.labels.gender}>
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
                </Col>
                <Col md={12}>
                  <Row></Row>
                </Col>
                {/* <Col md={24}>
                  <VerifyMobileNumber
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
                </Col> */}
              </Row>
            </div>
          </div>
          <div className="border-t border-canGrey2 pt-10">
            <Title
              level={4}
              className=" uppercase font-semibold text-canBlack !mb-5 !text-base"
            >
              ADDITIONAL INFORMATION
            </Title>
            <Row gutter={30}>
              <Col md={12} sm={24}>
                {/* <Form.Item
                  name="address_1"
                  label={messages.labels.addressLine1}
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
                </Form.Item> */}
                <Form.Item
                  name="city"
                  label={messages.labels.city}
                  className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6"
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
                    className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input]:!h-[3.25rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input]:!text-white [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0
                        [&_.ant-input-affix-wrapper-lg]:!pl-4 "
                    size="large"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="country"
                  label={messages.labels.country}
                  className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6"
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
                    className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg [&_.ant-input]:!h-[3.25rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input]:!text-white [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0
                        [&_.ant-input-affix-wrapper-lg]:!pl-4"
                    size="large"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                {/* <Form.Item
                  name="address_2"
                  label={messages.labels.addressLine2}
                >
                  <Input
                    id="selectAddress_2"
                    addonAfter={selectAfter(
                      "address_2",
                      publicOrPrivate("address_2")
                    )}
                    placeholder={messages.placeholders.addressLine2}
                    size="large"
                    maxLength={255}
                  />
                </Form.Item> */}
                <Form.Item
                  name="state"
                  label={messages.labels.state}
                  className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-form-item-label]:font-normal [&_.ant-select-selection-item]:!pr-6"
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
                    className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg 
                   [&_.ant-input]:!h-[3.25rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input]:!text-white [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0
                        [&_.ant-input-affix-wrapper-lg]:!pl-4"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="postal_code"
                  label={messages.labels.zipCode}
                  className="[&_.ant-input-group-addon]:!w-[5rem] [&_.ant-select-selection-item]:!pr-6"
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
                    className="font-medium [&_.ant-input]:!rounded-tl-lg [&_.ant-input]:!rounded-bl-lg [&_.ant-input-group-addon]:!rounded-tr-lg [&_.ant-input-group-addon]:!rounded-br-lg 
                    [&_.ant-input]:!h-[3.25rem] [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input]:!pl-2.5 [&_.ant-input-affix-wrapper]:!rounded-tl-lg [&_.ant-input-affix-wrapper]:!rounded-bl-lg [&_.ant-input]:!text-white [&_.ant-input]:!text-base [&_.ant-input]:!font-normal [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select]:!my-0
                        [&_.ant-input-affix-wrapper-lg]:!pl-4"
                    maxLength={255}
                    disabled={postalCodeDisable}
                    autoComplete="off"
                    defaultValue={publicOrPrivate("postal_code")}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Title level={4} className="form-Title">
              Other Information
            </Title> */}
            {/* <Row gutter={30}>
              <Col md={12}>
                <Form.Item name="language" label={messages.labels.language}>
                  <Select
                    id="selectLanguage"
                    size="large"
                    placeholder="Select a language"
                    tabIndex={10}
                    showSearch
                    optionFilterProp="children"
                  >
                    {listOfOption(languageList, "languages")}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="default_algo"
                  label={messages.labels.chooseAlgorithm}
                >
                  <Select
                    id="algorithms"
                    size="large"
                    placeholder={messages.placeholders.algorithm}
                    tabIndex={11}
                    showSearch
                    optionFilterProp="children"
                  >
                    {listOfOption(algorithmList, "algorithms")}
                  </Select>
                </Form.Item>
              </Col>
            </Row> */}
          </div>
          <Form.Item className="!flex-col flex items-center lg:flex-row md:flex-row sm:flex-row xs:flex-col justify-center   [&_.ant-form-item-control-input-content]:!flex lg:[&_.ant-form-item-control-input-content]:!flex-row lg:[&_.ant-form-item-control-input-content]:gap-5 mt-6 md:[&_.ant-form-item-control-input-content]:!flex-row [&_.ant-form-item-control-input-content]:!flex-col [&_.ant-form-item-control-input-content]:gap-2.5 md:[&_.ant-form-item-control-input-content]:!justify-center">
            <Button
              onClick={handleDiscard}
              disabled={afterSaveChangeDisable || isButtonDisabled}
              className="Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-12 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-[#98B7E6] bg-opacity-10 text-canBlack text-base font-medium rounded-lg border-canBlue justify-center "
            >
              Discard{" "}
              <Image
                src="/images/cross-dark.svg"
                width={16}
                height={16}
                alt="no image"
              />
            </Button>
            <Button
              onClick={() => {
                setAfterSaveChangeDisable(true);
              }}
              id="profileUpdate"
              type="primary"
              htmlType="submit"
              data-testid="submitButton"
              tabIndex={12}
              disabled={disableButton}
              className=" Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-6 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-canBlue text-white text-base font-medium rounded-lg border-none justify-center"
            >
              Save Changes{" "}
              <Image
                src="/images/save-icon.svg"
                width={24}
                height={24}
                alt="no image"
              />
            </Button>
          </Form.Item>
        </Form>
        <Modal
          open={open}
          onCancel={handleCancel}
          footer={null}
          closable={false}
        >
          <div className="modal_parent">
            <h3>
              {step === 2
                ? "Verify New Email Id"
                : step === 4
                ? "Success"
                : "Update Email Id"}
            </h3>
            <div className="otp-btn">
              {step === 1 ? (
                <div className="opt-btn-child">
                  <p>Please enter the OTP sent to your Registered Email ID</p>
                  <Input
                    placeholder="Enter OTP Code"
                    value={generatedOtp}
                    onChange={(e) => {
                      setGeneratedOtp(e?.target?.value);
                    }}
                  />
                </div>
              ) : step === 2 ? (
                <div className="opt-btn-child">
                  <p className="m-0 new-email-id">New Email ID</p>
                  <Input
                    placeholder="Enter New Email ID"
                    value={updatedEmail}
                    onChange={(e) => {
                      setUpdatedEmail(e?.target?.value);
                    }}
                  />
                </div>
              ) : step === 3 ? (
                <div className="opt-btn-child">
                  <p>Please enter the OTP sent to your New Email ID</p>
                  <Input
                    placeholder="Enter OTP Code"
                    value={newEmailOtp}
                    onChange={(e) => {
                      setNewEmailOtp(e?.target?.value);
                    }}
                  />
                </div>
              ) : step === 4 ? (
                <div className="last-step-modal">
                  <p>Your Email ID has been updated to</p>
                  <h3>{updatedEmail}</h3>
                </div>
              ) : (
                ""
              )}
              <Button onClick={handleClick}>
                {step === 3 ? "Submit" : step == 4 ? "Ok" : "Continue"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  else
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

export default ProfileInfoForm;
