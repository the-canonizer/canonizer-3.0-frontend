import { Table, Input, Select, Form, Modal, Tooltip } from "antd";
import { DownOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import Image from "next/image";

import messages from "src/messages";
import CustomSkelton from "components/common/customSkelton";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const { Option } = Select;

function NickNameUI({
  add_edit_form,
  addEditBtn,
  addEditTitle,
  isNickNameModalVisible,
  nickNameForm,
  handleAddNickName,
  handleNickNameCancel,
  onAddUpdateNickName,
  nickNameList,
  disableButton,
  getNickNamesLoadingIndicator,
  chnageVisibilityStatus,
}) {
  const pageSizeLength = 10;
  const isDisable = addEditBtn == "Update";

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
    },
    {
      title: "Nicknames",
      dataIndex: "nick_name",
      width: "40%",
      render: (text, record) => <div className="flex gap-4">{text}</div>,
    },
    {
      title: "Visibility",
      dataIndex: "private",
      className: "",
      width: "20%",
      render: (_, record) => (
        <Select
          defaultValue={record.private.toString()}
          size="large"
          onChange={(value) => chnageVisibilityStatus(value, record)}
          className="!w-[80px] [&_.ant-select-selector]:!h-[40px] [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!justify-center [&_.ant-select-arrow]:!right-5 [&_.ant-select-selector]:!bg-canGray [&_.ant-select-selector]:!border-l [&_.ant-select-selector]:!border-r-0 [&_.ant-select-selector]:!border-t-0 [&_.ant-select-selector]:!border-b-0 [&_.ant-select-selector]:!border-canGrey2  [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!w-5 [&_.ant-select-selection-item]:!h-5
      [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center"
          suffixIcon={<DownOutlined className="text-canBlack" />}
          popupClassName="nickNamePopup"
        >
          <Option value="0">
            <Tooltip title="Public" placement="left">
              <Image
                src="/images/globe-icon-2.svg"
                width={14}
                height={14}
                alt=""
              />
            </Tooltip>
          </Option>
          <Option value="1">
            <Tooltip title="Private" placement="left">
              <Image
                src="/images/nickname-lock-icon.svg"
                width={12}
                height={12}
                alt=""
              />
            </Tooltip>
          </Option>
        </Select>
      ),
    },
  ];

  if (getNickNamesLoadingIndicator) {
    return (
      <CustomSkelton
        skeltonFor="table"
        bodyCount={5}
        stylingClass=""
        isButton={false}
      />
    );
  }

  return (
    <section>
      <SectionHeading title="NICKNAMES" icon={null} />
      <p className="mt-1 mb-5 text-sm font-normal text-canBlack">
        Note: You can’t edit or delete your nickname once created. You can only
        manage its visibility status.
      </p>
      <Form form={nickNameForm} component={false}>
        <Form.Item className="!mb-0">
          <Table
            id="nickNameList"
            dataSource={nickNameList}
            columns={columns}
            rowClassName="editable-row"
            pagination={{ pageSize: pageSizeLength }}
          />
        </Form.Item>
        <Form.Item>
          <SecondaryButton
            onClick={handleAddNickName}
            type="primary"
            style={{ marginBottom: 16 }}
            className="flex gap-2.5 items-center justify-center h-auto"
          >
            {messages.labels.addnewNickName}
            <PlusOutlined />
          </SecondaryButton>
        </Form.Item>
      </Form>

      <Modal
        title={addEditTitle}
        visible={isNickNameModalVisible}
        footer=""
        onCancel={handleNickNameCancel}
        width={400}
        data-testid="addnicknamemodal"
      >
        <Form
          name="add_edit_form"
          form={add_edit_form}
          onFinish={onAddUpdateNickName}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="nick_name"
            label={
              <>
                {messages.labels.nickName}
                <span className="required" id="asteriskNickName">
                  *
                </span>
              </>
            }
            {...messages.nickNameRule}
            className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
            rules={[
              {
                required: true,
                message: 'Please enter a nickname.',
              },
              {
                pattern: /^[a-zA-Z0-9 ]*$/, // Allow only alphanumeric characters and spaces
                message: 'Nickname should not contain special characters.',
              },
            ]}
          >
            <Input
              maxLength={50}
              data-testid="enterNickName"
              id="enterNickName"
              placeholder="Enter Nickname"
              value=""
              size="large"
              disabled={isDisable}
              onKeyDown={(e) =>
                e.key === " " && e.keyCode === 32 && e.preventDefault()
              }
              className="text-canBlack font-normal h-[40px] rounded-md [&_.ant-input-prefix]:!text-canBlack [&_.ant-input-prefix]:mr-3 text-sm mainInput"
            />
          </Form.Item>
          <Form.Item
            name="visibility_status"
            label={messages.labels.visibilityStatus}
            className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
          >
            <Select
              defaultValue="0"
              size="large"
              className="text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack"
            >
              <Option value="0">
                <Tooltip title="Public">Public</Tooltip>
              </Option>
              <Option value="1">
                <Tooltip title="Private">Private</Tooltip>
              </Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <PrimaryButton
              id="addEditBtn"
              htmlType="submit"
              data-testid="submitButton"
              className="h-auto w-auto flex items-center justify-center"
              style={{
                width: "100%",
              }}
              disabled={disableButton}
            >
              {addEditBtn}
              <SaveOutlined />
            </PrimaryButton>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

export default NickNameUI;
