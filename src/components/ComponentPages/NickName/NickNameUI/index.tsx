import { Table, Input, Select, Form, Modal, Tooltip, Radio } from "antd";
import { DownOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import Image from "next/image";

import messages from "src/messages";
import CustomSkelton from "components/common/customSkelton";
import SectionHeading from "components/ComponentPages/Home/FeaturedTopic/sectionsHeading";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import { setDefaultNickname } from "src/network/api/userApi";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";
import { useState } from "react";

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
  fetchNickNameList = () => {},
  isChecked,
  setIsChecked = false,
}: any) {
  const pageSizeLength = 10;
  const isDisable = addEditBtn == "Update";
  const [loadingStates, setLoadingStates] = useState({});

  const updateDefaultNickname = async (record, setCancelDisabled) => {
    setLoadingStates((prev) => ({ ...prev, [record.id]: true }));
    setCancelDisabled(true);

    const payload = { nick_name_id: record.id };
    try {
      const res = await setDefaultNickname(payload);
      if (res && res.status_code === 200) {
        openNotificationWithIcon(
          `${res?.data?.nick_name} has been successfully set as the default.`,
          "success"
        );
        fetchNickNameList();
      }
    } catch (error) {
      console.error("Error setting default nickname:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [record.id]: false }));
      setCancelDisabled(false);
    }
  };

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
      title: "Default",
      dataIndex: "default",
      width: "20%",
      render: (text, record) => (
        <Radio
          className="nick-radio"
          checked={record?.default > 0}
          onClick={() => {
            if (record?.default === 0) {
              let cancelDisabled = false;
              Modal.confirm({
                title: "Are you sure?",
                content: `Are you sure you want to set "${record?.nick_name}" as the default nickname?`,
                okText: "Yes",
                cancelText: "No",
                okButtonProps: { loading: loadingStates[record.id] },
                cancelButtonProps: { disabled: cancelDisabled },
                onOk: () =>
                  updateDefaultNickname(record, (value) => {
                    cancelDisabled = value;
                  }),
              });
            }
          }}
        >
          {record?.default > 0 ? "Default" : "Set as default"}
        </Radio>
      ),
    },
    {
      title: "Visibility",
      dataIndex: "private",
      className: "",
      width: "10%",
      render: (_, record) => (
        <Select
          id="nickname_status_select"
          defaultValue={record.private.toString()}
          size="large"
          onChange={(value) => chnageVisibilityStatus(value, record)}
          className="!w-[80px] [&_.ant-select-selector]:!h-[40px] [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!justify-center [&_.ant-select-arrow]:!right-5 [&_.ant-select-selector]:!bg-canGray [&_.ant-select-selector]:!border-l [&_.ant-select-selector]:!border-r-0 [&_.ant-select-selector]:!border-t-0 [&_.ant-select-selector]:!border-b-0 [&_.ant-select-selector]:!border-canGrey2  [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!w-5 [&_.ant-select-selection-item]:!h-5
      [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center"
          suffixIcon={<DownOutlined className="text-canBlack" />}
          popupClassName="nickNamePopup"
        >
          <Option value="0" id="nickname_status_option">
            <Tooltip
              title="Public"
              placement="left"
              id="nickname_status_option_public_tooltip"
            >
              <Image
                src="/images/globe-icon-2.svg"
                width={14}
                height={14}
                alt=""
                id="nickname_public_icon"
              />
            </Tooltip>
          </Option>
          <Option value="1">
            <Tooltip
              title="Private"
              placement="left"
              id="nickname_status_option_private_tooltip"
            >
              <Image
                src="/images/nickname-lock-icon.svg"
                width={12}
                height={12}
                alt=""
                id="nickname_private_icon"
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
        id="nickname_loader"
      />
    );
  }

  return (
    <section id="nickname_section">
      <SectionHeading title="NICKNAMES" icon={null} />
      <p className="mt-1 mb-5 text-sm font-normal " id="nickanme_note">
        Note: You can’t edit or delete your nickname once created. You can only
        manage its visibility status.
      </p>
      <Form form={nickNameForm} component={false} id="nickname_form_section">
        <Form.Item className="!mb-0" id="form_for_nickname">
          <Table
            id="nickanme_table"
            dataSource={nickNameList}
            columns={columns}
            rowClassName="editable-row"
            scroll={{
              x: "inherit",
            }}
            pagination={{ pageSize: pageSizeLength }}
          />
        </Form.Item>
        <Form.Item id="form_for_nickname_secondry_btn">
          <SecondaryButton
            onClick={handleAddNickName}
            type="primary"
            style={{ marginBottom: 16 }}
            className="flex gap-2.5 items-center justify-center h-auto"
            id="nickname_secondry_btn"
          >
            {messages.labels.addnewNickName}
            <PlusOutlined id="nickname_secondry_btn_plusoutlined" />
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
          id="nickname_modal_form"
          name="add_edit_form"
          form={add_edit_form}
          onFinish={onAddUpdateNickName}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            id="form_for_nickanme_modal"
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
                message: "Please enter a nickname.",
              },
            ]}
          >
            <Input
              maxLength={50}
              data-testid="enterNickName"
              id="nickname_input"
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
            id="form_for_nickname_visibiluty_status"
            name="visibility_status"
            label={messages.labels.visibilityStatus}
            className="text-sm text-canBlack font-normal [&_label]:text-sm [&_label]:font-medium [&_.ant-form-item-explain-error]:mb-6"
          >
            <Select
              id="nickname_select_tag"
              defaultValue="0"
              size="large"
              className="text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack"
            >
              <Option value="0" id="nickname_option">
                <Tooltip title="Public" id="publuc_option">
                  Public
                </Tooltip>
              </Option>
              <Option value="1">
                <Tooltip title="Private" id="private_option">
                  Private
                </Tooltip>
              </Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Radio onClick={() => setIsChecked(!isChecked)} checked={isChecked}>
              Set as default
            </Radio>
          </Form.Item>
          <Form.Item>
            <PrimaryButton
              id="nickname_add_edit_btn"
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
