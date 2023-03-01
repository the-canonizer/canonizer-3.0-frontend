import CampList from "..";
import { Provider } from "react-redux";
import { store } from "../../../../store";
import { render, screen } from "@testing-library/react";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { act } from "react-dom/test-utils";
import { setHistory } from "../../../../store/slices/campDetailSlice";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

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

// afterEach(cleanup);

describe("CampHistory Page", () => {
  it("should render without crash", () => {
    act(() => {
      store.dispatch(
        setHistory({
          items: [
            {
              id: 135,
              namespace: "/General/",
              language: null,
              topic_num: 88,
              note: "SEO name change as proposed in forum.",
              submit_time: 1268964861,
              submitter_nick_id: 1,
              go_live_time: 1269569661,
              objector_nick_id: null,
              object_time: null,
              object_reason: null,
              proposed: null,
              replacement: null,
              topic_name: "Theories of Consciousness",
              namespace_id: 1,
              grace_period: 0,
              objector_nick_name: null,
              submitter_nick_name: "Brent_Allsop",
              isAuthor: false,
              status: "live",
              parsed_value: "<br />",
            },
          ],
          current_page: 1,
          per_page: 4,
          last_page: 1,
          total_rows: 2,
          from: 1,
          to: 2,
          details: {
            ifIamSupporter: 0,
            ifSupportDelayed: 0,
            parentTopic: "Theories of Consciousness",
          },
        })
      );
      const { container } = render(
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/topic/history/88-Theories-of-Consciousness",
            })}
          >
            <CampList />
          </RouterContext.Provider>
        </Provider>
      );
      screen.queryByRole("heading", {
        name: /topic history/i,
        hidden: true,
      });
      screen.queryByRole("button", {
        name: /submit topic update based on this/i,
        hidden: true,
      });
      screen.queryByRole("button", {
        name: /view this version/i,
        hidden: true,
      });

      expect(
        screen.queryByRole("heading", {
          name: /topic name :/i,
          hidden: true,
        })
      );
      expect(screen.queryAllByText(/theories of consciousness/i)[1]);
      expect(screen.queryByText(/edit summary :/i));
      expect(screen.queryByText(/SEO name change as proposed in forum./i));
      expect(screen.queryByText(/Namespace :/i));
      expect(screen.queryByText(/\/general\//i));
      expect(screen.queryByText(/submitted on :/i));
      expect(screen.queryByText(/submitter nick name :/i));
      expect(
        screen.queryByRole("link", {
          name: /brent_allsop/i,
        })
      );
      expect(screen.queryByText(/go live time :/i));
      expect(screen.queryByText(/Select to Compare/i));
      expect(container.getElementsByTagName("button"));
      expect(container.getElementsByTagName("input"));
    });
  });
});
