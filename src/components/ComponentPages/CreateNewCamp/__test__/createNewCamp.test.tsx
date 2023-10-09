import { cleanup, render, screen, waitFor } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "src/store";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import CreateNewCamp from "..";
import messages from "src/messages";

import {
  createCamp,
  getAllParentsCamp,
  getAllCampNickNames,
  getAllUsedNickNames,
} from "src/network/api/campDetailApi";
import { placeholders } from "src/messages/placeholder";

const { labels } = messages;

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

const nameSpaceList = [
  { id: 1, parent_id: 0, name: "Genaral", label: "Genaral" },
  { id: 2, parent_id: 0, name: "corporations", label: "/corporations/" },
];

jest.mock("src/network/api/campDetailApi");

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
    basePath: "/",
    pathname: "/topic/[...camp]",
    route:
      "/topic/34-Software-Development-Team-RFP/1-Agreement?score=0&algo=blind_popularity&asof=default&canon=",
    query: {
      camp: ["34-Software-Development-Team-RFP", "1-Agreement"],
      score: "0",
      algo: "blind_popularity",
      asof: "default",
      canon: "",
    },
    asPath:
      "/topic/34-Software-Development-Team-RFP/1-Agreement?score=0&algo=blind_popularity&asof=default&canon=",
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

describe("Create Camp page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render heading and labels", async () => {
    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: campNickNamesList,
    });

    getAllCampNickNames.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp initialValues={initialValues} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getAllUsedNickNames).toHaveBeenCalled();
      expect(getAllCampNickNames).toHaveBeenCalled();
    });

    expect(screen.getByTestId("head")).toBeInTheDocument();
    expect(
      screen.getByText("Disable additional sub camps")
    ).toBeInTheDocument();
    expect(screen.getByText("Create New Camp")).toBeInTheDocument();
    expect(screen.getByText("Camp archive")).toBeInTheDocument();
    expect(screen.getByText("Single level sub camps only")).toBeInTheDocument();
    expect(screen.getByText(labels.cr_camp_name)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_keywords)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_edit_summary)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_keywords_sp)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_camp_url)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_nick_name_about)).toBeInTheDocument();
    expect(screen.getByTestId("btn")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    const campName = screen.getByPlaceholderText("Camp name");
    expect(campName).toBeInTheDocument();
    expect(campName).toHaveAttribute("type", "text");

    const keywords = screen.getByPlaceholderText("Keywords");
    expect(keywords).toBeInTheDocument();
    expect(keywords).toHaveAttribute("type", "text");

    const editSummary = screen.getByPlaceholderText(placeholders.editSummary);
    expect(editSummary).toBeInTheDocument();

    const campUrl = screen.getByPlaceholderText(placeholders.campURL);
    expect(campUrl).toBeInTheDocument();
    expect(campUrl).toHaveAttribute("type", "text");

    const comoboxInputs = screen.getAllByRole("combobox");
    expect(comoboxInputs.length).toEqual(3);
    expect(comoboxInputs[0]).toBeInTheDocument();
    expect(comoboxInputs[0]).toHaveAttribute("type", "search");

    const btnEl = screen.getByTestId("btn");
    expect(btnEl).toBeInTheDocument();
  });

  it("render inputs field and submit button", async () => {
    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: campNickNamesList,
    });

    getAllCampNickNames.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    getAllParentsCamp.mockResolvedValue({
      status_code: 200,
      data: parentCampsList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp initialValues={initialValues} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getAllUsedNickNames).toHaveBeenCalled();
      expect(getAllCampNickNames).toHaveBeenCalled();
      expect(getAllParentsCamp).toHaveBeenCalled();
    });

    const campName = screen.getByPlaceholderText("Camp name");
    userEvent.type(campName, "camp name one");
    expect(campName).toHaveValue("camp name one");

    const keywords = screen.getByPlaceholderText("Keywords");
    userEvent.type(keywords, "keys one");
    expect(keywords).toHaveValue("keys one");

    const editSummary = screen.getByPlaceholderText(placeholders.editSummary);
    userEvent.type(editSummary, "summary of the camp");
    expect(editSummary).toHaveValue("summary of the camp");

    const campUrl = screen.getByPlaceholderText(placeholders.campURL);
    userEvent.type(campUrl, "https://development.canonizer.com/");
    expect(campUrl).toHaveValue("https://development.canonizer.com/");

    const btnEl = screen.getByTestId("btn");
    userEvent.click(btnEl);

    createCamp.mockResolvedValue({
      status_code: 200,
      message: "Created!",
      data: { camp_name: 2 },
    });
  });

  it("Form submmited and received 400 response", async () => {
    getAllUsedNickNames.mockResolvedValue({
      status_code: 400,
      data: campNickNamesList,
    });

    getAllCampNickNames.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    getAllParentsCamp.mockResolvedValue({
      status_code: 200,
      data: parentCampsList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp initialValues={initialValues} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getAllUsedNickNames).toHaveBeenCalled();
      expect(getAllCampNickNames).toHaveBeenCalled();
      expect(getAllParentsCamp).toHaveBeenCalled();
    });

    const campName = screen.getByPlaceholderText("Camp name");
    userEvent.type(campName, "camp name one");
    expect(campName).toHaveValue("camp name one");

    const keywords = screen.getByPlaceholderText("Keywords");
    userEvent.type(keywords, "keys one");
    expect(keywords).toHaveValue("keys one");

    const editSummary = screen.getByPlaceholderText(placeholders.editSummary);
    userEvent.type(editSummary, "summary of the camp");
    expect(editSummary).toHaveValue("summary of the camp");

    const campUrl = screen.getByPlaceholderText(placeholders.campURL);
    userEvent.type(campUrl, "https://development.canonizer.com/");
    expect(campUrl).toHaveValue("https://development.canonizer.com/");

    const btnEl = screen.getByTestId("btn");
    userEvent.click(btnEl);

    createCamp.mockResolvedValue({
      status_code: 400,
      message: "Failled!",
      data: { camp_name: 2 },
    });
  });

  it("Form submit with blank camp name", async () => {
    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: campNickNamesList,
    });

    getAllCampNickNames.mockResolvedValue({
      status_code: 200,
      data: nickNamesList,
    });

    getAllParentsCamp.mockResolvedValue({
      status_code: 200,
      data: parentCampsList,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp initialValues={initialValues} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getAllUsedNickNames).toHaveBeenCalled();
      expect(getAllCampNickNames).toHaveBeenCalled();
      expect(getAllParentsCamp).toHaveBeenCalled();
    });

    const campName = screen.getByPlaceholderText("Camp name");
    userEvent.type(campName, "");
    expect(campName).toHaveValue("");

    const keywords = screen.getByPlaceholderText("Keywords");
    userEvent.type(keywords, "keys one");
    expect(keywords).toHaveValue("keys one");

    const editSummary = screen.getByPlaceholderText(placeholders.editSummary);
    userEvent.type(editSummary, "summary of the camp");
    expect(editSummary).toHaveValue("summary of the camp");

    const campUrl = screen.getByPlaceholderText(placeholders.campURL);
    userEvent.type(campUrl, "https://development.canonizer.com/");
    expect(campUrl).toHaveValue("https://development.canonizer.com/");

    const btnEl = screen.getByTestId("btn");
    userEvent.click(btnEl);
  });

  it("blank form should not be submit", async () => {
    render(
      <Provider store={store}>
        <CreateNewCamp
          nickNames={nickNamesList}
          parentCamps={parentCampsList}
          campNickNames={campNickNamesList}
          initialValues={initialValues}
        />
      </Provider>
    );
    const btnEl = screen.getByTestId("btn");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });

  it("click on the cancel button", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp
            nickNames={nickNamesList}
            parentCamps={parentCampsList}
            campNickNames={campNickNamesList}
            initialValues={initialValues}
          />
        </RouterContext.Provider>
      </Provider>
    );

    const btnEl = screen.getByTestId("cancel-btn");
    expect(btnEl).toBeInTheDocument();
    userEvent.click(btnEl);
  });

  it("Select subcamp and archive checkbox", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp
            nickNames={nickNamesList}
            parentCamps={parentCampsList}
            campNickNames={campNickNamesList}
            initialValues={initialValues}
          />
        </RouterContext.Provider>
      </Provider>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toEqual(3);
    userEvent.click(checkboxes[0]);
  });
});
