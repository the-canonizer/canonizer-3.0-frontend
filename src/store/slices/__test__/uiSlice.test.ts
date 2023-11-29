// uiSlice.test.js
import uiReducer, {
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
} from "../uiSlice"; // Replace with the path to your slice file

describe("uiSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
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
    };
  });

  it("should handle showLoginModal", () => {
    const newState = uiReducer(initialState, showLoginModal());
    expect(newState.loginModalVisible).toEqual(true);
  });

  it("should handle hideLoginModal", () => {
    const stateWithLoginModal = { ...initialState, loginModalVisible: true };
    const newState = uiReducer(stateWithLoginModal, hideLoginModal());
    expect(newState.loginModalVisible).toEqual(false);
  });

  it("should handle showRegistrationModal", () => {
    const newState = uiReducer(initialState, showRegistrationModal());
    expect(newState.registrationModalVisible).toEqual(true);
  });

  it("should handle hideRegistrationModal", () => {
    const stateWithRegistrationModal = {
      ...initialState,
      registrationModalVisible: true,
    };
    const newState = uiReducer(
      stateWithRegistrationModal,
      hideRegistrationModal()
    );
    expect(newState.registrationModalVisible).toEqual(false);
  });

  it("should handle showForgotModal", () => {
    const newState = uiReducer(initialState, showForgotModal());
    expect(newState.forgotModalVisible).toEqual(true);
  });

  it("should handle hideForgotModal", () => {
    const stateWithForgotModal = { ...initialState, forgotModalVisible: true };
    const newState = uiReducer(stateWithForgotModal, hideForgotModal());
    expect(newState.forgotModalVisible).toEqual(false);
  });

  it("should handle showMultiUserModal", () => {
    const newState = uiReducer(initialState, showMultiUserModal());
    expect(newState.multipleUserModalVisible).toEqual(true);
  });

  it("should handle hideMultiUserModal", () => {
    const stateWithMultiUserModal = {
      ...initialState,
      multipleUserModalVisible: true,
    };
    const newState = uiReducer(stateWithMultiUserModal, hideMultiUserModal());
    expect(newState.multipleUserModalVisible).toEqual(false);
  });

  it("should handle hideFolderModal", () => {
    const stateWithFolderModal = {
      ...initialState,
      createFolderShowModal: true,
    };
    const newState = uiReducer(stateWithFolderModal, hideFolderModal());
    expect(newState.createFolderShowModal).toEqual(false);
  });

  it("should handle showFolderModal", () => {
    const newState = uiReducer(initialState, showFolderModal());
    expect(newState.createFolderShowModal).toEqual(true);
  });

  it("should handle showDrageBox", () => {
    const newState = uiReducer(initialState, showDrageBox());
    expect(newState.dragBox).toEqual(true);
  });

  it("should handle hideDrageBox", () => {
    const stateWithDragBox = { ...initialState, dragBox: true };
    const newState = uiReducer(stateWithDragBox, hideDrageBox());
    expect(newState.dragBox).toEqual(false);
  });

  it("should handle createFolderBtnDisable", () => {
    const newState = uiReducer(initialState, createFolderBtnDisable());
    expect(newState.disabledCreateFolderBtn).toEqual(true);
  });

  it("should handle createFolderBtnEnable", () => {
    const stateWithDisabledCreateFolderBtn = {
      ...initialState,
      disabledCreateFolderBtn: true,
    };
    const newState = uiReducer(
      stateWithDisabledCreateFolderBtn,
      createFolderBtnEnable()
    );
    expect(newState.disabledCreateFolderBtn).toEqual(false);
  });

  it("should handle hideUploadOptions", () => {
    const stateWithVisibleUploadOptions = {
      ...initialState,
      visibleUploadOptions: true,
    };
    const newState = uiReducer(
      stateWithVisibleUploadOptions,
      hideUploadOptions()
    );
    expect(newState.visibleUploadOptions).toEqual(false);
  });

  it("should handle showUploadOptions", () => {
    const newState = uiReducer(initialState, showUploadOptions());
    expect(newState.visibleUploadOptions).toEqual(true);
  });

  it("should handle showAfterUploads", () => {
    const newState = uiReducer(initialState, showAfterUploads());
    expect(newState.uploadAfter).toEqual(true);
  });

  it("should handle hideAfterUploads", () => {
    const stateWithUploadAfter = { ...initialState, uploadAfter: true };
    const newState = uiReducer(stateWithUploadAfter, hideAfterUploads());
    expect(newState.uploadAfter).toEqual(false);
  });

  it("should handle showFolder", () => {
    const newState = uiReducer(initialState, showFolder());
    expect(newState.folderShown).toEqual(true);
  });

  it("should handle hideFolder", () => {
    const stateWithFolderShown = { ...initialState, folderShown: true };
    const newState = uiReducer(stateWithFolderShown, hideFolder());
    expect(newState.folderShown).toEqual(false);
  });

  it("should handle showOpenFolder", () => {
    const newState = uiReducer(initialState, showOpenFolder());
    expect(newState.folderOpen).toEqual(true);
  });

  it("should handle hideOpenFolder", () => {
    const stateWithFolderOpen = { ...initialState, folderOpen: true };
    const newState = uiReducer(stateWithFolderOpen, hideOpenFolder());
    expect(newState.folderOpen).toEqual(false);
  });

  it("should handle showAddButton", () => {
    const newState = uiReducer(initialState, showAddButton());
    expect(newState.addButton).toEqual(true);
  });

  it("should handle hideAddButton", () => {
    const stateWithAddButton = { ...initialState, addButton: true };
    const newState = uiReducer(stateWithAddButton, hideAddButton());
    expect(newState.addButton).toEqual(false);
  });

  it("should handle showFileStatus", () => {
    const newState = uiReducer(initialState, showFileStatus());
    expect(newState.fileStatus).toEqual(true);
  });

  it("should handle hideFileStatus", () => {
    const stateWithFileStatus = { ...initialState, fileStatus: true };
    const newState = uiReducer(stateWithFileStatus, hideFileStatus());
    expect(newState.fileStatus).toEqual(false);
  });

  it("should handle showCrossBtn", () => {
    const newState = uiReducer(initialState, showCrossBtn());
    expect(newState.crossBtn).toEqual(true);
  });

  it("should handle hideCrossBtn", () => {
    const stateWithCrossBtn = { ...initialState, crossBtn: true };
    const newState = uiReducer(stateWithCrossBtn, hideCrossBtn());
    expect(newState.crossBtn).toEqual(false);
  });

  it("should handle hideUploadFiles", () => {
    const stateWithShowFiles = { ...initialState, showFiles: "afterUpload" };
    const newState = uiReducer(stateWithShowFiles, hideUploadFiles());
    expect(newState.showFiles).toEqual("hideUpload");
  });

  it("should handle showUploadFiles", () => {
    const newState = uiReducer(initialState, showUploadFiles());
    expect(newState.showFiles).toEqual("afterUpload");
  });

  it("should handle showSocialEmailPopup", () => {
    const newState = uiReducer(initialState, showSocialEmailPopup());
    expect(newState.showSocialLoginEmailPopup).toEqual(true);
  });

  it("should handle hideSocialEmailPopup", () => {
    const stateWithSocialEmailPopup = {
      ...initialState,
      showSocialLoginEmailPopup: true,
    };
    const newState = uiReducer(
      stateWithSocialEmailPopup,
      hideSocialEmailPopup()
    );
    expect(newState.showSocialLoginEmailPopup).toEqual(false);
  });

  it("should handle updateStatus", () => {
    const newState = uiReducer(initialState, updateStatus("success"));
    expect(newState.apiStatus).toEqual("success");
  });

  it("should handle showSocialNamePopup", () => {
    const newState = uiReducer(initialState, showSocialNamePopup());
    expect(newState.showSocialLoginNamePopup).toEqual(true);
  });

  it("should handle hideSocialNamePopup", () => {
    const stateWithSocialNamePopup = {
      ...initialState,
      showSocialLoginNamePopup: true,
    };
    const newState = uiReducer(stateWithSocialNamePopup, hideSocialNamePopup());
    expect(newState.showSocialLoginNamePopup).toEqual(false);
  });

  it("should handle setIsFolderOpen", () => {
    const newState = uiReducer(initialState, setIsFolderOpen(true));
    expect(newState.isFolderOpen).toEqual(true);
  });

  it("should handle setFolderId", () => {
    const newState = uiReducer(initialState, setFolderId(123));
    expect(newState.folderId).toEqual(123);
  });

  it("should handle resetBtnDisabled", () => {
    const newState = uiReducer(initialState, resetBtnDisabled());
    expect(newState.disabledResetBtn).toEqual(true);
  });

  it("should handle resetBtnEnabled", () => {
    const stateWithDisabledResetBtn = {
      ...initialState,
      disabledResetBtn: true,
    };
    const newState = uiReducer(stateWithDisabledResetBtn, resetBtnEnabled());
    expect(newState.disabledResetBtn).toEqual(false);
  });

  it("should handle showRemoveSupportModal", () => {
    const newState = uiReducer(initialState, showRemoveSupportModal());
    expect(newState.remove_support_modal).toEqual(true);
  });

  it("should handle hideRemoveSupportModal", () => {
    const stateWithSupportModal = {
      ...initialState,
      remove_support_modal: true,
    };
    const newState = uiReducer(stateWithSupportModal, hideRemoveSupportModal());
    expect(newState.remove_support_modal).toEqual(false);
  });
});
