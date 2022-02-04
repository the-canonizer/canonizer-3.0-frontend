import { Row, Col, Typography, Form, Input, Button, Select, DatePicker, Radio } from "antd";
import styles from "../ProfileInfo/ProfileInfoUI/ProfileInfo.module.scss";
import messages from "../../../messages";

const { Title } = Typography;
const { Option } = Select;

function ProfileInfoForm({
  form,
  onFinish,
  onFinishFailed,
  handleselectAfter,
  privateFlags,
  algorithmList }) {

  let algorithms = algorithmList.length > 0
    && algorithmList.map((item, i) => {
      return (
        <Option key={item.algorithm_key} value={item.algorithm_key} >{item.algorithm_label}</Option>
      )
    });
  const selectAfter = (val, prvtPblc) => {
    if (privateFlags != undefined)
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
      <Title level={4} >
        Personal information
      </Title>
      <div className={styles.section_two}>
        <Row gutter={30}>
          <Col md={12}>
            <Form.Item
              name="first_name"
              label={messages.labels.firstName}
              {...messages.firstNameRule}
            >
              <Input addonAfter={selectAfter("first_name", (privateFlags.includes('first_name') ? "private" : "public"))} placeholder={messages.placeholders.firstName} size="large" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label={messages.labels.lastName}
              {...messages.lastNameRule}
            >
              <Input addonAfter={selectAfter("last_name", (privateFlags.includes('last_name') ? "private" : "public"))} placeholder={messages.placeholders.lastName} />
            </Form.Item>
            <Form.Item
              name="gender"
              label={messages.labels.gender}
            >
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
              <Input addonAfter={selectAfter("middle_name", (privateFlags.includes('middle_name') ? "private" : "public"))} placeholder={messages.placeholders.middleName} size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              label={messages.labels.email}
              {...messages.emailRule}
            >
              <Input addonAfter={selectAfter("email", (privateFlags.includes('email') ? "private" : "public"))} placeholder={messages.placeholders.email} size="large" />
            </Form.Item>
            <Form.Item name="birthday" label="Date of Birth" {...messages.dobRule}>
              <DatePicker size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Title level={4} >
          Address information
        </Title>
        <Row gutter={30}>
          <Col md={12}>
            <Form.Item
              name="address_1"
              label={messages.labels.addressLine1}
            >
              <Input addonAfter={selectAfter("address_1", (privateFlags.includes('address_1') ? "private" : "public"))} placeholder={messages.placeholders.addressLine1} size="large" />
            </Form.Item>
            <Form.Item
              name="city"
              label={messages.labels.city}
            >
              <Input addonAfter={selectAfter("city", (privateFlags.includes('city') ? "private" : "public"))} placeholder={messages.placeholders.city} size="large" />
            </Form.Item>
            <Form.Item
              name="country"
              label={messages.labels.country}
            >
              <Input addonAfter={selectAfter("country", (privateFlags.includes('country') ? "private" : "public"))} placeholder={messages.placeholders.country} size="large" />
            </Form.Item>
            <Form.Item
              name="language"
              label={messages.labels.language}
            >
              <Select size="large" placeholder="Select a language">
                <Option value="English">English</Option>
                <Option value="Hindi">Hindi</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              name="address_2"
              label={messages.labels.addressLine2}
            >
              <Input addonAfter={selectAfter("address_2", (privateFlags.includes('address_2') ? "private" : "public"))} placeholder={messages.placeholders.addressLine2} size="large" />
            </Form.Item>
            <Form.Item
              name="state"
              label={messages.labels.state}
            >
              <Input addonAfter={selectAfter("state", (privateFlags.includes('state') ? "private" : "public"))} placeholder={messages.placeholders.state} size="large" />
            </Form.Item>
            <Form.Item
              name="postal_code"
              label={messages.labels.zipCode}
            >
              <Input addonAfter={selectAfter("postal_code", (privateFlags.includes('postal_code') ? "private" : "public"))} placeholder={messages.placeholders.zipCode} size="large" />
            </Form.Item>
            <Form.Item
              name="default_algo"
              label={messages.labels.chooseAlgorithm}
            >
              <Select size="large" placeholder={messages.placeholders.algorithm}>
               {algorithms}
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
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  );
  else
    return (
      <div>Loading...</div>
    )

}

export default ProfileInfoForm;
