import React from "react";
import { render, screen, waitFor, cleanup } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import CreateNewTopic from "..";
import messages from "src/messages";
import { createTopic } from "src/network/api/topicAPI";
import { getNickNameList } from "src/network/api/userApi";

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

const nameSpaceList = [
  { id: 1, parent_id: 0, name: "Genaral", label: "Genaral" },
  { id: 2, parent_id: 0, name: "corporations", label: "/corporations/" },
];
jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

// Create a mock store
const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  homePage: { nameSpaces: nameSpaceList },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: Date.now() / 1000,
      asof: "default",
      filterByScore: 0,
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
    viewThisVersionCheck: false,
  },
  forum: {
    currentThread: {},
    currentPost: {},
  },
});

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "/create/topic",
    pathname: "/create/topic",
    route: "/create/topic",
    query: {},
    asPath: "/create/topic",
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
    ...router,
  };
}

jest.mock("src/network/api/topicAPI");
jest.mock("src/network/api/userApi");

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

afterEach(cleanup);

describe("Create Topic page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render heading, labels, and inputs", async () => {
    getNickNameList.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewTopic />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getNickNameList).toHaveBeenCalled();
    });

    // expect(screen.getByTestId("head")).toBeInTheDocument();
    expect(screen.getByText(labels.cr_nick_name)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_topic_name)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_nick_name_sp)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_namespace)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_namespace)).toBeInTheDocument();
    expect(screen.getAllByText("Creating a New Topic")).toHaveLength(2);
    expect(
      screen.getByText(
        "A topic on our platform refers to a specific subject within the context of the canon. It serves as a focal point for discussions, allowing users to explore and share opinions, ideas on a topic."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Discard")).toBeInTheDocument();

    const nickName = screen.getByText(labels.cr_nick_name);
    expect(nickName).toBeInTheDocument();

    const topicName = screen.getByText(labels.cr_topic_name);
    expect(topicName).toBeInTheDocument();

    const nameSpace = screen.getByText(labels.cr_namespace);
    expect(nameSpace).toBeInTheDocument();

    // const editSummary = screen.getByText(labels.cr_edit_summary);
    // expect(editSummary).toBeInTheDocument();

    const compInps = screen.getAllByRole("combobox");
    const topicInp = screen.getByPlaceholderText(placeholders.topicName);
    // const sumInp = screen.getByPlaceholderText(placeholders.editSummary);
    expect(compInps[0]).toBeInTheDocument();
    expect(topicInp).toBeInTheDocument();
    expect(compInps[1]).toBeInTheDocument();
    // expect(sumInp).toBeInTheDocument();
    expect(compInps[0]).toHaveAttribute("type", "search");
    expect(topicInp).toHaveAttribute("type", "text");
    expect(compInps[1]).toHaveAttribute("type", "search");

    userEvent.type(compInps[0], nickNamesList[0]?.nick_name);
    userEvent.type(compInps[1], nameSpaceList[0]?.label);
    userEvent.type(topicInp, "Text Topic");
    // userEvent.type(
    //   sumInp,
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veniam tempora velit animi adipisci. A, dolor est! Obcaecati itaque doloribus hic voluptatum! Pariatur explicabo veritatis quas perferendis labore vel sed quia amet, expedita voluptatum voluptas quo assumenda odit reiciendis repellat quam aliquam est dolore fugiat. At nulla numquam modi impedit id totam labore, eligendi perferendis est blanditiis quibusdam animi, ipsum iure harum cumque, officia enim. Eveniet commodi blanditiis aliquid pariatur deserunt deleniti inventore repudiandae praesentium animi, illum quam quod ipsa nulla sint rem natus, dicta nisi vero veritatis dolores perferendis? Similique velit quos impedit cum officiis odit repellendus et molestias."
    // );

    expect(topicInp).toHaveValue("Text Topic");
    // expect(sumInp).toHaveValue(
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem veniam tempora velit animi adipisci. A, dolor est! Obcaecati itaque doloribus hic voluptatum! Pariatur explicabo veritatis quas perferendis labore vel sed quia amet, expedita voluptatum voluptas quo assumenda odit reiciendis repellat quam aliquam est dolore fugiat. At nulla numquam modi impedit id totam labore, eligendi perferendis est blanditiis quibusdam animi, ipsum iure harum cumque, officia enim. Eveniet commodi blanditiis aliquid pariatur deserunt deleniti inventore repudiandae praesentium animi, illum quam quod ipsa nulla sint rem natus, dicta nisi vero veritatis dolores perferendis? Similique velit quos impedit cum officiis odit repellendus et molestias."
    // );
  });
  it("Submit create topic api with data", async () => {
    getNickNameList.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewTopic />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getNickNameList).toHaveBeenCalled();
    });

    const compInps = screen.getAllByRole("combobox");
    const topicInp = screen.getByPlaceholderText(placeholders.topicName);
    // const sumInp = screen.getByPlaceholderText(placeholders.editSummary);

    userEvent.type(compInps[0], nickNamesList[0]?.nick_name);
    userEvent.type(compInps[1], nameSpaceList[0]?.label);
    userEvent.type(topicInp, "Text Topic");
    // userEvent.type(
    //   sumInp,
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit."
    // );

    expect(topicInp).toHaveValue("Text Topic");
    // expect(sumInp).toHaveValue(
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit."
    // );

    const btnEl = screen.getByTestId("create-topic-btn");
    userEvent.click(btnEl);

    createTopic.mockResolvedValue({
      status_code: 200,
      message: "Topic Created Successfully!",
      data: {
        topic_num: 1,
        camp_num: 1,
        topic_name: "Text Topic",
        submitter_nick_id: 10,
      },
    });

    // await waitFor(() => {
    // expect(screen.getByText("Topic Created Successfully!")).toBeInTheDocument();
    // });
  });

  it("Submit without topic name", async () => {
    getNickNameList.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewTopic />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getNickNameList).toHaveBeenCalled();
    });

    const compInps = screen.getAllByRole("combobox");
    const topicInp = screen.getByPlaceholderText(placeholders.topicName);
    // const sumInp = screen.getByPlaceholderText(placeholders.editSummary);

    userEvent.type(compInps[0], nickNamesList[0]?.nick_name);
    userEvent.type(compInps[1], nameSpaceList[0]?.label);
    userEvent.type(topicInp, "");
    // userEvent.type(
    //   sumInp,
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit."
    // );

    expect(topicInp).toHaveValue("");
    // expect(sumInp).toHaveValue(
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit."
    // );

    const btnEl = screen.getByTestId("create-topic-btn");
    userEvent.click(btnEl);
  });
  it("Submit create topic api for 400 response", async () => {
    getNickNameList.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewTopic />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getNickNameList).toHaveBeenCalled();
    });

    const compInps = screen.getAllByRole("combobox");
    const topicInp = screen.getByPlaceholderText(placeholders.topicName);
    // const sumInp = screen.getByPlaceholderText(placeholders.editSummary);

    userEvent.type(compInps[0], nickNamesList[0]?.nick_name);
    userEvent.type(compInps[1], nameSpaceList[0]?.label);
    userEvent.type(topicInp, "Text Topic");
    // userEvent.type(
    //   sumInp,
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit."
    // );

    expect(topicInp).toHaveValue("Text Topic");
    // expect(sumInp).toHaveValue(
    //   "Lorem, ipsum dolor sit amet consectetur adipisicing elit."
    // );

    const btnEl = screen.getByTestId("create-topic-btn");
    userEvent.click(btnEl);

    createTopic.mockResolvedValue({
      status_code: 400,
      message: "Topic Creation Faileld!",
      data: null,
      error: { topic_name: "Topic name already exists" },
    });

    // await waitFor(() => {
    //   expect(screen.getByText("Topic name already exists")).toBeInTheDocument();
    // });

    const cancelBtn = screen.getByTestId("cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
    userEvent.click(cancelBtn);
  });

  it("blank form should not be submit", async () => {
    render(<CreateNewTopic />);

    const btnEl = screen.getByTestId("create-topic-btn");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.getAllByRole("alert").length).toEqual(1);
    });
  });
});
