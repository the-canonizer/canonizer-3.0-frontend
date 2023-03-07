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
    disabledCreateFolderBtn: false,
    visibleUploadOptions: false,
    uploadAfter: false,
    folderShown: false,
    folderOpen: false,
    addButton: false,
    fileStatus: false,
    crossBtn: false,
    showFiles: "afterUpload",
    showSocialLoginEmailPopup: false,
    apiStatus: null,
    showSocialLoginNamePopup: false,
    isFolderOpen: false,
    folderId: null,
    disabledResetBtn: false,
    remove_support_modal: false,
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
    updateStatus: (state, action) => {
      state.apiStatus = action.payload;
    },
    setIsFolderOpen: (state, action) => {
      state.isFolderOpen = action.payload;
    },
    setFolderId: (state, action) => {
      state.folderId = action.payload;
    },
    showSocialNamePopup: (state) => {
      state.showSocialLoginNamePopup = true;
    },
    hideSocialNamePopup: (state) => {
      state.showSocialLoginNamePopup = false;
    },
    resetBtnDisabled: (state) => {
      state.disabledResetBtn = true;
    },
    resetBtnEnabled: (state) => {
      state.disabledResetBtn = false;
    },
    showRemoveSupportModal: (state) => {
      state.remove_support_modal = true;
    },
    hideRemoveSupportModal: (state) => {
      state.remove_support_modal = false;
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
  updateStatus,
  showSocialNamePopup,
  hideSocialNamePopup,
  setIsFolderOpen,
  setFolderId,
  resetBtnDisabled,
  resetBtnEnabled,
  showRemoveSupportModal,
  hideRemoveSupportModal,
} = uiSlice.actions;

export default uiSlice.reducer;
