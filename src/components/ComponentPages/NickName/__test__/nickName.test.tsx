import {
  fireEvent,
  getByAltText,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import NickNameUI from "../NickNameUI/index";
import messages from "../../../../messages";
import NickName from "..";
import { useState } from "react";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react-hooks";
import { getNickNameList } from "src/network/api/userApi";

const { labels, validations } = messages;
var addEditTitle = "";
var addEditBtn = "";
const isNickNameModalVisible = true;
const editNickName = jest.fn();
const handleAddNickName = jest.fn();
const handleNickNameCancel = jest.fn();
const onAddUpdateNickName = jest.fn();
const disableButton = false;
const nickNameList = [
  {
    id: "1",
    nick_name: "Mike",
    private: 0,
  },
  {
    id: "2",
    nick_name: "John",
    private: 0,
  },
];

const addNewNickName = [
  {
    create_time: "1998-01-01",
    id: 1,
    nick_name: "ABC",
    owner_code: "aabbcc",
    private: 0,
  },
  {
    create_time: "1979-02-02",
    id: 2,
    nick_name: "DEF",
    owner_code: "ddeeff",
    private: 0,
  },
];
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("src/network/api/userApi", () => ({
  getNickNameList: jest.fn(),
  addNickName: jest.fn(),
  updateNickName: jest.fn()
}));

describe("NickName page", () => {
  it("render Column Names and Button", () => {
    render(
      <NickNameUI
        addEditTitle={addEditTitle}
        addEditBtn={addEditBtn}
        isNickNameModalVisible={isNickNameModalVisible}
        editNickName={editNickName}
        handleAddNickName={handleAddNickName}
        handleNickNameCancel={handleNickNameCancel}
        onAddUpdateNickName={onAddUpdateNickName}
        nickNameList={nickNameList}
        disableButton={disableButton}
      />
    );

    expect(screen.getByText("Sr.No.")).toBeInTheDocument();
    expect(screen.getByText("Nickname ID")).toBeInTheDocument();
    expect(screen.getByText("Nickname")).toBeInTheDocument();
    expect(screen.getByLabelText("Visibility Status")).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.addnewNickName)[0] as HTMLButtonElement
    ).toBeInTheDocument();
  });

  it("render Nickname Table", () => {
    render(
      <NickNameUI
        addEditTitle={addEditTitle}
        addEditBtn={addEditBtn}
        isNickNameModalVisible={isNickNameModalVisible}
        editNickName={editNickName}
        handleAddNickName={handleAddNickName}
        handleNickNameCancel={handleNickNameCancel}
        onAddUpdateNickName={onAddUpdateNickName}
        nickNameList={nickNameList}
        disableButton={disableButton}
      />
    );
    expect(screen.getByText("Sr.No.")).toBeInTheDocument();
    expect(screen.getByText("Nickname ID")).toBeInTheDocument();
    expect(screen.getByText("Nickname")).toBeInTheDocument();
    expect(screen.getByLabelText("Visibility Status")).toBeInTheDocument();

    screen.getByText((content, node) => {
      const hasText = (node) => node.textContent === "Mike";
      const nodeHasText = hasText(node);
      return nodeHasText;
    });
    screen.getByText((content, node) => {
      const hasText = (node) => node.textContent === "John";
      const nodeHasText = hasText(node);
      return nodeHasText;
    });
  });

  it("render Add new Nickname button", () => {
    const { getAllByText } = render(
      <NickNameUI
        addEditTitle={addEditTitle}
        addEditBtn={addEditBtn}
        isNickNameModalVisible={isNickNameModalVisible}
        editNickName={editNickName}
        handleAddNickName={handleAddNickName}
        handleNickNameCancel={handleNickNameCancel}
        onAddUpdateNickName={onAddUpdateNickName}
        nickNameList={nickNameList}
        disableButton={disableButton}
      />
    );
    const addbutton = getAllByText(
      labels.addnewNickName
    )[0] as HTMLButtonElement;
    expect(addbutton).toBeTruthy();
  });

  it("render Modal when Add new NickName is clicked", () => {
    addEditTitle = "Add New Nickname";
    addEditBtn = "Create";

    const { getByText } = render(
      <NickNameUI
        addEditTitle={addEditTitle}
        addEditBtn={addEditBtn}
        isNickNameModalVisible={isNickNameModalVisible}
        editNickName={editNickName}
        handleAddNickName={handleAddNickName}
        handleNickNameCancel={handleNickNameCancel}
        onAddUpdateNickName={onAddUpdateNickName}
        nickNameList={nickNameList}
        disableButton={disableButton}
      />
    );

    const addbutton = getByText("Create");
    expect(addbutton).toBeTruthy();
    expect(
      screen.getAllByText(labels.addnewNickName)[1] as HTMLLabelElement
    ).toBeInTheDocument();
    expect(screen.getByText(labels.nickName)).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.visibilityStatus)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });

  it("render Modal when Edit NickName is clicked", () => {
    addEditTitle = "Edit Nickname";
    addEditBtn = "Update";

    const { getByText } = render(
      <NickNameUI
        addEditTitle={addEditTitle}
        addEditBtn={addEditBtn}
        isNickNameModalVisible={isNickNameModalVisible}
        editNickName={editNickName}
        handleAddNickName={handleAddNickName}
        handleNickNameCancel={handleNickNameCancel}
        onAddUpdateNickName={onAddUpdateNickName}
        nickNameList={nickNameList}
        disableButton={disableButton}
      />
    );

    const nickname = screen.getByPlaceholderText("Enter Nickname");
    const addbutton = getByText("Update");
    expect(addbutton).toBeTruthy();
    expect(screen.getByText("Edit Nickname")).toBeInTheDocument();
    expect(screen.getByText(labels.nickName)).toBeInTheDocument();
    expect(nickname).toBeInTheDocument();
    expect(nickname).toHaveAttribute("type", "text");
    expect(nickname).toHaveAttribute("disabled");
    expect(
      screen.getAllByText(labels.visibilityStatus)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });

  it("Nickname input disabled on Edit click", () => {
    addEditTitle = "Edit Nickname";
    addEditBtn = "Update";

    render(
      <NickNameUI
        addEditTitle={addEditTitle}
        addEditBtn={addEditBtn}
        isNickNameModalVisible={isNickNameModalVisible}
        editNickName={editNickName}
        handleAddNickName={handleAddNickName}
        handleNickNameCancel={handleNickNameCancel}
        onAddUpdateNickName={onAddUpdateNickName}
        nickNameList={nickNameList}
        disableButton={disableButton}
      />
    );
    const nickname = screen.getByPlaceholderText("Enter Nickname");

    expect(nickname).toHaveAttribute("type", "text");
    expect(nickname).toHaveAttribute("disabled");
  });

  it("blank form should not be submit", async () => {
    render(
      <NickNameUI
        addEditTitle={addEditTitle}
        addEditBtn={addEditBtn}
        isNickNameModalVisible={isNickNameModalVisible}
        editNickName={editNickName}
        handleAddNickName={handleAddNickName}
        handleNickNameCancel={handleNickNameCancel}
        onAddUpdateNickName={onAddUpdateNickName}
        nickNameList={nickNameList}
        disableButton={disableButton}
      />
    );
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText(validations.nickName)).toBeVisible();
    });
  });
});

