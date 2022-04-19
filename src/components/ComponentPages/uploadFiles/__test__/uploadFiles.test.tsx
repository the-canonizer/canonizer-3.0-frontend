import { render, screen, waitFor } from "../../../../utils/testUtils";

import UploadFileUI from "../uploadFilesUI";
import messages from "../../../../messages";
const { labels, placeholders, validations } = messages;

const input = "";
const setInput = jest.fn();
const selectedFolderID = jest.fn();
//const fileLists = [];
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
const onFinish = jest.fn();
const fileLists = [
  {
    id: "0",
    lastModified: 1644681380403,
    lastModifiedDate:
      "Sat Feb 12 2022 21:26:20 GMT+0530 (India Standard Time) {}",
    name: "jon-koop-khYVyHiNZo0-unsplash.jpg",
    percent: 0,
    size: 770230,
    status: "uploading",
    thumbUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMg",
    type: "image/jpeg",
    uid: "rc-upload-1649942764012-2",
  },
  {
    id: "1",
    lastModified: 1644681380403,
    lastModifiedDate:
      "Sat Feb 12 2022 21:26:20 GMT+0530 (India Standard Time) {}",
    name: "jon-koop-khYVyHiNZo0-unsplash.jpg",
    percent: 0,
    size: 770230,
    status: "uploading",
    thumbUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMg",
    type: "image/jpeg",
    uid: "rc-upload-1649942764012-2",
  },
];
describe("Upload File Page", () => {
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
        handle_X_btn={handle_X_btn()}
        addNewFile={addNewFile}
        Openfolder={Openfolder}
        removeFiles={removeFiles}
        onFinish={onFinish}
      />
    );
    expect(screen.getByText(labels.uploadFiles)).toBeTruthy();
    expect(screen.getByText(labels.maxSize)).toBeTruthy();
    expect(screen.getByPlaceholderText("Select date")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search")).toBeTruthy();
    expect(
      screen.getAllByText("Create a folder")[0] as HTMLButtonElement
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
        onFinish={onFinish}
      />
    );
    expect(screen.getByText(labels.uploadFiles)).toBeTruthy();
    expect(screen.getByText(labels.maxSize)).toBeTruthy();
    expect(screen.getByPlaceholderText("Select date")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search")).toBeTruthy();
    expect(
      screen.getAllByText("Create a folder")[0] as HTMLButtonElement
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Click or drag file to this area to upload"
      )[0] as HTMLLabelElement
    ).toBeInTheDocument();
  });
});
