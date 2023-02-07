import CampInfoBar from "..";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

import { RouterContext } from "next/dist/shared/lib/router-context";

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
describe("Camp statement on camp details page", () => {
  beforeEach(() => {
    jest.mock("../../../../../network/api/campDetailApi", () => ({
      getCampBreadCrumbApi: jest.fn(() =>
        Promise.resolve({ data: {}, status_code: 200 })
      ),
    }));
  });
  it("Should render without crash", async () => {
    const { container } = await render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <CampInfoBar payload={payload} isTopicPage={true} />
        </RouterContext.Provider>
      </Provider>
    );
    waitFor(() => {
      const forumButton = screen.getByRole("button", {
        name: /camp forum/i,
      });

      expect(screen.getByText(/topic/i)).toBeInTheDocument();
      // expect(screen.getByText(/Theories-of-Consciousness/i)).toBeInTheDocument();
      expect(screen.getByText(/camp :/i)).toBeInTheDocument();
      expect(container.getElementsByTagName("button")).toHaveLength(4);
      expect(forumButton.textContent).toBe("Camp Forum");
    });
  });
});
