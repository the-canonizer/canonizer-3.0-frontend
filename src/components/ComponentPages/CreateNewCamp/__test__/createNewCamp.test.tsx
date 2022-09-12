import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import CreateNewCamp from "..";
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

const parentCampsList = [
  {
    camp_name: "Design Change...",
    camp_num: 5,
    id: 119,
    parent_camp_num: 2,
    topic_num: 1,
  },
  {
    camp_name: "Second camp",
    camp_num: 7,
    id: 114,
    parent_camp_num: 4,
    topic_num: 4,
  },
];

const campNickNamesList = [
  { id: 20, nick_name: "Akash-Akash" },
  { id: 22, nick_name: "Rahul -Singh919" },
];

describe("Create New Topic page", () => {
  it("render heading and labels", () => {
    render(
      <CreateNewCamp
        nickNames={nickNamesList}
        parentCamps={parentCampsList}
        campNickNames={campNickNamesList}
        initialValues={initialValues}
      />
    );

    waitFor(async () => {
      expect(screen.getByTestId("head")).toBeInTheDocument();
      expect(screen.getByText(labels.cr_camp_name)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_keywords)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_edit_summary)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_keywords_sp)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_camp_url)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_nick_name_about)).toBeInTheDocument();
      expect(screen.getByTestId("btn")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  it("render inputs field and submit button", () => {
    render(
      <CreateNewCamp
        nickNames={nickNamesList}
        parentCamps={parentCampsList}
        campNickNames={campNickNamesList}
        initialValues={initialValues}
      />
    );

    waitFor(async () => {
      const campName = screen.getByLabelText(labels.cr_camp_name);
      expect(campName).toBeInTheDocument();
      expect(campName).toHaveAttribute("type", "text");

      const keywords = screen.getByLabelText(labels.cr_keywords);
      expect(keywords).toBeInTheDocument();
      expect(keywords).toHaveAttribute("type", "text");

      const editSummary = screen.getByLabelText(labels.cr_edit_summary);
      expect(editSummary).toBeInTheDocument();

      const campUrl = screen.getByLabelText(labels.cr_camp_url);
      expect(campUrl).toBeInTheDocument();
      expect(campUrl).toHaveAttribute("type", "text");

      const nickNameAbout = screen.getByLabelText(labels.cr_nick_name_about);
      expect(nickNameAbout).toBeInTheDocument();
      expect(nickNameAbout).toHaveAttribute("type", "search");
    });
  });

  it("blank form should not be submit", async () => {
    render(
      <CreateNewCamp
        nickNames={nickNamesList}
        parentCamps={parentCampsList}
        campNickNames={campNickNamesList}
        initialValues={initialValues}
      />
    );
    const btnEl = screen.getByTestId("btn");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });
});
