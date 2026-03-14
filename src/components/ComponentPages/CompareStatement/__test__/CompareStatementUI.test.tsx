import { fireEvent, render, screen } from "src/utils/testUtils";

import CompareStatementUI from "../UI/index-old";

import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "",
    route: "/",
    query: {
      statements: "3267_2716",
      from: "statement",
      status: "3267_live-2716_old",
      routes: ["88-Mind-and-Consciousness-revie", "1-Agreement"],
    },
    asPath:
      "/statement/compare/88-Mind-and-Consciousness-revie/1-Agreement?statements=3267_2716&from=statement&status=3267_live-2716_old",

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

  forum: {
    currentThread: null,
    currentPost: null,
  },
});

const liveStatementCamp = {
  id: 10433,
  topic_num: 23,
  parent_camp_num: null,
  key_words: "consciousness, hard, problem, phenomenal, quale, qualia",
  language: "English",
  camp_num: 1,
  note: "",
  submit_time: 1690794514,
  submitter_nick_id: 713,
  go_live_time: 1690880914,
  objector_nick_id: null,
  object_time: null,
  object_reason: null,
  proposed: null,
  replacement: null,
  title: "",
  camp_name: "Agreement",
  camp_about_url: "",
  camp_about_nick_id: 0,
  grace_period: 0,
  is_disabled: 0,
  is_one_level: 0,
  is_archive: 1,
  direct_archive: 1,
  old_parent_camp_num: null,
  archive_action_time: 1690794514,
  parsed_value: "Agreement",
  camp_about_nick_name: "",
  value: "Agreement",
  submitter_nick_name: "Anickname",
  namespace_id: 1,
  parent_camp_name: "",
  status: "live",
  revision_date: 1690794514,
};
const statementsCamp = [
  {
    go_live_time: 1188083350,
    submit_time: 1188083350,
    object_time: null,
    parsed_value: "Agreement",
    value: "Agreement",
    topic_num: 23,
    camp_num: 1,
    id: 125,
    note: "First Version of Agreement Statement",
    submitter_nick_id: 1,
    objector_nick_id: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    language: null,
    grace_period: 0,
    submitter_nick_name: "Brent_Allsop",
    status: null,
    key_words: "consciousness, hard, problem, phenomenal, quale, qualia",
    namespace_id: null,
    camp_about_url: null,
    camp_about_nick_id: null,
    camp_about_nick_name: "",
    parent_camp_name: "",
    is_disabled: 0,
    is_one_level: 0,
    is_archive: 0,
    parsed_v: "Agreement",
  },
  {
    go_live_time: 1690880914,
    submit_time: 1690794514,
    object_time: null,
    parsed_value: "Agreement",
    value: "Agreement",
    topic_num: 23,
    camp_num: 1,
    id: 10433,
    note: "",
    submitter_nick_id: 713,
    objector_nick_id: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    language: "English",
    grace_period: 0,
    submitter_nick_name: "Anickname",
    status: null,
    key_words: "consciousness, hard, problem, phenomenal, quale, qualia",
    namespace_id: null,
    camp_about_url: "",
    camp_about_nick_id: 0,
    camp_about_nick_name: "",
    parent_camp_name: "",
    is_disabled: 0,
    is_one_level: 0,
    is_archive: 1,
    parsed_v: "Agreement",
  },
];
const itemsStatusCamp = {
  "125": "old",
  "10433": "live",
};

