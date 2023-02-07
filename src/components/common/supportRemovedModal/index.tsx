import { useState, Fragment, useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";

import classes from "./support-removed-modal.module.scss";
import messages from "src/messages";
import { RootState } from "src/store";
import { hideRemoveSupportModal } from "src/store/slices/uiSlice";
import { setReasonData } from "src/store/slices/utilsSlice";

const { labels, removedReasonRule, removedURLRule, placeholders } = messages;

const SupportRemovedModal = ({ onFinish, handleCancel, form }) => {
  // const { isModalOpen } = useSelector((state: RootState) => ({
  //   isModalOpen: state.ui.remove_support_modal,
  // }));

  // const [open, setOpen] = useState(isModalOpen);

  // const dispatch = useDispatch();
  // const [form] = Form.useForm();

  // useEffect(() => setOpen(isModalOpen), [isModalOpen]);

  // const handleCancel = () => {
  //   dispatch(hideRemoveSupportModal());
  // };

  // const onFinish = async (values: any) => setReasonData(values);

  return (
    <Fragment>
      {/* <Modal title="Reason for support end!" open={open} footer={null}> */}
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
              className={classes.edit_summary_input}
              label={
                <Fragment>
                  {labels.reasonLabel}
                  <span className="required">*</span>
                </Fragment>
              }
              name="end_reason"
              {...removedReasonRule}
            >
              <Input.TextArea rows={5} placeholder={placeholders.editSummary} />
            </Form.Item>
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
      {/* </Modal> */}
    </Fragment>
  );
};

export default SupportRemovedModal;
