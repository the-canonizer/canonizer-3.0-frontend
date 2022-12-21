import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import NickNameUI from "../NickNameUI/index";
import messages from "../../../../messages";

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
    expect(screen.getByText("Nick Name ID")).toBeInTheDocument();
    expect(screen.getByText("Nick Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Visibility Status")).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.addnewNickName)[0] as HTMLButtonElement
    ).toBeInTheDocument();
  });

  it("render Nick Name Table", () => {
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
    expect(screen.getByText("Nick Name ID")).toBeInTheDocument();
    expect(screen.getByText("Nick Name")).toBeInTheDocument();
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

  it("render Add new Nick Name button", () => {
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
    addEditTitle = "Add New Nick Name";
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
    addEditTitle = "Edit Nick Name";
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

    const nickname = screen.getByPlaceholderText("Enter nick name");
    const addbutton = getByText("Update");
    expect(addbutton).toBeTruthy();
    expect(screen.getByText("Edit Nick Name")).toBeInTheDocument();
    expect(screen.getByText(labels.nickName)).toBeInTheDocument();
    expect(nickname).toBeInTheDocument();
    expect(nickname).toHaveAttribute("type", "text");
    expect(nickname).toHaveAttribute("disabled");
    expect(
      screen.getAllByText(labels.visibilityStatus)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });

  it("Nick Name input disabled on Edit click", () => {
    addEditTitle = "Edit Nick Name";
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
    const nickname = screen.getByPlaceholderText("Enter nick name");

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
