import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import TopicsList from "../index";
import { store } from "src/store";
import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";

import {
  getCanonizedNameSpacesApi,
  getCanonizedTopicsApi,
} from "src/network/api/homePageApi";
import { RouterContext } from "next/dist/shared/lib/router-context";
import userEvent from "@testing-library/user-event";
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

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

afterEach(cleanup);

let nameSpaces = [
  {
    id: 1,
    parent_id: 0,
    name: "General",
    label: "/General/",
    sort_order: 1,
  },
  {
    id: 2,
    parent_id: 0,
    name: "corporations",
    label: "/corporations/",
    sort_order: 3,
  },
  {
    id: 3,
    parent_id: 0,
    name: "crypto_currency",
    label: "/crypto_currency/",
    sort_order: 4,
  },
];

let topics = [
  {
    id: "6526a05b9165f776db0a6de3",
    as_of_date: 1696982400,
    topic_score: 25.281,
    topic_full_score: 61.888999999999996,
    topic_name: "Theories of Consciousness",
    topic_id: 88,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Theories of Consciousness",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 96,
  },
  {
    id: "6492a55305ef45132a288982",
    as_of_date: 1687305600,
    topic_score: 16.716,
    topic_full_score: 73.299,
    topic_name: "Representationalist Books",
    topic_id: 85,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Representationalist Books",
      },
    },
    submitter_nick_id: 21,
    created_by_nick_id: 21,
  },
  {
    id: "6492a52305ef45132a288901",
    as_of_date: 1687305600,
    topic_score: 15.97,
    topic_full_score: 15.97,
    topic_name: "Hard Problem",
    topic_id: 23,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Hard Problem",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a5ae05ef45132a288aff",
    as_of_date: 1687305600,
    topic_score: 6.497,
    topic_full_score: 6.497,
    topic_name: "ALCCO",
    topic_id: 243,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "ALCCO",
      },
    },
    submitter_nick_id: 407,
    created_by_nick_id: 407,
  },
  {
    id: "6492a56005ef45132a28898b",
    as_of_date: 1687305600,
    topic_score: 5.842,
    topic_full_score: 43.214999999999996,
    topic_name: "Most Important Science?",
    topic_id: 90,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Most Important Science?",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a52d05ef45132a28891f",
    as_of_date: 1687305600,
    topic_score: 5.574,
    topic_full_score: 5.574,
    topic_name: "Human Accomplishment",
    topic_id: 42,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Human Accomplishment",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a56105ef45132a28898e",
    as_of_date: 1687305600,
    topic_score: 5.563000000000001,
    topic_full_score: 5.563000000000001,
    topic_name: "Qualia Topic Appropriate",
    topic_id: 91,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Qualia Topic Appropriate",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "64ad16af3bfe80390e07ba93",
    as_of_date: 1689033600,
    topic_score: 5.286,
    topic_full_score: 5.286,
    topic_name: "Human Gen. Eng. is Wrong",
    topic_id: 44,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Human Gen. Eng. is Wrong",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "64ad139f92eb3958b40e64c3",
    as_of_date: 1689033600,
    topic_score: 5.286,
    topic_full_score: 5.286,
    topic_name: "Technological Improvement",
    topic_id: 40,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Technological Improvement",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a56b05ef45132a2889bb",
    as_of_date: 1687305600,
    topic_score: 4.809,
    topic_full_score: 4.809,
    topic_name: "Explanatory Gap",
    topic_id: 107,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Explanatory Gap",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 163,
  },
  {
    id: "6492a60d05ef45132a288d06",
    as_of_date: 1687305600,
    topic_score: 4.544,
    topic_full_score: 9.086,
    topic_name: "Abstract Word for Red",
    topic_id: 595,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Abstract Word for Red",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a53d05ef45132a28894c",
    as_of_date: 1687305600,
    topic_score: 4.544,
    topic_full_score: 22.715,
    topic_name: "Bible Best",
    topic_id: 61,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Bible Best",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a53e05ef45132a28894f",
    as_of_date: 1687305600,
    topic_score: 4.544,
    topic_full_score: 9.086,
    topic_name: "Bible Worst",
    topic_id: 62,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Bible Worst",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a51905ef45132a2888e9",
    as_of_date: 1687305600,
    topic_score: 4.544,
    topic_full_score: 9.086,
    topic_name: "Biological Trends?",
    topic_id: 12,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Biological Trends?",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
  {
    id: "6492a60e05ef45132a288d0c",
    as_of_date: 1687305600,
    topic_score: 4.544,
    topic_full_score: 9.086,
    topic_name: "Can Qualia Be Mistaken",
    topic_id: 597,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    tree_structure: {
      "1": {
        review_title: "Can Qualia Be Mistaken",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 1,
  },
];

let topicsArchive = [
  {
    id: "6526a05b9165f776db0a6de3",
    as_of_date: 1696982400,
    topic_score: 25.281,
    topic_full_score: 61.888999999999996,
    topic_name: "Theories of Consciousness",
    topic_id: 88,
    namespace_id: 1,
    algorithm_id: "mind_experts",
    is_archive: true,

    tree_structure: {
      "1": {
        review_title: "Theories of Consciousness",
      },
    },
    submitter_nick_id: 1,
    created_by_nick_id: 96,
  },
];

const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
      email: "andreaallsop14@gmail.com",
    },
  },
  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: 1699612621.161,
      asof: "default",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
  },
  homePage: {
    nameSpaces: nameSpaces,
    canonizedTopicsData: {
      numOfPages: null,
      topics: topics,
    },
  },
  utils: {
    score_checkbox: false,
    archived_checkbox: false,
  },
  loading: {
    loading: false,
  },
});

