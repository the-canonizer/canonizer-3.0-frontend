import CreateTopic from "../";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../store";
import moment from "moment";

import userEvent from "@testing-library/user-event";
import { NextRouter } from "next/router";

import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";

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
function createMockRouter2(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "",
    route: "/",
    query: {
      score: "0",
      algo: "mind_experts",
      asofdate: "1696359599",
      asof: "bydate",
      canon: "1",
    },
    asPath:
      "/?score=0&algo=mind_experts&asofdate=1696359599&asof=bydate&canon=1",
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
const store2 = mockStore({
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
      asof: "bydate",
      filterByScore: "0",
      algorithm: "computer_science_experts",
      search: "",
      includeReview: true,
      is_archive: 0,
    },
    current_date: 1696920964627,
    viewThisVersionCheck: true,
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
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <CreateTopic />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getAllByText(/canonizer/i)).toHaveLength(2);
    expect(screen.getByText("Canonizer Algorithm:")).toBeInTheDocument();
    expect(screen.getByText("Algorithm Information")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText(/filter/i)).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(
      screen.getByRole("checkbox", {
        name: /100% of canonized score on all supported camps/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /show archived camps/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/100% of canonized score on all supported camps/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/show archived camps/i)).toBeInTheDocument();
    expect(screen.getByText("As Of")).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: /include review/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/include review/i)).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: /default/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/default/i)).toBeInTheDocument();
    expect(
      screen.getByRole("radio", {
        name: /as of date/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/as of date/i)).toBeInTheDocument();

    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(8);
    expect(container.getElementsByTagName("a")).toHaveLength(1);
    expect(container.getElementsByTagName("img")).toHaveLength(0);
  });

  it("Change Algorithm", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter()}>
          <CreateTopic />
        </RouterContext.Provider>
      </Provider>
    );
    const selectInput = screen.getByRole("combobox"); // Find the select input by role

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

  it("Fire All Events", async () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter2({
            asPath:
              "/?score=0&algo=mind_experts&asofdate=1696359599&asof=bydate&canon=1",
            query: {
              score: "0",
              algo: "mind_experts",
              asofdate: "1696359599",
              asof: "bydate",
              canon: "1",
            },
          })}
        >
          <CreateTopic />
        </RouterContext.Provider>
      </Provider>
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /100% of canonized score on all supported camps/i,
      })
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /show archived camps/i,
      })
    );
    fireEvent.click(
      screen.getByRole("link", {
        name: /algorithm information/i,
      })
    );
  });

  it("Change Filter Value", async () => {
    render(
      <Provider store={store2}>
        <RouterContext.Provider
          value={createMockRouter2({
            asPath:
              "/?score=0&algo=mind_experts&asofdate=1696359599&asof=bydate&canon=1",
            query: {
              score: "0",
              algo: "mind_experts",
              asofdate: "1696359599",
              asof: "bydate",
              canon: "1",
            },
          })}
        >
          <CreateTopic />
        </RouterContext.Provider>
      </Provider>
    );

    expect(screen.getByText("Computer Science Experts")).toBeInTheDocument();

    const inputElement = screen.getAllByRole("textbox")[0];
    fireEvent.change(inputElement, { target: { value: "123" } });
    act(() => {
      jest.advanceTimersByTime(1001);
    });
  });
});
