import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import UploadFiles from "..";
import { cleanup } from "@testing-library/react-hooks";
import CreateFolder from "../CreateFolder";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";

jest.mock("src/hooks/isUserAuthenticated", () =>
  jest.fn(() => ({ isUserAuthenticated: true }))
);
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
];
jest.mock("src/network/api/userApi", () => ({
  uploadFile: jest.fn().mockReturnValue(Promise.resolve({ status_code: 200 })),
  deleteFolderApi: jest.fn(),
  deleteUploadFileApi: jest.fn(),
  getFileInsideFolderApi: jest
    .fn()
    .mockReturnValue(
      Promise.resolve({ success: true, status_code: 200, data: [{ id: 1 }] })
    ),
  getUploadFileAndFolder: jest.fn((v) =>
    Promise.resolve({
      data: { files: fileLists, folders: [{ ...v, type: "folder" }] },
    })
  ),
}));
const mockStore = configureMockStore();
const store1 = mockStore({
  ui: {
    dragBox: false,
    crossBtn: true,
    visibleUploadOptions: true,
    folderOpen: false,
  },
});
const store1sub1 = mockStore({
  ui: {
    dragBox: false,
    crossBtn: true,
    visibleUploadOptions: true,
    folderOpen: true,
  },
});

const store2 = mockStore({
  ui: {
    dragBox: false,
    folderOpen: true,
    visibleUploadOptions: true,
  },
});

const store3 = mockStore({
  ui: {
    dragBox: false,
    // disabledCreateFolderBtn,
    addButton: true,
  },
});
const store4 = mockStore({
  ui: {
    visibleUploadOptions: true,
  },
});

// jest.mock("react-redux", () => ({
//   ...jest.requireActual("react-redux"),
//   useDispatch: () => jest.fn(),
//   useSelector: () =>
//     jest.fn().mockImplementation((callback) => callback(mockState)),
// }));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Upload file page", () => {
  it("onChange updates state correctly", async () => {
    const editModal = true,
      // createFolderForm = jest.fn(),
      onFinish = jest.fn(),
      validateMessages = {},
      rename = "",
      input = "",
      setRename = jest.fn(),
      editFolderNameVal = "";
    // const { getByPlaceholderText, getByTestId } =
    render(
      <CreateFolder
        editModal={editModal}
        createFolderForm={null}
        onFinish={onFinish}
        validateMessages={validateMessages}
        rename={rename}
        input={input}
        setRename={setRename}
        editFolderNameVal={editFolderNameVal}
      />
    );
    // const input = getByPlaceholderText('password');

    // Simulate a change event with a new value
    const inputEl = screen.getByPlaceholderText("Enter name of the Folder");
    expect(inputEl).toBeInTheDocument();
    // expect(inputEl).toHaveAttribute("type", "password");

    await fireEvent.change(inputEl, { target: { value: "ABCD" } });
    // await userEvent.tab();
  });
  it("upload files api render folder", async () => {
    render(
      <Provider store={store1}>
        <UploadFiles />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("cancel_btn")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("cancel_btn"));
      expect(screen.getByTestId("handle_x_btn")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("handle_x_btn"));
    });
  });
  it("upload files api render open folder", async () => {
    render(
      <Provider store={store1sub1}>
        <UploadFiles />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("cancel_btn")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("cancel_btn"));
      expect(screen.getByTestId("handle_x_btn")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("handle_x_btn"));
    });
  });

  it("upload files api render close folder", async () => {
    render(
      <Provider store={store2}>
        <UploadFiles />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("arrow_outlined")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("arrow_outlined"));
    });
  });

  it("Add a file test", async () => {
<<<<<<< HEAD

=======
>>>>>>> 29989dfff07a1f263b7567e13df5aab0ebb5b5a2
      render(
        <Provider store={store3}>
          <UploadFiles />
        </Provider>
      );
    await waitFor(() => {
      const add_folder_element = screen.getByTestId("addAFileBtn");
      expect(add_folder_element).toBeInTheDocument();
      fireEvent.click(add_folder_element);
      // fireEvent.click(add_folder_element[0])
    });
    // await waitFor(() => {
    //   const change_name_input = getAllByPlaceholderText("Enter name of the Folder")
    //   // expect(change_name_input[0]).toBeInTheDocument()
    //   fireEvent.change(change_name_input[0], { target: { value: "Test Folder 1" } })
    //   const create_button = getAllByText("Create")
    //   fireEvent.click(create_button[0])
    // })
  });
  it("render add_file_btn", async () => {
    const { container } = render(
      <Provider store={store4}>
        <UploadFiles />
      </Provider>
    );
    await waitFor(() => {
      const uploadBtn = screen.getByTestId("upload_btn");
      fireEvent.click(uploadBtn);
    expect(container.getElementsByClassName("threeDOt")).toBeTruthy();

    });
  });
});
afterEach(cleanup);
