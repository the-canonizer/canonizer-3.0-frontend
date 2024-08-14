import { useState } from "react";
import { Table, Input, Select, Form, Typography, Button, Modal } from "antd";
import Icon, { PlusCircleOutlined } from "@ant-design/icons";
import styles from "./NickName.module.scss";
import messages from "../../../../messages";
import CustomSkelton from "../../../common/customSkelton";
import Image from "next/image";

const { Option } = Select;

export default function NickNameUI({
  add_edit_form,
  addEditBtn,
  addEditTitle,
  isNickNameModalVisible,
  editNickName,
  nickNameForm,
  handleAddNickName,
  handleNickNameCancel,
  onAddUpdateNickName,
  nickNameList,
  disableButton,
  getNickNamesLoadingIndicator,
  chnageVisibilityStatus,
}: any) {
  const pageSizeLength = 10;
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(10);
  const isDisable = addEditBtn == "Update";
  const columns = [
    // {
    //   title: "Sr.No.",
    //   dataIndex: "srNo",
    //   width: "5%",
    //   render: (text, record, index) => (page - 1) * paginationSize + index + 1,
    // },
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
     
      
    },
    {
      title: "Nicknames",
      dataIndex: "nick_name",
      width: "40%",
      render: (text, record) => (
       
        <div className="flex gap-4">
        <Image className="mr-4" src="/images/nickname-user-icon.svg" width={14} height={16} alt="" />
        {text}
        </div>
       
        
      ),
    },
    {
      title: "",
      dataIndex: "private",
      width: "20%",
      render: (text, record) => (
        <Select
          defaultValue={record.private.toString()}
          size="large"
          onChange={(value) => chnageVisibilityStatus(value, record)}
          className=" !w-24 [&_.ant-select-selector]:!h-12 !float-right [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!justify-center [&_.ant-select-arrow]:!right-5 [&_.ant-select-selector]:!bg-canGray [&_.ant-select-selector]:!border-l [&_.ant-select-selector]:!border-r-0 [&_.ant-select-selector]:!border-t-0 [&_.ant-select-selector]:!border-b-0 [&_.ant-select-selector]:!border-canGrey2  [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!w-5 [&_.ant-select-selection-item]:!h-5
      [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center"
          suffixIcon={
            <Image src="/images/caret-icon.svg" width={16} height={9} alt="" />
          }
        >
          <Option value="0"> <Image src="/images/globe-icon-2.svg" width={16} height={16} alt="" /></Option>
          <Option value="1"><Image src="/images/nickname-lock-icon.svg" width={14} height={16} alt="" /></Option>
        </Select>
      ),
    },
    // {
    //   title: "",
    //   dataIndex: "operation",
    //   width: "10%",
    //   className: "min-60",
    //   render: (_, record) => {
    //     return (
    //       <Typography.Link onClick={() => editNickName(record)}>
    //         edit
    //       </Typography.Link>
    //     );
    //   },
    // },
    // {
    //   title:"",
    //   dataIndex:"",
    //   width:"10%",
    //   render:(value)=>{
    //     return(
    //       <Form.Item>
    //       <Select defaultValue="0" size="large" onChange={chnageVisibilityStatus}>
    //         <Option value="0">Public</Option>
    //         <Option value="1">Private</Option>
    //       </Select>
    //     </Form.Item>
    //     )
    //   }

    // }
  ];

  return getNickNamesLoadingIndicator ? (
    <CustomSkelton
      skeltonFor="table"
      bodyCount={5}
      stylingClass=""
      isButton={false}
    />
  ) : (
    <>
      <section className={styles.nick_name}>
        <h3 className="uppercase text-canBlack font-semibold text-base">NICKNAMES</h3>
        <p className="my-5 text-sm font-normal text-canBlack">Note: You can’t edit or delete your nickname once created. You can only manage its visibility status.</p>
        <Form form={nickNameForm} component={false}>
          <Form.Item className={styles.nick_form}>
            <Table
              id="nickNameList"
              dataSource={nickNameList}
              columns={columns}
              rowClassName="editable-row"
              pagination={{
                onChange(current, pageSize) {
                  setPage(current);
                  setPaginationSize(pageSize);
                },
                pageSize: pageSizeLength,
              }}
              // className={"NickName_TableHead"}
              className=""
            />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={handleAddNickName}
              type="primary"
              style={{
                marginBottom: 16,
              }}
              className=" ant-btn-lg py-2.5 px-6  flex gap-2.5 items-center bg-btnBg bg-opacity-10 text-canBlack text-base font-medium rounded-lg justify-center border border-canBlue"
            >
              {messages.labels.addnewNickName}
              <Image src="/images/plus-Icon.svg" width={24} height={24} alt=""/>
              {/* <Icon component={() => <PlusCircleOutlined />} /> */}
            </Button>
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
              />
            </Form.Item>
            <Form.Item
            
              name="visibility_status"
              label={messages.labels.visibilityStatus}
            >
              <Select defaultValue="0" size="large">
                <Option value="0">Public</Option>
                <Option value="1">Private</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                id="addEditBtn"
                type="primary"
                htmlType="submit"
                data-testid="submitButton"
                className="ant-btn ant-btn-orange ant-btn-lg"
                style={{
                  width: "100%",
                }}
                disabled={disableButton}
              >
                {addEditBtn}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </>
  );
}
