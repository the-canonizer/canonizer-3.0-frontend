import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import TopicsList from "../index";
import { store } from "src/store";
import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
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
    nameSpaces: [
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
    ],
    canonizedTopicsData: {
      numOfPages: null,
      topics: [
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
      ],
    },
  },
  utils: {
    score_checkbox: false,
  },
  loading: {
    loading: false,
  },
});

describe("TopicsList", () => {
  test("renders select canon title", () => {
    const { debug } = render(
      <Provider store={store}>
        <TopicsList />
      </Provider>
    );
    debug();

    const selectCanonTitle = screen.getByText("Select Canon");
    expect(selectCanonTitle).toBeInTheDocument();
  });
  test("renders select canon title", () => {
    const { debug } = render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter({ asPath: "/" })}>
          <TopicsList />
        </RouterContext.Provider>
      </Provider>
    );
    debug();
  });
});
