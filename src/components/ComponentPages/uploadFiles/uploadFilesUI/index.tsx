import React from "react";
import { useState } from "react";
import {
  Card,
  Button,
  Upload,
  message,
  Modal,
  Input,
  Form,
  Menu,
  Dropdown,
  DatePicker,
} from "antd";
import {
  InboxOutlined,
  MenuOutlined,
  SearchOutlined,
  AppstoreOutlined,
  CloseCircleOutlined,
  FolderFilled,
  MoreOutlined,
  FolderOpenOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import styles from "./UploadFile.module.scss";
import { useRouter } from "next/router";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
  showFolderModal,
  hideFolderModal,
  showDrageBox,
  hideDrageBox,
  hideUploadOptions,
  showUploadOptions,
  hideAddButton,
  showAddButton,
  hideFileStatus,
  hideCrossBtn,
} from "../../../../store/slices/uiSlice";
const UploadFileUI = ({
  input,
  setInput,
  fileName,
  setfileName,
  selectedFolderID,
  fileLists,
  setFileLists,
  folderFiles,
  setFolderFiles,
  closeFolder,
  uploadFun,
  handleCancel,
  handle_X_btn,
  addNewFile,
  Openfolder,
  removeFiles,
  onFinish,
}) => {
  const [createFolderForm] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const visible = useSelector(
    (state: RootState) => state.ui.createFolderShowModal
  );
  const DrageBoxVisible = useSelector((state: RootState) => state.ui.dragBox);
  const disabledCreateFolder = useSelector(
    (state: RootState) => state.ui.disabledCreateFolderBtn
  );
  const show_UploadOptions = useSelector(
    (state: RootState) => state.ui.visibleUploadOptions
  );
  const afterUpload = useSelector((state: RootState) => state.ui.uploadAfter);
  const showFolder = useSelector((state: RootState) => state.ui.folderShown);
  const openFolder = useSelector((state: RootState) => state.ui.folderOpen);
  const AddButtonShow = useSelector((state: RootState) => state.ui.addButton);
  const fileStatus = useSelector((state: RootState) => state.ui.fileStatus);
  const showCrossBtn = useSelector((state: RootState) => state.ui.crossBtn);

  const showCreateFolderModal = () => dispatch(showFolderModal());
  const hideCreateFolderModal = () => dispatch(hideFolderModal());
  const DragBoxShow = () => dispatch(showDrageBox());
  const DragBoxHide = () => dispatch(hideDrageBox());
  const UploadOptionsHide = () => dispatch(hideUploadOptions());
  const UploadOptionsShow = () => dispatch(showUploadOptions());
  const hideButtonAdd = () => dispatch(hideAddButton());
  const shownAddButton = () => dispatch(showAddButton());
  const StatushideFile = () => dispatch(hideFileStatus());
  const CrossBtnhide = () => dispatch(hideCrossBtn());

  const router = useRouter();
  const campRoute = () => {
    router.push("/create-new-topic");
  };
  const validateMessages = {
    required: "${name} is required !",
  };
  const menu = (i) => (
    <Menu>
      <Menu.Item>
        <a onClick={() => Openfolder(i)}>Open folder</a>
      </Menu.Item>
      <Menu.Item>
        <a>Edit folder</a>
      </Menu.Item>
      <Menu.Item>
        <a>Delete folder</a>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <div>
        <div className={styles.card}>
          <div className={styles.btnsWrap}>
            <Button size="large" className={styles.btn} onClick={campRoute}>
              <i className="icon-topic"></i> Create New Topic
            </Button>
          </div>
        </div>
        <div className="siteAds">
          <Image
            alt="adOne"
            src={"/images/image11.jpg"}
            width={200}
            height={635}
          />
        </div>
      </div>
      <div className={styles.uploadFilesData}>
        <Card
          title={
            <h3>
              Upload Files <span className={styles.span}>Max size 5 MB</span>
            </h3>
          }
          className={styles.Card}
          extra={
            <div className="d-flex">
              <div className={styles.top_btn}>
                <div className="datepIcker">
                  <DatePicker />
                </div>
                <div className={styles.search_users}>
                  <SearchOutlined />
                  <Input placeholder="Search" type="text" name="search" />
                </div>
                <Button
                  id="createFolder"
                  disabled={disabledCreateFolder}
                  className={styles.create_folder_btn}
                  onClick={showCreateFolderModal}
                >
                  Create a folder
                </Button>
                {AddButtonShow ? (
                  <Button className={styles.add_file_btn} onClick={addNewFile}>
                    Add a file
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.top_icon}>
                <MenuOutlined />
                <AppstoreOutlined />
              </div>
            </div>
          }
        >
          <div className={styles.uploded_Files}>
            {showCrossBtn ? (
              <div className={styles.Back_from_browser}>
                <CloseCircleOutlined onClick={handle_X_btn} />
              </div>
            ) : (
              ""
            )}
            <Upload
              name="file"
              listType="picture"
              multiple={true}
              fileList={fileStatus ? folderFiles : fileLists}
              onChange={(info) => {
                let length = info.fileList.length;
                if (length) {
                  if (fileStatus) {
                    fileLists.map((fileitems, index) => {
                      return (
                        <div key={index}>
                          {fileitems.id === selectedFolderID
                            ? fileitems.files.push(...folderFiles)
                            : ""}
                        </div>
                      );
                    });
                    setFolderFiles(info.fileList);
                  } else {
                    setFileLists(info.fileList);
                  }
                  DragBoxHide();
                  CrossBtnhide();
                  shownAddButton();
                  UploadOptionsShow();
                } else {
                  DragBoxShow();
                  UploadOptionsHide();
                  hideButtonAdd();
                }

                const { status } = info.file;
                if (status !== "uploading") {
                }
                if (status === "done") {
                  message.success(
                    `${info.file.name} file uploaded successfully.`
                  );
                } else if (status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
              onDrop={(e) => {
                console.log("Dropped files", e.dataTransfer.files);
              }}
              itemRender={(originNode, file, currFileList) => {
                return file.type && file.type == "folder" ? (
                  ""
                ) : (
                  <div className={styles.After_Upload}>
                    <CloseCircleOutlined
                      onClick={() =>
                        removeFiles(originNode, file, currFileList)
                      }
                    />
                    <img
                      src="https://www.apkmirror.com/wp-content/uploads/2021/05/65/60afb3b73b390.png"
                      height="150px"
                      width="140px"
                    />
                    <br />
                    <label>{file.name}</label>
                    <Input
                      className="mr0"
                      value={fileName}
                      id={fileName}
                      onChange={(e) => setfileName(e.target.value)}
                      placeholder="Full Name (with no extension)"
                    />
                  </div>
                );
              }}
            >
              {DrageBoxVisible !== false ? (
                <div className={styles.Dragebox}>
                  <Button className={styles.Drager}>
                    <div className="uploadBTn">
                      <InboxOutlined />
                      <h2>
                        <b>Click or drag file to this area to upload</b>
                      </h2>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit
                        from uploading company data or other band files
                      </p>
                    </div>
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Upload>
          </div>

          {fileLists.map((item, i) => {
            return (
              <div className={styles.view_After_Upload} key={i}>
                {item.type &&
                item.type == "folder" &&
                item.id == selectedFolderID &&
                openFolder ? (
                  <div>
                    <Card
                      size="small"
                      title={
                        <h2>
                          {" "}
                          <ArrowLeftOutlined
                            onClick={() => {
                              closeFolder();
                              StatushideFile();
                            }}
                          />{" "}
                          {item.folderName} <FolderOpenOutlined />
                        </h2>
                      }
                      className="FolderfileCard"
                    ></Card>
                  </div>
                ) : (
                  <div className={"folderId" + i} id={"folderId" + i}>
                    {item &&
                    item.type &&
                    item.type == "folder" &&
                    showFolder ? (
                      <div className={styles.Folder_container}>
                        <Card>
                          {(item.id = "folderId" + i)}
                          <div className={styles.folder_icon}>
                            <FolderFilled />
                            <div className="folder--wrap">
                              <div
                                className={styles.foldername}
                                onClick={() => Openfolder(i)}
                              >
                                {item.folderName.substring(0, 10) + "..."}
                              </div>
                              <div className={styles.dateAndfiles}>
                                <p>{moment().format("DD MMM-YYYY")}</p>
                                <small>
                                  {"(" + item.files.length + " files)"}
                                </small>
                              </div>
                            </div>
                            <div className={styles.dropdown}>
                              <Dropdown overlay={menu(i)} trigger={["click"]}>
                                <a
                                  className="ant-dropdown-link"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <MoreOutlined />
                                </a>
                              </Dropdown>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ) : afterUpload ? (
                      <Card className={styles.files}>
                        <div className="icon--menu">
                          <MoreOutlined />
                        </div>
                        <h3>
                          {item.name.substring(0, 16) + "..."}
                          <br />
                        </h3>
                        <span>{moment().format("MMM DD,YYYY, h:mm:ss A")}</span>
                      </Card>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {show_UploadOptions ? (
            <div className={styles.Upload_Cancel_Btn}>
              <Button className={styles.Upload_Btn} onClick={uploadFun}>
                Upload
              </Button>
              <Button onClick={() => handleCancel()}>cancel</Button>
            </div>
          ) : (
            ""
          )}
        </Card>
      </div>
      <Modal
        className={styles.modal_cross}
        title={"Create a Folder"}
        visible={visible}
        footer=""
        onCancel={hideCreateFolderModal}
        width={400}
        closeIcon={<CloseCircleOutlined />}
      >
        <Form
          name="Create a Folder"
          form={createFolderForm}
          onFinish={onFinish}
          validateMessages={validateMessages}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            label="Folder Name (Limit 15 Chars*)"
            name="Folder name"
            rules={[
              { required: true },
              {
                pattern: new RegExp(/^[A-Z ]*$/i),
                message: "field does not accept numbers",
              },
            ]}
          >
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter name of the Folder"
              maxLength={15}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="ant-btn ant-btn-orange ant-btn-lg"
              style={{
                width: "100%",
              }}
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default UploadFileUI;
