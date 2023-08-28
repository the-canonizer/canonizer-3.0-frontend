import { cleanup, render, screen, waitFor } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";

import SubscriptionList from "..";
import { store } from "src/store";
import { RouterContext } from "next/dist/shared/lib/router-context";

const subsList = [
  {
    topic_num: 323,
    title: "topic one 17 05",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [],
  },
  {
    topic_num: 324,
    title: "topic two",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [
      {
        camp_num: 4,
        camp_name: "Agreement",
        support_order: 1,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
      {
        camp_num: 5,
        camp_name: "Agreement-2",
        support_order: 2,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
    ],
  },
];

// jest.mock("src/network/api/userApi", () => ({
//   GetAllSubscriptionsList: jest.fn(() =>
//     Promise.resolve({ status_code: 200, data: [] })
//   ),
//   unsubscribeTopicOrCampAPI: jest.fn(() =>
//     Promise.resolve({ status_code: 200, data: [] })
//   ),
// }));

// jest.mock("src/network/api/campDetailApi", () => ({
//   getAllUsedNickNames: jest.fn(() =>
//     Promise.resolve({ status_code: 200, data: [] })
//   ),
//   getAllRemovedReasons: jest.fn(() =>
//     Promise.resolve({ status_code: 200, data: [] })
//   ),
// }));

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

afterEach(cleanup);

describe("Removed Support List Component", () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  //   jest.mock("src/network/api/userApi", () => ({
  //     GetAllSubscriptionsList: jest.fn(() =>
  //       Promise.resolve({ status_code: 200, data: [] })
  //     ),
  //     unsubscribeTopicOrCampAPI: jest.fn(() =>
  //       Promise.resolve({ status_code: 200, data: [] })
  //     ),
  //   }));

  //   jest.mock("src/network/api/campDetailApi", () => ({
  //     getAllUsedNickNames: jest.fn(() =>
  //       Promise.resolve({ status_code: 200, data: [] })
  //     ),
  //     getAllRemovedReasons: jest.fn(() =>
  //       Promise.resolve({ status_code: 200, data: [] })
  //     ),
  //   }));
  // });
  it("render heading and labels", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      expect(screen.getAllByText("For topic").length).toEqual(2);
      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText(subsList[1].title)).toBeInTheDocument();
      expect(screen.getAllByText("Remove subscription").length).toEqual(2);
      expect(screen.getByText("Agreement")).toBeInTheDocument();
      expect(screen.getByText("Agreement-2")).toBeInTheDocument();
    });
  });

  it("click on remove subscription button and open modal", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({})}>
          <SubscriptionList isTestData={subsList} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(async () => {
      const btns = screen.getAllByText("Remove subscription");

      userEvent.click(btns[0]);

      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
});
