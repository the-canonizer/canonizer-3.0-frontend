import { render, screen } from "@testing-library/react";
import TopicHistory from "../topicHistory";

describe("TopicHistory", () => {
  const campStatement = {
    note: "this is test",
    namespace: "Topic/History",
    submit_time: 1622834400,
    submitter_nick_id: "987",
    submitter_nick_name: "Andrea",
    object_reason: "not valid",
    objector_nick_id: "654",
    objector_nick_name: "legend",
    go_live_time: 1622838000,
  };

  it("renders the canon", () => {
    render(
      <TopicHistory
        campStatement={campStatement}
        topicNamespaceId="topicNamespaceId"
      />
    );
    // const canon = screen.getByText("Topic > History");
    // expect(canon).toBeInTheDocument();
  });

  it("renders the submitted on time", () => {
    const { container } = render(
      <TopicHistory
        campStatement={campStatement}
        topicNamespaceId="topicNamespaceId"
      />
    );
    const submittedOnTime = screen.getByText("05 June 2021, 12:20:00 AM");

    // expect(screen.getByText(/Edit Summary :/i)).toBeInTheDocument();

    expect(screen.getByText(/this is test/i)).toBeInTheDocument();

    expect(screen.getByText(/Submitted on:/i)).toBeInTheDocument();
    // expect(screen.getByText(/Submitter Nickname :/i)).toBeInTheDocument();

    expect(screen.getByText(/Andrea/i)).toBeInTheDocument();
    expect(screen.getByText(/Going live on :/i)).toBeInTheDocument();
    expect(screen.getByText(/05 June 2021, 01:20:00 AM/i)).toBeInTheDocument();

    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(2);

    expect(submittedOnTime).toBeInTheDocument();
  });
});
