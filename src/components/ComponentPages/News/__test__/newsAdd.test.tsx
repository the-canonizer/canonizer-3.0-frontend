import React from "react";
import {
  render,
  waitFor,
  screen,
  cleanup,
  fireEvent,
} from "@testing-library/react";
// import AddOrEdit from "../";
import { getAllUsedNickNames } from "../../../../../network/api/campDetailApi";

import { getEditCampNewsFeedApi } from "../../../../../network/api/campNewsApi";

import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";

import { NextRouter } from "next/router";
import NewsAdd from "..";
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
    },
  },
});
const store2 = mockStore({
  auth: {
    authenticated: false,
    loggedInUser: {
      is_admin: false,
    },
  },
});
const store3 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: false,
    },
  },
});
jest.mock("src/network/api/campDetailApi");

jest.mock("src/network/api/campNewsApi");
describe("Should render Addnews", () => {
  beforeEach(() => {
    jest.mock("../../../../../network/api/campDetailApi", () => ({
      getAllUsedNickNames: jest.fn(() =>
        Promise.resolve({
          data: [
            {
              id: 4,
              nick_name: "Andrea_Allsop",
            },
          ],
          status_code: 200,
        })
      ),
    }));
    jest.mock("../../../../../network/api/campNewsApi", () => ({
      getEditCampNewsFeedApi: jest.fn(() =>
        Promise.resolve({
          data: [
            {
              id: 198,
              display_text: "Test ",
              link: "www.abedwc.com",
              available_for_child: 0,
              submitter_nick_id: 4,
            },
          ],

          status_code: 200,
        })
      ),
    }));
  });
  it("Only admin can acces page error", async () => {
    render(
      <Provider store={store2}>
        <RouterContext.Provider
          value={createMockRouter(
            createMockRouter({
              asPath: "/addnews/88/1",
              query: { camp: ["88", "1"] },
            })
          )}
        >
          <NewsAdd edit={false} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(
      screen.getByText(/only admin can add\/edit news/i)
    ).toBeInTheDocument();
  });

  it("Login to access this  page", () => {
    render(
      <Provider store={store3}>
        <RouterContext.Provider
          value={createMockRouter(
            createMockRouter({
              asPath: "/addnews/88/1",
              query: { camp: ["88", "1"] },
            })
          )}
        >
          <NewsAdd edit={false} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText("Add News")).toBeInTheDocument();
  });

  it("Cancel to create news", async () => {
    getAllUsedNickNames.mockResolvedValue({
      data: [
        {
          id: 4,
          nick_name: "Andrea_Allsop",
        },
      ],
      status_code: 200,
    });
    const { container } = await render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/addnews/88/1",
            query: { camp: ["88", "1"] },
          })}
        >
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
      fireEvent.click(
        screen.getByRole("button", {
          name: /Cancel/i,
        })
      );
    });
  });

  it("Create news", async () => {
    getAllUsedNickNames.mockResolvedValue({
      data: [
        {
          id: 4,
          nick_name: "Andrea_Allsop",
        },
      ],
      status_code: 200,
    });
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/addnews/88/1",
            query: { camp: ["88", "1"] },
          })}
        >
          <NewsAdd edit={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      screen.getByRole("button", {
        name: /Create News/i,
      });
      screen.getByRole("button", {
        name: /Cancel/i,
      });

      const linkField = screen.getByRole("textbox", {
        name: /link \* \(limit 2000 chars\)/i,
      });
      const displayfield = screen.getByRole("textbox", {
        name: /display text \* \(limit 256 chars\)/i,
      });
      expect(displayfield).toBeInTheDocument();
      expect(linkField).toBeInTheDocument();
      fireEvent.change(linkField, { target: { value: "www.abedwc.com" } });
      fireEvent.change(displayfield, { target: { value: "test" } });

      fireEvent.click(
        screen.getByRole("button", {
          name: /Create News/i,
        })
      );
    });
  });

  it("Cancel to Edit News", async () => {
    getAllUsedNickNames.mockResolvedValue({
      data: [
        {
          id: 4,
          nick_name: "Andrea_Allsop",
        },
      ],
      status_code: 200,
    });
    getEditCampNewsFeedApi.mockResolvedValue({
      data: [
        {
          id: 198,
          display_text: "Test ",
          link: "www.abedwc.com",
          available_for_child: 0,
          submitter_nick_id: 4,
        },
      ],
      status_code: 200,
    });
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/editnews/88/1/news-id-198",
            query: { camp: ["88", "1", "news-id-198"] },
          })}
        >
          <NewsAdd edit={true} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getAllByText(/only admin can add\/edit news/i)).toHaveLength(
      2
    );
    await waitFor(() => {
      screen.getByRole("button", {
        name: /submit/i,
      });
      screen.getByRole("button", {
        name: /Cancel/i,
      });
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /Cancel/i,
      })
    );
  });
  // eslint-disable-next-line jest/expect-expect
  it("Submit to Edit News", async () => {
    getAllUsedNickNames.mockResolvedValue({
      data: [
        {
          id: 4,
          nick_name: "Andrea_Allsop",
        },
      ],
      status_code: 200,
    });
    getEditCampNewsFeedApi.mockResolvedValue({
      data: [
        {
          id: 198,
          display_text: "Test ",
          link: "www.abedwc.com",
          available_for_child: 0,
          submitter_nick_id: 4,
        },
      ],
      status_code: 200,
    });
    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/editnews/88/1/news-id-198",
            query: { camp: ["88", "1", "news-id-198"] },
          })}
        >
          <NewsAdd edit={true} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      screen.getByRole("button", {
        name: /submit/i,
      });
      screen.getByRole("button", {
        name: /Cancel/i,
      });
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit/i,
      })
    );
  });
});
