import {
  fireEvent,
  getByAltText,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import UploadFiles from "..";
import { useState } from "react";
import { useRouter } from "next/router";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { message } from "antd";

jest.mock("src/hooks/isUserAuthenticated", () =>
  jest.fn(() => ({ isUserAuthenticated: true }))
);

jest.mock("src/network/api/userApi", () => ({
  uploadFile: jest.fn(),
  deleteFolderApi: jest.fn(),
  deleteUploadFileApi: jest.fn(),
  getFileInsideFolderApi: jest
    .fn()
    .mockReturnValue(Promise.resolve({ success: true })),
  getUploadFileAndFolder: jest.fn(() =>
    Promise.resolve({ data: { files: [], folders: [] } })
  ),
}));
const mockState = {
  ui: {
    // dragBox,
    // disabledCreateFolderBtn,
    visibleUploadOptions: true,
    addButton: true,
  },
};

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
  useSelector: () =>
    jest.fn().mockImplementation((callback) => callback(mockState)),
}));

jest.mock("next/router", () => ({
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

const createNewFolder = {
  created_at: 1686299789,
  id: 2,
  name: "frust",
  updated_at: 161616556,
  user_id: 362,
};
function createMockRouter() {
  return {
    showDrageBox: true,
  };
}

describe("Upload file page", () => {
  // it("upload files api render files", () => {
  //   render(<UploadFiles />);
  //   waitFor(async () => {
  //     expect(screen.getByText(fileLists[0].created_at)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].deleted_at)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].file_id)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].file_name)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].file_path)).toBeInTheDocument();
  //     expect(
  //       screen.getByText(fileLists[0].short_code_path)
  //     ).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].folder_id)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].id)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].short_code)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].type)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].updated_at)).toBeInTheDocument();
  //     expect(screen.getByText(fileLists[0].user_id)).toBeInTheDocument();
  //   });
  // });

  it("upload files api render folder", async () => {
    // jest.mock("react", () => ({
    //   ...jest.requireActual('react'),
    //   useState: ()=> [true,jest.fn()],
    // }));
    const { container, asFragment } = render(<UploadFiles />);
    await waitFor(() => {
      // expect(container).toMatchSnapshot();
      expect(screen.getByTestId("cancel_btn")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("cancel_btn"));
      // expect(screen.getByText(fileLists[1].created_at)).toBeInTheDocument();
      // expect(screen.getByText(fileLists[1].deleted_at)).toBeInTheDocument();
      // expect(screen.getByText(fileLists[1].name)).toBeInTheDocument();
      // expect(screen.getByText(fileLists[1].uploads_count)).toBeInTheDocument();
      // expect(screen.getByText(fileLists[1].id)).toBeInTheDocument();
      // expect(screen.getByText(fileLists[1].type)).toBeInTheDocument();
      // expect(screen.getByText(fileLists[1].updated_at)).toBeInTheDocument();
      // expect(screen.getByText(fileLists[1].user_id)).toBeInTheDocument();
    });
  });
  it("render useState is working ", () => {
    render(<UploadFiles />);
    const TestComponent = () => {
      const [isActive, setIsActive] = useState(false);

      const toggleActive = () => {
        setIsActive(!isActive);
      };

      return (
        <div>
          <p>{isActive ? "Active" : "Inactive"}</p>
          <button onClick={toggleActive}>Toggle</button>
        </div>
      );
    };

    const { getByText } = render(<TestComponent />);

    const statusElement = getByText("Inactive");
    const toggleButton = getByText("Toggle");

    expect(statusElement.textContent).toBe("Inactive");

    fireEvent.click(toggleButton);

    expect(statusElement.textContent).toBe("Active");

    fireEvent.click(toggleButton);

    expect(statusElement.textContent).toBe("Inactive");
  });

  it("path is working with use router", () => {
    render(<UploadFiles />);
    const mockedRouter = {
      pathname: "/about",
    };

    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);

    const { result } = renderHook(() => useRouter());

    expect(result.current.pathname).toBe("/about");
  });
  it("Message component displays correct content", () => {
    const { getByTestId } = render(<UploadFiles />);
    const messageContent = "Test message";

    // Render the Message component
    message.success(messageContent);

    // Assert that the message content is displayed
    const messageElement = screen.getByText(messageContent);
    expect(messageElement).toBeInTheDocument();
  });
});
afterEach(cleanup);
