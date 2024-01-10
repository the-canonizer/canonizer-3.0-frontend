import { render, screen, act } from "src/utils/testUtils";

import { Provider } from "react-redux";
import Statements from "../index";
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

jest.mock("../../../../network/api/history", () => ({
  getCompareStatement: jest.fn(() => Promise.resolve({ status_code: 200 })),
}));

describe("Compare Statements page", () => {
  beforeEach(() => {
    jest.mock("../../../../network/api/history", () => ({
      getCompareStatement: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          message: "Success",
          error: null,
          data: {
            comparison: [
              {
                go_live_time: 1642971539,
                submit_time: 1642885139,
                object_time: null,
                parsed_value: "<h1> Theories of Mind and Consciousness </h1>",
                value: "= Theories of Mind and Consciousness =",
                topic_num: 88,
                camp_num: 1,
                id: 2716,
                note: "Change the goal of this topic",
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
              },
            ],
            liveStatement: {
              value: "= Theories of Mind and Consciousness =",
              parsed_value:
                "<h1> Theories of Mind and Consciousness </h1>\r\n<p> </p>\nOur goal with this topic is to track theoretical scientific progress, so that we can rigorously demonstrate not only how much consensus progress we have made, but also to encourage experimentation under a falsification paradigm to narrow the field of contenders. Eventually, we should arrive at the camp that best describes consciousness, supported by evidence.\r\n<p> </p>\n<p> </p>\nAlternative sites focus on disagreements, which tends to increase polarization. For example <a href='https://en.wikipedia.org/wiki/Qualia' target='_blank'>Wikipedia polarizes everyone around the Qualia issue</a>. As you can see in that topic on qualia, <a href='https://en.wikipedia.org/wiki/Qualia#Daniel_Dennett' target='_blank'>Daniell Dennett is one of the top “critics of qualia”</a>. Instead, Canonizer enables people to find things they agree on, then negotiates terminology more people can accept. As you can see here <a href='https://canonizer.com/topic/88-Theories-of-Consciousness/21-Dennett-s-PBC-Theory' target='_blank'>Dennet’s Predictive Bayesian Coding Theory camp</a> is in a supporting sub camp position to the consensus <a href='https://canonizer.com/topic/88-Theories-of-Consciousness/6-Representational-Qualia#statement' target='_blank'>Representational Qualia Theory super camp</a>.\r\n<p> </p>\n<p> </p>\nThe focus of this topic is on the phenomenological nature of consciousness, asking the question: “What is it like?”  Some people refer to this as the “hard problem” and talk about an “explanatory gap”.\r\n<p> </p>\n<p> </p>\nIf you want to help push this most important of all theoretical fields of science forward, please sign or support the camp you find most convincing. Then recruit others to do the same. Eventually the experimentalists will take notice, perform the experiments as described, the results of which will force people into the correct camp.  We will then have a definitive scientific consensus nobody can doubt.\r\n<p> </p>\n<p> </p>\nThis topic is part of the <a href='https://canonizer.com/topic/105-Consciousness-Consensus-Projct/1-Agreement' target='_blank'>Consciousness Consensus Project</a>.",
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
            },
            latestRevision: 1654427966,
          },
        })
      ),
    }));
  });
  it("compare statement", async () => {
    await act(async () => {
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
            <Statements />
          </RouterContext.Provider>
        </Provider>
      );
    });
    expect(screen.getByText(/topic :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();
    expect(screen.getAllByText(/edit summary :/i)).toHaveLength(2);
    expect(screen.getAllByText(/submitted on :/i)).toHaveLength(2);
    expect(screen.getAllByText(/submitter nickname :/i)).toHaveLength(2);
    expect(screen.getAllByText(/go live time :/i)).toHaveLength(2);
    // expect(screen.getAllByText()).toHaveLength(3);
    expect(screen.getAllByText(/statement :/i)).toHaveLength(2);
    // expect(screen.getAllByText(/invalid date/i)).toHaveLength(4);
    expect(
      screen.getByText("Camp Statement History Comparison")
    ).toBeInTheDocument();
  });

  it("compare statement 2", async () => {
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
          <Statements />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText(/topic :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();
    expect(screen.getAllByText(/edit summary :/i)).toHaveLength(3);
    expect(screen.getAllByText(/submitted on :/i)).toHaveLength(3);
    expect(screen.getAllByText(/submitter nickname :/i)).toHaveLength(3);
    expect(screen.getAllByText(/go live time :/i)).toHaveLength(3);
    // expect(screen.getAllByText()).toHaveLength(3);
    expect(screen.getAllByText(/statement :/i)).toHaveLength(3);
    // expect(screen.getAllByText(/invalid date/i)).toHaveLength(7);

    expect(
      screen.getByText("Camp Statement History Comparison")
    ).toBeInTheDocument();
  });
});
