import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import { Provider } from "react-redux";

import SubscriptionList from "../";
import { GetAllSubscriptionsList } from "src/network/api/userApi";

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

afterEach(cleanup);

const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
  topicDetails: {
    currentCampRecord: {},
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
});

jest.mock("src/network/api/userApi");

describe("Subscriptions List Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi");
  });

  it("render heading and labels", async () => {
    GetAllSubscriptionsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          {
            topic_num: 69,
            title: "Public Sex Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 295,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 294,
              },
            ],
          },
          {
            topic_num: 70,
            title: "Public Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 296,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 204,
              },
            ],
          },
        ],
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/" })}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(() => {
      expect(GetAllSubscriptionsList).toHaveBeenCalled();
    });

    expect(screen.getByText("Public Sex Education")).toBeInTheDocument();
    expect(screen.getByText("Public Education")).toBeInTheDocument();
    expect(screen.getAllByText("Remove subscription").length).toEqual(2);
    expect(screen.getAllByText("Funds for Sex Ed Before obama").length).toEqual(
      2
    );
    const removebtn = screen.getAllByTestId("camp-remove");
    expect(removebtn.length).toEqual(2);
    userEvent.click(removebtn[0]);

    expect(screen.getByTestId("topic-rm-title")).toBeInTheDocument();
    const rmbtn = screen.getByTestId("popremove");
    const rmcancelbtn = screen.getByTestId("popcancel");
    expect(rmbtn).toBeInTheDocument();
    expect(rmcancelbtn).toBeInTheDocument();

    userEvent.click(rmbtn);

    userEvent.click(removebtn[0]);
    userEvent.click(rmcancelbtn);

    screen.debug();
  });

  it("data render camp remove", async () => {
    GetAllSubscriptionsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          {
            topic_num: 69,
            title: "Public Sex Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 295,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 294,
              },
            ],
          },
          {
            topic_num: 70,
            title: "Public Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 296,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 204,
              },
            ],
          },
        ],
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/" })}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(async () => {
      expect(GetAllSubscriptionsList).toHaveBeenCalled();
    });

    expect(screen.getByText("Public Sex Education")).toBeInTheDocument();
    expect(screen.getAllByText("Funds for Sex Ed Before obama")).toHaveLength(
      2
    );
    expect(screen.getByText("Public Education")).toBeInTheDocument();
    // expect(screen.getByText("Remove Subscription")).toBeInTheDocument();
    const closeCircle = screen.getAllByRole("img");
    expect(closeCircle).toHaveLength(4);
    fireEvent.click(closeCircle[0]);
    expect(screen.getByText("Remove")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
