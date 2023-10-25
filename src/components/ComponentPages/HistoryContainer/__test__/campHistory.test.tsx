import CampList from "..";
import { Provider } from "react-redux";
import { store } from "../../../../store";
import { fireEvent, render, screen } from "@testing-library/react";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { act } from "react-dom/test-utils";
import { setHistory } from "../../../../store/slices/campDetailSlice";

import configureMockStore from "redux-mock-store";
import CampHistory from "../Collapse/campHistory";
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
          topic_id: 1444,
          camp_id: 1,
          title: "17 JAN 20232",
          review_title: "17 JAN 20232",
          link: "/topic/1444-17-JAN-20232/1-Agreement",
          review_link: "/topic/1444-17-JAN-20232/1-Agreement",
          score: 6,
          full_score: 10,
          submitter_nick_id: 709,
          created_date: 1673935009,
          is_valid_as_of_time: true,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          subscribed_users: [],
          support_tree: [
            {
              score: 1,
              support_order: 1,
              nick_name: "Rupali N",
              nick_name_id: 351,
              nick_name_link:
                "/user/supports/351?topicnum=1444&campnum=1&namespace=19",
              delegates: [],
              full_score: 1,
            },
            {
              score: 1,
              support_order: 1,
              nick_name: "aq",
              nick_name_id: 803,
              nick_name_link:
                "/user/supports/803?topicnum=1444&campnum=1&namespace=19",
              delegates: [],
              full_score: 1,
            },
          ],
          children: {
            "2": {
              topic_id: 1444,
              camp_id: 2,
              title: "Camp 1",
              review_title: "Camp 1",
              link: "/topic/1444-17-JAN-20232/2-Camp-1#statement",
              review_link: "/topic/1444-17-JAN-20232/2-Camp-1#statement",
              score: 3,
              full_score: 4,
              submitter_nick_id: 347,
              created_date: 1673935020,
              is_disabled: 0,
              is_one_level: 0,
              is_archive: 0,
              direct_archive: 0,
              support_tree: [
                {
                  score: 3,
                  support_order: 1,
                  nick_name: "Rupali C",
                  nick_name_id: 347,
                  nick_name_link:
                    "/user/supports/347?topicnum=1444&campnum=2&namespace=19",
                  delegates: [
                    {
                      score: 2.25,
                      full_score: 1,
                      support_order: 1,
                      nick_name: "Rupali cano",
                      nick_name_id: 357,
                      nick_name_link:
                        "/user/supports/357?topicnum=1444&campnum=2&namespace=19",
                      delegate_nick_name_id: 347,
                      delegates: [
                        {
                          score: 1.5,
                          full_score: 1,
                          support_order: 1,
                          nick_name: "Rupali-Chavan",
                          nick_name_id: 522,
                          nick_name_link:
                            "/user/supports/522?topicnum=1444&campnum=2&namespace=19",
                          delegate_nick_name_id: 357,
                          delegates: [
                            {
                              score: 0.75,
                              full_score: 1,
                              support_order: 1,
                              nick_name: "Rupali-Chavan14",
                              nick_name_id: 554,
                              nick_name_link:
                                "/user/supports/554?topicnum=1444&campnum=2&namespace=19",
                              delegate_nick_name_id: 522,
                              delegates: [],
                            },
                          ],
                        },
                      ],
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
            "3": {
              topic_id: 1444,
              camp_id: 3,
              title: "Camp 2",
              review_title: "Camp 2",
              link: "/topic/1444-17-JAN-20232/3-Camp-2#statement",
              review_link: "/topic/1444-17-JAN-20232/3-Camp-2#statement",
              score: 1,
              full_score: 4,
              submitter_nick_id: 347,
              created_date: 1673935054,
              is_disabled: 0,
              is_one_level: 0,
              is_archive: 0,
              direct_archive: 0,
              support_tree: [
                {
                  score: 1,
                  support_order: 2,
                  nick_name: "Rupali C",
                  nick_name_id: 347,
                  nick_name_link:
                    "/user/supports/347?topicnum=1444&campnum=3&namespace=19",
                  delegates: [
                    {
                      score: 0.75,
                      full_score: 1,
                      support_order: 2,
                      nick_name: "Rupali cano",
                      nick_name_id: 357,
                      nick_name_link:
                        "/user/supports/357?topicnum=1444&campnum=3&namespace=19",
                      delegate_nick_name_id: 347,
                      delegates: [
                        {
                          score: 0.5,
                          full_score: 1,
                          support_order: 2,
                          nick_name: "Rupali-Chavan",
                          nick_name_id: 522,
                          nick_name_link:
                            "/user/supports/522?topicnum=1444&campnum=3&namespace=19",
                          delegate_nick_name_id: 357,
                          delegates: [
                            {
                              score: 0.25,
                              full_score: 1,
                              support_order: 2,
                              nick_name: "Rupali-Chavan14",
                              nick_name_id: 554,
                              nick_name_link:
                                "/user/supports/554?topicnum=1444&campnum=3&namespace=19",
                              delegate_nick_name_id: 522,
                              delegates: [],
                            },
                          ],
                        },
                      ],
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
    history: {
      items: [
        {
          value:
            "<p><del><strong>state12</strong></del></p>\n<ul>\n<li><del><strong>tset</strong></del></li>\n<li><del><strong>test</strong></del></li>\n</ul>\n",
          parsed_value:
            "<p><del><strong>state12</strong></del></p>\n<ul>\n<li><del><strong>tset</strong></del></li>\n<li><del><strong>test</strong></del></li>\n</ul>\n<p> </p>",
          topic_num: 1444,
          camp_num: 1,
          id: 5521,
          note: "",
          submit_time: 1681876876,
          submitter_nick_id: 627,
          go_live_time: 1681963276,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          language: "English",
          grace_period: 0,
          objector_nick_name: null,
          agreed_to_change: 0,
          submitter_nick_name: "vikas 3",
          isAuthor: false,
          total_supporters: 4,
          agreed_supporters: 1,
          ifIamSupporter: 0,
          ifIAmExplicitSupporter: false,
          status: "live",
        },
        {
          value: "<p><del><strong>state12</strong></del></p>\n",
          parsed_value: "<p><del><strong>state12</strong></del></p>\n<p> </p>",
          topic_num: 1444,
          camp_num: 1,
          id: 5520,
          note: "",
          submit_time: 1681876844,
          submitter_nick_id: 627,
          go_live_time: 1681963244,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          language: "English",
          grace_period: 0,
          objector_nick_name: null,
          agreed_to_change: 0,
          submitter_nick_name: "vikas 3",
          isAuthor: false,
          total_supporters: 4,
          agreed_supporters: 1,
          ifIamSupporter: 0,
          ifIAmExplicitSupporter: false,
          status: "old",
        },
        {
          value: "<p>state12</p>\n",
          parsed_value: "<p>state12</p>\n<p> </p>",
          topic_num: 1444,
          camp_num: 1,
          id: 5346,
          note: "",
          submit_time: 1679493356,
          submitter_nick_id: 803,
          go_live_time: 1679579756,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          language: "English",
          grace_period: 0,
          objector_nick_name: null,
          agreed_to_change: 0,
          submitter_nick_name: "aq",
          isAuthor: false,
          total_supporters: 3,
          agreed_supporters: 1,
          ifIamSupporter: 0,
          ifIAmExplicitSupporter: false,
          status: "old",
        },
      ],
      current_page: 1,
      per_page: 4,
      last_page: 1,
      total_rows: 3,
      from: 1,
      to: 3,
      details: {
        ifIamSupporter: 0,
        ifSupportDelayed: 0,
        ifIAmExplicitSupporter: false,
        topic: {
          topic_name: "17 JAN 20232",
          namespace_id: 19,
          id: 5915,
          topic_num: 1444,
          parent_camp_num: null,
          key_words: "",
          language: "English",
          camp_num: 1,
          note: "",
          submit_time: 1673935009,
          submitter_nick_id: 347,
          go_live_time: 1673935009,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          title: "17 JAN 2023",
          camp_name: "Agreement",
          camp_about_url: null,
          camp_about_nick_id: null,
          grace_period: 0,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          old_parent_camp_num: null,
          archive_action_time: 0,
          namespace_name: "sandbox testing",
          name: "sandbox testing",
        },
        liveCamp: {
          id: 5915,
          topic_num: 1444,
          parent_camp_num: null,
          key_words: "",
          language: "English",
          camp_num: 1,
          note: "",
          submit_time: 1673935009,
          submitter_nick_id: 347,
          go_live_time: 1673935009,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          title: "17 JAN 2023",
          camp_name: "Agreement",
          camp_about_url: null,
          camp_about_nick_id: null,
          grace_period: 0,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          old_parent_camp_num: null,
          archive_action_time: 0,
        },
        parentCamp: [
          {
            camp_name: "Agreement",
            topic_num: 1444,
            camp_num: 1,
          },
        ],
      },
    },
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: 1697569199,
      asof: "bydate",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
    selectedCampNode: {
      topic_id: 1444,
      camp_id: 1,
      title: "17 JAN 20232",
      review_title: "17 JAN 20232",
      link: "/topic/1444-17-JAN-20232/1-Agreement",
      review_link: "/topic/1444-17-JAN-20232/1-Agreement",
      score: 6,
      full_score: 10,
      submitter_nick_id: 709,
      created_date: 1673935009,
      is_valid_as_of_time: true,
      is_disabled: 0,
      is_one_level: 0,
      is_archive: 0,
      direct_archive: 0,
      subscribed_users: [],
      support_tree: [
        {
          score: 1,
          support_order: 1,
          nick_name: "Rupali N",
          nick_name_id: 351,
          nick_name_link:
            "/user/supports/351?topicnum=1444&campnum=1&namespace=19",
          delegates: [],
          full_score: 1,
        },
        {
          score: 1,
          support_order: 1,
          nick_name: "aq",
          nick_name_id: 803,
          nick_name_link:
            "/user/supports/803?topicnum=1444&campnum=1&namespace=19",
          delegates: [],
          full_score: 1,
        },
      ],
      children: {
        "2": {
          topic_id: 1444,
          camp_id: 2,
          title: "Camp 1",
          review_title: "Camp 1",
          link: "/topic/1444-17-JAN-20232/2-Camp-1#statement",
          review_link: "/topic/1444-17-JAN-20232/2-Camp-1#statement",
          score: 3,
          full_score: 4,
          submitter_nick_id: 347,
          created_date: 1673935020,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          support_tree: [
            {
              score: 3,
              support_order: 1,
              nick_name: "Rupali C",
              nick_name_id: 347,
              nick_name_link:
                "/user/supports/347?topicnum=1444&campnum=2&namespace=19",
              delegates: [
                {
                  score: 2.25,
                  full_score: 1,
                  support_order: 1,
                  nick_name: "Rupali cano",
                  nick_name_id: 357,
                  nick_name_link:
                    "/user/supports/357?topicnum=1444&campnum=2&namespace=19",
                  delegate_nick_name_id: 347,
                  delegates: [
                    {
                      score: 1.5,
                      full_score: 1,
                      support_order: 1,
                      nick_name: "Rupali-Chavan",
                      nick_name_id: 522,
                      nick_name_link:
                        "/user/supports/522?topicnum=1444&campnum=2&namespace=19",
                      delegate_nick_name_id: 357,
                      delegates: [
                        {
                          score: 0.75,
                          full_score: 1,
                          support_order: 1,
                          nick_name: "Rupali-Chavan14",
                          nick_name_id: 554,
                          nick_name_link:
                            "/user/supports/554?topicnum=1444&campnum=2&namespace=19",
                          delegate_nick_name_id: 522,
                          delegates: [],
                        },
                      ],
                    },
                  ],
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
        "3": {
          topic_id: 1444,
          camp_id: 3,
          title: "Camp 2",
          review_title: "Camp 2",
          link: "/topic/1444-17-JAN-20232/3-Camp-2#statement",
          review_link: "/topic/1444-17-JAN-20232/3-Camp-2#statement",
          score: 1,
          full_score: 4,
          submitter_nick_id: 347,
          created_date: 1673935054,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          support_tree: [
            {
              score: 1,
              support_order: 2,
              nick_name: "Rupali C",
              nick_name_id: 347,
              nick_name_link:
                "/user/supports/347?topicnum=1444&campnum=3&namespace=19",
              delegates: [
                {
                  score: 0.75,
                  full_score: 1,
                  support_order: 2,
                  nick_name: "Rupali cano",
                  nick_name_id: 357,
                  nick_name_link:
                    "/user/supports/357?topicnum=1444&campnum=3&namespace=19",
                  delegate_nick_name_id: 347,
                  delegates: [
                    {
                      score: 0.5,
                      full_score: 1,
                      support_order: 2,
                      nick_name: "Rupali-Chavan",
                      nick_name_id: 522,
                      nick_name_link:
                        "/user/supports/522?topicnum=1444&campnum=3&namespace=19",
                      delegate_nick_name_id: 357,
                      delegates: [
                        {
                          score: 0.25,
                          full_score: 1,
                          support_order: 2,
                          nick_name: "Rupali-Chavan14",
                          nick_name_id: 554,
                          nick_name_link:
                            "/user/supports/554?topicnum=1444&campnum=3&namespace=19",
                          delegate_nick_name_id: 522,
                          delegates: [],
                        },
                      ],
                    },
                  ],
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
      parentIsOneLevel: 0,
      _isDisabled: 0,
      _isOneLevel: 0,
    },

    viewThisVersionCheck: false,
  },
  utils: {
    score_checkbox: false,
  },
});

// afterEach(cleanup);

describe("CampHistory Page", () => {
  it("should render without crash", () => {
    act(() => {
      const { container, debug } = render(
        <Provider store={store1}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/statement/history/1444-17-JAN-20232/1-Agreement",
            })}
          >
            <CampList />
          </RouterContext.Provider>
        </Provider>
      );

      fireEvent.click(
        screen.getAllByRole("checkbox", {
          name: /select to compare/i,
        })[0]
      );
      fireEvent.click(
        screen.getAllByRole("checkbox", {
          name: /select to compare/i,
        })[1]
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: /compare statements/i,
        })
      );
    });
  });

  it("should render without crash", () => {
    act(() => {
      const { container, debug } = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/statement/history/1444-17-JAN-20232/1-Agreement",
            })}
          >
            <CampList />
          </RouterContext.Provider>
        </Provider>
      );
    });
  });

  it("should render without crash", () => {
    act(() => {
      const { container, debug } = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/camp/history/1444-17-JAN-20232/1-Agreement",
              pathname: "/camp/history/[...camp]",
            })}
          >
            <CampList />
          </RouterContext.Provider>
        </Provider>
      );
      // debug();
    });
  });
  it("should render without crash", () => {
    act(() => {
      const { container, debug } = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/topic/history/1444-17-JAN-20232/1-Agreement",
              pathname: "/topic/history/[...camp]",
            })}
          >
            <CampList />
          </RouterContext.Provider>
        </Provider>
      );
    });
  });
  it("should render without crash", () => {
    act(() => {
      store.dispatch(
        setHistory({
          items: [
            {
              id: 135,
              namespace: "/General/",
              language: null,
              topic_num: 88,
              note: "SEO name change as proposed in forum.",
              submit_time: 1268964861,
              submitter_nick_id: 1,
              go_live_time: 1269569661,
              objector_nick_id: null,
              object_time: null,
              object_reason: null,
              proposed: null,
              replacement: null,
              topic_name: "Theories of Consciousness",
              namespace_id: 1,
              grace_period: 0,
              objector_nick_name: null,
              submitter_nick_name: "Brent_Allsop",
              isAuthor: false,
              status: "live",
              parsed_value: "<br />",
            },
          ],
          current_page: 1,
          per_page: 4,
          last_page: 1,
          total_rows: 2,
          from: 1,
          to: 2,
          details: {
            ifIamSupporter: 0,
            ifSupportDelayed: 0,
            parentTopic: "Theories of Consciousness",
          },
        })
      );
      const { container, debug } = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/topic/history/88-Theories-of-Consciousness",
              pathname: "/topic/history/[...camp]",
            })}
          >
            <CampList />
          </RouterContext.Provider>
        </Provider>
      );
      // const topicHistoryHeading = screen.getByRole("heading", {
      //   name: /topic history/i,
      // });
      // const submitTopicButton = screen.getByRole("button", {
      //   name: /submit topic update based on this/i,
      // });
      // const viewThisButton = screen.getByRole("button", {
      //   name: /view this version/i,
      // });
      expect(
        screen.getByRole("heading", {
          name: /topic history/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: /submit topic update based on this/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /view this version/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /topic name :/i,
        })
      ).toBeInTheDocument();
      // expect(
      //   screen.getAllByText(/theories of consciousness/i)[1]
      // ).toBeInTheDocument();
      expect(screen.getByText(/edit summary :/i)).toBeInTheDocument();
      expect(
        screen.getByText(/SEO name change as proposed in forum./i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Canon :/i)).toBeInTheDocument();
      // expect(screen.getByText(/\/general\//i));
      expect(screen.getByText(/submitted on :/i)).toBeInTheDocument();
      expect(screen.getByText(/submitter nickname :/i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: /brent_allsop/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/go live time :/i)).toBeInTheDocument();
      expect(screen.getByText(/Select to Compare/i)).toBeInTheDocument();
      expect(container.getElementsByTagName("button")).toHaveLength(3);
      expect(container.getElementsByTagName("input")).toHaveLength(1);
    });
  });

  it("should render without crash", () => {
    act(() => {
      const { container, debug } = render(
        <Provider store={store1}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/statement/history/1444-17-JAN-20232/1-Agreement",
              pathname: "/statement/history/[...camp]",
            })}
          >
            <CampList />
          </RouterContext.Provider>
        </Provider>
      );
      // debug();
      fireEvent.click(screen.getByText(/view all/i));
      fireEvent.click(screen.getByText(/objected/i));
      fireEvent.click(screen.getAllByText(/live/i)[0]);
      fireEvent.click(screen.getByText(/not live/i));
      fireEvent.click(screen.getByText(/old/i));
    });
  });
});