const itemsStatus = {
  "2716": "old",
  "3267": "live",
};
const liveStatement = {
  value: "= Theories of Mind and Consciousness =",
  parsed_value: "<h1> Theories of Mind and Consciousness </h1>",
  topic_num: 88,
  camp_num: 1,
  id: 3267,
  note: "Update agreement statement with a call to action.",
  submit_time: 1654427966,
  submitter_nick_id: 1,
  go_live_time: 1654514366,
  objector_nick_id: null,
  object_time: null,
  object_reason: null,
  proposed: null,
  replacement: null,
  language: "English",
  grace_period: 0,
  submitter_nick_name: "Brent_Allsop",
  namespace_id: 1,
  status: "live",
  revision_date: 1654427966,
};
const statements = [
  {
    go_live_time: 1642971539,
    submit_time: 1642885139,
    object_time: null,
    parsed_value: "<h1> Theories of Mind and Consciousness </h1>",
    value: "= Theories of Mind and Consciousness =",
    topic_num: 88,
    camp_num: 1,
    id: 2716,
    note: "Change the goal of this topic.",
    submitter_nick_id: 1,
    objector_nick_id: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    language: "English",
    grace_period: 0,
    submitter_nick_name: "Brent_Allsop",
    status: "live",
    namespace_id: 1,
    parsed_v: "<h1> Theories of Mind and Consciousness </h1>",
  },

  {
    go_live_time: 1654514366,
    submit_time: 1654427966,
    object_time: null,
    parsed_value: "<h1> Theories of Mind and Consciousness </h1>",
    value: "= Theories of Mind and Consciousness =",
    topic_num: 88,
    camp_num: 1,
    id: 3267,
    note: "Update agreement statement with a call to action.",
    submitter_nick_id: 1,
    objector_nick_id: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    language: "English",
    grace_period: 0,
    submitter_nick_name: "Brent_Allsop",
    status: "old",
    namespace_id: 1,
    parsed_v: "<h1> Theories of Mind and Consciousness </h1>",
  },
];
describe("Compare Statement page", () => {
  it("should render without crash", () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath:
              "/statement/compare/88-Mind-and-Consciousness-revie/1-Agreement?statements=3267_2716&from=statement&status=3267_live-2716_old",
            query: {
              statements: "3267_2716",
              from: "statement",
              status: "3267_live-2716_old",
              routes: ["88-Mind-and-Consciousness-revie", "1-Agreement"],
            },
          })}
        >
          <CompareStatementUI
            statements={statements}
            isLoading={false}
            liveStatement={liveStatement}
            itemsStatus={itemsStatus}
          />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText(/topic :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();
    expect(
      screen.getByText("Camp Statement History Comparison")
    ).toBeInTheDocument();

    expect(screen.getAllByText(/edit summary :/i)).toHaveLength(3);
    expect(
      screen.getByText(/Change the goal of this topic./i)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/update agreement statement with a call to action\./i)
    ).toHaveLength(2);

    expect(screen.getAllByText(/submitted on :/i)).toHaveLength(3);
    expect(
      screen.getByText(/23 january 2022, 01:58:59 am/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/submitter nickname :/i)).toHaveLength(3);
    expect(
      screen.getAllByRole("link", {
        name: /brent_allsop/i,
      })
    ).toHaveLength(3);

    expect(screen.getAllByText(/go live time :/i)).toHaveLength(3);
    expect(
      screen.getByText(/24 january 2022, 01:58:59 am/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/05 june 2022, 04:19:26 pm/i)).toHaveLength(3);

    expect(screen.getAllByText(/statement :/i)).toHaveLength(3);
    expect(
      screen.getAllByRole("heading", {
        name: /theories of mind and consciousness/i,
      })
    ).toHaveLength(3);
    fireEvent.click(
      screen.getByRole("button", {
        name: /arrow-left/i,
      })
    );
    // debug();
  });

  it("should render without crash test", () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath:
              "/statement/compare/88-Mind-and-Consciousness-revie/1-Agreement?statements=3267_2716&from=statement&status=3267_live-2716_old",
            query: {
              statements: "3267_2716",
              from: "statement",
              status: "3267_live-2716_old",
              routes: ["88-Mind-and-Consciousness-revie", "1-Agreement"],
            },
          })}
        >
          <CompareStatementUI
            statements={statements}
            isLoading={true}
            liveStatement={liveStatement}
            itemsStatus={itemsStatus}
          />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText(/topic :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();
    expect(
      screen.getByText("Camp Statement History Comparison")
    ).toBeInTheDocument();

    // debug();
  });

  it("Comapare camps", () => {
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath:
              "/statement/compare/23-Hard-Problem/1-Agreement?statements=10433_125&from=camp&status=10433_live-125_old",
            query: {
              statements: "10433_125",
              from: "camp",
              status: "10433_live-125_old",
              routes: ["23-Hard-Problem", "1-Agreement"],
            },
          })}
        >
          <CompareStatementUI
            statements={statementsCamp}
            isLoading={false}
            liveStatement={liveStatementCamp}
            itemsStatus={itemsStatusCamp}
          />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText(/topic :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();
    expect(screen.getByText("Camp History Comparison")).toBeInTheDocument();

    expect(screen.getAllByText(/edit summary :/i)).toHaveLength(3);
    expect(
      screen.getByText(/first version of agreement statement/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/submitted on :/i)).toHaveLength(3);
    expect(screen.getAllByText(/26 august 2007, 04:09:10 am/i)).toHaveLength(2);
    expect(screen.getAllByText(/31 july 2023, 02:08:34 pm/i)).toHaveLength(3);

    expect(screen.getAllByText(/submitter nickname :/i)).toHaveLength(3);
    expect(
      screen.getAllByRole("link", {
        name: /brent_allsop/i,
      })
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("link", {
        name: /anickname/i,
      })
    ).toHaveLength(2);

    expect(screen.getAllByText(/go live time :/i)).toHaveLength(3);
    // expect(
    //   screen.getByText(/26 august 2007, 04:09:10 am/i)
    // ).toBeInTheDocument();
    expect(screen.getAllByText(/01 august 2023, 02:08:34 pm/i)).toHaveLength(2);

    expect(screen.getAllByText(/keywords :/i)).toHaveLength(3);
    expect(
      screen.getAllByText(
        /consciousness, hard, problem, phenomenal, quale, qualia/i
      )
    ).toHaveLength(3);

    expect(screen.getAllByText(/camp about url :/i)).toHaveLength(3);

    expect(screen.getAllByText(/camp about nickname :/i)).toHaveLength(3);

    expect(screen.getAllByText(/disable additional sub camps :/i)).toHaveLength(
      3
    );
    expect(screen.getAllByText(/camp archived :/i)).toHaveLength(3);
    expect(screen.getAllByText(/camp name :/i)).toHaveLength(3);
    expect(screen.getAllByText(/agreement/i)).toHaveLength(4);
    expect(screen.getAllByText("No")).toHaveLength(7);
    expect(screen.getAllByText("Yes")).toHaveLength(2);
    fireEvent.click(
      screen.getByRole("button", {
        name: /arrow-left/i,
      })
    );

    // debug();
  });
});
