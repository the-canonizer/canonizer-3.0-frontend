import { render, screen, waitFor } from "../../../../../utils/testUtils";
import messages from "../../../../../messages";
import ManageSupportUI from "../index";

const { labels } = messages;
const nickNameList = [];
const manageSupportList = [];
const clearAllChanges = jest.fn();
const removeAll = jest.fn();
const handleClose = jest.fn();
const checked = true;
const setManageSupportList = [],
  parentSupportDataList = [],
  getSupportStatusData = null,
  submitNickNameSupportCamps = jest.fn(),
  cancelManageRoute = jest.fn(),
  setSelectedtNickname = jest.fn(),
  selectedtNickname = "",
  setUpdatePostion = jest.fn();
const submitButtonDisable = false;

describe("ManageSupportUI", () => {
  it("render show SupportedCamps", () => {
    render(
      <ManageSupportUI
        nickNameList={nickNameList}
        manageSupportList={manageSupportList}
        clearAllChanges={clearAllChanges}
        removeAll={removeAll}
        handleClose={handleClose}
        checked={checked}
        setManageSupportList={setManageSupportList}
        parentSupportDataList={parentSupportDataList}
        getSupportStatusData={getSupportStatusData}
        submitNickNameSupportCamps={submitNickNameSupportCamps}
        cancelManageRoute={cancelManageRoute}
        setSelectedtNickname={setSelectedtNickname}
        selectedtNickname={selectedtNickname}
        submitButtonDisable={submitButtonDisable}
        setUpdatePostion={setUpdatePostion}
      />
    );
    expect(screen.getByText(labels.SupportedCamps)).toBeTruthy();
  });
});

describe("ManageSupportUI", () => {
  it("render show Nick Name To Support Above Camps", () => {
    render(
      <ManageSupportUI
        nickNameList={nickNameList}
        manageSupportList={manageSupportList}
        clearAllChanges={clearAllChanges}
        removeAll={removeAll}
        handleClose={handleClose}
        checked={checked}
        setManageSupportList={setManageSupportList}
        parentSupportDataList={parentSupportDataList}
        getSupportStatusData={getSupportStatusData}
        submitNickNameSupportCamps={submitNickNameSupportCamps}
        cancelManageRoute={cancelManageRoute}
        setSelectedtNickname={setSelectedtNickname}
        selectedtNickname={selectedtNickname}
        submitButtonDisable={submitButtonDisable}
        setUpdatePostion={setUpdatePostion}
      />
    );
    expect(screen.getByText("Nick Name To Support Above Camps")).toBeTruthy();
  });
});

it("render show submit button", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
    />
  );
  const submitButton = getAllByText("Submit")[0] as HTMLButtonElement;
  expect(submitButton).toBeTruthy();
});

it("render show cancel button", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
    />
  );
  const cancelButton = getAllByText("Cancel")[0] as HTMLButtonElement;
  expect(cancelButton).toBeTruthy();
});

it("render show clear changes button", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
    />
  );
  const clearChangesButton = getAllByText(
    "Clear all changes"
  )[0] as HTMLButtonElement;
  expect(clearChangesButton).toBeTruthy();
});

it("render show Quick Action Text", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
    />
  );
  const quickActionText = getAllByText("Quick Action:");
  expect(quickActionText).toBeTruthy();
});

it("render show Remove all Text", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
    />
  );
  const removeAllText = getAllByText("Remove all");
  expect(removeAllText).toBeTruthy();
});

it("render show checkbox", () => {
  const { container } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
    />
  );
  expect(
    container.getElementsByClassName("ManageSupport_checkbox__DQcrk")
  ).toBeTruthy();
});
