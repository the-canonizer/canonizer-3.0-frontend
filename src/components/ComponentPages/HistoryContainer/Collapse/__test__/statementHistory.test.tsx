import { render, screen } from "@testing-library/react";
import StatementHistory from "../statementHistory";

describe("StatementHistory", () => {
  const campStatement = {
    note: "Edit Summary",
    submit_time: 1622834400,
    submitter_nick_id: "987",
    submitter_nick_name: "Submitter Nickname",
    object_reason: "Object Reason",
    objector_nick_id: "654",
    objector_nick_name: "Objector Nickname",
    go_live_time: 1622838000,
  };

  it("renders the edit summary", () => {
    render(
      <StatementHistory
        campStatement={campStatement}
        topicNamespaceId="topicNamespaceId"
      />
    );
    const editSummary = screen.getByText("Edit Summary");
    expect(editSummary).toBeInTheDocument();
  });

  it("renders the submitted on time", () => {
    render(
      <StatementHistory
        campStatement={campStatement}
        topicNamespaceId="topicNamespaceId"
      />
    );
    const submittedOnTime = screen.getByText("05 June 2021, 12:20:00 AM");
    expect(submittedOnTime).toBeInTheDocument();
  });
});
