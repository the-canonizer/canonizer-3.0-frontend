import React, { useState, useEffect, useRef } from "react";
import UploadFileUI from "./uploadFilesUI";
import { useDispatch } from "react-redux";
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
  hideUploadFiles,
  showUploadFiles,
} from "src/store/slices/uiSlice";
import {
  deleteFolderApi,
  getFileInsideFolderApi,
  getUploadFileAndFolder,
  uploadFile,
} from "src/network/api/userApi";

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
  const showFiles = () => dispatch(showUploadFiles());
  const hideFiles = () => dispatch(hideUploadFiles());

  const [input, setInput] = useState("");
  const [selectedFolderID, setSelectedFolderID] = useState("");
  const [fileLists, setFileLists] = useState([]);
  const [folderFiles, setFolderFiles] = useState([]);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [fileAndFolderList, setFileAndFolderList] = useState([]);
  const [testFileList, setTestFileList] = useState([]);
  const ref = useRef();
  const closeFolder = () => {
    showUploadsAfter();
    enableCreateFolderBtn();
    openFolderHide();
  };

  const uploadFun = async () => {
    const formData = new FormData();
    console.log(uploadFileList, "uploadFileList");
    for (const key of Object.keys(uploadFileList)) {
      formData.append("file[]", uploadFileList[key].originFileObj),
        formData.append("name[]", uploadFileList[key].name);
    }
    formData.append("folder_id", "");
    let res = await uploadFile(formData);
    if (res && res.status_code == 200) {
      setFolderFiles([]);
      fileStatusHide();
      enableCreateFolderBtn();
      uploadOptionsHide();
      shownFolder();
      hideFiles();
      showUploadsAfter();
      GetUploadFileAndFolder();
    }
  };
  const handleCancel = () => {
    setFileLists(fileLists);
    fileStatusHide();
    // disbleCreateFolderBtn();
    // addButtonHide();
    // dragBoxHide();
    // uploadOptionsHide();
    {
      fileLists.length > 0
        ? (enableCreateFolderBtn(),
          shownAddButton(),
          dragBoxHide(),
          uploadOptionsHide())
        : (disbleCreateFolderBtn(),
          addButtonHide(),
          dragBoxShow(),
          uploadOptionsShow());
    }
  };
  const handle_X_btn = () => {
    crossBtnHide();
    dragBoxHide();
    showFiles();
    uploadOptionsHide();
  };
  const addNewFile = () => {
    hideFiles();
    dragBoxShow();
    closeFolder();
    hideUploadsAfter();
    disbleCreateFolderBtn();
    folderHide();
    uploadOptionsHide();
    shownCrossBtn();
  };

  const GetFileInsideFolderData = async (id) => {
    console.log("hello");
    let response = await getFileInsideFolderApi(id);
    if (response) {
      console.log("Hello", response, "getFileInsideFolderApi");
      //setFileAndFolderList(response.data);
    }
  };

  const Openfolder = (i) => {
    console.log(i, "itemId");
    //let ID = document.getElementsByClassName("folderId" + i)[0].id;
    console.log(i, "IsdsdD");
    shownFileStatus();
    openFolderShow();
    setSelectedFolderID(i);
    disbleCreateFolderBtn();
    hideUploadsAfter();
    GetFileInsideFolderData(i);
  };

  // const removeFiles = (originNode, file, currFileList) => {
  //   let uid = file.uid;
  //   let fileIndex = currFileList.findIndex((element) => element.uid == uid);
  //   let newarray = [...fileLists];

  //   setFileLists(newarray);
  //   newarray.splice(fileIndex, 1);
  //   if (newarray.length < 1) {
  //     dragBoxShow();
  //     uploadOptionsHide();
  //     addButtonHide();
  //   }
  // };
  const removeFiles = async (originNode, file, currFileList) => {
    let newarray = [...fileLists];
    if (file.uid) {
      let uid = file.uid;
      let fileIndex = currFileList.findIndex((element) => element.uid == uid);
    } else {
      let folderIndex = currFileList.findIndex(
        (element) => element.id == originNode.id
      );
      let res = await deleteFolderApi(originNode.id);
      if (res && res.status_code == 200) {
        newarray.splice(folderIndex, 1);
        setFileLists(newarray);

        {
          newarray.length > 0
            ? (dragBoxHide(), uploadOptionsHide(), shownAddButton())
            : (dragBoxShow(), uploadOptionsHide(), hideAddButton());
        }
      }
    }
  };
  const removeUploadFiles = (originNode, file, currFileList) => {
    let uid = file.uid;
    let fileIndex = currFileList.findIndex((element) => element.uid == uid);
    let newarray = [...uploadFileList];

    setUploadFileList(newarray);
    newarray.splice(fileIndex, 1);
    if (newarray.length > 1) {
      dragBoxHide();
      uploadOptionsHide();
      addButtonHide();
    }
  };
  const GetUploadFileAndFolder = async () => {
    console.log("hello");
    let response = await getUploadFileAndFolder();
    if (response) {
      console.log("Hello");
      let filesArr = response.data.files;
      let FileArrData = filesArr.map((v) => ({ ...v, type: "file" }));
      let folderArr = response.data.folders;
      let folderArrData = folderArr.map((v) => ({ ...v, type: "folder" }));
      let arr = [];
      arr.push(...FileArrData);
      arr.push(...folderArrData);
      setFileAndFolderList(arr);
      //console.log(response.data, 'Responsedat', ...folderArrData,...FileArrData, 'folderArrData')
      setFileLists(arr);
      if (FileArrData.length > 0) {
        dragBoxHide();
        shownAddButton();
        enableCreateFolderBtn();
      }
    }
  };
  //onLoad
  useEffect(() => {
    GetUploadFileAndFolder();
  }, []);
  console.log(fileAndFolderList, "fileAndFolderList");
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
    />
  );
};

export default UploadFiles;
