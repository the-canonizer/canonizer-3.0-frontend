import React, { useState, useEffect, useRef } from "react";
import UploadFileUI from "./UploadFilesUI";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import {
  hideFolderModal,
  showDrageBox,
  hideDrageBox,
  createFolderBtnDisable,
  createFolderBtnEnable,
  hideUploadOptions,
  showUploadOptions,
  showAfterUploads,
  hideAfterUploads,
  showFolder,
  hideFolder,
  hideOpenFolder,
  showOpenFolder,
  hideAddButton,
  showAddButton,
  hideFileStatus,
  showFileStatus,
  showCrossBtn,
  hideCrossBtn,
  hideUploadFiles,
  showUploadFiles,
} from "src/store/slices/uiSlice";
import {
  deleteFolderApi,
  deleteUploadFileApi,
  getFileInsideFolderApi,
  getUploadFileAndFolder,
  uploadFile,
} from "src/network/api/userApi";
import { message } from "antd";
import isAuth from "../../../hooks/isUserAuthenticated";
const UploadFiles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dragBoxShow = () => dispatch(showDrageBox());
  const dragBoxHide = () => dispatch(hideDrageBox());
  const disbleCreateFolderBtn = () => dispatch(createFolderBtnDisable());
  const enableCreateFolderBtn = () => dispatch(createFolderBtnEnable());
  const uploadOptionsHide = () => dispatch(hideUploadOptions());
  const uploadOptionsShow = () => dispatch(showUploadOptions());
  const showUploadsAfter = () => dispatch(showAfterUploads());
  const hideUploadsAfter = () => dispatch(hideAfterUploads());
  const shownFolder = () => dispatch(showFolder());
  const folderHide = () => dispatch(hideFolder());
  const openFolderShow = () => dispatch(showOpenFolder());
  const openFolderHide = () => dispatch(hideOpenFolder());
  const addButtonHide = () => dispatch(hideAddButton());
  const shownAddButton = () => dispatch(showAddButton());
  const fileStatusHide = () => dispatch(hideFileStatus());
  const shownFileStatus = () => dispatch(showFileStatus());
  const crossBtnHide = () => dispatch(hideCrossBtn());
  const shownCrossBtn = () => dispatch(showCrossBtn());
  const showFiles = () => dispatch(showUploadFiles());
  const hideFiles = () => dispatch(hideUploadFiles());
  const openFolder = useSelector((state: RootState) => state.ui.folderOpen);

  const [input, setInput] = useState("");
  const [selectedFolderID, setSelectedFolderID] = useState("");
  const [fileLists, setFileLists] = useState([]);
  const [folderFiles, setFolderFiles] = useState([]);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [getFileListFromFolderID, setGetFileListFromFolderID] = useState([]);
  const [openFolderID, setOpenFolderID] = useState("");
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [flickringData, setFlickringData] = useState(false);
  const [DeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const isLogIn = isAuth();
  const ref = useRef();
  const closeFolder = () => {
    setGetFileListFromFolderID([]);
    setOpenFolderID("");
    showUploadsAfter();
    enableCreateFolderBtn();
    openFolderHide();
    localStorage.removeItem("isFolderOpen");
    localStorage.removeItem("folderId");
  };

  const uploadFun = async () => {
    const formData = new FormData();
    for (const key of Object.keys(
      openFolderID ? folderFiles : uploadFileList
    )) {
      if (
        (openFolderID ? folderFiles : uploadFileList)[key].size /
          (1024 * 1024) <
        5
      ) {
        formData.append(
          "file[]",
          (openFolderID ? folderFiles : uploadFileList)[key].originFileObj
        ),
          formData.append(
            "name[]",
            (openFolderID ? folderFiles : uploadFileList)[key].name
          );
      } else {
        message.error("Your upload file is greater than 5 mb");
        uploadOptionsHide();
        GetUploadFileAndFolder();
      }
    }
    formData.append("folder_id", openFolderID);
    let res = await uploadFile(formData);
    if (res && res.status_code == 200) {
      //fileStatusHide();
      openFolder ? "" : enableCreateFolderBtn();
      uploadOptionsHide();
      shownFolder();
      hideFiles();
      showUploadsAfter();
      GetUploadFileAndFolder();
      if (openFolderID) {
        GetFileInsideFolderData(openFolderID);
      }
    }
    uploadOptionsHide();
    GetUploadFileAndFolder();
  };
  const handleCancel = () => {
    setUploadFileList([]);
    setFolderFiles([]);
    uploadOptionsHide();
    fileStatusHide();
    GetUploadFileAndFolder();
  };
  const handle_X_btn = () => {
    crossBtnHide();
    dragBoxHide();
    showFiles();
    uploadFileList.length == 0
      ? (uploadOptionsHide(), GetUploadFileAndFolder())
      : uploadOptionsShow();
  };
  const addNewFile = () => {
    hideFiles();
    dragBoxShow();
    hideUploadsAfter();
    disbleCreateFolderBtn();
    folderHide();
    uploadOptionsHide();
    shownCrossBtn();
  };

  const GetFileInsideFolderData = async (id) => {
    let response = await getFileInsideFolderApi(id);
    if (response && response.status_code == 200) {
      setGetFileListFromFolderID(response.data);
      setFlickringData(true);
    }
  };

  const Openfolder = (i) => {
    setOpenFolderID(i);
    shownFileStatus();
    openFolderShow();
    setSelectedFolderID(i);
    disbleCreateFolderBtn();
    hideUploadsAfter();
    GetFileInsideFolderData(i);
    localStorage.setItem("isFolderOpen", "true"),
      localStorage.setItem("folderId", i);
  };

  const removeFiles = async (originNode, file, currFileList) => {
    if (originNode.type == "folder") {
      let res = await deleteFolderApi(originNode.id);
      if (res && res.status_code == 200) {
        setDeleteConfirmationVisible(false);
        GetUploadFileAndFolder();
        setFileLists(fileLists);
      }
    } else {
      let response = await deleteUploadFileApi(originNode.id);
      if (response && response.status_code == 200) {
        setDeleteConfirmationVisible(false);
        if (openFolderID) {
          GetFileInsideFolderData(openFolderID);
        }
        GetUploadFileAndFolder();
        setFileLists(fileLists);
      }
    }
    {
      fileLists.length > 0
        ? (dragBoxHide(), uploadOptionsHide(), shownAddButton())
        : (dragBoxShow(), uploadOptionsHide(), hideAddButton());
    }
  };

  const removeUploadFiles = (originNode, file, currFileList) => {
    let uid = file.uid;
    let fileIndex = currFileList.findIndex((element) => element.uid == uid);
    let newarray = [...currFileList];
    //uploadOptionsShow();
    newarray.splice(fileIndex, 1);
    openFolderID ? setFolderFiles(newarray) : setUploadFileList(newarray);
    if (newarray.length > 0) {
      dragBoxHide();
      shownAddButton();
    }
    if (newarray.length <= 0) {
      showFiles();
      uploadOptionsHide();
      GetUploadFileAndFolder();
      if (openFolderID) {
        GetFileInsideFolderData(openFolderID);
      }
    }
  };
  const GetUploadFileAndFolder = async () => {
    let response = await getUploadFileAndFolder();
    if (response) {
      let filesArr = response.data.files;
      let FileArrData = filesArr.map((v) => ({ ...v, type: "file" }));
      let folderArr = response.data.folders;
      let folderArrData = folderArr.map((v) => ({ ...v, type: "folder" }));
      let arr = [];
      arr.push(...FileArrData);
      arr.push(...folderArrData);
      setFileLists(arr);
      {
        arr.length > 0
          ? (dragBoxHide(),
            shownAddButton(),
            openFolder ? "" : enableCreateFolderBtn(),
            showUploadsAfter())
          : (dragBoxShow(), hideAddButton());
        openFolder ? "" : enableCreateFolderBtn();
      }
    }
  };
  //onLoad
  useEffect(() => {
    if (isLogIn) {
      GetUploadFileAndFolder();
      setOpenFolderID("");
      openFolderHide();
      uploadOptionsHide();
      if (localStorage.getItem("isFolderOpen")) {
        Openfolder(localStorage.getItem("folderId"));
      }
    }
  }, [isLogIn]);
  return (
    <UploadFileUI
      input={input}
      setInput={setInput}
      selectedFolderID={selectedFolderID}
      fileLists={fileLists}
      setFileLists={setFileLists}
      folderFiles={folderFiles}
      setFolderFiles={setFolderFiles}
      closeFolder={closeFolder}
      uploadFun={uploadFun}
      handleCancel={handleCancel}
      handle_X_btn={handle_X_btn}
      addNewFile={addNewFile}
      Openfolder={Openfolder}
      removeFiles={removeFiles}
      uploadFileList={uploadFileList}
      setUploadFileList={setUploadFileList}
      removeUploadFiles={removeUploadFiles}
      GetUploadFileAndFolder={GetUploadFileAndFolder}
      getFileListFromFolderID={getFileListFromFolderID}
      setShowCreateFolderModal={setShowCreateFolderModal}
      showCreateFolderModal={showCreateFolderModal}
      DeleteConfirmationVisible={DeleteConfirmationVisible}
      setDeleteConfirmationVisible={setDeleteConfirmationVisible}
      flickringData={flickringData}
      setFlickringData={setFlickringData}
    />
  );
};

export default UploadFiles;
