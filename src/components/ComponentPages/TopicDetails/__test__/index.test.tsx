import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
// import configureStore from "redux-mock-store";
import TopicDetails from "../index";
import { store } from "../../../../store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

// Mock Redux store
// const mockStore = configureStore([]);
// function createMockRouter(router: Partial<NextRouter>): NextRouter {
//   return {
//     basePath: "",
//     pathname: "/",
//     route: "/",
//     query: {},
//     asPath: "/",
//     back: jest.fn(),
//     beforePopState: jest.fn(),
//     prefetch: jest.fn(),
//     push: jest.fn(),
//     reload: jest.fn(),
//     replace: jest.fn(),
//     events: {
//       on: jest.fn(),
//       off: jest.fn(),
//       emit: jest.fn(),
//     },
//     isFallback: false,
//     isLocaleDomain: false,
//     isReady: true,
//     defaultLocale: "en",
//     domainLocales: [],
//     isPreview: false,
//     ...router,
//   };
// }

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

function createMockRouter(): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: { camp: ["88-Theories-of-Consciousness", "1-Agreement"] },
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

afterEach(cleanup);

describe("TopicDetails", () => {
  // let store;
  // beforeEach(() => {
  //   // Create a mock Redux store
  //   store = mockStore({
  //     filters: {
  //       filterObject: {
  //         asofdate: "2022-01-01",
  //         algorithm: "algorithm-1",
  //       },
  //       viewThisVersionCheck: false,
  //     },
  //     topicDetails: {
  //       newsFeed: [],
  //       currentTopicRecord: {
  //         topic_num: 1,
  //         topic_name: "Test Topic",
  //         camp_name: "Test Camp",
  //         camp_num: 1,
  //       },
  //       currentCampRecord: {},
  //       tree: [],
  //     },
  //   });
  // });

  it("renders TopicDetails component correctly", async () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <TopicDetails serverSideCall={true} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText(/show archived camps/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(8);
    // expect(container.getElementsByTagName("a")).toHaveLength(1);

    // // Assert loading indicator is initially shown
    // expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();

    // // Wait for the component to finish loading
    // await waitFor(() => {
    //   expect(screen.queryByTestId("loading-indicator")).toBeNull();
    // });

    // Assert the rendered components or elements as per your requirements
    // expect(screen.getByText("Test Topic")).toBeInTheDocument();
    // expect(screen.getByText("Test Camp")).toBeInTheDocument();
  });
});
