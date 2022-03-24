import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import CreateNewTopic from "../index";
import messages from "../../../../messages";

const { labels, placeholders } = messages;

describe("Create New Topic page", () => {
  it("render heading and labels", () => {
    render(<CreateNewTopic />);

    expect(screen.getByTestId("head")).toBeInTheDocument();
    expect(screen.getByText(labels.cr_topic_name)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_edit_summary)).toBeInTheDocument();
    expect(screen.getByText("Create Topic")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(<CreateNewTopic />);

    const topicName = screen.getByLabelText(labels.cr_topic_name);
    expect(topicName).toBeInTheDocument();
    expect(topicName).toHaveAttribute("type", "text");

    const editSummary = screen.getByLabelText(labels.cr_edit_summary);
    expect(editSummary).toBeInTheDocument();
  });

  it("blank form should not be submit", async () => {
    render(<CreateNewTopic />);
    const btnEl = screen.getByText("Create Topic");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });
});
