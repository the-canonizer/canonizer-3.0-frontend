import InfoBar from "../../infoBar";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../../store";

import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import configureMockStore from "redux-mock-store";
function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/topic/88-Mind-and-Consciousness-revie/1-Agreement",
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
    selectedCampNode: {
      topic_id: 88,
      camp_id: 1,
      title: "Mind and Consciousness revie",
      review_title: "Mind and Consciousness revie",
      link: "/topic/88-Mind-and-Consciousness-revie/1-Agreement",
      review_link: "/topic/88-Mind-and-Consciousness-revie/1-Agreement",
      score: 65.004,
      full_score: 91,
      submitter_nick_id: 592,
      created_date: 1228141435,
      is_valid_as_of_time: true,
      is_disabled: 0,
      is_one_level: 0,
      is_archive: 0,
      direct_archive: 0,
    },
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
});

describe("Camp statement on camp details page", () => {
  it("Should render without crash", async () => {
    const { container, debug } = await render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            pathname: "/topic/88-Mind-and-Consciousness-revie/1-Agreement",
          })}
        >
          <InfoBar payload={payload} isTopicPage={true} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /camp forum/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", {
          name: /share\-alt/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(/share/i)).toBeInTheDocument();

      const element = document.querySelector(
        ".ant-dropdown-trigger.iconMore.campForumDropdown"
      );

      // Now, you can make assertions on the element
      expect(element).toBeInTheDocument();

      expect(container.getElementsByTagName("a")).toHaveLength(2);
    });

    const element = document.querySelector(
      ".ant-dropdown-trigger.iconMore.campForumDropdown"
    );
    fireEvent.click(element);

    expect(
      screen.getByRole("menuitem", {
        name: /add news/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: /subscribe to entire topic/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: /subscribe to the camp/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: /heart directly join and support/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: /manage\/edit this camp/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /manage\/edit this topic/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: /file\-text add camp statement/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("menuitem", {
        name: /get embed code/i,
      })
    ).toBeInTheDocument();
  });
});
