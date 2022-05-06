import React from "react";
import { useState, useEffect } from "react";
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
import Icon, {
  InboxOutlined,
  MenuOutlined,
  SearchOutlined,
  AppstoreOutlined,
  CloseCircleOutlined,
  FolderFilled,
  FileTextFilled,
  FilePdfFilled,
  FileUnknownFilled,
  MoreOutlined,
  FolderOpenOutlined,
  ArrowLeftOutlined,
  EyeTwoTone,
  CopyTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import Image from "next/image";
import styles from "./UploadFile.module.scss";
import { useRouter } from "next/router";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import messages from "../../../../messages";
import ThreeDots from "../../../../assets/image/threeDots.svg";
import GridView from "../../../../assets/image/gridView.svg";
import GridViewActive from "../../../../assets/image/gridViewActive.svg";
import ListView from "../../../../assets/image/listView.svg";
import ListViewActive from "../../../../assets/image/listViewActive.svg";
import {
  showDrageBox,
  hideDrageBox,
  hideUploadOptions,
  showUploadOptions,
  hideAddButton,
  showAddButton,
  hideFileStatus,
  hideCrossBtn,
  showUploadFiles,
  showFolder,
  showAfterUploads,
} from "../../../../store/slices/uiSlice";
import CreateFolder from "../CreateFolder";
import { createFolderApi } from "../../../../network/api/userApi";
import { labels } from "../../../../messages/label";

const UploadFileUI = ({
  input,
  setInput,
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
  setUploadFileList,
  uploadFileList,
  removeUploadFiles,
  GetUploadFileAndFolder,
  getFileListFromFolderID,
  setShowCreateFolderModal,
  showCreateFolderModal,
}) => {
  const [toggleFileView, setToggleFileView] = useState(false);
  const [search, setSearch] = useState("");
  const [updateList, setUpdateList] = useState({});
  const [datePick, setDatePick] = useState("");
  const [createFolderForm] = Form.useForm();

  const [rename, setRename] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editModalId, setEditModalId] = useState("");
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewPath: "",
    previewName: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const drageBoxVisible = useSelector((state: RootState) => state.ui.dragBox);
  const disabledCreateFolder = useSelector(
    (state: RootState) => state.ui.disabledCreateFolderBtn
  );
  const dragBoxStatus = useSelector((state: RootState) => state.ui.dragBox);
  const show_UploadOptions = useSelector(
    (state: RootState) => state.ui.visibleUploadOptions
  );
  const afterUpload = useSelector((state: RootState) => state.ui.uploadAfter);
  const showFolderData = useSelector(
    (state: RootState) => state.ui.folderShown
  );
  const openFolder = useSelector((state: RootState) => state.ui.folderOpen);
  const addButtonShow = useSelector((state: RootState) => state.ui.addButton);
  const fileStatus = useSelector((state: RootState) => state.ui.fileStatus);
  const showCrossBtn = useSelector((state: RootState) => state.ui.crossBtn);
  const afterUploadClass = useSelector(
    (state: RootState) => state.ui.showFiles
  );
  const dragBoxShow = () => dispatch(showDrageBox());
  const dragBoxHide = () => dispatch(hideDrageBox());
  const uploadOptionsHide = () => dispatch(hideUploadOptions());
  const uploadOptionsShow = () => dispatch(showUploadOptions());
  const hideButtonAdd = () => dispatch(hideAddButton());
  const shownAddButton = () => dispatch(showAddButton());
  const StatusHideFile = () => dispatch(hideFileStatus());
  const crossBtnhide = () => dispatch(hideCrossBtn());
  const showFiles = () => dispatch(showUploadFiles());
  const shownFolder = () => dispatch(showFolder());
  const showUploadsAfter = () => dispatch(showAfterUploads());

  const router = useRouter();
  const campRoute = () => {
    router.push("/create/topic");
  };
  const validateMessages = {
    required: "${name} is required !",
  };
  const menu = (i, obj) => (
    <Menu>
      <Menu.Item>
        <span
          id="openFolder"
          onClick={() => {
            Openfolder(obj.id);
          }}
        >
          Open folder
        </span>
      </Menu.Item>
      <Menu.Item>
        <span id="editFolderName" onClick={() => editFolder(obj)}>
          Edit folder name
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          id="deleteFolder"
          onClick={() => {
            removeFiles(obj, {}, fileLists);
          }}
        >
          Delete folder
        </span>
      </Menu.Item>
    </Menu>
  );
  const menu_files = (i, item) => (
    <Menu>
      <Menu.Item>
        <span
          className={styles.menu_item}
          onClick={() =>
            setPreview({
              previewVisible: true,
              previewName: item.file_name,
              previewPath: item.file_path,
            })
          }
        >
          <EyeTwoTone id="viewFile" /> View File
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          className={styles.menu_item}
          onClick={() => {
            {
              navigator.clipboard.writeText(item.short_code),
                message.success("Short code copied");
            }
          }}
        >
          <CopyTwoTone id="copyShortCode" /> Copy Short Code
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          className={styles.menu_item}
          onClick={() => {
            removeFiles(item, item, fileLists);
          }}
        >
          <DeleteTwoTone id="deleteFile" /> Delete File
        </span>
      </Menu.Item>
    </Menu>
  );
  const displayColumnListImage = (obj) => {
    console.log(obj, "obj");
    return (
      <div>
        {obj.type == "file" || obj.file_path ? (
          <Image
            id={"imageList" + obj.id}
            src={obj.file_path}
            alt="picture of author"
            width={"100"}
            height={"100"}
          />
        ) : obj.type == "folder" ? (
          <FolderFilled className={styles.folder_icons} />
        ) : obj.file_type == "text/plain" ? (
          <FileTextFilled className={styles.folder_icons_fileTxt} />
        ) : obj.file_type == "application/pdf" ? (
          <FilePdfFilled className={styles.folder_icons_pdf} />
        ) : (
          <FileUnknownFilled className={styles.folder_icons} />
        )}
      </div>
    );
  };
  const editFolder = (obj) => {
    createFolderForm.resetFields();
    setEditModal(true);
    setShowCreateFolderModal(true);
    setRename(obj.name);
    setEditModalId(obj.id);
    createFolderForm.setFieldsValue({
      ["Folder Name"]: obj.name,
    });
  };

  const changeFolderName = async () => {
    let res = await createFolderApi({
      name: rename,
      id: editModalId,
    });
    if (res && res.status_code == 200) {
      GetUploadFileAndFolder();
      setFileLists(fileLists);
      setEditModal(false);
      setShowCreateFolderModal(false);
    }
  };

  const createNewFolder = async () => {
    let res = await createFolderApi({
      name: input,
    });
    if (res && res.status_code == 200) {
      GetUploadFileAndFolder();
      setFileLists(fileLists);
      shownFolder();
      setShowCreateFolderModal(false);
      dragBoxHide();
      shownAddButton();
    }
  };

  const onFinish = (values) => {
    editModal ? changeFolderName() : createNewFolder();
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (name, obj, index) => {
        return (
          <div className={styles.CopyShortCode}>
            <div className={styles.icon_Width}>
              {displayColumnListImage(obj)}
            </div>
            <div className={styles.filename_text}>
              {obj.file_name ? obj.file_name : obj.name}
            </div>
          </div>
        );
      },
    },
    {
      title: "Short Code",
      dataIndex: "code",
      key: "code",
      render: (code, obj) => {
        return (
          <div className={styles.CopyShortCode}>
            {obj.short_code ? (
              <>
                <div className={styles.icon_height}>
                  {`[[${obj.short_code}]]`}
                </div>
                <div className={styles.shortcode_icon}>
                  <CopyTwoTone
                    className={styles.folder_icons}
                    onClick={() => {
                      navigator.clipboard.writeText(obj.short_code),
                        message.success("Short code copied");
                    }}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      title: "Created Date",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      render: (lastModifiedDate, obj) => (
        <div>
          {" "}
          {obj.updated_at
            ? moment
                .unix(obj.updated_at)
                .format("MMM DD,YYYY, h:mm:ss A")
                .toString()
            : moment
                .unix(obj.created_at)
                .format("MMM DD,YYYY, h:mm:ss A")
                .toString()}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (keyParam, obj, index) => {
        return (
          <>
            <Popover
              placement="bottomRight"
              title=""
              content={
                obj.file_type ? (
                  <>
                    <li
                      className={styles.menu_item}
                      onClick={() =>
                        setPreview({
                          previewVisible: true,
                          previewName: obj.file_name,
                          previewPath: obj.file_path,
                        })
                      }
                    >
                      {" "}
                      <EyeTwoTone /> View File
                    </li>
                    <br />
                    <li
                      className={styles.menu_item}
                      onClick={() => {
                        navigator.clipboard.writeText(keyParam.short_code),
                          message.success("Short code copied");
                      }}
                    >
                      <CopyTwoTone /> Copy Short Code
                    </li>
                    <br />
                    <li
                      className={styles.menu_item}
                      onClick={() => {
                        removeFiles(keyParam, obj, fileLists);
                      }}
                    >
                      <DeleteTwoTone /> Delete File
                    </li>
                  </>
                ) : (
                  menu(index, obj)
                )
              }
              trigger="click"
              zIndex={1}
            >
              <div className="threeDOt">
                <MoreOutlined />
              </div>
            </Popover>
          </>
        );
      },
    },
  ];
  const uploadList = () => {
    Object.entries(updateList).map(([k, v], i) => {
      const fileIndex = fileLists.findIndex((obj) => k == obj.uid);
      const fileListsArr = [...fileLists];
      fileListsArr[fileIndex].name = v;
      setFileLists(fileListsArr);
    });
  };
  const handleChangeFileName = (e, id) => {
    setUpdateList({ ...updateList, [id]: e.target.value });
  };

  const filteredArray = () => {
    const datePickerData = moment(datePick).format("MMM DD, YYYY");
    const createdAtValue = (val) =>
      moment.unix(val.created_at).format("MMM DD, YYYY");
    let searchName = "";
    return fileLists.filter((val) => {
      if (search !== "") {
        if (val.name) {
          searchName = val.name;
        } else if (val.file_name) {
          searchName = val.file_name;
        }
        if (
          searchName
            .toLowerCase()
            .trim()
            .includes(search.toLowerCase().trim()) &&
          (datePick == "" ||
            (datePick !== "" && datePickerData == createdAtValue(val)))
        ) {
          return val;
        }
      } else if (datePick.trim() == "") {
        return val;
      } else if (datePickerData == createdAtValue(val)) {
        return val;
      }
    });
  };
  const openFolderData = (item, i) => {
    return (
      <div className={"folderId" + item.id} id={"folderId" + item.id}>
        {item && item.type && item.type == "folder" && !toggleFileView ? (
          <div className={styles.Folder_container}>
            <Card className={styles.FolderData}>
              <div className={styles.folder_icon}>
                <div className="folder--wrap">
                  <div
                    className="foldername"
                    onClick={() => {
                      Openfolder(item.id);
                    }}
                  >
                    {item.name}
                  </div>
                  <div className={styles.dateAndfiles}>
                    <p>
                      {" "}
                      {moment.unix(item.created_at).format("DD MMMM YYYY")}
                    </p>
                    <small>{"(" + item.uploads_count + " files)"}</small>
                  </div>
                </div>
                <div className={styles.dropdown}>
                  <Dropdown overlay={menu(i, item)} trigger={["click"]}>
                    <div
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreOutlined />
                    </div>
                  </Dropdown>
                </div>
              </div>
            </Card>
          </div>
        ) : afterUpload && !toggleFileView && item.type == "file" ? (
          <Card className={styles.files}>
            <div className={styles.dropdown_menu}>
              <Dropdown overlay={menu_files(item.id, item)} trigger={["click"]}>
                <div
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <Image
                    // id="threeDots"
                    className={styles.Menu_Iconss}
                    alt="Three Dots"
                    src={ThreeDots}
                    width={15}
                    height={20}
                  />
                </div>
              </Dropdown>
            </div>
            <div className={styles.imageFiles}>
              {displayImage(item, item.file_path)}
            </div>
            <h3>
              {(item.name ? item.name : item.file_name).substring(0, 10) +
                "..."}
            </h3>
            <span>
              {item.created_at
                ? moment.unix(item.created_at).format("MMM DD, YYYY, h:mm:ss A")
                : moment(item.lastModified).format("MMM DD, YYYY, h:mm:ss A")}
            </span>
          </Card>
        ) : (
          ""
        )}
      </div>
    );
  };
  const searchFilter = () => {
    return filteredArray().map((item, i) => {
      return (
        <div
          className={(() => {
            if (openFolder && item.id != selectedFolderID) {
              return "";
            } else if (!openFolder) {
              return styles.view_After_Upload;
            } else {
              return styles.folder_Back_Button;
            }
          })()}
          key={i}
        >
          {(() => {
            if (
              item.type &&
              item.type == "folder" &&
              item.id == selectedFolderID &&
              openFolder &&
              dragBoxStatus == false
            ) {
              return (
                <div>
                  <Card
                    size="small"
                    title={
                      <h2>
                        {" "}
                        <ArrowLeftOutlined
                          id="arrowLeftOutlined"
                          onClick={() => {
                            closeFolder();
                            StatusHideFile();
                          }}
                        />
                        {" " + item.name + " "}
                        <FolderOpenOutlined />
                      </h2>
                    }
                    className="FolderfileCard"
                  >
                    <div className={styles.openFolder}>
                      {!toggleFileView
                        ? getFileListFromFolderID.map((file, i) => {
                            return (
                              <div
                                className={styles.view_After_Upload}
                                key="upload_file_one"
                              >
                                <Card className={styles.files} key={i}>
                                  <div className={styles.dropdown_menu}>
                                    <Dropdown
                                      overlay={menu_files(file.id, file)}
                                      trigger={["click"]}
                                    >
                                      <div
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                      >
                                        <Image
                                          id="menuFilesThreeDots"
                                          className={styles.Menu_Iconss}
                                          alt="Three Dots"
                                          src={ThreeDots}
                                          width={15}
                                          height={20}
                                        />
                                      </div>
                                    </Dropdown>
                                  </div>
                                  <div className={styles.imageFiles}>
                                    {displayImage(file, file.file_path)}
                                  </div>
                                  <h3>
                                    {file.file_name.substring(0, 16) + "..."}
                                  </h3>
                                  <span>
                                    {moment
                                      .unix(file.created_at)
                                      .format("MMM DD, YYYY, h:mm:ss A")}
                                  </span>
                                </Card>
                              </div>
                            );
                          })
                        : ""}
                    </div>
                  </Card>
                </div>
              );
            } else if (!openFolder && dragBoxStatus == false) {
              return openFolderData(item, i);
            } else {
              return "";
            }
          })()}
        </div>
      );
    });
  };
  const displayImage = (file, imageData) => {
    return (
      <div id="display_image">
        {imageData ? (
          <Image alt="Image" src={imageData} height={"150px"} width={"140px"} />
        ) : file.type == "text/plain" ? (
          <FileTextFilled className={styles.FileTextTwoOneClass} />
        ) : file.type == "application/pdf" ? (
          <FilePdfFilled className={styles.FilePdfTwoToneColor} />
        ) : (
          <FileUnknownFilled className={styles.FileTextTwoOneClass} />
        )}
      </div>
    );
  };
  return (
    <>
      <div>
        <div className={styles.card}>
          <div className={styles.btnsWrap}>
            <Button
              id="createNewTopicBtn"
              size="large"
              className={styles.btn}
              onClick={campRoute}
            >
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
              {messages.labels.uploadFiles}{" "}
              <span className={styles.span}>{messages.labels.maxSize}</span>
            </h3>
          }
          className={styles.Card}
          extra={
            <div className="d-flex">
              <div className={styles.top_btn}>
                <div className="datepIcker">
                  <DatePicker
                    onChange={(date, dateString) => {
                      setDatePick(date ? date.toLocaleString() : "");
                    }}
                  />
                </div>
                <div className={styles.search_users}>
                  <SearchOutlined />
                  <Input
                    id="datePickerText"
                    placeholder="Search"
                    type="text"
                    name="search"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
                <Button
                  id="createFolderBtn"
                  disabled={disabledCreateFolder}
                  className={styles.create_folder_btn}
                  onClick={() => {
                    createFolderForm.resetFields();
                    setShowCreateFolderModal(true),
                      setToggleFileView(false),
                      setEditModal(false);
                  }}
                >
                  Create a folder
                </Button>
                {addButtonShow ? (
                  <Button
                    id="addAFileBtn"
                    className={styles.add_file_btn}
                    onClick={() => {
                      addNewFile(), setToggleFileView(false), setUpdateList({});
                    }}
                  >
                    Add a file
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.top_icon}>
                <span
                  onClick={() => {
                    setToggleFileView(true);
                  }}
                >
                  <Image
                    alt="listView"
                    src={toggleFileView ? ListViewActive : ListView}
                    width={24}
                    height={20}
                  />
                </span>
                <span
                  onClick={() => {
                    setToggleFileView(false), showUploadsAfter();
                  }}
                >
                  <Image
                    alt="listView"
                    src={!toggleFileView ? GridViewActive : GridView}
                    width={24}
                    height={20}
                  />
                </span>
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
              className={styles.UploadDataFiles}
              name="file"
              listType="picture"
              multiple
              fileList={fileStatus ? folderFiles : uploadFileList}
              onChange={(info) => {
                let fileListData = [...info.fileList];
                let length = info.fileList.length;
                if (length) {
                  if (fileStatus) {
                    if (
                      info.file.status == "uploading" &&
                      info.file.percent == 0
                    ) {
                      setFolderFiles(info.fileList);
                      setUploadFileList(info.fileList);
                      setFileLists(info.fileList);
                    }
                  } else {
                    let dataValues = info.fileList;

                    setUploadFileList(dataValues);
                    setFileLists(info.fileList);
                  }
                  dragBoxHide();
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
                  showFiles();
                } else if (status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
              onDrop={(e) => {
                console.log("Dropped files", e.dataTransfer.files);
              }}
              itemRender={(originNode, file, currFileList) => {
                const fileSizeFlag = file.size / (1024 * 1024) > 5;
                return (file.type && file.type == "folder") ||
                  toggleFileView ? (
                  ""
                ) : (
                  <div className={afterUploadClass}>
                    <div
                      className={styles.After_Upload}
                      style={fileSizeFlag ? { border: "1px solid red" } : {}}
                    >
                      <CloseCircleOutlined
                        onClick={() =>
                          removeUploadFiles(originNode, file, uploadFileList)
                        }
                      />
                      <div className="imgWrap">
                        {displayImage(file, file.thumbUrl)}
                      </div>
                      <br />
                      <label
                        className={
                          fileSizeFlag
                            ? "fileName_label_max_limit"
                            : "fileName_label"
                        }
                      >
                        {file.name}
                      </label>
                      <span className={"fileName_span"}>Enter file name</span>

                      <Input
                        id="enterFileName"
                        className="mr0"
                        name={file.uid}
                        onChange={(e) => handleChangeFileName(e, file.uid)}
                        placeholder="Full Name (with no extension)"
                      />
                    </div>
                    {fileSizeFlag ? (
                      <p className={styles.maxLimit}>
                        This file is exceeding the max limit and will not be
                        uploaded{" "}
                      </p>
                    ) : (
                      " "
                    )}
                  </div>
                );
              }}
            >
              {drageBoxVisible !== false ? (
                <div className={styles.Dragebox}>
                  <Button id="clickOrDragAreaBtn" className={styles.Drager}>
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
          <div className={styles.fileList}>{searchFilter()}</div>
          {toggleFileView && fileLists.length > 0 ? (
            <div className="TableContent">
              <Table
                id="tableColumn"
                className="contentValue"
                dataSource={fileStatus ? getFileListFromFolderID : fileLists}
                columns={columns}
              />
            </div>
          ) : (
            ""
          )}

          {show_UploadOptions ? (
            <div className={styles.Upload_Cancel_Btn}>
              <Button
                id="uploadBtn"
                className={styles.Upload_Btn}
                onClick={() => {
                  uploadList(), uploadFun(), setToggleFileView(false);
                  setUploadFileList([]);
                }}
              >
                Upload
              </Button>
              <Button
                id="cancelBtn"
                className={styles.cancel_Btn}
                onClick={handleCancel}
              >
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
        title={editModal ? "Edit your folder name" : labels.CreateaFolder}
        visible={showCreateFolderModal}
        footer=""
        onCancel={() => setShowCreateFolderModal(false)}
        width={450}
        closeIcon={<CloseCircleOutlined />}
      >
        <CreateFolder
          editModal={editModal}
          createFolderForm={createFolderForm}
          onFinish={onFinish}
          validateMessages={validateMessages}
          rename={rename}
          input={input}
          setRename={setRename}
          setInput={setInput}
        />
      </Modal>

      <Modal
        className={styles.preview_image}
        visible={preview.previewVisible}
        title={preview.previewName}
        footer={null}
        closeIcon={<CloseCircleOutlined className={styles.crossIcon} />}
        onCancel={() => {
          setPreview({ ...preview, previewVisible: false });
        }}
      >
        {preview.previewPath && (
          <Image
            id="modalImageId"
            alt="example"
            src={preview.previewPath}
            width={"470px"}
            height={"470px"}
          />
        )}
      </Modal>
    </>
  );
};
export default UploadFileUI;
