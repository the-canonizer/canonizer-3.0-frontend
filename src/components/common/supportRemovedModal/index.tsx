import { useState, Fragment, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useSelector } from "react-redux";

import classes from "./support-removed-modal.module.scss";
import messages from "src/messages";
import { RootState } from "src/store";
import Image from "next/image";
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
  onKeyUp = (_) => { },
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
                <span className="text-sm font-normal text-canBlack">
                {isOrderChange ? labels.reasonChangeLabel : labels.reasonLabel}
              </span>
              }
              name="reason"
              {...removedReasonSelectRule}
            >
              <div className="select-wrapper relative">
                <span className="select-icon absolute top-4  left-3 z-10">
                  <Image

                    src="/images/preference-icon.svg"
                    alt="icon"
                    width={20}
                    height={14}

                  />
                </span>

                <Select
                  suffixIcon={<Image

                    src="/images/caret-icon.svg"
                    alt="icon"
                    width={14}
                    height={18}

                  />}
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
                  className="[&_.ant-select-selection-item]:!text-canLightWhite [&_.ant-select-arrow]:!right-4 w-full lg:!w-1/2 [&_.ant-select-selector]:!h-[3.25rem] [&_.ant-select-selector]:!pl-10 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-canGrey2 [&_.ant-select-selector]:!border"
                >
                  <Option key="select" value={null}>
                  Select reason from list
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
              </div>

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
              label={<span className="text-sm font-normal text-canBlack">
                {labels.resonURLLabel}
              </span>}
              name="citation_link"
              {...removedURLRule}
            >
              <Input

                placeholder={placeholders.campURL}
                size={"large"}
                maxLength={255}
                onKeyUp={onKeyUp}
                className="h-[3.25rem]  !rounded-lg !border-canGrey2 !border"
                prefix={<Image src="/images/link-icon.svg" alt="" width={24} height={24} />}
              />
            </Form.Item>
          </Col>
        </Row>

        {!isAdd && (
          <div className="lg:py-20 py-6 ">
            <div className="flex items-center justify-center gap-5 lg:flex-row flex-col">


              {/* <Button
              type="primary"
              htmlType="button"
              size={"large"}
              className={`${classes.cancel_btn}`}
              onClick={handleCancel}
              id="cancel-btn"
            >
              Cancel
            </Button> */}
              <Button
                className="Profile_btn ant-btn ant-btn-orange ant-btn-lg hover:text-canBlack flex gap-2.5 items-center bg-btnBg bg-opacity-10 hover:!bg-btnBg hover:!bg-opacity-10 text-canBlack text-base font-medium rounded-lg border-canBlue hover:border-canBlue justify-center w-[12.5rem] active:bg-btnBg active:bg-opacity-10 active:border-canBlue active:text-canBlack"

                type="primary"
                htmlType="button"
                size={"large"}

                onClick={handleCancel}
                id="cancel-btn">
                Cancel
                <Image
                  src="/images/cross-dark.svg"
                  width={16}
                  height={16}
                  alt="no image"
                />
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size={"large"}
                className=" Profile_btn ant-btn ant-btn-orange ant-btn-lg w-[12.5rem] hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-canBlue text-white text-base font-medium rounded-lg border-none justify-center focus:bg-canBlue focus:!text-white active:bg-canBlue"
                id="create-topic-btn"
              >
                {isOrderChange ? "Submit" : <span className="!flex items-center justify-center gap-2.5">Remove Support  <Image
                  src="/images/remove-icon-white.svg"
                  width={24}
                  height={24}
                  alt="no image"
                /> </span>}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </Fragment>
  );
};

export default SupportRemovedModal;
