import React, { useState } from "react";
import UploadFileUI from "./uploadFilesUI";
import { Form, Menu } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
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
} from "src/store/slices/uiSlice";

const UploadFiles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hideCreateFolderModal = () => dispatch(hideFolderModal());
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

  const [input, setInput] = useState("");
  const [fileName, setfileName] = useState("");
  const [selectedFolderID, setSelectedFolderID] = useState("");
  const [fileLists, setFileLists] = useState([]);
  const [folderFiles, setFolderFiles] = useState([]);

  const Closefolder = () => {
    showUploadsAfter();
    enableCreateFolderBtn();
    openFolderHide();
  };
  const hideFiles = () => {
    let element = document.getElementsByClassName("ant-upload-list-picture");
    for (let x = 0; x < element.length; x++) {
      element[x].style.display = "none";
    }
  };
  const showfiles = () => {
    let element = document.getElementsByClassName("ant-upload-list-picture");
    for (let x = 0; x < element.length; x++) {
      element[x].style.display = "flex";
    }
  };
  const UploadFun = () => {
    setFolderFiles([]);
    fileStatusHide();
    enableCreateFolderBtn();
    uploadOptionsHide();
    shownFolder();
    hideFiles();
    showUploadsAfter();
  };
  const handleCancel = () => {
    setFileLists([]);
    fileStatusHide();
    disbleCreateFolderBtn();
    addButtonHide();
    dragBoxShow();
    uploadOptionsHide();
  };
  const handle_X_btn = () => {
    crossBtnHide();
    dragBoxHide();
    showfiles();
    uploadOptionsShow();
  };
  const addNewFile = () => {
    hideFiles();
    dragBoxShow();
    Closefolder();
    hideUploadsAfter();
    disbleCreateFolderBtn();
    folderHide();
    uploadOptionsHide();
    shownCrossBtn();
  };

  const Openfolder = (i) => {
    let ID = document.getElementsByClassName("folderId" + i)[0].id;
    shownFileStatus();
    openFolderShow();
    setSelectedFolderID(ID);
    disbleCreateFolderBtn();
    hideUploadsAfter();
  };

  const removeFiles = (originNode, file, currFileList) => {
    let uid = file.uid;
    let fileIndex = currFileList.findIndex((element) => element.uid == uid);
    let newarray = [...fileLists];

    setFileLists(newarray);
    newarray.splice(fileIndex, 1);
    if (newarray.length < 1) {
      dragBoxShow();
      uploadOptionsHide();
      addButtonHide();
    }
  };

  const createNewFolder = () => {
    let newFolder = {
      folderName: input,
      type: "folder",
      createdAt: moment().format("DD MMM-YYYY"),
      files: [],
      id: "",
    };
    let newarray = [...fileLists];
    newarray.push(newFolder);
    setFileLists(newarray);
    shownFolder();
    hideCreateFolderModal();
    dragBoxHide();
    shownAddButton();
  };

  const onFinish = (values) => {
    createNewFolder();
  };
  return (
    <UploadFileUI
      input={input}
      setInput={setInput}
      fileName={fileName}
      setfileName={setfileName}
      selectedFolderID={selectedFolderID}
      fileLists={fileLists}
      setFileLists={setFileLists}
      folderFiles={folderFiles}
      setFolderFiles={setFolderFiles}
      Closefolder={Closefolder}
      showfiles={showfiles}
      UploadFun={UploadFun}
      handleCancel={handleCancel}
      handle_X_btn={handle_X_btn}
      addNewFile={addNewFile}
      Openfolder={Openfolder}
      removeFiles={removeFiles}
      onFinish={onFinish}
    />
  );
};

export default UploadFiles;
