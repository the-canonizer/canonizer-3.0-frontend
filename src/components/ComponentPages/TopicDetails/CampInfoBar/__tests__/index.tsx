import CampInfoBar from "..";
import { cleanup, render, screen } from "@testing-library/react";
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
  topic_name: "Theories-of-Consciousness",
};
describe("Camp statement on camp details page", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <CampInfoBar payload={payload} isTopicPage={true} />
        </RouterContext.Provider>
      </Provider>
    );
    const forumButton = screen.getByRole("button", {
      name: /camp forum/i,
    });

    expect(screen.getByText(/topic/i)).toBeInTheDocument();
    // expect(screen.getByText(/Theories-of-Consciousness/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(1);
    expect(forumButton.textContent).toBe("Camp Forum");
  });
});
