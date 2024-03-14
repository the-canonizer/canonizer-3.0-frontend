import {
  fireEvent,
  getAllByPlaceholderText,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import UploadFileUI from "../UploadFilesUI";
import messages from "../../../../messages";
import { cleanup } from "@testing-library/react-hooks";
import { Empty, Input } from "antd";
import { Provider, connectAdvanced } from "react-redux";
import UploadFiles from "..";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";

// import { showDrageBox } from "src/store/slices/uiSlice";

jest.mock("src/hooks/isUserAuthenticated", () =>
  jest.fn(() => ({ isUserAuthenticated: true }))
);

jest.mock("src/network/api/userApi", () => ({
  uploadFile: jest.fn(),
  deleteFolderApi: jest.fn(),
  createFolderApi: jest
    .fn()
    .mockReturnValue(Promise.resolve({ status_code: 200 })),
  deleteUploadFileApi: jest.fn(),
  getFileInsideFolderApi: jest
    .fn()
    .mockReturnValue(Promise.resolve({ success: true })),
  getUploadFileAndFolder: jest.fn(() =>
    Promise.resolve({ data: { files: [], folders: [] } })
  ),
  globalSearchUploadFiles: jest.fn((v) =>
    Promise.resolve({
      status_code: 200,
      data: { files: [{ ...v, type: "file", file_type: "image/jpeg" }] },
    })
  ),
}));
const { labels } = messages;

const input = "";
const setInput = jest.fn();
const selectedFolderID = jest.fn();
const setFileLists = jest.fn();
// const folderFiles = [];
const setFolderFiles = jest.fn();
const uploadFun = jest.fn();
const closeFolder = jest.fn();
const handleCancel = jest.fn();
const handle_X_btn = jest.fn();
const addNewFile = jest.fn();
const Openfolder = jest.fn();
const removeFiles = jest.fn();
const uploadFileList = [];
const setUploadFileList = jest.fn();
const removeUploadFiles = jest.fn();
const GetUploadFileAndFolder = jest.fn();
// const getFileListFromFolderID = [];
const setShowCreateFolderModal = jest.fn();
const showCreateFolderModal = true;
const DeleteConfirmationVisible = true;
const setDeleteConfirmationVisible = jest.fn();
const flickringData = true;
const setFlickringData = jest.fn();
const toggleFileView = true;
const setToggleFileView = jest.fn();

// const dragBoxShow = () => {
//   const dispatch = useDispatch();
//   dispatch(showDrageBox());
// };

// const listview = <ListView/>

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const mockStore = configureMockStore();
const store1 = mockStore({
  ui: {
    uploadAfter: true,
    dragBox: false,
    // disabledCreateFolderBtn,
    visibleUploadOptions: true,
    addButton: true,
    folderOpen: false,
  },
});
const store2 = mockStore({
  ui: {
    dragBox: false,
    // disabledCreateFolderBtn,
    visibleUploadOptions: true,
    addButton: true,
    folderOpen: false,
  },
});
const store3 = mockStore({
  ui: {
    dragBox: false,
    // disabledCreateFolderBtn,
    folderOpen: true,
  },
});
// jest.mock("react-redux", () => ({
//   ...jest.requireActual("react-redux"),
//   useDispatch: () => jest.fn(),
//   useSelector: () =>
//     jest.fn().mockImplementation((callback) => callback(mockState)),
// }));

const fileLists = [
  {
    id: 173,
    user_id: 1235,
    folder_id: null,
    file_id: "Why.jpg",
    short_code: "Why.jpg",
    file_name: "Why.jpg",
    file_type: "image/jpeg",
    file_path:
      "https://canonizer-test.s3.us-west-2.amazonaws.com/TWFsaWExMjM1TWFsaWE%3D_1672056635_987947.jpg",
    created_at: 1672056635,
    updated_at: 1672056635,
    deleted_at: null,
    short_code_path: "TWFsaWExMjM1TWFsaWE%3D_1672056635_987947.jpg",
  },
  {
    created_at: 1650894719,
    deleted_at: null,
    file_id: "can-lmLrBLqFe",
    file_name: "Third1.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "text/plain",
    folder_id: null,
    id: 132,
    short_code: "can-lmLrBLqFe",
    type: "file",
    updated_at: 1650894718,
    user_id: 1134,
  },
  {
    created_at: 1650894728,
    deleted_at: null,
    file_id: "can-lmLrBLqFe",
    file_name: "Third2.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "application/pdf",
    folder_id: null,
    id: 132,
    short_code: "can-lmLrBLqFe",
    type: "file",
    updated_at: 1650894718,
    user_id: 1134,
  },
  {
    created_at: 1651209637,
    deleted_at: null,
    id: 109,
    name: "can",
    type: "folder",
    updated_at: 1651209637,
    uploads_count: 0,
    user_id: 1134,
  },
  {
    created_at: 1650894768,
    deleted_at: null,
    file_id: "can-lmLrBLqFe",
    file_name: "nop.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "application/msword",
    folder_id: null,
    id: 132,
    short_code: "can-lmLrBLqFe",
    type: "file",
    updated_at: 1650894719,
    user_id: 1184,
  },
  {
    created_at: 1650894768,
    deleted_at: null,
    file_id: "can-lmLrBpqFe",
    file_name: "nop.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "application/msword",
    folder_id: null,
    id: 142,
    short_code: "can-lmLrBLqFe",
    type: "file",
    updated_at: 1650894719,
    user_id: 1184,
  },
  {
    created_at: 1650895768,
    deleted_at: null,
    file_id: "can-lmLrBLlFe",
    file_name: "nop.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "application/json",
    folder_id: null,
    id: 132,
    short_code: "can-lmLrBLqFe",
    type: "file",
    updated_at: 1650894719,
    user_id: 1184,
  },
  {
    created_at: 1650885768,
    deleted_at: null,
    file_id: "can-lmLkBLlFe",
    file_name: "nope.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "application/vnd.ms-excel.sheet.macroEnabled.12",
    folder_id: null,
    id: 152,
    short_code: "can-lmLrBLqFe",
    type: "file",
    updated_at: 1650894719,
    user_id: 1184,
  },
  {
    created_at: 1650885768,
    deleted_at: null,
    file_id: "can-lmLkBLlFe",
    file_name: "nope.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "application/vnd.ms-powerpoint.template.macroEnabled.12",
    folder_id: null,
    id: 162,
    short_code: "can-llLrBLqFe",
    type: "file",
    updated_at: 1650894119,
    user_id: 1184,
  },
  {
    id: 183,
    user_id: 1235,
    folder_id: null,
    file_id: "TestFile1.json",
    short_code: "TestFile1.json",
    file_name: "TestFile1.json",
    file_type: "application/json",
    file_path:
      "https://canonizer-test.s3.us-west-2.amazonaws.com/TWFsaWExMjM1TWFsaWE%3D_1699340170_414767.json",
    created_at: 1699340170,
    updated_at: 1699340170,
    deleted_at: null,
    short_code_path: "TWFsaWExMjM1TWFsaWE%3D_1699340170_414767.json",
  },
];

const folderFiles = [
  {
    id: 4,
    user_id: 1235,
    name: "Test Folder 1",
    created_at: 1699247632,
    updated_at: 1699247632,
    deleted_at: null,
    uploads_count: 0,
  },
];

const getFileListFromFolderID = [
  {
    id: 184,
    user_id: 1235,
    folder_id: 4,
    file_id: "Testfile2.json",
    short_code: "Testfile2.json",
    file_name: "Testfile2.json",
    file_type: "application/json",
    file_path:
      "https://canonizer-test.s3.us-west-2.amazonaws.com/TWFsaWExMjM1TWFsaWE%3D_1699341363_118335.json",
    created_at: 1699341363,
    updated_at: 1699341363,
    deleted_at: null,
    short_code_path: "TWFsaWExMjM1TWFsaWE%3D_1699341363_118335.json",
  },
];

const createNewFolder = {
  created_at: 1686299789,
  id: 2,
  name: "frust",
  updated_at: 161616556,
  user_id: 362,
};
// function createMockRouter() {
//   return {
//     showDrageBox: true,
//   };
// }
describe("Upload File UI Page", () => {
  it("render Upload Files Page", () => {
    render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    expect(screen.getByText(labels.uploadFiles)).toBeTruthy();
    expect(screen.getByText(labels.maxSize)).toBeTruthy();
    expect(screen.getByPlaceholderText("Select date")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search")).toBeTruthy();
    expect(
      screen.getAllByText("Create a Folder")[0] as HTMLButtonElement
    ).toBeInTheDocument();
  });
  it("render upload file(images) is loaded", () => {
    render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    expect(screen.getByText(labels.uploadFiles)).toBeTruthy();
    expect(screen.getByText(labels.maxSize)).toBeTruthy();
    expect(screen.getByPlaceholderText("Select date")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search")).toBeTruthy();
    expect(
      screen.getAllByText("Create a Folder")[0] as HTMLButtonElement
    ).toBeInTheDocument();
  });
  it("render Create folder button", () => {
    const { getAllByText } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    const createFolderbutton = getAllByText(
      "Create a Folder"
    )[0] as HTMLButtonElement;
    expect(createFolderbutton).toBeTruthy();
  });

  it("render Create folder button image grid view", async () => {
    const { getByAltText } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    const close_Folder = screen.getByTestId("folderFilled");
    expect(close_Folder).toBeInTheDocument();
    fireEvent.click(close_Folder);
  });

  it("render Create folder button image list view", async () => {
    const { getByAltText } = await render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    const image = getByAltText("listView");

    expect(image).toHaveAttribute("alt", "listView");
  });

  it("render heading in the list view", () => {
    render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    expect(screen.getByText("File Name")).toBeTruthy();
    expect(screen.getByText("Perma Link")).toBeTruthy();
    expect(screen.getByText("Created Date")).toBeTruthy();
    expect(screen.getByText("Action")).toBeTruthy();
  });

  it("render list view threeDot icon", () => {
    const { container } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    expect(container.getElementsByClassName("threeDOt")).toBeTruthy();
    expect(
      container.getElementsByClassName("UploadFile_shortcode_icon__Ixf_x")
    ).toBeTruthy();
  });

  it("render list view & grid view icon icon", () => {
    const { container } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    expect(container.getElementsByClassName("top_icon")).toBeTruthy();
  });

  it("render menuList  icon", () => {
    const { container } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    expect(container.getElementsByClassName("menu_item")).toBeTruthy();
  });

  it("render Modal when create folder button  is clicked", () => {
    const { getByText } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );

    const addbutton = getByText("Create");
    expect(addbutton).toBeTruthy();
    expect(
      screen.getAllByText(labels.CreateaFolder)[0] as HTMLLabelElement
    ).toBeInTheDocument();
    expect(screen.getByText(labels.FolderName)).toBeInTheDocument();
  });
  it("render create folder button", () => {
    render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    waitFor(async () => {
      expect(screen.getByText(createNewFolder.created_at)).toBeInTheDocument();
      expect(screen.getByText(createNewFolder.id)).toBeInTheDocument();
      expect(screen.getByText(createNewFolder.name)).toBeInTheDocument();
      expect(screen.getByText(createNewFolder.updated_at)).toBeInTheDocument();
      expect(screen.getByText(createNewFolder.user_id)).toBeInTheDocument();
    });
  });
  it("render cancel button", async () => {
    const { getByTestId } = await render(
      <UploadFileUI show_UploadOptions={true} />
    );
    waitFor(() => {
      const cancel = getByTestId("cancel_btn");
      fireEvent.click(cancel);
      expect(screen.getByText(createNewFolder.user_id)).toBeInTheDocument();
    });
    // const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    // expect(cancelButton).toBeInTheDocument();
  });

  it("render reset button", () => {
    const { getByText } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );

    const addbutton = getByText("Reset");
    expect(addbutton).toBeTruthy();
  });
  it("render file type", () => {
    render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );

    waitFor(async () => {
      expect(screen.getByText(fileLists[0].file_type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].file_type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[2].file_type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[3].file_type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[4].file_type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[5].file_type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[6].file_type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[7].file_type)).toBeInTheDocument();
    });
  });
  it("render add_file_btn", () => {
    const { getByTestId, getByText } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    expect(screen.getByText(labels.FolderName)).toBeInTheDocument();
    const btn = getByTestId("remove_files");
    fireEvent.click(btn);
    const btnE1 = getByTestId("cancel_modal");
    fireEvent.click(btnE1);
    const btnE2 = getByTestId("add_AFile_Btn");
    fireEvent.click(btnE2);
    const btnE3 = getByTestId("add_AFile_Btn2");
    fireEvent.click(btnE3);
  });
  it("Empty component displays correct content", () => {
    const { container } = render(
      <Provider store={store1}>
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
          toggleFileView={false}
          setToggleFileView={setToggleFileView}
        />
      </Provider>
    );
    const span = screen.getAllByTestId("cpoy_span")[0];
    expect(span).toBeInTheDocument();
    fireEvent.click(span);
    fireEvent.click(container.querySelector("#threeDots"));
    expect(screen.getByTestId("test1")).toBeDefined();
    fireEvent.click(screen.getByTestId("test1"));
  });
  it("Empty component displays correct", () => {
    const { container } = render(
      <Provider store={store2}>
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
          toggleFileView={false}
          setToggleFileView={setToggleFileView}
        />
      </Provider>
    );
    const span = screen.getByTestId("open_folder_render_mennu");
    expect(span).toBeInTheDocument();
    fireEvent.click(span);
  });
  it("open folder  correct", () => {
    const { container } = render(
      <Provider store={store3}>
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
          toggleFileView={false}
          setToggleFileView={setToggleFileView}
        />
      </Provider>
    );
    const span = screen.getByTestId("arrow_outlined");
    expect(span).toBeInTheDocument();
    fireEvent.click(span);
  });
  it("Menu item render", () => {
    const { container, getByText } = render(
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
        toggleFileView={true}
        setToggleFileView={setToggleFileView}
      />
    );
    fireEvent.click(container.querySelector(".threeDOt"));
    expect(getByText("View File")).toBeDefined();
    fireEvent.click(getByText("View File"));
    fireEvent.click(container.querySelector(".threeDOt"));
    expect(getByText("Copy Perma Link")).toBeDefined();
    fireEvent.click(getByText("Copy Perma Link"));
    fireEvent.click(container.querySelector(".threeDOt"));
    expect(getByText("Delete File")).toBeDefined();
    fireEvent.click(getByText("Delete File"));
  });

  it("Menu item render download file", () => {
    const { container, getByText } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    const menu = container.querySelectorAll(".threeDOt");
    fireEvent.click(menu[menu.length - 1]);
    expect(screen.getByText("Download File")).toBeDefined();
    fireEvent.click(screen.getByText("Download File"));
    fireEvent.click(menu[menu.length - 1]);
    fireEvent.click(getByText("Copy Perma Link"));
    fireEvent.click(menu[menu.length - 1]);
    expect(getByText("Delete File")).toBeDefined();
    fireEvent.click(getByText("Delete File"));
  });

  it("Menu item render for folder", () => {
    const { container, getByText } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    fireEvent.click(container.querySelectorAll(".threeDOt")[3]);
    expect(getByText("Open folder")).toBeDefined();
    fireEvent.click(getByText("Open folder"));
    fireEvent.click(container.querySelectorAll(".threeDOt")[3]);
    expect(getByText("Edit folder name")).toBeDefined();
    fireEvent.click(getByText("Edit folder name"));
    fireEvent.click(container.querySelectorAll(".threeDOt")[3]);
    expect(getByText("Delete folder")).toBeDefined();
    fireEvent.click(getByText("Delete folder"));
  });
  test("Input component handles user input correctly", () => {
    // Render the Input component
    render(<Input />);

    // Find the input element
    const inputElement = screen.getByRole("textbox");

    // Simulate user input
    const userInput = "Test Input";
    fireEvent.change(inputElement, { target: { value: userInput } });

    // Assert that the input value is updated
    expect(inputElement.value).toBe(userInput);
  });
});
afterEach(cleanup);

