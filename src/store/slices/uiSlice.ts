import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loginModalVisible: false,
    registrationModalVisible: false,
    forgotModalVisible: false,
    multipleUserModalVisible: false,
    createFolderShowModal: false,
    dragBox: false,
    disabledCreateFolderBtn: true,
    visibleUploadOptions: false,
    uploadAfter: false,
    folderShown: false,
    folderOpen: false,
    addButton: false,
    fileStatus: false,
    crossBtn: false,
    showFiles: "afterUpload",
    showSocialLoginEmailPopup: true,
  },
  reducers: {
    showLoginModal: (state) => {
      state.loginModalVisible = true;
    },
    hideLoginModal: (state) => {
      state.loginModalVisible = false;
    },
    showRegistrationModal: (state) => {
      state.registrationModalVisible = true;
    },
    hideRegistrationModal: (state) => {
      state.registrationModalVisible = false;
    },
    showForgotModal: (state) => {
      state.forgotModalVisible = true;
    },
    hideForgotModal: (state) => {
      state.forgotModalVisible = false;
    },
    showMultiUserModal: (state) => {
      state.multipleUserModalVisible = true;
    },
    hideMultiUserModal: (state) => {
      state.multipleUserModalVisible = false;
    },
    hideFolderModal: (state) => {
      state.createFolderShowModal = false;
    },
    showFolderModal: (state) => {
      state.createFolderShowModal = true;
    },
    showDrageBox: (state) => {
      state.dragBox = true;
    },
    hideDrageBox: (state) => {
      state.dragBox = false;
    },
    createFolderBtnDisable: (state) => {
      state.disabledCreateFolderBtn = true;
    },
    createFolderBtnEnable: (state) => {
      state.disabledCreateFolderBtn = false;
    },
    showUploadOptions: (state) => {
      state.visibleUploadOptions = true;
    },
    hideUploadOptions: (state) => {
      state.visibleUploadOptions = false;
    },
    showAfterUploads: (state) => {
      state.uploadAfter = true;
    },
    hideAfterUploads: (state) => {
      state.uploadAfter = false;
    },
    showFolder: (state) => {
      state.folderShown = true;
    },
    hideFolder: (state) => {
      state.folderShown = false;
    },
    showOpenFolder: (state) => {
      state.folderOpen = true;
    },
    hideOpenFolder: (state) => {
      state.folderOpen = false;
    },
    showAddButton: (state) => {
      state.addButton = true;
    },
    hideAddButton: (state) => {
      state.addButton = false;
    },
    showFileStatus: (state) => {
      state.fileStatus = true;
    },
    hideFileStatus: (state) => {
      state.fileStatus = false;
    },
    showCrossBtn: (state) => {
      state.crossBtn = true;
    },
    hideCrossBtn: (state) => {
      state.crossBtn = false;
    },
    showUploadFiles: (state) => {
      state.showFiles = "afterUpload";
    },
    hideUploadFiles: (state) => {
      state.showFiles = "hideUpload";
    },
    showSocialEmailPopup: (state) => {
      state.showSocialLoginEmailPopup = true;
    },
    hideSocialEmailPopup: (state) => {
      state.showSocialLoginEmailPopup = false;
    },
  },
});

export const {
  showLoginModal,
  hideLoginModal,
  hideRegistrationModal,
  showRegistrationModal,
  showForgotModal,
  hideForgotModal,
  showMultiUserModal,
  hideMultiUserModal,
  hideFolderModal,
  showFolderModal,
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
  showSocialEmailPopup,
  hideSocialEmailPopup,
} = uiSlice.actions;

export default uiSlice.reducer;
