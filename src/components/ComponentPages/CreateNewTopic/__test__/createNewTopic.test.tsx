import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import CreateNewTopic from "../index";
import messages from "../../../../messages";

const { labels, placeholders } = messages;

const initialValues = {
  nick_name: 36,
  namespace: 1,
};

const nickNamesList = [
  {
    id: 36,
    nick_name: "Rahul-Singh775",
    create_time: "7963-03-24",
    owner_code: "TWFsaWEzNk1hbGlh",
    private: 0,
  },
  {
    id: 45,
    nick_name: "Redwin75",
    create_time: "7963-03-27",
    owner_code: "TWFsaWEzNk1hbGlh",
    private: 0,
  },
];

const nameSpaceList = [
  { id: 1, parent_id: 0, name: "Genaral", label: "Genaral" },
  { id: 2, parent_id: 0, name: "corporations", label: "/corporations/" },
];

describe("Create New Topic page", () => {
  it("render heading and labels", () => {
    render(
      <CreateNewTopic
        testNickName={nickNamesList}
        testNamespace={nameSpaceList}
        testInitialValue={initialValues}
      />
    );

    expect(screen.getByTestId("head")).toBeInTheDocument();
    expect(screen.getByLabelText(labels.cr_nick_name)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_topic_name)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_nick_name_sp)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_namespace)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_namespace)).toBeInTheDocument();
    expect(screen.getByText("Create Topic")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(
      <CreateNewTopic
        testNickName={nickNamesList}
        testNamespace={nameSpaceList}
        testInitialValue={initialValues}
      />
    );

    const nickName = screen.getByLabelText(labels.cr_nick_name);
    expect(nickName).toBeInTheDocument();
    expect(nickName).toHaveAttribute("type", "search");

    const topicName = screen.getByLabelText(labels.cr_topic_name);
    expect(topicName).toBeInTheDocument();
    expect(topicName).toHaveAttribute("type", "text");

    const nameSpace = screen.getByLabelText(labels.cr_namespace);
    expect(nameSpace).toBeInTheDocument();
    expect(nameSpace).toHaveAttribute("type", "search");

    const editSummary = screen.getByLabelText(labels.cr_edit_summary);
    expect(editSummary).toBeInTheDocument();
  });

  it("blank form should not be submit", async () => {
    render(
      <CreateNewTopic
        testNickName={nickNamesList}
        testNamespace={nameSpaceList}
        testInitialValue={initialValues}
      />
    );
    const btnEl = screen.getByText("Create Topic");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });
});
