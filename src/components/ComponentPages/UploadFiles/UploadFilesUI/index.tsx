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
  Popconfirm,
  Spin,
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
  FilePptOutlined,
  FileOutlined,
  FileExcelOutlined,
  FileWordOutlined,
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
import folderOpenOutLine from "../../../../assets/image/folderOpen.svg";
import CopyShortCode from "../../../../assets/image/copyShortCode.svg";
import eyeImage from "../../../../assets/image/eye.svg";
import Trash from "../../../../assets/image/trash.svg";
import ArrowLeft from "../../../../assets/image/arrow_small_left.svg";
import CopyShortCodeImage from "../../../../assets/image/copyShort.png";
import DatePickerImage from "../../../../assets/image/datePicker.png";
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
import {
  createFolderApi,
  deactivateUser,
} from "../../../../network/api/userApi";
import { labels } from "../../../../messages/label";
import { setTimeout } from "timers";
import { spawnSync } from "child_process";
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
  const [previewImageIndicator, setPreviewImageIndicator] = useState(false);
  const [addFileIndicator, setAddFileIndicator] = useState(false);
  const [loadingArray, setLoadingArray] = useState([]);
  const [search, setSearch] = useState("");
  const [updateList, setUpdateList] = useState({});
  const [datePick, setDatePick] = useState("");
  const [createFolderForm] = Form.useForm();
  const imageTimer = 2500;
  const [rename, setRename] = useState("");
  const [editFolderNameVal, setEditFolderNameVal] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editModalId, setEditModalId] = useState("");
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewPath: "",
    previewName: "",
    previewCopyShortCode: "",
    previewCreatedAt: 0,
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
  //Regex
  const textFileRegex = /^text\/(plain$|html$|rtf$|csv$)/;
  const pdfFileRegex = /^application\/(pdf$)/;
  const excelFileRegex =
    /^application\/(vnd.ms-excel.sheet.macroEnabled.12$|vnd.ms-excel$|vnd.ms-excel.sheet.binary.macroEnabled.12$|vnd.openxmlformats-officedocument.spreadsheetml.sheet$)/;
  const docFileRegex =
    /^application\/(msword$|vnd.openxmlformats-officedocument.wordprocessingml.template$|vnd.ms-word.template.macroEnabled.12$|vnd.openxmlformats-officedocument.wordprocessingml.document$| vnd.ms-word.document.macroEnabled.12$|msword$)/;
  const imageRegexData = /^image\/(jpeg$|png$|jpg$|gif$|bmp$)/;
  const pptRegexData =
    /^application\/(vnd.ms-powerpoint.template.macroEnabled.12$|vnd.openxmlformats-officedocument.presentationml.template$|vnd.ms-powerpoint.addin.macroEnabled.12$|vnd.openxmlformats-officedocument.presentationml.slideshow$|vnd.openxmlformats-officedocument.presentationml.slideshow$|vnd.ms-powerpoint.slideshow.macroEnabled.12$|vnd.ms-powerpoint$|vnd.ms-powerpoint.presentation.macroEnabled.12$|vnd.openxmlformats-officedocument.presentationml.presentation$)/;
  const fileJsonRegex = /^application\/(json$)/;
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
        <span id="deleteFolder">
          <Popconfirm
            placement="leftTop"
            title="Are you sure to delete ?"
            onConfirm={() => removeFiles(obj, {}, fileLists)}
            okText="Yes"
            cancelText="No"
          >
            Delete folder
          </Popconfirm>
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
              previewCopyShortCode: item.short_code,
              previewCreatedAt: item.created_at,
            })
          }
        >
          <Image
            id="viewFile"
            alt="Eye Image"
            src={eyeImage}
            width={15}
            height={11}
          />
          <span className={styles.marginLeftView}>View File</span>
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
          <Image
            id="copyShortCode"
            alt="copyShortCode"
            src={CopyShortCode}
            width={12}
            height={15}
          />
          <span className={styles.marginLeftView}>Copy Short Code</span>
        </span>
      </Menu.Item>
      <Menu.Item>
        <span className={styles.menu_item}>
          <Popconfirm
            placement="top"
            title="Are you sure to delete ?"
            onConfirm={() => removeFiles(item, item, fileLists)}
            okText="Yes"
            cancelText="No"
          >
            <Image
              id="deleteFile"
              alt="Trash Data "
              src={Trash}
              width={12}
              height={15}
            />
            <span className={styles.marginLeftView}>Delete File</span>
          </Popconfirm>
        </span>
      </Menu.Item>
    </Menu>
  );
  const displayColumnListImage = (obj) => {
    const fileText = <FileTextFilled className={styles.folder_icons_fileTxt} />;
    const filePdf = <FilePdfFilled className={styles.folder_icons_pdf} />;
    const fileUnknown = <FileUnknownFilled className={styles.folder_icons} />;

    const filePpt = <FilePptOutlined className={styles.folder_icons_fileTxt} />;
    const fileJson = <FileOutlined className={styles.folder_icons_fileTxt} />;
    const fileXcel = (
      <FileExcelOutlined className={styles.folder_icons_fileTxt} />
    );
    const fileDocs = (
      <FileWordOutlined className={styles.folder_icons_fileTxt} />
    );
    return (
      <div>
        {(() => {
          if (imageRegexData.test(obj.file_type) && obj.file_path) {
            return (
              <Image
                alt="Image"
                src={obj.file_path}
                height={"150px"}
                width={"140px"}
              />
            );
          } else if (obj.type == "folder") {
            return (
              <FolderFilled
                className={styles.folder_icons}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  Openfolder(obj.id);
                }}
              />
            );
          } else if (textFileRegex.test(obj.file_type)) {
            return fileText;
          } else if (pdfFileRegex.test(obj.file_type)) {
            return filePdf;
          } else if (excelFileRegex.test(obj.file_type)) {
            return fileXcel;
          } else if (docFileRegex.test(obj.file_type)) {
            return fileDocs;
          } else if (pptRegexData.test(obj.file_type)) {
            return filePpt;
          } else if (fileJsonRegex.test(obj.file_type)) {
            return fileJson;
          } else {
            return fileUnknown;
          }
        })()}
      </div>
    );
  };
  const editFolder = (obj) => {
    createFolderForm.resetFields();
    setEditModal(true);
    setShowCreateFolderModal(true);
    setRename(obj.name);
    setEditFolderNameVal(obj.name);
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
              {obj.file_name ? (
                obj.file_name
              ) : (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    Openfolder(obj.id);
                  }}
                >
                  {obj.name}
                </div>
              )}
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
                  <span
                    className={styles.folder_icons}
                    onClick={() => {
                      navigator.clipboard.writeText(obj.short_code),
                        message.success("Short code copied");
                    }}
                  >
                    <Image
                      alt="copyShortCode"
                      src={CopyShortCode}
                      width={15}
                      height={18}
                    />
                  </span>
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
              overlayClassName="PopoverCustom"
              placement="bottomRight"
              title=""
              content={
                obj.file_type ? (
                  <>
                    <div
                      className={styles.menu_item}
                      onClick={() =>
                        setPreview({
                          previewVisible: true,
                          previewName: obj.file_name,
                          previewPath: obj.file_path,
                          previewCopyShortCode: obj.short_code,
                          previewCreatedAt: obj.created_at,
                        })
                      }
                    >
                      {" "}
                      <Image
                        alt="Eye Image"
                        src={eyeImage}
                        width={15}
                        height={11}
                      />
                      <span className={styles.marginLeftView}>View File</span>
                    </div>
                    <div
                      className={styles.menu_item}
                      onClick={() => {
                        navigator.clipboard.writeText(keyParam.short_code),
                          message.success("Short code copied");
                      }}
                    >
                      <Image
                        alt="copyShortCode"
                        src={CopyShortCode}
                        width={12}
                        height={15}
                      />
                      <span className={styles.marginLeftView}>
                        Copy Short Code
                      </span>
                    </div>
                    <div className={styles.menu_item}>
                      <Popconfirm
                        placement="rightTop"
                        title="Are you sure to delete this file."
                        onConfirm={() => removeFiles(keyParam, obj, fileLists)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Image
                          alt="Trash Data "
                          src={Trash}
                          width={12}
                          height={15}
                        />
                        <span className={styles.marginLeftView}>
                          Delete File
                        </span>
                      </Popconfirm>
                    </div>
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
    return (openFolder ? getFileListFromFolderID : fileLists).filter((val) => {
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
                    <span style={{ cursor: "pointer" }}>{item.name}</span>
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
                  <Dropdown
                    overlay={menu(i, item)}
                    trigger={["click"]}
                    placement="topCenter"
                  >
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
            <Dropdown
              className={styles.dropdown_menu}
              overlay={menu_files(item.id, item)}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <Image
                  id="threeDots"
                  className={styles.Menu_Iconss}
                  alt="Three Dots"
                  src={ThreeDots}
                  width={15}
                  height={20}
                />
              </div>
            </Dropdown>
            <div className={styles.imageFiles}>
              {displayImage(item, item.file_path)}
            </div>
            <h3 className="BoxcopyWrap">
              <span className="value">
                {subStringData(item.name ? item.name : item.file_name)}
              </span>
              <span
                className="copySpan"
                onClick={() => {
                  navigator.clipboard.writeText(item.short_code),
                    message.success("Short code copied");
                }}
              >
                <Image
                  alt="copyShortCode"
                  src={CopyShortCode}
                  width={12}
                  height={15}
                />
              </span>
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
  const subStringData = (fileName) => {
    return fileName.length > 10 ? fileName.substring(0, 10) + "..." : fileName;
  };
  const filterArrList = [];
  const searchFilter = () => {
    return (openFolder ? fileLists : filteredArray()).map((item, i) => {
      filterArrList.push(item);
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
                      <h2 className={styles.FolderOpenHeading}>
                        {" "}
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            closeFolder();
                            StatusHideFile();
                          }}
                        >
                          <Image
                            id="arrowLeftOutlined"
                            alt="Arrow Left"
                            src={ArrowLeft}
                            width={14}
                            height={17}
                          />
                        </span>
                        <span className={styles.marginLeftView}>
                          {" " + item.name + " "}
                        </span>
                        <Image
                          alt="folderOpenOutLine"
                          src={folderOpenOutLine}
                          width={24}
                          height={20}
                          className="ms-2"
                        />
                      </h2>
                    }
                    className="FolderfileCard"
                  >
                    <div className={styles.openFolder}>
                      {!toggleFileView
                        ? (openFolder
                            ? filteredArray()
                            : getFileListFromFolderID
                          ).map((file, i) => {
                            return (
                              <div
                                className={styles.view_After_Upload}
                                key="upload_file_one"
                              >
                                <Card className={styles.files} key={i}>
                                  <Dropdown
                                    className={styles.dropdown_menu}
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
                                  <div className={styles.imageFiles}>
                                    {displayImage(file, file.file_path)}
                                  </div>
                                  <h3 className="BoxcopyWrap">
                                    <span className="value">
                                      {subStringData(file.file_name)}
                                    </span>
                                    <span
                                      className="copySpan"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          file.short_code
                                        ),
                                          message.success("Short code copied");
                                      }}
                                    >
                                      <Image
                                        alt="copyShortCode"
                                        src={CopyShortCode}
                                        width={12}
                                        height={15}
                                      />
                                    </span>
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
    const fileText = <FileTextFilled className={styles.FileTextTwoOneClass} />;
    const filePdf = <FilePdfFilled className={styles.FilePdfTwoToneColor} />;
    const fileUnknown = (
      <FileUnknownFilled className={styles.FileTextTwoOneClass} />
    );
    const filePpt = <FilePptOutlined className={styles.FileTextTwoOneClass} />;
    const fileJson = <FileOutlined className={styles.FileTextTwoOneClass} />;
    const fileXcel = (
      <FileExcelOutlined className={styles.FileTextTwoOneClass} />
    );
    const fileDocs = (
      <FileWordOutlined className={styles.FileTextTwoOneClass} />
    );

    return (
      <div id="display_image">
        {(() => {
          if (imageRegexData.test(file.file_type || file.type) && imageData) {
            return (
              <Image
                alt="Image"
                src={imageData}
                height={"150px"}
                width={"140px"}
              />
            );
          } else if (textFileRegex.test(file.file_type || file.type)) {
            return fileText;
          } else if (pdfFileRegex.test(file.file_type || file.type)) {
            return filePdf;
          } else if (excelFileRegex.test(file.file_type || file.type)) {
            return fileXcel;
          } else if (docFileRegex.test(file.file_type || file.type)) {
            return fileDocs;
          } else if (pptRegexData.test(file.file_type || file.type)) {
            return filePpt;
          } else if (fileJsonRegex.test(file.file_type || file.type)) {
            return fileJson;
          } else {
            return fileUnknown;
          }
        })()}
      </div>
    );
  };
  const confirm = (keyParam) => {
    message.info("Clicked on Yes.");
    removeFiles(keyParam);
  };
  //spinner Image Preview
  useEffect(() => {
    setPreviewImageIndicator(true);
    setTimeout(() => {
      setPreviewImageIndicator(false);
    }, imageTimer);
  }, [preview.previewVisible]);
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
                    disabled={show_UploadOptions || dragBoxStatus}
                    onChange={(date, dateString) => {
                      setDatePick(date ? date.toLocaleString() : "");
                    }}
                  />
                </div>
                <div className={styles.search_users}>
                  <SearchOutlined />
                  <Input
                    disabled={show_UploadOptions || dragBoxStatus}
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
                  Create folder
                </Button>
                {addButtonShow && !dragBoxStatus ? (
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
                {show_UploadOptions || dragBoxStatus ? (
                  ""
                ) : (
                  <span
                    style={{ cursor: "pointer" }}
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
                )}
                {show_UploadOptions || dragBoxStatus ? (
                  ""
                ) : (
                  <span
                    onClick={() => {
                      setToggleFileView(false), showUploadsAfter();
                    }}
                  >
                    <Image
                      alt="gridView"
                      src={!toggleFileView ? GridViewActive : GridView}
                      width={24}
                      height={20}
                    />
                  </span>
                )}
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
              beforeUpload={(file, fileList) => {
                setLoadingArray([...fileList]);
              }}
              onChange={(info) => {
                let fileListData = [...info.fileList];
                let length = info.fileList.length;
                if (info.file.status == "uploading") {
                  setAddFileIndicator(true);
                }
                if (info.file.status == "done") {
                  setTimeout(() => {
                    setLoadingArray([]);
                    setAddFileIndicator(false);
                  }, 3000);
                }
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
                    <Spin
                      size="large"
                      className="styles_spin"
                      spinning={
                        addFileIndicator &&
                        loadingArray.findIndex((o) => o.uid === file.uid) > -1
                      }
                    >
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
                    </Spin>
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
                dataSource={filteredArray()}
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
          editFolderNameVal={editFolderNameVal}
        />
      </Modal>

      <Modal
        destroyOnClose={true}
        className="modalStyle"
        visible={preview.previewVisible}
        footer={null}
        closeIcon={<CloseCircleOutlined className={styles.crossIcon} />}
        onCancel={() => {
          setPreview({ ...preview, previewVisible: false }),
            setPreviewImageIndicator(false);
        }}
      >
        {preview.previewPath && (
          <span>
            <Spin spinning={previewImageIndicator} size="large">
              <Image
                className="modal--img"
                id="modalImageId"
                alt="example"
                src={preview.previewPath}
                width={"470px"}
                height={"470px"}
              />
            </Spin>

            <div className="d-flex copy--modal">
              <div className="copy__text">
                <h6>{preview.previewName}</h6>
                <div
                  className="copy_wrap"
                  onClick={() => {
                    navigator.clipboard.writeText(preview.previewCopyShortCode),
                      message.success("Short code copied");
                  }}
                >
                  <Image
                    alt="copyShortCode"
                    src={CopyShortCodeImage}
                    width={"16px"}
                    height={"10px"}
                  />
                  <span> [[{preview.previewCopyShortCode}]]</span>
                </div>
              </div>
              <div className="date_wrap">
                <Image
                  src={DatePickerImage}
                  alt="datePicker"
                  width={"18px"}
                  height={"20px"}
                />
                <span>
                  {moment
                    .unix(preview.previewCreatedAt)
                    .format("MMM DD, YYYY, h:mm:ss A")}
                </span>
              </div>
            </div>
          </span>
        )}
      </Modal>
    </>
  );
};
export default UploadFileUI;
