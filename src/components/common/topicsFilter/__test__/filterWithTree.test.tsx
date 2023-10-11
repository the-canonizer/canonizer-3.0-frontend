import FilterWithTree from "../filterWithTree";
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
    asPath:
      "/topic/88-Theories-of-Consciousness/1-Agreement?score=0&algo=mind_experts&asofdate=1696359599&asof=bydate&canon=1&filter=70",
    query: {
      score: "0",
      algo: "mind_experts",
      asofdate: "1696359599",
      asof: "bydate",
      canon: "1",
      filter: "70",
    },
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
          <FilterWithTree
            backGroundColorClass={"default"}
            getTreeLoadingIndicator={false}
            scrollToCampStatement={jest.fn()}
            setSupportTreeForCamp={jest.fn()}
            setTotalCampScoreForSupportTree={jest.fn()}
          />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText("Canonizer Algorithm:")).toBeInTheDocument();
    // expect(screen.getByText("Algorithm Information")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
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
    expect(
      screen.getByRole("textbox", {
        name: /2023\-10\-11/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /consensus tree/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/show camps with score/i)).toBeInTheDocument();
    expect(screen.getByText(/50%/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(9);
    expect(container.getElementsByTagName("a")).toHaveLength(1);
    expect(container.getElementsByTagName("img")).toHaveLength(0);
  });

  it("Should render without crash", async () => {
    const { container } = render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter()}>
          <FilterWithTree
            backGroundColorClass={"review"}
            getTreeLoadingIndicator={false}
            scrollToCampStatement={jest.fn()}
            setSupportTreeForCamp={jest.fn()}
            setTotalCampScoreForSupportTree={jest.fn()}
          />
        </RouterContext.Provider>
      </Provider>
    );
    const selectInput = screen.getAllByRole("combobox")[0]; // Find the select input by role

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

  it("Should render without crash", async () => {
    const { container } = render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter2({
            asPath:
              "/topic/88-Theories-of-Consciousness/1-Agreement?score=0&algo=mind_experts&asofdate=1696359599&asof=bydate&canon=1&filter=70",
            query: {
              score: "0",
              algo: "mind_experts",
              asofdate: "1696359599",
              asof: "bydate",
              canon: "1",
              filter: "70",
            },
          })}
        >
          <FilterWithTree
            backGroundColorClass={"bydate"}
            getTreeLoadingIndicator={false}
            scrollToCampStatement={jest.fn()}
            setSupportTreeForCamp={jest.fn()}
            setTotalCampScoreForSupportTree={jest.fn()}
          />
        </RouterContext.Provider>
      </Provider>
    );

    const includeReviewRadio = screen.getByText("Include review");
    const defaultRadio = screen.getByText("Default");
    const asOfDateRadio = screen.getByText("As of date");
    // const datePickerInput = screen.getByPlaceholderText('Select date');

    fireEvent.click(includeReviewRadio);
    fireEvent.click(defaultRadio);
    fireEvent.click(asOfDateRadio);

    let datePickerInput = screen.getByRole("textbox", {
      name: /2023\-10\-10/i,
    });
    fireEvent.click(datePickerInput);
    expect(datePickerInput).not.toBeDisabled();

    const selectedDate = moment("2022-10-15", "YYYY-MM-DD"); // Replace with the desired date
    fireEvent.change(datePickerInput, {
      target: { value: selectedDate.format("YYYY-MM-DD") },
    });

    // // Verify that the selected date is displayed in the input
    expect(datePickerInput).toHaveValue("2022-10-15");
    fireEvent.click(screen.getAllByText(/27/i)[0]);

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
  });

  it("Should render without crash", async () => {
    const { container } = render(
      <Provider store={store2}>
        <RouterContext.Provider
          value={createMockRouter2({
            asPath:
              "/topic/88-Theories-of-Consciousness/1-Agreement?score=0&algo=mind_experts&asofdate=1696359599&asof=bydate&canon=1&filter=70",
            query: {
              score: "0",
              algo: "mind_experts",
              asofdate: "1696359599",
              asof: "bydate",
              canon: "1",
              filter: "70",
            },
          })}
        >
          <FilterWithTree
            backGroundColorClass={"bydate"}
            getTreeLoadingIndicator={false}
            scrollToCampStatement={jest.fn()}
            setSupportTreeForCamp={jest.fn()}
            setTotalCampScoreForSupportTree={jest.fn()}
          />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText("Computer Science Experts")).toBeInTheDocument();

    const inputElement = screen.getAllByRole("textbox")[0];
    fireEvent.change(inputElement, { target: { value: "123" } });

    // Advance timers by 1001 milliseconds (1 second + 1 millisecond)
    act(() => {
      jest.advanceTimersByTime(1001);
    });
  });
});
