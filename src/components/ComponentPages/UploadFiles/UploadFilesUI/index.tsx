import React, { Fragment } from "react";
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
  Spin,
  Alert,
  Empty,
} from "antd";
import {
  InboxOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  FolderFilled,
  FileTextFilled,
  FilePdfFilled,
  FileUnknownFilled,
  MoreOutlined,
  FilePptOutlined,
  FileOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import styles from "./UploadFile.module.scss";
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
import reset from "../../../../assets/image/reset.png";
import addFolder from "../../../../assets/image/add-folder.png";
import addFile from "../../../../assets/image/add.png";
import download from "../../../../assets/image/DownloadFile.svg";
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
  globalSearchUploadFiles,
} from "../../../../network/api/userApi";
import { labels } from "../../../../messages/label";
import { setTimeout } from "timers";
// import SideBar from "../../CampForum/UI/sidebar";
import queryParams from "src/utils/queryParams";
import CustomSkelton from "../../../common/customSkelton";

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
  DeleteConfirmationVisible,
  setDeleteConfirmationVisible,
  flickringData,
  setFlickringData,
  toggleFileView,
  setToggleFileView,
  getUploadFilesLoadingIndicator,
  getUploadFolderLoadingIndicator,
}: any) => {
  const [uploadStatus] = useState(false);
  // const [toggleFileView, setToggleFileView] = useState(false);
  const [previewImageIndicator, setPreviewImageIndicator] = useState(false);
  const [addFileIndicator, setAddFileIndicator] = useState(false);
  const [loadingArray, setLoadingArray] = useState([]);
  const [search, setSearch] = useState<any>("");
  const [updateList, setUpdateList] = useState({});
  const [datePick, setDatePick] = useState("");
  const [createFolderForm] = Form.useForm();
  // const imageTimer = 2500;
  const [rename, setRename] = useState("");
  const [editFolderNameVal, setEditFolderNameVal] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editModalId, setEditModalId] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewPath: "",
    previewName: "",
    prevShort: "",
    previewCopyShortCode: "",
    previewCreatedAt: 0,
  });
  const [removeFileData, setRemoveFileData] = useState({
    keyParam: "",
    obj: {},
    fileLists: [],
  });
  const dispatch = useDispatch<AppDispatch>();
  const drageBoxVisible = useSelector((state: RootState) => state.ui?.dragBox);
  const disabledCreateFolder = useSelector(
    (state: RootState) => state.ui?.disabledCreateFolderBtn
  );
  const disabledResetButton = useSelector(
    (state: RootState) => state.ui?.disabledResetBtn
  );
  const dragBoxStatus = useSelector((state: RootState) => state.ui?.dragBox);
  const show_UploadOptions = useSelector(
    (state: RootState) => state.ui?.visibleUploadOptions
  );
  const afterUpload = useSelector((state: RootState) => state.ui?.uploadAfter);
  // const showFolderData = useSelector(
  //   (state: RootState) => state.ui.folderShown
  // );
  const openFolder = useSelector((state: RootState) => state.ui?.folderOpen);
  const addButtonShow = useSelector((state: RootState) => state.ui?.addButton);
  const fileStatus = useSelector((state: RootState) => state.ui?.fileStatus);
  const showCrossBtn = useSelector((state: RootState) => state.ui?.crossBtn);
  const afterUploadClass = useSelector(
    (state: RootState) => state.ui?.showFiles
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
  const [imageStatus, setImageStatus] = useState("file");
  const [loadingImage, setLoadingImage] = useState(false);
  const validateMessages = {
    required: "${name} is required !",
  };
  //File Name Length
  const fileNameLength = 30;

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
      <Menu.Item
        onClick={() => {
          Openfolder(obj.id);
        }}
      >
        <span id="openFolder" data-testid="open_folder">
          Open folder
        </span>
      </Menu.Item>
      <Menu.Item onClick={() => editFolder(obj)}>
        <span id="editFolderName">Edit folder name</span>
      </Menu.Item>
      <span
        onClick={() => {
          setRemoveFileData({ keyParam: obj, obj: {}, fileLists: fileLists }),
            setDeleteConfirmationVisible(true);
        }}
      >
        <Menu.Item>
          <span id="deleteFolder">Delete folder</span>
        </Menu.Item>
      </span>
    </Menu>
  );
  const menu_files = (i, item) => (
    <Menu>
      {imageRegexData.test(item.file_type) ? (
        <Menu.Item
          data-testid="test1"
          onClick={() => {
            setPreview({
              previewVisible: true,
              previewName:
                item.file_name.length > fileNameLength
                  ? item.file_name.substring(0, fileNameLength) + "..."
                  : item.file_name,
              previewPath: item.file_path,
              prevShort: item.short_code_path,
              previewCopyShortCode: item.short_code,
              previewCreatedAt: item.created_at,
            });
          }}
        >
          <span className={styles.menu_item}>
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
      ) : (
        <Menu.Item
          data-testid="test2"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/${item.file_path}`;
          }}
        >
          <span className={styles.menu_item}>
            <Image
              id="downloadFile"
              alt="download file"
              src={download}
              width={15}
              height={13}
            />
            <span className={styles.marginLeftView}>Download File</span>
          </span>
        </Menu.Item>
      )}
      <Menu.Item
        data-testid="test3"
        onClick={() => {
          {
            navigator.clipboard.writeText(item.short_code_path),
              message.success("Perma Link Copied");
          }
        }}
      >
        <span className={styles.menu_item}>
          <Image
            id="copyShortCode"
            alt="copyShortCode"
            src={CopyShortCode}
            width={12}
            height={15}
          />
          <span className={styles.marginLeftView}>Copy Perma Link</span>
        </span>
      </Menu.Item>
      <span
        data-testid="test4"
        onClick={() => {
          setRemoveFileData({
            keyParam: item,
            obj: item,
            fileLists: fileLists,
          }),
            setDeleteConfirmationVisible(true);
        }}
      >
        <Menu.Item>
          <span className={styles.menu_item}>
            <Image
              id="deleteFile"
              alt="Trash Data "
              src={Trash}
              width={12}
              height={15}
            />
            <span id="delete_file_text" className={styles.marginLeftView}>
              Delete File
            </span>
          </span>
        </Menu.Item>
      </span>
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
                alt="uploaded-file"
                src={`${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/${obj.file_path}`}
                height={150}
                width={140}
              />
            );
          } else if (obj.type == "folder") {
            return (
              <FolderFilled
                data-testid="folderFilled"
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

  const cancelBtn = () => {
    handleCancel();
    setLoadingImage(false);
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

  const onFinish = () => {
    editModal ? changeFolderName() : createNewFolder();
  };
  const onFinishValidation = () => {
    uploadList(), uploadFun();
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (name, obj) => {
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
      title: "Perma Link",
      dataIndex: "code",
      key: "code",
      render: (code, obj) => {
        return (
          <div className={styles.CopyShortCode}>
            {obj.short_code_path ? (
              <>
                <div className={styles.icon_height}>
                  {`[[${
                    obj.short_code_path.length > fileNameLength
                      ? obj.short_code_path.substring(0, fileNameLength) + "..."
                      : obj.short_code_path
                  }]]`}
                </div>
                <div className={styles.shortcode_icon}>
                  <span
                    className={styles.folder_icons}
                    onClick={() => {
                      navigator.clipboard.writeText(obj.short_code_path),
                        message.success("Perma Link Copied");
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
              placement="bottom"
              title=""
              content={
                obj.file_type ? (
                  <>
                    {imageRegexData.test(obj.file_type) ? (
                      <div
                        className={styles.menu_item}
                        onClick={() => {
                          setPreview({
                            previewVisible: true,
                            previewName: obj.file_name,
                            previewPath: obj.file_path,
                            prevShort: obj.short_code_path,
                            previewCopyShortCode: obj.short_code,
                            previewCreatedAt: obj.created_at,
                          });
                        }}
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
                    ) : (
                      <div
                        className={styles.menu_item}
                        onClick={() => {
                          window.location.href = `${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/${obj.file_path}`;
                        }}
                      >
                        <Image
                          alt="downloadFile"
                          src={download}
                          width={15}
                          height={13}
                        />
                        <span className={styles.marginLeftView}>
                          Download File
                        </span>
                      </div>
                    )}

                    <div
                      className={styles.menu_item}
                      onClick={() => {
                        navigator?.clipboard?.writeText(
                          keyParam.short_code_path
                        ),
                          message.success("Perma Link Copied");
                      }}
                    >
                      <Image
                        alt="copyShortCode"
                        src={CopyShortCode}
                        width={12}
                        height={15}
                      />
                      <span className={styles.marginLeftView}>
                        Copy Perma Link
                      </span>
                    </div>
                    <div
                      className={styles.menu_item}
                      onClick={() => {
                        setRemoveFileData({
                          keyParam: keyParam,
                          obj: obj,
                          fileLists: fileLists,
                        }),
                          setDeleteConfirmationVisible(true);
                      }}
                    >
                      <Image
                        alt="Trash Data "
                        src={Trash}
                        width={12}
                        height={15}
                      />
                      <span className={styles.marginLeftView}>Delete File</span>
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
    Object.entries(updateList).map(([k, v]) => {
      const fileIndex = fileLists.findIndex((obj) => k == obj.uid);
      const fileListsArr = [...fileLists];
      if (fileListsArr[fileIndex]) {
        const fileExtension = fileListsArr[fileIndex].name.split(".").pop();
        fileListsArr[fileIndex].name = v + "." + fileExtension;
        setFileLists(fileListsArr);
      }
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
    if (!openFolder && search !== "") {
      return filteredList;
    }
    return (openFolder ? getFileListFromFolderID : fileLists)?.filter((val) => {
      if (val.id) {
        val.key = val.id;
      }
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
    return getUploadFilesLoadingIndicator ? (
      <CustomSkelton
        skeltonFor="cardForUploadFile"
        bodyCount={15}
        stylingClass=""
        isButton={false}
      />
    ) : (
      <div className={"folderId" + item.id} id={"folderId" + item.id}>
        {item && item.type && item.type == "folder" && !toggleFileView ? (
          <div className={styles.Folder_container}>
            <Card
              className={styles.FolderData}
              onClick={() => {
                Openfolder(item.id);
              }}
            >
              <div className={styles.folder_icon}>
                <div className="folder--wrap">
                  <div className="foldername">
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
              </div>
            </Card>
            <div className={styles.dropdown} data-testid="overlay_menu">
              <Dropdown
                overlay={menu(i, item)}
                trigger={["click"]}
                placement="topCenter"
              >
                <div
                  data-testid="open_folder_render_mennu"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreOutlined />
                </div>
              </Dropdown>
            </div>
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
              {displayImage(
                item,
                `${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/${item.file_path}`
              )}
            </div>
            <h3 className="BoxcopyWrap">
              <span className="value">
                {subStringData(item.name ? item.name : item.file_name)}
              </span>
              <span
                data-testid="cpoy_span"
                className="copySpan"
                onClick={() => {
                  navigator.clipboard.writeText(item.short_code_path),
                    message.success("Perma Link Copied");
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
    return fileName?.length > 10 ? fileName.substring(0, 10) + "..." : fileName;
  };
  const filterArrList = [];
  const searchFilter = () => {
    return (openFolder ? fileLists : filteredArray())?.length > 0 ? (
      (openFolder ? fileLists : filteredArray()).map((item, i) => {
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
                return getUploadFolderLoadingIndicator ? (
                  <CustomSkelton
                    skeltonFor="cardForUploadFile"
                    bodyCount={10}
                    stylingClass=""
                    isButton={false}
                  />
                ) : (
                  <div>
                    <Card
                      size="small"
                      title={
                        <h2 className={styles.FolderOpenHeading}>
                          {" "}
                          <span
                            data-testid="arrow_outlined"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              closeFolder();
                              StatusHideFile();
                              setFlickringData(false);
                              setSearch("");
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
                          ? openFolder
                            ? filteredArray() && filteredArray().length > 0
                              ? filteredArray().map((file, i) => {
                                  return openFolderInGridView(file, i);
                                })
                              : flickringData && (
                                  <div className={styles.emptyFolderData}>
                                    <Empty
                                      description={<span>No Data Found</span>}
                                    />
                                  </div>
                                )
                            : ""
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
      })
    ) : dragBoxStatus == true ? (
      ""
    ) : !toggleFileView ? (
      <div className={styles.emptyFolderData}>
        <Empty description={<span>No Data Found</span>} />
      </div>
    ) : (
      ""
    );
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
                alt="displayed-file"
                src={imageData}
                height={150}
                width={140}
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
  // const confirm = (keyParam) => {
  //   message.info("Clicked on Yes.");
  //   removeFiles(keyParam);
  // };
  const getGlobalSearchUploadFile = async (queryString) => {
    let response = await globalSearchUploadFiles(
      queryParams({ query: queryString })
    );
    if (response && response.status_code == 200) {
      setFilteredList(response.data.files.map((v) => ({ ...v, type: "file" })));
    }
  };
  const openFolderInGridView = (file, i) => {
    return (
      <div
        className={styles.view_After_Upload}
        //key="upload_file_one"
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
            {displayImage(
              file,
              `${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/${file.file_path}`
            )}
          </div>
          <h3 className="BoxcopyWrap">
            <span className="value">{subStringData(file.file_name)}</span>
            <span
              data-testid="copySpan"
              className="copySpan"
              onClick={() => {
                navigator.clipboard.writeText(file.short_code_path),
                  message.success("Perma Link Copied");
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
            {moment.unix(file.created_at).format("MMM DD, YYYY, h:mm:ss A")}
          </span>
        </Card>
      </div>
    );
  };
  const handleImageLoaded = () => {
    setPreviewImageIndicator(false);
    setImageStatus("loaded");
  };

  const handleImageErrored = () => {
    setPreviewImageIndicator(false);
    setImageStatus("failed to load");
  };

  useEffect(() => {
    setPreviewImageIndicator(true);
  }, [preview.previewVisible]);

  return (
    <Fragment>
      <div className="d-flex w-100">
        <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar">
          <div className="leftSideBar_Card p-0 m-0">{/* <SideBar /> */}</div>
        </aside>
        {getUploadFilesLoadingIndicator ? (
          <CustomSkelton
            skeltonFor="cardForUploadFile"
            bodyCount={15}
            stylingClass=""
            isButton={false}
          />
        ) : (
          <div className="pageContentWrap">
            <div className={styles.uploadFilesData}>
              <Form
                //name={editModal ? "Edit your folder name" : labels.CreateaFolder}
                form={createFolderForm}
                onFinish={onFinishValidation}
                validateMessages={validateMessages}
                layout="vertical"
                scrollToFirstError
              >
                <Card
                  title={
                    <h3>
                      {messages.labels.uploadFiles}{" "}
                      <span className={styles.span}>
                        {messages.labels.maxSize}
                      </span>
                    </h3>
                  }
                  className={styles.Card}
                  extra={
                    <div className="d-flex">
                      <div className={styles.top_btn}>
                        <div className="datepIcker">
                          <DatePicker
                            disabledDate={(current) =>
                              current.isAfter(moment().subtract(0, "day"))
                            }
                            disabled={show_UploadOptions || dragBoxStatus}
                            onChange={(date) => {
                              uploadStatus == true
                                ? setDatePick("")
                                : setDatePick(
                                    date ? date.toLocaleString() : ""
                                  );
                            }}
                            value={datePick && moment(new Date(datePick))}
                          />
                        </div>
                        <div className={styles.search_users}>
                          <div className="searchinput">
                            <SearchOutlined />
                          </div>

                          <Input
                            disabled={show_UploadOptions || dragBoxStatus}
                            id="datePickerText"
                            data-testid="datePickerText"
                            placeholder="Search"
                            autoComplete="off"
                            value={search}
                            type="text"
                            name="search"
                            onChange={(e) => {
                              setSearch(e.target.value);
                              openFolder
                                ? filteredArray()
                                : getGlobalSearchUploadFile(e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <Button
                            data-testid="add_AFile_Btn2"
                            disabled={disabledResetButton}
                            onClick={() => {
                              setSearch("");
                              setDatePick("");
                            }}
                            className={styles.create_folder_btn}
                          >
                            <Image
                              alt="adOne"
                              src={reset}
                              width={20}
                              height={22}
                            />
                            Reset
                          </Button>
                        </div>
                        <Button
                          data-testid="add_AFile_Btn"
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
                          <Image
                            alt="adOne"
                            src={addFolder}
                            width={20}
                            height={22}
                          />
                          Create a Folder
                        </Button>
                        {addButtonShow && !dragBoxStatus ? (
                          <Button
                            data-testid="addAFileBtn"
                            id="addAFileBtn"
                            className={styles.add_file_btn}
                            onClick={() => {
                              addNewFile(),
                                setToggleFileView(false),
                                setUpdateList({});
                              // setUploadStatus(true);
                              setDatePick("");
                              setSearch("");
                            }}
                          >
                            <Image
                              alt="adOne"
                              src={addFile}
                              width={20}
                              height={18}
                            />
                            Add a File
                          </Button>
                        ) : (
                          ""
                        )}

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
                                src={
                                  !toggleFileView ? GridViewActive : GridView
                                }
                                width={24}
                                height={20}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className={styles.uploded_Files}>
                    {showCrossBtn ? (
                      <div className={styles.Back_from_browser}>
                        <CloseCircleOutlined
                          onClick={() => {
                            handle_X_btn();
                            setSearch("");
                          }}
                          data-testid="handle_x_btn"
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <Upload
                      className={styles.UploadDataFiles}
                      name="file"
                      listType="picture"
                      multiple
                      data-testid="upload_images"
                      fileList={fileStatus ? folderFiles : uploadFileList}
                      beforeUpload={(file, fileList) => {
                        setLoadingArray([...fileList]);
                      }}
                      onChange={(info) => {
                        let length = info.fileList.length;
                        if (info.file.status == "uploading") {
                          setAddFileIndicator(true);
                          setLoadingImage(true);
                        }
                        if (info.file.status == "done") {
                          setLoadingImage(false);
                          setTimeout(() => {
                            setLoadingArray([]);
                            setAddFileIndicator(false);
                          }, 1000);
                        }
                        if (length) {
                          if (fileStatus) {
                            if (
                              info.file.status == "uploading" &&
                              info.file.percent == 0
                            ) {
                              setFolderFiles(info.fileList);
                              //setUploadFileList(info.fileList);
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
                        if (status !== "uploading")
                          if (status === "done") {
                            showFiles();
                          } else if (status === "error") {
                            message.error(
                              `${info.file.name} file upload failed.`
                            );
                          }
                      }}
                      onDrop={() => {}}
                      itemRender={(originNode, file) => {
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
                                loadingArray.findIndex(
                                  (o) => o.uid === file.uid
                                ) > -1
                              }
                            >
                              <div
                                className={styles.After_Upload}
                                style={
                                  fileSizeFlag
                                    ? { border: "1px solid red" }
                                    : {}
                                }
                              >
                                <CloseCircleOutlined
                                  data-testid="remove_upload_files"
                                  onClick={() => {
                                    removeUploadFiles(
                                      originNode,
                                      file,
                                      fileStatus ? folderFiles : uploadFileList
                                    );
                                  }}
                                />
                                <div className="imgWrap">
                                  {(!imageRegexData.test(file.type) ||
                                    (imageRegexData.test(file.type) &&
                                      file.thumbUrl)) &&
                                    displayImage(file, file.thumbUrl)}
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
                                <Form.Item
                                  label="Enter file name"
                                  className={"fileName_span"}
                                  name={file.uid}
                                  rules={[
                                    {
                                      required: true,
                                      message: "File Name is required",
                                    },
                                  ]}
                                >
                                  <Input
                                    data-testid="enterFileName"
                                    id="enterFileName"
                                    className="mr0"
                                    name={file.uid}
                                    onChange={(e) =>
                                      handleChangeFileName(e, file.uid)
                                    }
                                    placeholder="Full Name (with no extension)"
                                    onKeyDown={(e) => {
                                      // ============================ Allowed Special Chracter=====================================================
                                      // if (/[^\w]|_/g.test(e.key))
                                      //   return e.preventDefault();
                                      return (
                                        (e.key === "." || e.key === " ") &&
                                        (e.keyCode === 190 ||
                                          e.keyCode === 32) &&
                                        e.preventDefault()
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                              {fileSizeFlag
                                ? (uploadOptionsHide(),
                                  (
                                    <p className={styles.maxLimit}>
                                      This file is exceeding the max limit and
                                      will not be uploaded{" "}
                                    </p>
                                  ))
                                : " "}
                            </Spin>
                          </div>
                        );
                      }}
                    >
                      {drageBoxVisible !== false ? (
                        <div className={styles.Dragebox}>
                          <Button
                            id="clickOrDragAreaBtn"
                            className={styles.Drager}
                          >
                            <div className="uploadBTn" data-testid="drag_file">
                              <InboxOutlined />
                              <h2>
                                <b>Click or drag file to this area to upload</b>
                              </h2>
                              <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly
                                prohibit from uploading company data or other
                                band files
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
                        pagination={{ hideOnSinglePage: true }}
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {loadingImage ? (
                    <div>
                      <Spin
                        tip="Loading..."
                        spinning={loadingImage}
                        size="large"
                      >
                        <Alert
                          message="Image is loading. Please wait..."
                          type="info"
                        />
                      </Spin>
                      <br />
                      <br />
                    </div>
                  ) : (
                    ""
                  )}
                  <Form.Item>
                    {show_UploadOptions ? (
                      <div className={styles.Upload_Cancel_Btn}>
                        <Button
                          data-testid="upload_btn"
                          id="uploadBtn"
                          htmlType="submit"
                          className={styles.Upload_Btn}
                        >
                          Upload
                        </Button>
                        <Button
                          data-testid="cancel_btn"
                          id="cancelBtn"
                          htmlType="button"
                          className={styles.cancel_Btn}
                          onClick={cancelBtn}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </Form.Item>
                </Card>
              </Form>
            </div>
          </div>
        )}
      </div>

      <Modal
        className={styles.modal_cross}
        centered
        title={editModal ? "Edit your folder name" : labels.CreateaFolder}
        open={showCreateFolderModal}
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
        open={preview.previewVisible}
        footer={null}
        centered
        closeIcon={<CloseCircleOutlined className={styles.crossIcon} />}
        onCancel={() => {
          setPreview({ ...preview, previewVisible: false }),
            setPreviewImageIndicator(false);
        }}
      >
        {preview.previewPath ? (
          <span>
            <Spin spinning={previewImageIndicator} size="large">
              <Image
                className="modal--img"
                id="modalImageId"
                alt={imageStatus}
                src={`${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/${preview.previewPath}`}
                width={470}
                height={470}
                onLoad={handleImageLoaded}
                onError={handleImageErrored}
              />
            </Spin>

            <div className="d-flex copy--modal">
              <div className="copy__text">
                <h6>{preview.previewName}</h6>
                <div
                  data-testid="onCancel"
                  className="copy_wrap"
                  onClick={() => {
                    navigator.clipboard.writeText(preview.prevShort),
                      message.success("Perma Link Copied");
                  }}
                >
                  <Image
                    alt="copyShortCode"
                    src={CopyShortCodeImage}
                    width={16}
                    height={10}
                  />
                  <span>
                    {" "}
                    [[
                    {preview.prevShort.length > fileNameLength
                      ? preview.prevShort.substring(0, fileNameLength) + "..."
                      : preview.prevShort}
                    ]]
                  </span>
                </div>
              </div>
              <div className="date_wrap">
                <Image
                  src={DatePickerImage}
                  alt="datePicker"
                  width={18}
                  height={20}
                />
                <span>
                  {moment
                    .unix(preview.previewCreatedAt)
                    .format("MMM DD, YYYY, h:mm:ss A")}
                </span>
              </div>
            </div>
          </span>
        ) : (
          <div className={styles.emptyFolderData}>
            <br />
            <Empty description={<span>{"File doesn't exist"}</span>} />
            <br />
            <br />
          </div>
        )}
      </Modal>

      <Modal
        className={styles.modal_cross}
        title="Delete"
        open={DeleteConfirmationVisible}
        onOk={() => {
          setDeleteConfirmationVisible(false);
        }}
        onCancel={() => {
          setDeleteConfirmationVisible(false);
        }}
        footer={null}
        width="350px"
        closeIcon={<CloseCircleOutlined />}
      >
        <Form>
          <Form.Item style={{ marginBottom: "0px" }}>
            <p>Are you sure you want to delete ?</p>
          </Form.Item>
          <Form.Item
            className={styles.text_right}
            style={{ marginBottom: "0px" }}
          >
            <Button
              data-testid="remove_files"
              onClick={async () => {
                setDeleteLoading(true);
                await removeFiles(
                  removeFileData.keyParam,
                  removeFileData.obj,
                  removeFileData.fileLists
                );
                setDeleteLoading(false);
                //keyParam, obj, fileLists
              }}
              type="primary"
              style={{
                marginTop: 10,
                marginRight: 10,
              }}
              loading={deleteLoading}
              className="ant-btn ant-btn-orange"
            >
              Delete
            </Button>
            <Button
              data-testid="cancel_modal"
              onClick={() => {
                setDeleteConfirmationVisible(false);
              }}
              type="default"
              style={{
                marginTop: 10,
              }}
              className="ant-btn"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default UploadFileUI;
