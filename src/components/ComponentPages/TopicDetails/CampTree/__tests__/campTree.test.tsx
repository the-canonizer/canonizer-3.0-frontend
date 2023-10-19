import CampTree from "../";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import React from "react";

import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";

import { NextRouter } from "next/router";

afterEach(cleanup);

function createMockRouter2(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "",
    route: "/",
    query: {
      filter: "50",
      score: "0",
      algo: "blind_popularity",
      asof: "default",
      canon: "19",
      camp: ["369-Regression-25-JAN-2022", "10-2"],
    },
    asPath:
      "/topic/369-Regression-25-JAN-2022/10-2?score=0&algo=blind_popularity&asof=default&canon=19",
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
    tree: [
      {
        "1": {
          topic_id: 369,
          camp_id: 1,
          title: "Regression 25 JAN 2022",
          review_title: "Regression 25 JAN 2022",
          link: "/topic/369-Regression-25-JAN-2022/1-Agreement",
          review_link: "/topic/369-Regression-25-JAN-2022/1-Agreement",
          score: 6,
          full_score: 13,
          submitter_nick_id: 537,
          created_date: 1643112271,
          is_valid_as_of_time: true,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          subscribed_users: [],
          support_tree: [],
          children: {
            "7": {
              topic_id: 369,
              camp_id: 7,
              title: "camp 1234556",
              review_title: "camp 1234556",
              link: "/topic/369-Regression-25-JAN-2022/7-camp-1234556#statement",
              review_link:
                "/topic/369-Regression-25-JAN-2022/7-camp-1234556#statement",
              score: 4,
              full_score: 6,
              submitter_nick_id: 357,
              created_date: 1643261328,
              is_disabled: 0,
              is_one_level: 0,
              is_archive: 0,
              direct_archive: 0,
              support_tree: [
                {
                  score: 1,
                  support_order: 1,
                  nick_name: "Ali",
                  nick_name_id: 454,
                  nick_name_link:
                    "/user/supports/454?topicnum=369&campnum=7&namespace=19",
                  delegates: [],
                  full_score: 1,
                },
              ],
              subscribed_users: [],
              parent_camp_is_disabled: 0,
              parent_camp_is_one_level: 0,
              children: {
                "3": {
                  topic_id: 369,
                  camp_id: 3,
                  title: "camp 2",
                  review_title: "camp 2",
                  link: "/topic/369-Regression-25-JAN-2022/3-camp-2#statement",
                  review_link:
                    "/topic/369-Regression-25-JAN-2022/3-camp-2#statement",
                  score: 3,
                  full_score: 5,
                  submitter_nick_id: 348,
                  created_date: 1645598562,
                  is_disabled: 0,
                  is_one_level: 0,
                  is_archive: 0,
                  direct_archive: 0,
                  support_tree: [],
                  subscribed_users: [],
                  parent_camp_is_disabled: 0,
                  parent_camp_is_one_level: 0,
                  children: {
                    "2": {
                      topic_id: 369,
                      camp_id: 2,
                      title: "camp 1",
                      review_title: "camp 1",
                      link: "/topic/369-Regression-25-JAN-2022/2-camp-1#statement",
                      review_link:
                        "/topic/369-Regression-25-JAN-2022/2-camp-1#statement",
                      score: 0,
                      full_score: 0,
                      submitter_nick_id: 348,
                      created_date: 1658742787,
                      is_disabled: 0,
                      is_one_level: 0,
                      is_archive: 0,
                      direct_archive: 0,
                      support_tree: [],
                      subscribed_users: [],
                      parent_camp_is_disabled: 0,
                      parent_camp_is_one_level: 0,
                      children: [],
                    },
                    "4": {
                      topic_id: 369,
                      camp_id: 4,
                      title: "camp 31",
                      review_title: "camp 31",
                      link: "/topic/369-Regression-25-JAN-2022/4-camp-31#statement",
                      review_link:
                        "/topic/369-Regression-25-JAN-2022/4-camp-31#statement",
                      score: 3,
                      full_score: 5,
                      submitter_nick_id: 537,
                      created_date: 1646742961,
                      is_disabled: 0,
                      is_one_level: 0,
                      is_archive: 0,
                      direct_archive: 0,
                      support_tree: [
                        {
                          score: 1.25,
                          support_order: 1,
                          nick_name: "Rupali cano",
                          nick_name_id: 357,
                          nick_name_link:
                            "/user/supports/357?topicnum=369&campnum=4&namespace=19",
                          delegates: [
                            {
                              score: 0.625,
                              full_score: 1,
                              support_order: 1,
                              nick_name: "Rohitgupta",
                              nick_name_id: 493,
                              nick_name_link:
                                "/user/supports/493?topicnum=369&campnum=4&namespace=19",
                              delegate_nick_name_id: 357,
                              delegates: [],
                            },
                          ],
                          full_score: 1,
                        },
                      ],
                      subscribed_users: [],
                      parent_camp_is_disabled: 0,
                      parent_camp_is_one_level: 0,
                      children: {
                        "5": {
                          topic_id: 369,
                          camp_id: 5,
                          title: "1",
                          review_title: "1",
                          link: "/topic/369-Regression-25-JAN-2022/5-1#statement",
                          review_link:
                            "/topic/369-Regression-25-JAN-2022/5-1#statement",
                          score: 1.75,
                          full_score: 3,
                          submitter_nick_id: 537,
                          created_date: 1643349521,
                          is_disabled: 0,
                          is_one_level: 0,
                          is_archive: 0,
                          direct_archive: 0,
                          support_tree: [
                            {
                              score: 1.5,
                              support_order: 1,
                              nick_name: "RC",
                              nick_name_id: 348,
                              nick_name_link:
                                "/user/supports/348?topicnum=369&campnum=5&namespace=19",
                              delegates: [
                                {
                                  score: 0.75,
                                  full_score: 1,
                                  support_order: 1,
                                  nick_name: "Rupali-Chavan",
                                  nick_name_id: 522,
                                  nick_name_link:
                                    "/user/supports/522?topicnum=369&campnum=5&namespace=19",
                                  delegate_nick_name_id: 348,
                                  delegates: [],
                                },
                              ],
                              full_score: 1,
                            },
                          ],
                          subscribed_users: [],
                          parent_camp_is_disabled: 0,
                          parent_camp_is_one_level: 0,
                          children: {
                            "6": {
                              topic_id: 369,
                              camp_id: 6,
                              title: "camp 4",
                              review_title: "camp 4",
                              link: "/topic/369-Regression-25-JAN-2022/6-camp-4#statement",
                              review_link:
                                "/topic/369-Regression-25-JAN-2022/6-camp-4#statement",
                              score: 0.25,
                              full_score: 1,
                              submitter_nick_id: 537,
                              created_date: 1643349470,
                              is_disabled: 0,
                              is_one_level: 0,
                              is_archive: 0,
                              direct_archive: 0,
                              support_tree: [],
                              subscribed_users: [],
                              parent_camp_is_disabled: 0,
                              parent_camp_is_one_level: 0,
                              children: {
                                "10": {
                                  topic_id: 369,
                                  camp_id: 10,
                                  title: "2",
                                  review_title: "2",
                                  link: "/topic/369-Regression-25-JAN-2022/10-2#statement",
                                  review_link:
                                    "/topic/369-Regression-25-JAN-2022/10-2#statement",
                                  score: 0.25,
                                  full_score: 1,
                                  submitter_nick_id: 537,
                                  created_date: 1646744731,
                                  is_disabled: 0,
                                  is_one_level: 0,
                                  is_archive: 0,
                                  direct_archive: 0,
                                  support_tree: [
                                    {
                                      score: 0.25,
                                      support_order: 2,
                                      nick_name: "sania",
                                      nick_name_id: 537,
                                      nick_name_link:
                                        "/user/supports/537?topicnum=369&campnum=10&namespace=19",
                                      delegates: [],
                                      full_score: 1,
                                    },
                                  ],
                                  subscribed_users: [],
                                  parent_camp_is_disabled: 0,
                                  parent_camp_is_one_level: 0,
                                  children: [],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "8": {
              topic_id: 369,
              camp_id: 8,
              title: "camp3",
              review_title: "camp3",
              link: "/topic/369-Regression-25-JAN-2022/8-camp3#statement",
              review_link:
                "/topic/369-Regression-25-JAN-2022/8-camp3#statement",
              score: 1.5,
              full_score: 5,
              submitter_nick_id: 537,
              created_date: 1646742665,
              is_disabled: 0,
              is_one_level: 0,
              is_archive: 0,
              direct_archive: 0,
              support_tree: [
                {
                  score: 0.75,
                  support_order: 1,
                  nick_name: "sania",
                  nick_name_id: 537,
                  nick_name_link:
                    "/user/supports/537?topicnum=369&campnum=8&namespace=19",
                  delegates: [],
                  full_score: 1,
                },
                {
                  score: 0.5,
                  support_order: 2,
                  nick_name: "Rupali cano",
                  nick_name_id: 357,
                  nick_name_link:
                    "/user/supports/357?topicnum=369&campnum=8&namespace=19",
                  delegates: [
                    {
                      score: 0.25,
                      full_score: 1,
                      support_order: 2,
                      nick_name: "Rohitgupta",
                      nick_name_id: 493,
                      nick_name_link:
                        "/user/supports/493?topicnum=369&campnum=8&namespace=19",
                      delegate_nick_name_id: 357,
                      delegates: [],
                    },
                  ],
                  full_score: 1,
                },
              ],
              subscribed_users: [],
              parent_camp_is_disabled: 0,
              parent_camp_is_one_level: 0,
              children: {
                "9": {
                  topic_id: 369,
                  camp_id: 9,
                  title: "camp delegate",
                  review_title: "camp delegate",
                  link: "/topic/369-Regression-25-JAN-2022/9-camp-delegate#statement",
                  review_link:
                    "/topic/369-Regression-25-JAN-2022/9-camp-delegate#statement",
                  score: 0.25,
                  full_score: 2,
                  submitter_nick_id: 537,
                  created_date: 1653443037,
                  is_disabled: 0,
                  is_one_level: 0,
                  is_archive: 0,
                  direct_archive: 0,
                  support_tree: [
                    {
                      score: 0.25,
                      support_order: 3,
                      nick_name: "Rupali cano",
                      nick_name_id: 357,
                      nick_name_link:
                        "/user/supports/357?topicnum=369&campnum=9&namespace=19",
                      delegates: [
                        {
                          score: 0.125,
                          full_score: 1,
                          support_order: 3,
                          nick_name: "Rohitgupta",
                          nick_name_id: 493,
                          nick_name_link:
                            "/user/supports/493?topicnum=369&campnum=9&namespace=19",
                          delegate_nick_name_id: 357,
                          delegates: [],
                        },
                      ],
                      full_score: 1,
                    },
                  ],
                  subscribed_users: [],
                  parent_camp_is_disabled: 0,
                  parent_camp_is_one_level: 0,
                  children: [],
                },
              },
            },
            "11": {
              topic_id: 369,
              camp_id: 11,
              title: "camp 123456799",
              review_title: "camp 123456799",
              link: "/topic/369-Regression-25-JAN-2022/11-camp-123456799#statement",
              review_link:
                "/topic/369-Regression-25-JAN-2022/11-camp-123456799#statement",
              score: 0.5,
              full_score: 2,
              submitter_nick_id: 348,
              created_date: 1657861932,
              is_disabled: 0,
              is_one_level: 0,
              is_archive: 0,
              direct_archive: 0,
              support_tree: [
                {
                  score: 0.5,
                  support_order: 2,
                  nick_name: "RC",
                  nick_name_id: 348,
                  nick_name_link:
                    "/user/supports/348?topicnum=369&campnum=11&namespace=19",
                  delegates: [
                    {
                      score: 0.25,
                      full_score: 1,
                      support_order: 2,
                      nick_name: "Rupali-Chavan",
                      nick_name_id: 522,
                      nick_name_link:
                        "/user/supports/522?topicnum=369&campnum=11&namespace=19",
                      delegate_nick_name_id: 348,
                      delegates: [],
                    },
                  ],
                  full_score: 1,
                },
              ],
              subscribed_users: [],
              parent_camp_is_disabled: 0,
              parent_camp_is_one_level: 0,
              children: [],
            },
          },
          collapsedTreeCampIds: [1],
        },
      },
    ],
    currentTopicRecord: {
      topic_num: 369,
      camp_num: 1,
      topic_name: "Regression 25 JAN 2022",
      namespace_name: "/sandbox testing/",
      topicSubscriptionId: "",
      namespace_id: 19,
      note: "",
      submitter_nick_name: "sania",
      go_live_time: 1646829449,
      camp_about_nick_id: null,
      submitter_nick_id: 537,
      submit_time: 1646743049,
      in_review_changes: 0,
    },
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/sandbox testing/",
      namespace_id: 19,
      asofdate: 1697093746.744,
      asof: "default",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
    viewThisVersionCheck: false,
  },
  utils: {
    score_checkbox: false,
  },
});

describe("Camp tree on camp details page", () => {
  test("renders CampTree component correctly", () => {
    render(
      <Provider store={store}>
        <CampTree />
      </Provider>
    );
    expect(screen.getByTestId("camp-tree")).toBeInTheDocument();
    expect(screen.getByText("No Camp Tree Found")).toBeInTheDocument();
  });

  test("expands tree nodes correctly", () => {
    let { container } = render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter2({
            asPath:
              "/topic/369-Regression-25-JAN-2022/10-2?score=0&algo=blind_popularity&asof=default&canon=19",
            query: {
              filter: "50",
              score: "0",
              algo: "blind_popularity",
              asof: "default",
              canon: "19",
              camp: ["369-Regression-25-JAN-2022", "10-2"],
            },
          })}
        >
          <CampTree
            treeExpandValue={50}
            prevTreeValueRef={{ current: 50 }}
            setSupportTreeForCamp={jest.fn()}
            setTotalCampScoreForSupportTree={jest.fn()}
            scrollToCampStatement={jest.fn()}
          />
        </RouterContext.Provider>
      </Provider>
    );

    expect(
      screen.getAllByRole("img", {
        name: /plus\-square/i,
        hidden: true,
      })
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("img", {
        name: /minus\-square/i,
        hidden: true,
      })
    ).toHaveLength(7);
    expect(
      screen.getByRole("link", {
        name: /regression 25 jan 2022/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/6\.00/i)).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /camp 1234556/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/4\.00/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /camp 2/i,
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/3\.00/i)).toHaveLength(2);
    expect(
      screen.getByRole("link", {
        name: /camp 31/i,
        hidden: true,
      })
    ).toBeInTheDocument();

    // expect(
    //   screen.getByRole("link", {
    //     name: /1/i,
    //     hidden: true,
    //   })
    // ).toBeInTheDocument();

    expect(screen.getByText(/1\.75/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /camp 4/i,
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/0\.25/i)).toHaveLength(2);

    // expect(
    //   screen.getByRole("link", {
    //     name: /2/i,
    //     hidden: true,
    //   })
    // ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /<start new supporting camp here>/i,
        hidden: true,
      })
    ).toBeInTheDocument();

    // expect(
    //   screen.getByRole("link", {
    //     name: /camp 1/i,
    //     hidden: true,
    //   })
    // ).toBeInTheDocument();
    expect(screen.getByText(/0\.00/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /camp3/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/1\.50/i)).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /camp 123456799/i,
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/0\.50/i)).toBeInTheDocument();

    const plusIcon = screen.getByLabelText("plus-square");

    // Simulate a click event on the plus icon

    fireEvent.click(plusIcon);

    fireEvent.click(
      screen.getByRole("link", {
        name: /camp 31/i,
        hidden: true,
      })
    );

    fireEvent.click(
      screen.getByRole("link", {
        name: /<start new supporting camp here>/i,
        hidden: true,
      })
    );
  });
});
