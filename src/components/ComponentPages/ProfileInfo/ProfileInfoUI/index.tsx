import React from "react";
import { Row, Col, Typography, Form, Input, Button, Select, DatePicker, Radio } from "antd";
import styles from "./ProfileInfo.module.scss";
import messages from "../../../../messages";

const { Title, Text } = Typography;
const { Option } = Select;

function ProfileInfoUI() {

  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select time!',
      },
    ],
  };
  const selectAfter = (
    <Select defaultValue="private" className="select-after">
      <Option value="private">Private</Option>
      <Option value="public">Public</Option>
    </Select>
  );


  return (
    <section className={styles.profileInfo_wrapper}>
      <Form
        name="verifyNumber"
        initialValues={{ prefix: "+91" }}
        layout="vertical"
      >
        <div className={styles.section_one}>
          <Row gutter={30}>
            <Col md={12}>
              <Form.Item
                name="phoneNumber"
                label={messages.labels.phoneNumber}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Phone Number!',
                  },
                ]}
              >

                <Input placeholder={messages.placeholders.phoneNumber} size="large" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="mobileCarrier"
                label={messages.labels.mobileCarrier}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Mobile Carrier!',
                  },
                ]}
              >

                <Input placeholder={messages.placeholders.mobileCarrier} size="large"/>
              </Form.Item>
            </Col>
          </Row>
            <Button
              type="primary"
              htmlType="submit"
              className="ant-btn ant-btn-orange ant-btn-lg"
            >
              Verify
            </Button>
        </div>
      </Form>


      <Form
        name="profileInfo"

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
                rules={[
                  {
                    required: true,
                    message: messages.validations.firstName,
                  },
                  {
                    max: 100,
                    message: messages.validations.firstNameMax,
                  },
                ]}
              >

                <Input addonAfter={selectAfter} placeholder={messages.placeholders.firstName} size="large" />
              </Form.Item>
              <Form.Item
                name="last_name"
                label={messages.labels.lastName}
                rules={[
                  {
                    required: true,
                    message: messages.validations.lastName,
                  },
                  {
                    max: 100,
                    message: messages.validations.firstNameMax,
                  },
                ]}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.lastName} />
              </Form.Item>
              <Form.Item
                name="gender"
                label={messages.labels.gender}
                rules={[
                  {
                    required: true,
                    message: 'Please select gender!',
                  },
                ]}
              >
                <Radio.Group name="radiogroup" defaultValue={1}>
                  <Radio value={1}>Male</Radio>
                  <Radio value={2}>Female</Radio>
                  <Radio value={3}>Other</Radio>
                </Radio.Group>

              </Form.Item>

            </Col>
            <Col md={12}>
              <Form.Item
                name="middle_name"
                label={messages.labels.middleName}
                rules={[
                  {
                    max: 100,
                    message: messages.validations.middleName,
                  },
                ]}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.middleName} size="large" />
              </Form.Item>
              <Form.Item
                name="email"
                label={messages.labels.email}
                rules={[
                  {
                    type: "email",
                    message: messages.validations.email,
                  },
                  {
                    max: 255,
                    message: messages.validations.middleName,
                  },
                  {
                    required: true,
                    message: messages.validations.email,
                  },
                  {
                    pattern: messages.patterns.email,
                    message: messages.validations.validEmail,
                  },
                ]}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.email} size="large" />
              </Form.Item>
              <Form.Item name="date-picker" label="Date of Birth" {...config}>
                <DatePicker  size="large"/>
              </Form.Item>

            </Col>
          </Row>
          <Title level={4} >
            Address information
          </Title>
          <Row gutter={30}>

            <Col md={12}>

              <Form.Item
                name="addressline1"
                label={messages.labels.addressLine1}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.addressLine1} size="large" />
              </Form.Item>
              <Form.Item
                name="city"
                label={messages.labels.city}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.city} size="large" />
              </Form.Item>
              <Form.Item
                name="country"
                label={messages.labels.country}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.country} size="large" />
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
                name="addressline2"
                label={messages.labels.addressLine2}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.addressLine2} size="large" />
              </Form.Item>
              <Form.Item
                name="state"
                label={messages.labels.state}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.state} size="large" />
              </Form.Item>
              <Form.Item
                name="zipcode"
                label={messages.labels.zipCode}
              >
                <Input addonAfter={selectAfter} placeholder={messages.placeholders.zipCode} size="large"/>
              </Form.Item>
              <Form.Item
                name="algorithm"
                label={messages.labels.chooseAlgorithm}
              >
                <Select  size="large" placeholder="Select an algorithm">
                  <Option value="algo1">Algorithm 1</Option>
                  <Option value="algo2">Algorithm 2</Option>
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
    </section>
  );
}

export default ProfileInfoUI;
