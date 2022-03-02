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
} from "antd";
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
  address
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
        <Title level={4}>Personal information</Title>
        <div className={styles.section_two}>
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item
                name="first_name"
                label={messages.labels.firstName}
                {...messages.firstNameRule}
              >
                <Input
                  addonAfter={selectAfter(
                    "first_name",
                    publicOrPrivate("first_name")
                  )}
                  placeholder={messages.placeholders.firstName}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="last_name"
                label={messages.labels.lastName}
                {...messages.lastNameRule}
              >
                <Input
                  addonAfter={selectAfter(
                    "last_name",
                    publicOrPrivate("last_name")
                  )}
                  placeholder={messages.placeholders.lastName}
                />
              </Form.Item>
              <Form.Item name="gender" label={messages.labels.gender}>
                <Radio.Group name="radiogroup" defaultValue={1}>
                  <Radio value={0}>Male</Radio>
                  <Radio value={1}>Female</Radio>
                  <Radio value={2}>Other</Radio>
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
                  addonAfter={selectAfter(
                    "middle_name",
                    publicOrPrivate("middle_name")
                  )}
                  placeholder={messages.placeholders.middleName}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={messages.labels.email}
                {...messages.emailRule}
              >
                <Input
                  addonAfter={selectAfter("email", publicOrPrivate("email"))}
                  placeholder={messages.placeholders.email}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="birthday"
                label="Date of Birth"
                {...messages.dobRule}
              >
                <DatePicker size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Title level={4}>Address information</Title>
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item name="address_1" label={messages.labels.addressLine1}>
                <div>
                  <PlacesAutocomplete
                    value={address}
                    onChange={handleAddressChange}
                    onSelect={handleAddressSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <Input
                          addonAfter={selectAfter(
                            "address_1",
                            publicOrPrivate("address_1")
                          )}
                          placeholder={messages.placeholders.addressLine1}
                          size="large"
                          {...getInputProps({
                            placeholder: messages.placeholders.addressLine1,
                          })}
                        />
                        <div>
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion, index) => {
                            const style = suggestion.active
                              ? { backgroundColor: "#f8f8f8", cursor: "pointer" }
                              : { backgroundColor: "#ffffff", cursor: "pointer" };

                            return (
                              <div {...getSuggestionItemProps(suggestion, { style })} key={index}>
                                {suggestion.description}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
              </Form.Item>
              <Form.Item name="city" label={messages.labels.city}>
                <Input
                  addonAfter={selectAfter("city", publicOrPrivate("city"))}
                  placeholder={messages.placeholders.city}
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item name="country" label={messages.labels.country}>
                <Input
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
                <Select size="large" placeholder="Select a language">
                  {listOfOption(languageList, "languages")}
                </Select>
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item name="address_2" label={messages.labels.addressLine2}>
                <Input
                  addonAfter={selectAfter(
                    "address_2",
                    publicOrPrivate("address_2")
                  )}
                  placeholder={messages.placeholders.addressLine2}
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item name="state" label={messages.labels.state}>
                <Input
                  addonAfter={selectAfter("state", publicOrPrivate("state"))}
                  placeholder={messages.placeholders.state}
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item name="postal_code" label={messages.labels.zipCode}>
                <Input
                  addonAfter={selectAfter(
                    "postal_code",
                    publicOrPrivate("postal_code")
                  )}
                  placeholder={messages.placeholders.zipCode}
                  size="large"
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="default_algo"
                label={messages.labels.chooseAlgorithm}
              >
                <Select
                  size="large"
                  placeholder={messages.placeholders.algorithm}
                >
                  {listOfOption(algorithmList, "algorithms")}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="ant-btn ant-btn-orange ant-btn-lg"
            data-testid="submitButton"
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    );
  else return <div>Loading...</div>;
}

export default ProfileInfoForm;
