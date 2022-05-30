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
import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";
import messages from "../../../messages";
import PlacesAutocomplete from "react-places-autocomplete";

const { Title } = Typography;
const { Option } = Select;

function ProfileInfoForm({
  form,
  onFinish,
  onFinishFailed,
  handleselectAfter,
  privateFlags,
  algorithmList,
  languageList,
  handleAddressChange,
  handleAddressSelect,
  address,
  disableButton,
}) {
  const listOfOption = (optionList, algoOrLang): any => {
    let option = [];
    optionList.length > 0 &&
      optionList.map((item, i) => {
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
        id="selectAddress_1"
        addonAfter={selectAfter("address_1", publicOrPrivate("address_1"))}
        placeholder={messages.placeholders.addressLine1}
        size="large"
        {...getInputProps({
          placeholder: messages.placeholders.addressLine1,
        })}
        tabIndex={9}
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
  // @ts-ignore
  if (privateFlags != "")
    return (
      <Form
        name="profileInfo"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        scrollToFirstError
      >
        <Title level={4} className="form-Title">
          Personal Information
        </Title>
        <div className={styles.section_two}>
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item
                name="first_name"
                label={messages.labels.firstName}
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
                    e.key === " " && e.keyCode === 32 && e.preventDefault()
                  }
                />
              </Form.Item>
              <Form.Item
                name="last_name"
                label={messages.labels.lastName}
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
                    e.key === " " && e.keyCode === 32 && e.preventDefault()
                  }
                />
              </Form.Item>
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
            <Col md={12}>
              <Form.Item
                name="middle_name"
                label={messages.labels.middleName}
                {...messages.middleNameRule}
              >
                <Input
                  id="middleName"
                  addonAfter={selectAfter(
                    "middle_name",
                    publicOrPrivate("middle_name")
                  )}
                  placeholder={messages.placeholders.middleName}
                  size="large"
                  tabIndex={5}
                  onKeyDown={(e) =>
                    e.key === " " && e.keyCode === 32 && e.preventDefault()
                  }
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={messages.labels.email}
                {...messages.emailRule}
              >
                <Input
                  id="email"
                  addonAfter={selectAfter("email", publicOrPrivate("email"))}
                  placeholder={messages.placeholders.email}
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item label="Date of Birth">
                <Input.Group compact className={styles.date_picker}>
                  <Form.Item
                    name="birthday"
                    {...messages.dobRule}
                    className={styles.date_picker_input_item}
                  >
                    <DatePicker
                      size="large"
                      tabIndex={8}
                      className={styles.date_picker_inner}
                      disabledDate={(current) => {
                        let customDate = moment().format("YYYY-MM-DD");
                        return (
                          current && current > moment(customDate, "YYYY-MM-DD")
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Select
                      size="large"
                      defaultValue={publicOrPrivate("birthday")}
                      onChange={handleselectAfter("birthday")}
                      className={styles.select_after}
                    >
                      <Option value="private">Private</Option>
                      <Option value="public">Public</Option>
                    </Select>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
          <Title level={4} className="form-Title">
            Address Information
          </Title>
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item name="address_1" label={messages.labels.addressLine1}>
                <div className="reactDropdown">
                  <PlacesAutocomplete
                    value={address}
                    onChange={handleAddressChange}
                    onSelect={handleAddressSelect}
                  >
                    {renderFuncForGooglePlaces}
                  </PlacesAutocomplete>
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
              <Form.Item name="language" label={messages.labels.language}>
                <Select
                  id="selectLanguage"
                  size="large"
                  placeholder="Select a language"
                  tabIndex={10}
                >
                  {listOfOption(languageList, "languages")}
                </Select>
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
                />
              </Form.Item>
              <Form.Item
                name="default_algo"
                label={messages.labels.chooseAlgorithm}
              >
                <Select
                  id="algorithms"
                  size="large"
                  placeholder={messages.placeholders.algorithm}
                  tabIndex={11}
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
            className="ant-btn ant-btn-orange ant-btn-lg"
            data-testid="submitButton"
            tabIndex={12}
            disabled={disableButton}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    );
  else return <div></div>;
}

export default ProfileInfoForm;
