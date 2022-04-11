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
  Popover,
  Table,
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
  EyeTwoTone,
  CopyTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import Image from "next/image";
import PdfImage from "../../../../assets/image/png.png";
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
  showUploadFiles,
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
  const [toggleFileView, setToggleFileView] = useState(false);
  const [createFolderForm] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const visible = useSelector(
    (state: RootState) => state.ui.createFolderShowModal
  );
  const drageBoxVisible = useSelector((state: RootState) => state.ui.dragBox);
  const disabledCreateFolder = useSelector(
    (state: RootState) => state.ui.disabledCreateFolderBtn
  );
  const show_UploadOptions = useSelector(
    (state: RootState) => state.ui.visibleUploadOptions
  );
  const afterUpload = useSelector((state: RootState) => state.ui.uploadAfter);
  const showFolder = useSelector((state: RootState) => state.ui.folderShown);
  const openFolder = useSelector((state: RootState) => state.ui.folderOpen);
  const addButtonShow = useSelector((state: RootState) => state.ui.addButton);
  const fileStatus = useSelector((state: RootState) => state.ui.fileStatus);
  const showCrossBtn = useSelector((state: RootState) => state.ui.crossBtn);
  const afterUploadClass = useSelector(
    (state: RootState) => state.ui.showFiles
  );
  const showCreateFolderModal = () => dispatch(showFolderModal());
  const hideCreateFolderModal = () => dispatch(hideFolderModal());
  const dragBoxShow = () => dispatch(showDrageBox());
  const dagBoxHide = () => dispatch(hideDrageBox());
  const uploadOptionsHide = () => dispatch(hideUploadOptions());
  const uploadOptionsShow = () => dispatch(showUploadOptions());
  const hideButtonAdd = () => dispatch(hideAddButton());
  const shownAddButton = () => dispatch(showAddButton());
  const StatushideFile = () => dispatch(hideFileStatus());
  const crossBtnhide = () => dispatch(hideCrossBtn());
  const showFiles = () => dispatch(showUploadFiles());
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
  const menu_files = (i) => (
    <Menu>
      <Menu.Item>
        <a>
          <EyeTwoTone /> View File
        </a>
      </Menu.Item>
      <Menu.Item>
        <a>
          <CopyTwoTone /> Copy Short Code
        </a>
        ,
      </Menu.Item>
      <Menu.Item>
        <a>
          <DeleteTwoTone /> Delete
        </a>
      </Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (name, obj) => {
        return (
          <>
            <div className={styles.icon_Width}>
              {obj.thumbUrl ? (
                <img src={obj.thumbUrl} />
              ) : (
                <FolderFilled className={styles.folder_icons} />
              )}
            </div>
            <div className={styles.icon_height}>
              {name ? name : obj.folderName}
            </div>
          </>
        );
      },
    },
    {
      title: "Short Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Created Date",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      render: (lastModifiedDate, obj) => (
        <div>
          {" "}
          {lastModifiedDate
            ? moment().format("MMM DD,YYYY, h:mm:ss A").toString()
            : obj.createdAt}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (keyParam, obj) => {
        return (
          <>
            <Popover
              placement="bottomRight"
              title=""
              content={
                <>
                  <li className={styles.high_light}>
                    <EyeTwoTone /> View File
                  </li>
                  ,
                  <li
                    className={styles.high_light}
                    onClick={() => {
                      navigator.clipboard.writeText(keyParam.name);
                    }}
                  >
                    <CopyTwoTone /> Copy Short Code
                  </li>
                  ,
                  <li
                    className={styles.high_light}
                    onClick={() => {
                      removeFiles(keyParam, obj, fileLists);
                    }}
                  >
                    <DeleteTwoTone /> Delete
                  </li>
                </>
              }
              trigger="click"
            >
              <a>
                <MoreOutlined />
              </a>
            </Popover>
          </>
        );
      },
    },
  ];
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
                  onClick={() => {
                    showCreateFolderModal(), setToggleFileView(false);
                  }}
                >
                  Create a folder
                </Button>
                {addButtonShow ? (
                  <Button
                    className={styles.add_file_btn}
                    onClick={() => {
                      addNewFile(), setToggleFileView(false);
                    }}
                  >
                    Add a file
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.top_icon}>
                <MenuOutlined
                  className={toggleFileView ? styles.high_light : ""}
                  onClick={() => setToggleFileView(true)}
                />
                <AppstoreOutlined
                  className={!toggleFileView ? styles.high_light : ""}
                  onClick={() => setToggleFileView(false)}
                />
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
                  dagBoxHide();
                  crossBtnhide();
                  shownAddButton();
                  uploadOptionsShow();
                } else {
                  dragBoxShow();
                  uploadOptionsHide();
                  hideButtonAdd();
                }

                const { status } = info.file;
                if (status !== "uploading") {
                }
                if (status === "done") {
                  message.success(
                    `${info.file.name} file uploaded successfully.`
                  );
                  showFiles();
                } else if (status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
              onDrop={(e) => {
                console.log("Dropped files", e.dataTransfer.files);
              }}
              itemRender={(originNode, file, currFileList) => {
                return (file.type && file.type == "folder") ||
                  toggleFileView ? (
                  ""
                ) : (
                  <div className={afterUploadClass}>
                    <div className={styles.After_Upload}>
                      <CloseCircleOutlined
                        onClick={() =>
                          removeFiles(originNode, file, currFileList)
                        }
                      />
                      <div className="imgWrap">
                        <img
                          alt="Image"
                          src={file.thumbUrl}
                          height={"150px"}
                          width={"140px"}
                        />
                      </div>
                      <br />
                      <label className={"fileName_label"}>{file.name}</label>
                      <span className={"fileName_span"}>Enter file name</span>
                      <Input
                        className="mr0"
                        value={fileName}
                        id={fileName}
                        onChange={(e) => setfileName(e.target.value)}
                        placeholder="Full Name (with no extension)"
                      />
                    </div>
                  </div>
                );
              }}
            >
              {drageBoxVisible !== false ? (
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

          {toggleFileView && fileLists.length > 0 ? (
            <Table dataSource={fileLists} columns={columns} />
          ) : (
            ""
          )}
          <div className={styles.fileList}>
            {fileLists.map((item, i) => {
              item.id = "folderId" + i;
              return (
                <div className={styles.view_After_Upload} key={i}>
                  {console.log(
                    openFolder,
                    "openFolder",
                    item,
                    "item",
                    item.type == "folder",
                    "folder",
                    item.id == selectedFolderID
                  )}
                  {item.type &&
                  item.type == "folder" &&
                  item.id == selectedFolderID &&
                  openFolder ? (
                    <div className={styles.openFolder}>
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
                      showFolder &&
                      !toggleFileView ? (
                        <div className={styles.Folder_container}>
                          <Card className={styles.FolderData}>
                            {/* {item.id = "folderId" + i} */}
                            <div className={styles.folder_icon}>
                              {/* <FolderFilled /> */}
                              <div className="folder--wrap">
                                <div
                                  className="foldername"
                                  onClick={() => Openfolder(i)}
                                >
                                  {item.folderName}
                                </div>
                                <div className={styles.dateAndfiles}>
                                  <p>{moment().format("DD-MMM-YYYY")}</p>
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
                      ) : afterUpload && !toggleFileView ? (
                        <Card className={styles.files}>
                          <div className={styles.dropdown_menu}>
                            <Dropdown
                              overlay={menu_files(i)}
                              trigger={["click"]}
                            >
                              <a
                                className="ant-dropdown-link"
                                onClick={(e) => e.preventDefault()}
                              >
                                <MoreOutlined className="Menu_Iconss" />
                              </a>
                            </Dropdown>
                          </div>
                          <div className={styles.imageFiles}>
                            <img
                              alt="image"
                              src={item.thumbUrl}
                              height={"150px"}
                              width={"140px"}
                            />
                          </div>
                          <h3>{item.name.substring(0, 16) + "..."}</h3>
                          <span>
                            {moment().format("MMM DD,YYYY, h:mm:ss A")}
                          </span>
                        </Card>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {show_UploadOptions ? (
            <div className={styles.Upload_Cancel_Btn}>
              <Button
                className={styles.Upload_Btn}
                onClick={() => {
                  uploadFun(), setToggleFileView(false);
                }}
              >
                Upload
              </Button>
              <Button className={styles.cancel_Btn} onClick={handleCancel}>
                cancel
              </Button>
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