describe("upload files ui", () => {
  it("create new folder test", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );
    const add_folder_element = getAllByTestId("add_AFile_Btn");
    fireEvent.click(add_folder_element[0]);
    await waitFor(() => {
      const change_name_input = getAllByPlaceholderText(
        "Enter name of the Folder"
      );
      // expect(change_name_input[0]).toBeInTheDocument()
      fireEvent.change(change_name_input[0], {
        target: { value: "Test Folder 1" },
      });
      const create_button = getAllByText("Create");
      fireEvent.click(create_button[0]);
    });
  });

  it("change fodler name test", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );
    await waitFor(() => {
      fireEvent.click(container.querySelectorAll(".threeDOt")[3]);
      const edit_button = screen.getByText("Edit folder name");
      expect(edit_button).toBeInTheDocument();
      fireEvent.click(edit_button);
      const change_input = screen.getAllByPlaceholderText(
        "Enter name of the Folder"
      );
      fireEvent.change(change_input[0], { target: { value: "Test 2" } });
      fireEvent.click(screen.getByText("Update"));
    });
  });

  it("Open folder", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );
    await waitFor(() => {
      fireEvent.click(container.querySelectorAll(".threeDOt")[3]);
      const edit_button = screen.getByText("Delete folder");
      fireEvent.click(edit_button);
    });
  });

  it("create new folder test close", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );
    const add_folder_element = getAllByTestId("add_AFile_Btn");
    fireEvent.click(add_folder_element[0]);
    await waitFor(() => {
      const close_button = screen.getAllByRole("img");
      expect(close_button[close_button.length - 1]).toBeInTheDocument();
      fireEvent.click(close_button[close_button.length - 1]);
    });
  });

  it("search uploaded folder by name", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );

    await waitFor(() => {
      const update_name_menu = screen.getAllByTestId("datePickerText");
      expect(update_name_menu[0]).toBeInTheDocument();
      fireEvent.change(update_name_menu[0], { target: { value: "Test" } });
    });
  });

  it("search uploaded folder by date", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );

    await waitFor(() => {
      const update_name_menu_date =
        container.getElementsByClassName("ant-picker");
      fireEvent.click(update_name_menu_date[0]);
      const toady = screen.getAllByText("Today");
      fireEvent.click(toady[0]);
    });
  });

  it("upload file", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );
    const upload_file_button = screen.getByTestId("addAFileBtn");
    fireEvent.click(upload_file_button);
    const file_input = screen.getByTestId("upload_images");
    const file = new File(["test file content"], "test.txt", {
      type: "text/plain",
    });
    fireEvent.change(file_input, { target: { files: [file] } });
  });
  it("render remove upload files", async () => {
    const { container, getAllByText, getAllByTestId, getAllByPlaceholderText } =
      render(
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
          toggleFileView={toggleFileView}
          setToggleFileView={setToggleFileView}
        />
      );
    const upload_file_button = screen.getByTestId("remove_upload_files");
    fireEvent.click(upload_file_button);
    // const file_input = screen.getByTestId("upload_images");
    // const file = new File(["test file content"], "test.txt", {
    //   type: "text/plain",
    // });
    // fireEvent.change(file_input, { target: { files: [file] } });
  });

  it("upload file and click on upload button", async () => {
    const {
      container,
      getAllByText,
      getAllByTestId,
      getAllByPlaceholderText,
      rerender,
    } = render(
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
        toggleFileView={toggleFileView}
        setToggleFileView={setToggleFileView}
      />
    );
    const upload_file_button = screen.getByTestId("addAFileBtn");
    fireEvent.click(upload_file_button);

    await waitFor(async () => {
      const file_input = screen.getByTestId("upload_images");
      const file = new File(["test file content"], "test.txt", {
        type: "text/plain",
      });
      await fireEvent.change(file_input, { target: { files: [file] } });
    });

    const Loading_screen = container.getElementsByClassName(
      "ant-upload-list ant-upload-list-picture"
    );
    expect(Loading_screen).toBeInTheDocument();
  });
});