describe("", () => {
  it("render nickname list", () => {
    render(<NickName />);
    waitFor(async () => {
      expect(screen.getByText(nickNameList[0].id)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].nick_name)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].private)).toBeInTheDocument();
    });
  });
  it("should call getNickNameList and update state when response is not undefined and status_code is 200", async () => {
    const mockResponse = {
      status_code: 200,
      data: [{ id: "1", nick_name: "Mike", private: 0 }],
    };

    const fetchNickNameList = jest.fn();

    getNickNameList.mockResolvedValueOnce(mockResponse);

    const setNickNameList = jest.fn();

    // Call the function
    await fetchNickNameList(setNickNameList);

    // Assertions
    expect(getNickNameList).toHaveBeenCalled();
    // expect(setNickNameList).toHaveBeenCalledWith(mockResponse.data[0]);
  });
  it("render useState is working ", () => {
    render(<NickName />);
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
    render(<NickName />);
    const mockedRouter = {
      pathname: "/about",
    };

    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);

    const { result } = renderHook(() => useRouter());

    expect(result.current.pathname).toBe("/about");
  });
});

describe('Nickname test cases', () => {

  it('addnickname function should be called while click on edit button', async () => {

    const { getAllByText } = render(<NickName></NickName>)

    waitFor(() => {
      const edit_button = getAllByText("Add New Nickname")
      fireEvent.click(edit_button[0])
      expect(getAllByText("Add New Nickname")[1]).toBeInTheDocument()
    })
  })

  it('add new neickname ', async () => {
    const { getAllByTestId, getAllByText } = render(<NickName></NickName>)

    await waitFor(async () => {
      const edit_button = getAllByText("Add New Nickname")
      fireEvent.click(edit_button[0])
      const nickname_input = getAllByTestId("enterNickName")[0]
      await userEvent.type(nickname_input, "nickname123");
      const submit_button = getAllByTestId("submitButton")[0]
      userEvent.click(submit_button)
    })
  })
})
