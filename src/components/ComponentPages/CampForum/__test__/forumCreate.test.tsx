import { Fragment } from "react";
import { render, screen, cleanup } from "src/utils/testUtils";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

import ForumCreate from "../Create";
import messages from "src/messages";
import { store } from "src/store";

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

describe("Camp forum create thread", () => {
  it("render heading and labels on create page", () => {
    render(
      <Fragment>
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath:
                "/forum/54-Religious-Preference/1-Agreement/threads/create",
            })}
          >
            <ForumCreate
              isThreadUpdate={false}
              nickNameList={data}
              onCancelCreateThread={jest.fn()}
              onFinish={jest.fn()}
              form={undefined}
              initialValue={{}}
              isLoading={false}
            />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    expect(screen.getByText(labels.threadTitle)).toBeInTheDocument();
    expect(screen.getByText(labels.cr_nick_name_sp)).toBeInTheDocument();
    expect(screen.getByText("Create a new thread")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("render heading and labels on edit page", () => {
    render(
      <Fragment>
        <Provider store={store}>
          <RouterContext.Provider
            value={createMockRouter({
              asPath: "/forum/54-Religious-Preference/1-Agreement/threads/2",
            })}
          >
            <ForumCreate
              isThreadUpdate={true}
              nickNameList={data}
              onCancelCreateThread={jest.fn()}
              onFinish={jest.fn()}
              form={undefined}
              initialValue={{}}
              isLoading={false}
            />
          </RouterContext.Provider>
        </Provider>
      </Fragment>
    );

    expect(screen.getByText(labels.threadTitle)).toBeInTheDocument();
    expect(screen.getByText("Edit title of the thread")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });
});
