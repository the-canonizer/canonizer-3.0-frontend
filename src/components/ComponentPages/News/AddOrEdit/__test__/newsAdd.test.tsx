import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
// import AddOrEdit from "../";
// import { addNewsFeedApi } from "../../../../../network/api/campNewsApi";

import { getAllUsedNickNames } from "../../../../../network/api/campDetailApi";
import { Router } from "next/router";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";
// import userEvent from "@testing-library
import NewsAdd from "..";
function createMockRouter() {
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
    },
  },
  topicDetails: {
    currentCampRecord: {},
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
});
describe("Should render Addnews", () => {
  beforeEach(() => {
    jest.mock("../../../../../network/api/campDetailApi", () => ({
      getAllUsedNickNames: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          message: "Success",
          error: null,
          data: [
            {
              id: 818,
              owner_code: "TWFsaWExMzk0TWFsaWE=",
              nick_name: "Sajid-Dev",
              create_time: "1970-01-01",
              private: 0,
            },
          ],
        })
      ),
    }));
  });
  it("Render without crash", async () => {
    const { container } = await render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter()}>
          <NewsAdd edit={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /Create News/i,
      });
      const cancelButton = screen.getByRole("button", {
        name: /Cancel/i,
      });

      expect(container.getElementsByTagName("button")).toHaveLength(2);
      expect(container.getElementsByTagName("textarea")).toHaveLength(1);
      expect(container.getElementsByTagName("input")).toHaveLength(3);
      expect(screen.getByText(/add news/i)).toBeInTheDocument();
      expect(screen.getByText(/display text/i).textContent).toBe(
        "Display Text * (Limit 256 chars)"
      );
      expect(screen.getByText(/link/i).textContent).toBe(
        "Link * (Limit 2000 chars)"
      );
      expect(screen.getByText(/nickname/i)).toBeInTheDocument();
      expect(submitButton.textContent).toBe(" Create News");
      expect(cancelButton.textContent).toBe("Cancel");
    });
  });
});
