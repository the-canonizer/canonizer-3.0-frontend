import { render, screen } from "@testing-library/react";
import CampHistory from "../campHistory";

const campStatement = {
  parent_camp_name: "Parent Camp Name",
  key_words: "Keyword 1, Keyword 2",
  note: "this is test",
  camp_about_url: "https://example.com",
  camp_about_nick_id: "123",
  topic_num: "456",
  camp_num: "789",
  canon: "topicNamespaceId",
  camp_about_nick_name: "Aron",
  submitter_nick_id: "987",
  submitter_nick_name: "Andrea",
  is_disabled: 1,
  is_one_level: 0,
  is_archive: 1,
  submit_time: 1622834400,
  go_live_time: 1622838000,
  object_reason: "not valid",
  objector_nick_id: "654",
  objector_nick_name: "legend",
};
const campStatement2 = {
  parent_camp_name: "Parent Camp Name",
  key_words: "Keyword 1, Keyword 2",
  note: "this is test",
  camp_about_url: null,
  camp_about_nick_id: "123",
  topic_num: null,
  camp_num: null,
  canon: "topicNamespaceId",
  camp_about_nick_name: "Aron",
  submitter_nick_id: null,
  submitter_nick_name: "Andrea",
  is_disabled: 1,
  is_one_level: 1,
  is_archive: 1,
  submit_time: 1622834400,
  go_live_time: 1622838000,
  object_reason: "not valid",
  objector_nick_id: null,
  objector_nick_name: "legend",
};
describe("CampHistory", () => {
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
    const { container } = render(
      <CampHistory
        campStatement={campStatement}
        topicNamespaceId="topicNamespaceId"
      />
    );
    const keywords = screen.getByText("Keyword 1, Keyword 2");
    expect(keywords).toBeInTheDocument();
    expect(screen.getByText(/parent camp :/i)).toBeInTheDocument();
    expect(screen.getByText(/parent camp name/i)).toBeInTheDocument();
    expect(screen.getByText(/keywords :/i)).toBeInTheDocument();
    expect(screen.getByText(/edit summary :/i)).toBeInTheDocument();
    expect(screen.getByText(/this is test/i)).toBeInTheDocument();
    expect(screen.getByText(/camp about url :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp about nickname :/i)).toBeInTheDocument();
    expect(screen.getByText(/Aron/i)).toBeInTheDocument();
    expect(screen.getByText(/Submitter Nickname :/i)).toBeInTheDocument();
    expect(screen.getByText(/Andrea/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Disable Additional Sub Camps :/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Single Level Camps Only :/i)).toBeInTheDocument();
    expect(screen.getByText(/Camp Archived :/i)).toBeInTheDocument();
    expect(screen.getByText(/Submitted On :/i)).toBeInTheDocument();
    expect(screen.getByText(/05 June 2021, 12:20:00 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/Go Live Time :/i)).toBeInTheDocument();
    expect(screen.getByText(/05 June 2021, 01:20:00 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/Object Reason :/i)).toBeInTheDocument();
    expect(screen.getByText(/not valid/i)).toBeInTheDocument();
    expect(screen.getByText(/Objector Nickname :/i)).toBeInTheDocument();
    expect(screen.getByText(/legend/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(4);
  });
  it("renders the with topic namespaceid null", () => {
    render(
      <CampHistory campStatement={campStatement2} topicNamespaceId={null} />
    );
    expect(screen.getByText(/parent camp :/i)).toBeInTheDocument();
    expect(screen.getByText(/parent camp name/i)).toBeInTheDocument();
    expect(screen.getByText(/keywords :/i)).toBeInTheDocument();

    expect(screen.getByText(/edit summary :/i)).toBeInTheDocument();
    expect(screen.getByText(/this is test/i)).toBeInTheDocument();
    expect(screen.getByText(/camp about url :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp about nickname :/i)).toBeInTheDocument();
    expect(screen.getByText(/Aron/i)).toBeInTheDocument();
    expect(screen.getByText(/Submitter Nickname :/i)).toBeInTheDocument();
    expect(screen.getByText(/Andrea/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Disable Additional Sub Camps :/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Single Level Camps Only :/i)).toBeInTheDocument();
  });
});

// eslint-disable-next-line react-hooks/exhaustive-deps
