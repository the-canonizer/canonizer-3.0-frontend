import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../../../../store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import CampInfoBar from "../index";
import { NextRouter } from "next/router";

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

// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { setTopicName } from "src/store/slices/campDetailSlice";
// import CampInfoBar from "./CampInfoBar";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("CampInfoBar", () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({
        topicDetails: {
          topic_name: "Test Topic",
        },
        loading: {
          loading: false,
        },
      })
    );
  });

  test("renders the topic name correctly", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/eventline/1245-test-event-topic/2-camp-122",
          })}
        >
          <CampInfoBar />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText("Topic : Test Topic")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /arrow\-left/i,
      })
    ).toBeInTheDocument();
  });

  test("dispatches action and navigates on button click", () => {
    const dispatch = jest.fn();
    const push = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    jest.mock("next/router", () => ({
      useRouter: () => ({
        push,
        asPath: "/eventline",
      }),
    }));

    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/eventline/1245-test-event-topic/2-camp-122",
          })}
        >
          <CampInfoBar />
        </RouterContext.Provider>
      </Provider>
    );
    fireEvent.click(screen.getByRole("button"));

    expect(dispatch).toHaveBeenCalledWith(setTopicName(null));
  });
});
