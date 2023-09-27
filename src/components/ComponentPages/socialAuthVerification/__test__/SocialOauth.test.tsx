import { act, cleanup, render, screen, waitFor } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import { Provider } from "react-redux";

import SocialOauth from "../";
import {
  socialLogin,
  userSocialAccountsList,
  userSocialAccountDelete,
} from "src/network/api/userApi";

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/settings",
    route: "/settings",
    query: { tab: "social_oauth_verification" },
    asPath: "/settings?tab=social_oauth_verification",
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
    currentCampRecord: {},
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
  ui: { multipleUserModalVisible: false },
});

jest.mock("src/network/api/userApi");

const originalLocation = window.location as Location;

beforeAll(() => {
  delete global.window.location;
  delete global.window.localStorage;

  global.window.location = originalLocation;

  global.window.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

afterAll(() => {
  global.window.location = originalLocation;
});

afterEach(cleanup);

describe("Social oauth verification page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/userApi");
  });

  it("render heading, text, button, and unlink linked account", async () => {
    userSocialAccountsList.mockResolvedValue({
      status_code: 200,
      message: "Success",
      error: null,
      data: [
        {
          id: 60,
          user_id: 1,
          social_email: "john.doe@canonizer.com",
          social_name: "John Doe",
          provider: "google",
          provider_id: "102102853483475874624",
        },
        {
          id: 61,
          user_id: 1,
          social_email: "john.doe@gmail.com",
          social_name: "John Doe",
          provider: "facebook",
          provider_id: "10158036832911224",
        },
        {
          id: 62,
          user_id: 1,
          social_email: "john.doe@gmail.com",
          social_name: "JohnDoe",
          provider: "github",
          provider_id: "6559312",
        },
        {
          id: 63,
          user_id: 1,
          social_email: "john.doe@canonizer.com",
          social_name: "John_Doe",
          provider: "twitter",
          provider_id: "19577801",
        },
        {
          id: 64,
          user_id: 1,
          social_email: "john.doe@gmail.com",
          social_name: "John Doe",
          provider: "linkedin",
          provider_id: "-HUgq_PzPd",
        },
      ],
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SocialOauth />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(async () => {
      expect(userSocialAccountsList).toHaveBeenCalled();
    });

    expect(screen.getAllByText("john.doe@canonizer.com").length).toEqual(1);
    expect(screen.getAllByText("john.doe@gmail.com").length).toEqual(3);
    expect(screen.getAllByText("John Doe").length).toEqual(3);
    expect(screen.getByText("JohnDoe")).toBeInTheDocument();
    expect(screen.getByText("google")).toBeInTheDocument();
    expect(screen.getByText("facebook")).toBeInTheDocument();
    // expect(screen.getByText("John_Doe")).toBeInTheDocument();
    // expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("linkedin")).toBeInTheDocument();
    expect(screen.getByText("github")).toBeInTheDocument();
    expect(screen.getAllByTestId("linkBtn").length).toEqual(4);
    expect(screen.getAllByText("Unlink").length).toEqual(4);
    const unlinkBtn = screen.getAllByTestId("linkBtn");
    expect(unlinkBtn.length).toEqual(4);
    userEvent.click(unlinkBtn[1]);
    expect(
      screen.getByText("Are you sure to unlink this account?")
    ).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    userEvent.click(screen.getByText("Yes"));

    await userSocialAccountDelete.mockResolvedValue({
      message: "Unlink Successfull!",
      status_code: 200,
    });

    await waitFor(() => {
      expect(userSocialAccountDelete).toHaveBeenCalled();
    });
  });

  it("link account", async () => {
    act(() => {
      global.localStorage.setItem = jest.fn(() => ({
        redirectTab: "tab=social",
      }));
      global.localStorage.getItem = jest.fn(() => "tab=social");
    });

    userSocialAccountsList.mockResolvedValue({
      status_code: 200,
      message: "Success",
      error: null,
      data: [],
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SocialOauth />
        </RouterContext.Provider>
      </Provider>
    );

    await waitFor(async () => {
      expect(userSocialAccountsList).toHaveBeenCalled();
    });

    expect(screen.getByText("google")).toBeInTheDocument();
    expect(screen.getByText("facebook")).toBeInTheDocument();
    expect(screen.getByText("linkedin")).toBeInTheDocument();
    expect(screen.getByText("github")).toBeInTheDocument();
    expect(screen.getAllByTestId("linkBtn").length).toEqual(4);
    const unlinkBtn = screen.getAllByTestId("linkBtn");
    expect(unlinkBtn.length).toEqual(4);
    userEvent.click(unlinkBtn[1]);

    await socialLogin.mockResolvedValue({
      message: "link Successfull!",
      status_code: 200,
    });

    await waitFor(() => {
      expect(socialLogin).toHaveBeenCalled();
    });
  });

  it("modal form submit", async () => {
    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
        },
        socialUsers: [
          { user_id: 1, id: 1, social_name: "John Doe" },
          { user_id: 2, id: 2, social_name: "Jena Doe" },
        ],
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
      ui: { multipleUserModalVisible: true },
    });

    act(() => {
      global.window.location = {
        search: "?provider=facebook&code=fake_token",
        href: null,
      } as Location;

      global.localStorage.setItem = jest.fn(() => ({
        redirectTab: "tab=social",
      }));
      global.localStorage.getItem = jest.fn(() => "tab=social");
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SocialOauth />
        </RouterContext.Provider>
      </Provider>
    );

    const inputs = screen.getByTestId("user_2");
    expect(inputs).toBeInTheDocument();

    userEvent.click(inputs);

    const modalBtn = screen.getByTestId("modalSubmit");

    expect(modalBtn).toBeInTheDocument();
    userEvent.click(modalBtn);
  });
});
