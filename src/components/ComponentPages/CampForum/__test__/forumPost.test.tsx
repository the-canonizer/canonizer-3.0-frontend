import { cleanup, render, screen } from "src/utils/testUtils";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";

import ForumPost from "../Post";
import messages from "src/messages";
import { store } from "src/store";
import { NextRouter } from "next/router";

const { labels } = messages;

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter() {
    return {
      route: "/",
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

const data = [
  {
    key: "101",
    name: "Can we unify “Integrated Information” and “Global Workspace” with “Representational Qualia Theory”?",
    replies: 32,
    recent_post: "Brent_Allsop replied 3 years ago (Mar 18, 2019, 10:54:32 PM)",
  },
  {
    key: "102",
    name: "Moving “Mind Brain Identity” above “Dualism” in the camp structure.",
    replies: 3,
    recent_post: "Brent_Allsop replied 3 years ago (Sep 19, 2018, 3:48:20 AM)",
  },
];

afterEach(cleanup);

describe("Camp forum post page", () => {
  it("render heading and labels after login", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({ asPath: "" })}>
          <ForumPost
            onCancel={jest.fn()}
            initialValue={undefined}
            onFinishPost={jest.fn()}
            formPost={undefined}
            postList={data}
            pCurrent={1}
            pTotal={10}
            pOnChange={jest.fn()}
            quillContent={undefined}
            onContentChange={jest.fn()}
            isError={undefined}
            onDeleteClick={jest.fn()}
            onPostEditClick={jest.fn()}
            currentThread={{
              title:
                "Can we unify “Integrated Information” and “Global Workspace” with “Representational Qualia Theory”?",
              created_at: new Date()?.toDateString(),
            }}
            isLog={true}
            isLoading={false}
            postperPage={10}
            threadDetailsLoading={false}
            payload={undefined}
          />
        </RouterContext.Provider>
      </Provider>
    );

    // expect(screen.getByText("Create Topic")).toBeInTheDocument();
    expect(
      screen.getAllByText("replied 54 years ago (Jan 1st 1970, 5:30:00 am)")
    ).toHaveLength(2);
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getAllByText("Nickname")).toHaveLength(2);
    expect(
      screen.getByText("Number of Post in this thread: 10")
    ).toBeInTheDocument();
    expect(screen.getByText(labels.cr_nick_name_sp)).toBeInTheDocument();
    expect(screen.getByText("Started by")).toBeInTheDocument();
  });
  it("render heading and labels before login", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/forum/54-Religious-Preference/1-Agreement/threads/2",
          })}
        >
          <ForumPost
            onCancel={jest.fn()}
            initialValue={undefined}
            onFinishPost={jest.fn()}
            formPost={undefined}
            postList={data}
            pCurrent={1}
            pTotal={10}
            pOnChange={jest.fn()}
            quillContent={undefined}
            onContentChange={jest.fn()}
            isError={undefined}
            onDeleteClick={jest.fn()}
            onPostEditClick={jest.fn()}
            currentThread={{
              title:
                "Can we unify “Integrated Information” and “Global Workspace” with “Representational Qualia Theory”?",
              created_at: new Date()?.toDateString(),
            }}
            isLog={false}
            isLoading={false}
            postperPage={10}
            threadDetailsLoading={false}
            payload={undefined}
          />
        </RouterContext.Provider>
      </Provider>
    );

    expect(screen.getByTestId("logincheck")).toBeInTheDocument();
    // expect(screen.getByText("Create Topic")).toBeInTheDocument();
    expect(
      screen.getAllByText("replied 54 years ago (Jan 1st 1970, 5:30:00 am)")
    ).toHaveLength(2);
    expect(
      screen.getByText("Number of Post in this thread: 10")
    ).toBeInTheDocument();
    expect(screen.getByText("Started by")).toBeInTheDocument();
  });
});
