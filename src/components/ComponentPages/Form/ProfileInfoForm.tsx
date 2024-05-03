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
} from "antd";
import moment from "moment";
import PlacesAutocomplete from "react-places-autocomplete";

import style from "./style.module.scss";

import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";
import messages from "../../../messages";
import CustomSkelton from "../../common/customSkelton";
import ImageUploader from "../../ComponentPages/ImageUploader";
import VerifyMobileNumber from "./VerifyMobileNumberForm";

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
}: any) {
  // eslint-disable-next-line no-unused-vars
  const [gmapsLoaded, setgmapsLoaded] = useState(false);
  useEffect(() => {
    setgmapsLoaded(true);
  }, []);
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
        className="select-after"
        onChange={handleselectAfter(val)}
      >
        <Option value="private">Private</Option>
        <Option value="public">Public</Option>
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

  // @ts-ignore
  if (privateFlags != "loading")
    return (
      <Form
        name="profileInfo"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        scrollToFirstError
        className="profileInfoPointer"
      >
        <Title level={4} className="form-Title">
          Personal Information
        </Title>
        <div className={style.profileCardWrapper}>
          <div className={style.imageWrapper}>
            <div id="upload-profile">
              <ImageUploader />
            </div>
          </div>
          <div className={style.profileInfo}>
            <Row gutter={40}>
              <Col md={12}>
                <Row>
                  <Col md={24}>
                    <Form.Item
                      name="first_name"
                      label={
                        <>
                          {messages.labels.firstName}
                          <span className="required" id="asteriskFirstName">
                            *
                          </span>
                        </>
                      }
                      {...messages.firstNameRule}
                    >
                      <Input
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
                  <Col md={24}>
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
                      {...messages.lastNameRule}
                    >
                      <Input
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
                  <Col md={24}>
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
                <Row>
                  <Col md={24}>
                    <Form.Item
                      name="email"
                      label={messages.labels.email}
                      {...messages.emailRule}
                    >
                      <Input
                        id="email"
                        addonAfter={selectAfter(
                          "email",
                          publicOrPrivate("email")
                        )}
                        placeholder={messages.placeholders.email}
                        size="large"
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col md={24}>
                    <Form.Item label="Date of Birth" className="mb-0">
                      <Input.Group compact className={styles.date_picker}>
                        <Form.Item
                          name="birthday"
                          className={styles.date_picker_input_item}
                        >
                          <DatePicker
                            size="large"
                            tabIndex={8}
                            className={styles.date_picker_inner}
                            disabledDate={(current) => {
                              let customDate = moment().format("YYYY-MM-DD");
                              return (
                                current &&
                                current > moment(customDate, "YYYY-MM-DD")
                              );
                            }}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Select
                            data-testid="handleselectAfter"
                            size="large"
                            defaultValue={publicOrPrivate("birthday")}
                            onChange={handleselectAfter("birthday")}
                            className={styles.select_after}
                            showSearch
                            optionFilterProp="children"
                          >
                            <Option value="private">Private</Option>
                            <Option value="public">Public</Option>
                          </Select>
                        </Form.Item>
                      </Input.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
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
          </div>
        </div>
        <div className={styles.section_two}>
          <Title level={4} className="form-Title">
            Address Information
          </Title>
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item name="address_1" label={messages.labels.addressLine1}>
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
              <Form.Item name="city" label={messages.labels.city}>
                <Input
                  id="selectCity"
                  addonAfter={selectAfter("city", publicOrPrivate("city"))}
                  placeholder={messages.placeholders.city}
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item name="country" label={messages.labels.country}>
                <Input
                  id="selectCountry"
                  addonAfter={selectAfter(
                    "country",
                    publicOrPrivate("country")
                  )}
                  placeholder={messages.placeholders.country}
                  size="large"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item name="address_2" label={messages.labels.addressLine2}>
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
              </Form.Item>
              <Form.Item name="state" label={messages.labels.state}>
                <Input
                  id="selectState"
                  addonAfter={selectAfter("state", publicOrPrivate("state"))}
                  placeholder={messages.placeholders.state}
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item name="postal_code" label={messages.labels.zipCode}>
                <Input
                  id="selectPostalCode"
                  addonAfter={selectAfter(
                    "postal_code",
                    publicOrPrivate("postal_code")
                  )}
                  placeholder={messages.placeholders.zipCode}
                  size="large"
                  maxLength={255}
                  disabled={postalCodeDisable}
                  autoComplete="off"
                  defaultValue={publicOrPrivate("postal_code")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Title level={4} className="form-Title">
            Other Information
          </Title>
          <Row gutter={30}>
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
          </Row>
        </div>
        <Form.Item>
          <Button
            id="profileUpdate"
            type="primary"
            htmlType="submit"
            className="Profile_btn ant-btn ant-btn-orange ant-btn-lg"
            data-testid="submitButton"
            tabIndex={12}
            disabled={disableButton}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
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
