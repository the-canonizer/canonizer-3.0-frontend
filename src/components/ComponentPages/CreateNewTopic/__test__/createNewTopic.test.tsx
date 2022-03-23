import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import CreateNewCamp from "../index";
import messages from "../../../../messages";

const { labels, placeholders } = messages;

describe("Create New Topic page", () => {
  it("render heading and labels", () => {
    render(<CreateNewCamp />);

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
    render(<CreateNewCamp />);

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
    render(<CreateNewCamp />);
    const btnEl = screen.getByText("Create Topic");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });
});
