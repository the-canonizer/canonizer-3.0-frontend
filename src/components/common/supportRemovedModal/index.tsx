import { useState, Fragment } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";

import classes from "./support-removed-modal.module.scss";
import messages from "src/messages";

const {
  labels,
  removedReasonRule,
  removedURLRule,
  placeholders,
  removedReasonSelectRule,
} = messages;
const { Option } = Select;

const SupportRemovedModal = ({ onFinish, handleCancel, form }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const reasons = [
    { id: 1, label: "Reason 1" },
    { id: 2, label: "Reason 2" },
    { id: 3, label: "Other" },
  ];

  const onSelectChange = (value, option) => {
    setSelectedValue(value);
  };

  return (
    <Fragment>
      <Form
        form={form}
        onFinish={onFinish}
        name="removed_support_form"
        className={classes.modalForm}
        layout={"vertical"}
        autoComplete="off"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <Form.Item
              label={
                <Fragment>
                  {labels.reasonLabel}
                  <span className="required">*</span>
                </Fragment>
              }
              name="end_reason"
              {...removedReasonSelectRule}
            >
              <Select
                placeholder={placeholders.nickName}
                allowClear
                size={"large"}
                defaultValue={null}
                data-id="reason-name"
                showSearch
                optionFilterProp="children"
                onChange={onSelectChange}
              >
                <Option key="select" value={null}>
                  Select
                </Option>
                {reasons.map((nick) => (
                  <Option key={nick.id} value={nick.id}>
                    {nick.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedValue == 3 && (
              <Form.Item
                className={classes.edit_summary_input}
                label={
                  <Fragment>
                    {labels.reasonLabelSummary}
                    <span className="required">*</span>
                  </Fragment>
                }
                name="reason_summary"
                {...removedReasonRule}
              >
                <Input.TextArea
                  rows={5}
                  placeholder={placeholders.editSummary}
                />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              label={<Fragment>{labels.resonURLLabel}</Fragment>}
              name="end_reason_link"
              {...removedURLRule}
            >
              <Input
                placeholder={placeholders.campURL}
                size={"large"}
                maxLength={30}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className={classes.btn_box}>
          <Button
            type="primary"
            htmlType="submit"
            size={"large"}
            className={`${classes.submit_btn}`}
            id="create-topic-btn"
          >
            Remove
          </Button>

          <Button
            type="primary"
            htmlType="button"
            size={"large"}
            className={`${classes.cancel_btn}`}
            onClick={handleCancel}
            id="cancel-btn"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default SupportRemovedModal;