const store2 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
      email: "andreaallsop14@gmail.com",
    },
  },
  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/corporations/",
      namespace_id: 1,
      asofdate: 1699612621.161,
      asof: "review",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 1,
    },
  },
  homePage: {
    nameSpaces: nameSpaces,
    canonizedTopicsData: {
      numOfPages: null,
      topics: topicsArchive,
    },
  },
  utils: {
    score_checkbox: true,
    archived_checkbox: true,
  },
  loading: {
    loading: false,
  },
});

jest.mock("src/network/api/homePageApi");

describe("TopicsList", () => {
  beforeEach(() => {
    jest.mock("src/network/api/homePageApi");
  });
  test("renders select canon title", () => {
    render(
      <Provider store={store}>
        <TopicsList />
      </Provider>
    );

    const selectCanonTitle = screen.getByText("Select Canon");
    expect(selectCanonTitle).toBeInTheDocument();
  });

  test("click on view all topics", async () => {
    getCanonizedTopicsApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic: topics,
      },
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: nameSpaces,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/" })}>
          <TopicsList />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText(/theories of consciousness/i)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", {
        name: /select canon/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/general/i)).toBeInTheDocument();
    expect(screen.getByText(/theories of consciousness/i)).toBeInTheDocument();
    expect(screen.getByText(/25\.28/i)).toBeInTheDocument();

    expect(screen.getByText(/representationalist books/i)).toBeInTheDocument();
    expect(screen.getByText(/16\.72/i)).toBeInTheDocument();

    expect(screen.getByText(/hard problem/i)).toBeInTheDocument();
    expect(screen.getByText(/15\.97/i)).toBeInTheDocument();

    expect(screen.getByText(/alcco/i)).toBeInTheDocument();
    expect(screen.getByText(/6\.50/i)).toBeInTheDocument();

    expect(screen.getByText(/most important science?/i)).toBeInTheDocument();
    expect(screen.getByText(/5\.84/i)).toBeInTheDocument();

    expect(screen.getByText(/human accomplishment/i)).toBeInTheDocument();
    expect(screen.getByText(/5\.57/i)).toBeInTheDocument();

    expect(screen.getByText(/qualia topic appropriate/i)).toBeInTheDocument();
    expect(screen.getByText(/5\.56/i)).toBeInTheDocument();

    expect(screen.getByText(/human gen. eng. is wrong/i)).toBeInTheDocument();
    expect(screen.getAllByText(/5\.29/i)).toHaveLength(2);

    expect(screen.getByText(/technological improvement/i)).toBeInTheDocument();

    expect(screen.getByText(/explanatory gap/i)).toBeInTheDocument();
    expect(screen.getByText(/4\.81/i)).toBeInTheDocument();

    expect(screen.getByText(/abstract word for red/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4\.54/i)).toHaveLength(5);

    expect(screen.getByText(/bible best/i)).toBeInTheDocument();

    expect(screen.getByText(/Biological Trends?/i)).toBeInTheDocument();

    expect(screen.getByText(/can qualia Be mistaken/i)).toBeInTheDocument();

    expect(screen.getByText(/view all topics/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/view all topics/i));
  });

  test("click on only my topics", async () => {
    getCanonizedTopicsApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic: topics,
      },
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: nameSpaces,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/browse?canon=1&asof=bydate&asofdate=1700593199",
            query: {
              canon: "1",
              asof: "bydate",
              asofdate: "1700593199",
            },
          })}
        >
          <TopicsList />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText(/theories of consciousness/i)
      ).toBeInTheDocument();
    });
    screen.getByText("Only My Topics");
    const checkbox = screen.getByRole("checkbox", { name: "Only My Topics" });

    // Ensure the checkbox is initially unchecked
    expect(checkbox).not.toBeChecked();
  });

  test("Change namespaces", async () => {
    getCanonizedTopicsApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic: topicsArchive,
      },
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: nameSpaces,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/browse?canon=1&asof=review",
            query: {
              canon: "1",
              asof: "review",
            },
          })}
        >
          <TopicsList />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText(/theories of consciousness/i)
      ).toBeInTheDocument();
    });

    const selectInput = screen.getByRole("combobox"); // Find the select input by role

    userEvent.click(selectInput);

    fireEvent.click(screen.getByText("corporations"));
  });

  test("Click on Search", async () => {
    getCanonizedTopicsApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic: topicsArchive,
      },
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: nameSpaces,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/browse?canon=1&asof=review",
            query: {
              canon: "1",
              asof: "review",
            },
          })}
        >
          <TopicsList />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText(/theories of consciousness/i)
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    const seachField = screen.getByRole("textbox");

    fireEvent.change(seachField, { target: { value: "the" } });
    act(() => {
      jest.advanceTimersByTime(3001);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /search/i,
      })
    );
  });

  test("Click on Load More", async () => {
    getCanonizedTopicsApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic: topicsArchive,
      },
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: nameSpaces,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/browse?canon=1&asof=review",
            query: {
              canon: "1",
              asof: "review",
            },
          })}
        >
          <TopicsList />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText(/theories of consciousness/i)
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/load more/i));
  });

  test("With archive check", async () => {
    getCanonizedTopicsApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic: topicsArchive,
      },
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: nameSpaces,
    });

    render(
      <Provider store={store2}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/browse?canon=corporations&asof=review",
            query: {
              canon: "corporations",
              asof: "review",
            },
          })}
        >
          <TopicsList />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByText(/theories of consciousness/i)
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/theories of consciousness/i));
  });
});
