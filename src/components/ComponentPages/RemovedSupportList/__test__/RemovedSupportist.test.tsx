import {
  cleanup,
  render,
  screen,
  waitFor,
  fireEvent,
} from "src/utils/testUtils";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";

import SubscriptionList from "..";
import { store } from "src/store";
import {
  getAllUsedNickNames,
  getAllRemovedReasons,
} from "src/network/api/campDetailApi";

const subsList = [
  {
    topic_num: 323,
    title: "topic one 17 05",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [],
  },
  {
    topic_num: 324,
    title: "topic two",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [
      {
        camp_num: 4,
        camp_name: "Agreement",
        support_order: 1,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
      {
        camp_num: 5,
        camp_name: "Agreement-2",
        support_order: 2,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
    ],
  },
];

jest.mock("src/network/api/campDetailApi");
jest.mock("src/network/api/userApi");

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
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
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
});

afterEach(cleanup);

describe("Removed Support List Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render heading and labels", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      expect(screen.getAllByText("For topic").length).toEqual(2);
      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText(subsList[1].title)).toBeInTheDocument();
      expect(screen.getAllByText("Remove subscription").length).toEqual(2);
      expect(screen.getByText("Agreement")).toBeInTheDocument();
      expect(screen.getByText("Agreement-2")).toBeInTheDocument();
    });
  });

  it("render heading and labels if test data is blank", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={[]} />
        </RouterContext.Provider>
      </Provider>
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
    expect(screen.getAllByText("No data").length).toEqual(1);
    expect(screen.getByText("Select Nickname:")).toBeInTheDocument();
    expect(screen.getAllByText("Select Nickname:").length).toEqual(1);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getAllByText("All").length).toEqual(1);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("click on remove subscription button and open modal", async () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(async () => {
      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText(subsList[1].title)).toBeInTheDocument();
    });
  });

  test("calling api for success response", async () => {
    getAllRemovedReasons.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          { id: 1, title: "reason 1" },
          { id: 2, title: "reason 2" },
        ],
        total_rows: 2,
      },
    });

    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: [
        { id: 1, title: "nickname 1" },
        { id: 2, title: "nickname 2" },
      ],
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getAllRemovedReasons).toHaveBeenCalled();
      expect(screen.getAllByTestId("cards").length).toEqual(2);
      expect(getAllUsedNickNames).toHaveBeenCalled();
    });
  });

  test("calling api for fail response", async () => {
    getAllRemovedReasons.mockResolvedValue({
      status_code: 400,
      data: null,
    });

    getAllUsedNickNames.mockResolvedValue({
      status_code: 400,
      data: null,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getAllRemovedReasons).toHaveBeenCalled();
      expect(screen.getAllByTestId("cards").length).toEqual(2);
      expect(getAllUsedNickNames).toHaveBeenCalled();
    });
  });

  test("testing nickname dropdown click", async () => {
    getAllRemovedReasons.mockResolvedValue({
      status_code: 400,
      data: null,
    });

    getAllUsedNickNames.mockResolvedValue({
      status_code: 400,
      data: null,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(getAllRemovedReasons).toHaveBeenCalled();
      expect(screen.getAllByTestId("cards").length).toEqual(2);
      expect(getAllUsedNickNames).toHaveBeenCalled();
      const drop = screen.getByTestId("user-nick-name-dropdown");
      const dropInp = screen.getByRole("combobox");
      expect(drop).toBeInTheDocument();
      expect(dropInp).toBeInTheDocument();
      fireEvent.click(drop);
      fireEvent.click(dropInp);
    });
  });
});
