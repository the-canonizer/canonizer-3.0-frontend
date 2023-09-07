import { Fragment } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "src/utils/testUtils";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";

import CanonVideos from "../";
import { store } from "src/store";
import { act } from "react-dom/test-utils";
import { getVideosContentApi } from "src/network/api/videos";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter() {
    return {
      route: "/videos/consciousness",
      pathname: "",
      query: {},
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/videos/consciousness/introduction?format=720",
    query: { chapter: "introduction", format: "720" },
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
const resDat = [
  {
    id: 1,
    title: "Introduction",
    resolutions: [
      {
        id: 1,
        title: "360 P",
        link: "introduction_360.mp4",
      },
      {
        id: 2,
        title: "720 P",
        link: "introduction_720.mp4",
      },
      {
        id: 3,
        title: "1080 P",
        link: "introduction_1080.mp4",
      },
    ],
  },
  {
    id: 2,
    title: "Perceiving a Strawberry",
    resolutions: [
      {
        id: 1,
        title: "360 P",
        link: "perceiving_a_strawberry_360.mp4",
      },
      {
        id: 2,
        title: "720 P",
        link: "perceiving_a_strawberry_720.mp4",
      },
      {
        id: 3,
        title: "1080 P",
        link: "perceiving_a_strawberry_1080.mp4",
      },
    ],
  },
];

jest.mock("src/network/api/videos", () => ({
  getVideosContentApi: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: resDat })
  ),
}));

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

afterEach(cleanup);

describe("Canonizer Videos", () => {
  beforeEach(() => {
    jest.mock("src/network/api/videos", () => ({
      getVideosContentApi: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          data: resDat,
        })
      ),
    }));
  });

  it("renders video titles", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            route: "/videos/consciousness",
            asPath: "/videos/consciousness/introduction",
          })}
        >
          <CanonVideos />
        </RouterContext.Provider>
      </Provider>
    );
    expect(
      screen.getByText(
        "Consciousness: Not a Hard Problem, Just a Color Problem"
      )
    ).toBeInTheDocument();
  });

  it("changes video when clicked on video title", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            route: "/videos/consciousness",
            asPath: "/videos/consciousness/introduction",
          })}
        >
          <CanonVideos />
        </RouterContext.Provider>
      </Provider>
    );
    const videoTitle = screen.getByText("Video Format:");
    fireEvent.click(videoTitle);
  });

  it("renders video player with controls when video is available", async () => {
    render(<CanonVideos />);

    await waitFor(() => {
      const videoPlayer = screen.getByTestId("videoPlayer");
      expect(videoPlayer).toBeInTheDocument();
    });
  });

  it("render heading and labels", () => {
    render(
      <Fragment>
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({ asPath: "/videos/consciousness" })}
          >
            <CanonVideos />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    const mainHeadig = screen.getByRole("heading", {
      name: /Consciousness: Not a Hard Problem, Just a Color Problem/i,
    });
    const topictab = screen.getByText(/Video Format:/i);

    expect(mainHeadig).toBeInTheDocument();
    expect(topictab).toBeInTheDocument();
  });
  it("render", async () => {
    getVideosContentApi.mockResolvedValue({
      status_code: 200,
      data: resDat,
    });

    render(
      <Fragment>
        <Provider store={store1}>
          <RouterContext.Provider
            value={createMockRouter({
              route: "/videos/consciousness",
              asPath: "/videos/consciousness",
            })}
          >
            <CanonVideos />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    await waitFor(() => {
      expect(getVideosContentApi).toHaveBeenCalled();
      expect(screen.getByText("Introduction")).toBeInTheDocument();
      expect(screen.getByText("Perceiving a Strawberry")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Perceiving a Strawberry"));
      expect(screen.getByTestId("playerId")).toHaveAttribute(
        "src",
        "https://canonizer3.canonizer.com/static/videos/consciousness/perceiving_a_strawberry_360.mp4"
      );
      // fireEvent.click(screen.getByText("perceiving_a_strawberry_1080.mp4"));
      // expect(screen.getByTestId("playerId")).toHaveAttribute(
      //   "src",
      //   "https://canonizer3.canonizer.com/static/videos/consciousness/perceiving_a_strawberry_1080.mp4"
      // );

      expect(screen.getByText("360 P")).toBeInTheDocument();
      expect(screen.getByText("720 P")).toBeInTheDocument();
      expect(screen.getByText("1080 P")).toBeInTheDocument();
    });
  });
});
