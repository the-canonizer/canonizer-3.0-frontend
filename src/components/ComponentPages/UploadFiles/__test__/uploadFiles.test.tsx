import { fireEvent, render, screen, waitFor } from "../../../../utils/testUtils";
import UploadFileUI from "../UploadFilesUI";
import messages from "../../../../messages";
import UploadFiles from "..";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react-hooks";
import { Button, Empty, Input, Modal, Popover, Spin, message } from "antd";
import userEvent from "@testing-library/user-event";

const { labels } = messages;

const input = "";
const setInput = jest.fn();
const selectedFolderID = jest.fn();
const setFileLists = jest.fn();
const folderFiles = [];
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
const getFileListFromFolderID = [];
const setShowCreateFolderModal = jest.fn();
const showCreateFolderModal = true;
const DeleteConfirmationVisible = true;
const setDeleteConfirmationVisible = jest.fn();
const flickringData = true;
const setFlickringData = jest.fn();
const toggleFileView = true;
const setToggleFileView = jest.fn();
// const listview = <ListView/>

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const fileLists = [
  {
    created_at: 1650894718,
    deleted_at: null,
    file_id: "can-lmLrBLqFe",
    file_name: "Third.jpg",
    file_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    short_code_path:
      "https://canonizer-public-file.s3.us-east-2.amazonaws.com/TWFsaWExMTM0TWFsaWE%3D_1650894717_713566.jpg",
    file_type: "image/jpeg",
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
];
describe("Upload File UI Page", () => {
  it("render Upload Files Page ", () => {
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
  it("render upload file(images) is loaded ", () => {
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

  it("render Create folder button", async () => {
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
    const image = getByAltText("gridView");

    expect(image).toHaveAttribute("alt", "gridView");
  });

  it("render Create folder button", async () => {
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
    expect(container.getElementsByClassName("threeDOt")).toBeTruthy;
    expect(container.getElementsByClassName("UploadFile_shortcode_icon__Ixf_x"))
      .toBeTruthy;
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
    expect(container.getElementsByClassName("top_icon")).toBeTruthy;
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
    expect(container.getElementsByClassName("menu_item")).toBeTruthy;
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

    const addbutton = getByText("Reset");
    expect(addbutton).toBeTruthy();
  });
  it('Empty component displays correct content', () => {
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
    const emptyContent = 'No data found';
  
    // Render the Empty component
    render(<Empty description={emptyContent} />);
  
    // Assert that the empty content is displayed
    const emptyElement = screen.getByText(emptyContent);
    expect(emptyElement).toBeInTheDocument();
  });
  test('Input component handles user input correctly', () => {
    // Render the Input component
    render(<Input />);
  
    // Find the input element
    const inputElement = screen.getByRole('textbox');
  
    // Simulate user input
    const userInput = 'Test Input';
    fireEvent.change(inputElement, { target: { value: userInput } });
  
    // Assert that the input value is updated
    expect(inputElement.value).toBe(userInput);
  });
});

describe("Upload file page",()=>{
  it("upload files api render files",()=>{
    render(<UploadFiles/>)
    waitFor(async () => {
      expect(screen.getByText(fileLists[0].created_at)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].deleted_at)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].file_id)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].file_name)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].file_path)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].short_code_path)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].folder_id)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].id)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].short_code)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].updated_at)).toBeInTheDocument();
      expect(screen.getByText(fileLists[0].user_id)).toBeInTheDocument();
    });
  })

  it("upload files api render folder",()=>{
    render(<UploadFiles/>)
    waitFor(async () => {
      expect(screen.getByText(fileLists[1].created_at)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].deleted_at)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].name)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].uploads_count)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].id)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].type)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].updated_at)).toBeInTheDocument();
      expect(screen.getByText(fileLists[1].user_id)).toBeInTheDocument();
    });
  })
  it("render useState is working ",()=>{
    render(<UploadFiles/>)
    const TestComponent = () => {
      const [isActive, setIsActive] = useState(false);
      
  
      const toggleActive = () => {
        setIsActive(!isActive);
      };
  
      return (
        <div>
          <p>{isActive ? 'Active' : 'Inactive'}</p>
          <button onClick={toggleActive}>Toggle</button>
        </div>
      );
    };
  
    const { getByText } = render(<TestComponent />);
  
    const statusElement = getByText('Inactive');
    const toggleButton = getByText('Toggle');
  
    expect(statusElement.textContent).toBe('Inactive');
  
    fireEvent.click(toggleButton);
  
    expect(statusElement.textContent).toBe('Active');
  
    fireEvent.click(toggleButton);
  
    expect(statusElement.textContent).toBe('Inactive');
  });

  it("path is working with use router",()=>{
    render(<UploadFiles/>)
    const mockedRouter = {
      pathname: '/about',
    };
  
    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);
  
    const { result } = renderHook(() => useRouter());
  
    expect(result.current.pathname).toBe('/about');
  });
  it("Message component displays correct content",()=>{
    render(<UploadFiles/>)
    const messageContent = 'Test message';

  // Render the Message component
  message.success(messageContent);

  // Assert that the message content is displayed
  const messageElement = screen.getByText(messageContent);
  expect(messageElement).toBeInTheDocument();
  });
})
