import { render, screen } from "../../../../utils/testUtils";

import ForumList from "../List";
import messages from "../../../../messages";

const { placeholders } = messages;

const data = [
  {
    key: "101",
    name: "Can we unify “Integrated Information” and “Global Workspace” with “Representational Qualia Theory”?",
    replies: 32,
    recent_post: "Brent_Allsop replied 3 years ago (Mar 18, 2019, 10:54:32 PM)",
  },
  {
    key: "102",
    name: "Moving “Mind Brain Identity” above “Dualism” in the camp structure.",
    replies: 3,
    recent_post: "Brent_Allsop replied 3 years ago (Sep 19, 2018, 3:48:20 AM)",
  },
];

const params = { topic: "topic-88", camp: "camp-22" };

describe("Camp forum page", () => {
  it("render heading and labels before login", () => {
    render(
      <>
        <ForumList
          onSearch={jest.fn()}
          onChange={jest.fn()}
          onCreateThread={jest.fn()}
          threadList={data}
          onThreadClick={jest.fn()}
          onEditClick={jest.fn()}
          current={1}
          total={10}
          filterThread={jest.fn()}
          isLoggedIn={false}
          paramsList={params}
        />
      </>
    );

    expect(screen.getByText("Camp Forum")).toBeInTheDocument();
    expect(screen.getByText("List of All Camp Threads")).toBeInTheDocument();
    expect(screen.getByText("All Threads")).toBeInTheDocument();
    expect(screen.getByText("Create Thread")).toBeInTheDocument();
    expect(screen.getByText("Thread Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholders.searchPlaceholder)
    ).toBeInTheDocument();
  });

  it("render buttons after login", () => {
    render(
      <>
        <ForumList
          onSearch={jest.fn()}
          onChange={jest.fn()}
          onCreateThread={jest.fn()}
          threadList={data}
          onThreadClick={jest.fn()}
          onEditClick={jest.fn()}
          current={1}
          total={10}
          filterThread={jest.fn()}
          isLoggedIn={true}
          paramsList={params}
        />
      </>
    );

    expect(screen.getByText("Camp Forum")).toBeInTheDocument();
    expect(screen.getByText("List of All Camp Threads")).toBeInTheDocument();
    expect(screen.getByText("All Threads")).toBeInTheDocument();
    expect(screen.getByText("Create Thread")).toBeInTheDocument();
    expect(screen.getByText("Thread Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholders.searchPlaceholder)
    ).toBeInTheDocument();
  });
});
