import { useState, Fragment, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useSelector } from "react-redux";

import classes from "./support-removed-modal.module.scss";
import messages from "src/messages";
import { RootState } from "src/store";
import { getAllRemovedReasons } from "src/network/api/campDetailApi";

const {
  labels,
  removedReasonRule,
  removedURLRule,
  placeholders,
  removedReasonSelectRule,
} = messages;
const { Option } = Select;

const SupportRemovedModal = ({
  onFinish,
  handleCancel,
  form,
  isAdd = false,
  isOrderChange = false,
  onKeyUp = (_) => {},
}: any) => {
  const reasons = useSelector(
    (state: RootState) => state?.topicDetails?.removedReasons
  );

  const [selectedValue, setSelectedValue] = useState(null);
  const [availableReasons, setReasons] = useState(reasons);

  const getReasons = async () => {
    await getAllRemovedReasons();
  };

  useEffect(() => {
    getReasons();
  }, []);

  useEffect(() => {
    setReasons(reasons);
  }, [reasons]);

  const onSelectChange = (value) => {
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
                  {isOrderChange
                    ? labels.reasonChangeLabel
                    : labels.reasonLabel}
                </Fragment>
              }
              name="reason"
              {...removedReasonSelectRule}
            >
              <Select
                placeholder={labels.reasonLabel}
                allowClear
                size={"large"}
                defaultValue={null}
                data-id="reason-name"
                showSearch
                optionFilterProp="children"
                onChange={onSelectChange}
                getPopupContainer={(triggerNode) => {
                  return triggerNode.parentNode;
                }}
                onSelect={onKeyUp}
              >
                <Option key="select" value={null}>
                  Select reason
                </Option>
                {availableReasons?.map((res) => (
                  <Option key={res.id} value={res.reason}>
                    {res.label}
                  </Option>
                ))}
                <Option key="custom_reason" value="Custom reason">
                  Custom reason
                </Option>
              </Select>
            </Form.Item>
            {selectedValue == "Custom reason" && (
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
                  data-testid="supportremoval"
                  placeholder={placeholders.editSummary}
                  onKeyUp={onKeyUp}
                />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              label={<Fragment>{labels.resonURLLabel}</Fragment>}
              name="citation_link"
              {...removedURLRule}
            >
              <Input
                placeholder={placeholders.campURL}
                size={"large"}
                maxLength={255}
                onKeyUp={onKeyUp}
              />
            </Form.Item>
          </Col>
        </Row>

        {!isAdd && (
          <div className={classes.btn_box}>
            <Button
              type="primary"
              htmlType="submit"
              size={"large"}
              className={`${classes.submit_btn}`}
              id="create-topic-btn"
            >
              {isOrderChange ? "Submit" : "Remove"}
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
        )}
      </Form>
    </Fragment>
  );
};

export default SupportRemovedModal;
