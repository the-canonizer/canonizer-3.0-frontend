import { render, screen } from "@testing-library/react";
import CampHistory from "../campHistory";

describe("CampHistory", () => {
  const campStatement = {
    parent_camp_name: "Parent Camp Name",
    key_words: "Keyword 1, Keyword 2",
    note: "Edit Summary",
    camp_about_url: "https://example.com",
    camp_about_nick_id: "123",
    topic_num: "456",
    camp_num: "789",
    canon: "topicNamespaceId",
    camp_about_nick_name: "Camp About Nickname",
    submitter_nick_id: "987",
    submitter_nick_name: "Submitter Nickname",
    is_disabled: 1,
    is_one_level: 0,
    is_archive: 1,
    submit_time: 1622834400,
    go_live_time: 1622838000,
    object_reason: "Object Reason",
    objector_nick_id: "654",
    objector_nick_name: "Objector Nickname",
  };

  it("renders the parent camp name", () => {
    render(
      <CampHistory
        campStatement={campStatement}
        topicNamespaceId="topicNamespaceId"
      />
    );
    const parentCampName = screen.getByText("Parent Camp Name");
    expect(parentCampName).toBeInTheDocument();
  });

  it("renders the keywords", () => {
    render(
      <CampHistory
        campStatement={campStatement}
        topicNamespaceId="topicNamespaceId"
      />
    );
    const keywords = screen.getByText("Keyword 1, Keyword 2");
    expect(keywords).toBeInTheDocument();
  });
});
