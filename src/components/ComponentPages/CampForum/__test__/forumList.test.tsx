import { render, screen, waitFor, act } from "../../../../utils/testUtils";

import ForumList from "../List";
import messages from "../../../../messages";

const { placeholders } = messages;

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
const postList = [];
const campRecords = {
  parentCamps: [
    {
      camp_num: 22,
      camp_name: "camp",
    },
  ],
};

const topicRecords = {
  topic_name: "topic",
  topic_num: 1,
};

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
