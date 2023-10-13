import CreateTopic from "..";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../../../store";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

import configureMockStore from "redux-mock-store";

function createMockRouter(): NextRouter {
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
  homePage: {
    algorithms: [
      {
        id: 1,
        algorithm_key: "blind_popularity",
        algorithm_label: "One Person One Vote",
      },
      {
        id: 2,
        algorithm_key: "mind_experts",
        algorithm_label: "Mind Experts",
      },
      {
        id: 3,
        algorithm_key: "computer_science_experts",
        algorithm_label: "Computer Science Experts",
      },
    ],
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: 1696924691.702,
      asof: "review",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: true,
      is_archive: 0,
    },
    current_date: 1696920964627,
    viewThisVersionCheck: false,
  },
  loading: {
    loading: false,
  },

  forum: {
    currentThread: null,
    currentPost: null,
  },
});

afterEach(cleanup);

describe("Sidebar Filters Component", () => {
  it("Should render without crash", async () => {
    const { getByText } = render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter()}>
          <CreateTopic />
        </RouterContext.Provider>
      </Provider>
    );
    expect(getByText("Canonizer")).toBeInTheDocument();
    expect(getByText("Canonizer Algorithm:")).toBeInTheDocument();
    expect(screen.getByText(/filter/i)).toBeInTheDocument();

    expect(screen.getAllByRole("combobox")).toHaveLength(1);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    const inputElement = screen.getAllByRole("textbox")[0];
    fireEvent.change(inputElement, { target: { value: "123" } });
    act(() => {
      jest.advanceTimersByTime(1001);
    });

    const selectInput = screen.getByRole("combobox");

    userEvent.click(selectInput);

    const optionToSelect = screen.getByText("Computer Science Experts");
    userEvent.click(optionToSelect);
    waitFor(() => {
      const selectedOption = screen.getByText("Computer Science Experts");
      expect(selectedOption).toBeInTheDocument();
    });
    expect(screen.getByText("Computer Science Experts")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Computer Science Experts"));
    waitFor(() => {
      expect(
        screen.getAllByText("Computer Science Experts")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Computer Science Experts")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Computer Science Experts"));

    await waitFor(() => {
      expect(screen.getAllByText("Computer Science Experts")).toHaveLength(1);
    });
  });
});
