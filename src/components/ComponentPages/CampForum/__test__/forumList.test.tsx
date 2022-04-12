import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import TopBar from "../UI/TopBar";
import ForumList from "../List";
import ThreadForm from "../Create";
import PostSection from "../Post";
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

describe("Camp forum page", () => {
  it("render heading and labels before login", () => {
    render(
      <>
        <TopBar paramsList={params} />
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
    expect(screen.getByText("Topic:")).toBeInTheDocument();
    expect(screen.getByText("topic-88")).toBeInTheDocument();
    expect(screen.getByText("Camp:")).toBeInTheDocument();
    expect(screen.getByText("camp-22")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholders.searchPlaceholder)
    ).toBeInTheDocument();
  });

  it("render buttons after login", () => {
    render(
      <>
        <TopBar paramsList={params} />
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
    expect(screen.getByText("My Threads")).toBeInTheDocument();
    expect(screen.getByText("My Participation")).toBeInTheDocument();
    expect(screen.getByText("Top 10")).toBeInTheDocument();
    expect(screen.getByText("Create Thread")).toBeInTheDocument();
    expect(screen.getByText("Thread Name")).toBeInTheDocument();
    expect(screen.getByText("Topic:")).toBeInTheDocument();
    expect(screen.getByText("topic-88")).toBeInTheDocument();
    expect(screen.getByText("Camp:")).toBeInTheDocument();
    expect(screen.getByText("camp-22")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(placeholders.searchPlaceholder)
    ).toBeInTheDocument();
  });

  // it("render inputs field and submit button on create thread section", () => {
  //   const form = {};
  //   render(
  //     <>
  //       <TopBar paramsList={params} />
  //       <ThreadForm
  //         isThreadUpdate={false}
  //         nickNameList={nickNamesList}
  //         onFinish={jest.fn()}
  //         form={form}
  //         initialValue={initialValues}
  //         paramsList={params}
  //         onCancelCreateThread={jest.fn()}
  //       />
  //     </>
  //   );

  //   expect(screen.getByText("Create a new thread")).toBeInTheDocument();

  //   const parentCamp = screen.getByLabelText(labels.threadTitle);
  //   expect(parentCamp).toBeInTheDocument();
  //   expect(parentCamp).toHaveAttribute("type", "text");

  //   const nickNameAbout = screen.getByLabelText(labels.cr_nick_name);
  //   expect(nickNameAbout).toBeInTheDocument();
  //   expect(nickNameAbout).toHaveAttribute("type", "search");
  //   expect(screen.getByText(labels.cr_nick_name_sp)).toBeInTheDocument();

  //   expect(screen.getByText("Submit")).toBeInTheDocument();
  //   expect(screen.getByText("Back")).toBeInTheDocument();
  // });

  // it("blank form should not be submitted on create thread section", async () => {
  //   const form = {};
  //   render(
  //     <>
  //       <TopBar paramsList={params} />
  //       <ThreadForm
  //         isThreadUpdate={false}
  //         nickNameList={nickNamesList}
  //         onFinish={jest.fn()}
  //         form={form}
  //         initialValue={initialValues}
  //         paramsList={params}
  //         onCancelCreateThread={jest.fn()}
  //       />
  //     </>
  //   );
  //   const btnEl = screen.getByText("Submit");

  //   userEvent.click(btnEl);

  //   await waitFor(() => {
  //     expect(screen.queryByRole("alert")).toBeInTheDocument();
  //   });
  // });

  // it("post section render", async () => {
  //   const form = {};
  //   render(
  //     <>
  //       <TopBar paramsList={params} />
  //       <PostSection
  //         nickNameList={nickNamesList}
  //         onCancel={jest.fn()}
  //         onFinishPost={jest.fn()}
  //         formPost={form}
  //         startedBy={"startedBy"}
  //         postCount={0}
  //         postList={postList}
  //         threadStamps={"threadStamps"}
  //         initialValue={initialValues}
  //         cardTitle="Test Post"
  //         pCurrent={1}
  //         pTotal={10}
  //         pOnChange={jest.fn()}
  //         paramsList={params}
  //       />
  //     </>
  //   );

  //   expect(screen.getByText("Test Post")).toBeInTheDocument();
  //   expect(
  //     screen.getByText("Number of Post in this thread: 0")
  //   ).toBeInTheDocument();
  //   expect(screen.getByLabelText(labels.cr_nick_name)).toBeInTheDocument();
  //   expect(screen.getByText(labels.cr_nick_name_sp)).toBeInTheDocument();
  //   expect(screen.getByText("Submit")).toBeInTheDocument();
  //   expect(screen.getByText("Back")).toBeInTheDocument();
  // });

  // it("post section blank form error check", async () => {
  //   render(
  //     <>
  //       <TopBar paramsList={params} />
  //       <PostSection
  //         nickNameList={nickNamesList}
  //         onCancel={jest.fn()}
  //         onFinishPost={jest.fn()}
  //         formPost={form}
  //         startedBy={"startedBy"}
  //         postCount={0}
  //         postList={postList}
  //         threadStamps={"threadStamps"}
  //         initialValue={initialValues}
  //         cardTitle="Test Post"
  //         pCurrent={1}
  //         pTotal={10}
  //         pOnChange={jest.fn()}
  //         paramsList={params}
  //       />
  //     </>
  //   );

  //   const btnEl = screen.getByText("Submit");

  //   userEvent.click(btnEl);

  //   await waitFor(() => {
  //     expect(screen.queryByRole("alert")).toBeInTheDocument();
  //   });
  // });
});
