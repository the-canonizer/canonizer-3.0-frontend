import CampInfoBar from "..";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";

import { getCampBreadCrumbApi } from "src/network/api/campDetailApi";
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

afterEach(cleanup);
const payload = {
  camp_num: 1,
  topic_num: 88,
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
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 19,
      asofdate: 1693720277.174,
      asof: "default",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
});

jest.mock("src/network/api/campDetailApi");

describe("Camp statement on camp details page", () => {
  beforeEach(() => {
    jest.mock("src/network/api/campDetailApi");
  });
  it("Should render without crash", async () => {
    const { container } = await render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter()}>
          <CampInfoBar payload={payload} isTopicPage={true} />
        </RouterContext.Provider>
      </Provider>
    );
    container.querySelectorAll(".react-loading-skeleton");
    expect(screen.getByText(/topic :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();

    await waitFor(() => {
      screen.getAllByText(/n\/a/i);
    });
  });

  it("Api reponse", async () => {
    getCampBreadCrumbApi.mockResolvedValue({
      status_code: 200,
      data: {
        bread_crumb: [
          {
            camp_name: "Agreement",
            topic_num: 88,
            camp_num: 1,
          },
        ],
        flag: 0,
        subscription_id: null,
        subscribed_camp_name: null,
        topic_name: "Camp2DSFVAL",
      },
    });
    const { container } = await render(
      <Provider store={store1}>
        <RouterContext.Provider value={createMockRouter()}>
          <CampInfoBar payload={payload} isTopicPage={true} />
        </RouterContext.Provider>
      </Provider>
    );
    expect(screen.getByText(/topic :/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/camp2dsfval/i)).toBeInTheDocument();

      expect(
        screen.getByRole("link", {
          name: /agreement/i,
        })
      ).toBeInTheDocument();
      expect(container.getElementsByTagName("a")).toHaveLength(1);
    });
  });
});
