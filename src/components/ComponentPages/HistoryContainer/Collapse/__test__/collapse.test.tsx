import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import HistoryCollapse from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

import { NextRouter } from "next/router";
import configureMockStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";

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
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: 1698655445.598,
      asof: "default",
      filterByScore: "0",
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
  },
});

describe("HistoryCollapse component", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("30 Oct 2023 02:12:00 GMT").getTime());
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  test("renders commit and cancel button", () => {
    const { container, debug } = render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/statement/history/3020-test-colapse-2/1-Agreement",
            pathname: "/statement/history/[...camp]",
          })}
        >
          <HistoryCollapse
            collapseKey={"1"}
            isChecked={false}
            campStatement={{
              value: "<p>stateedit</p>",
              parsed_value: "<p>stateedit</p>",
              topic_num: 3020,
              camp_num: 1,
              id: 6193,
              note: "editSum",
              submit_time: 1698655566,
              submitter_nick_id: 831,
              go_live_time: 1698741966,
              objector_nick_id: null,
              object_time: null,
              object_reason: null,
              proposed: null,
              replacement: null,
              language: "English",
              grace_period: 1,
              objector_nick_name: null,
              agreed_to_change: 0,
              submitter_nick_name: "test2",
              isAuthor: true,
              total_supporters: 2,
              agreed_supporters: 1,
              ifIamSupporter: 0,
              ifIAmExplicitSupporter: false,
              status: "in_review",
            }}
            topicNamespaceId={19}
            userNickNameData={[
              {
                id: 2,
                nick_name: "Malia_Allsop",
              },
            ]}
            campHistoryItems={[
              {
                value: "<p>stateedit</p>",
                parsed_value: "<p>stateedit</p>",
                topic_num: 3020,
                camp_num: 1,
                id: 6193,
                note: "editSum",
                submit_time: 1698655566,
                submitter_nick_id: 831,
                go_live_time: 1698741966,
                objector_nick_id: null,
                object_time: null,
                object_reason: null,
                proposed: null,
                replacement: null,
                language: "English",
                grace_period: 1,
                objector_nick_name: null,
                agreed_to_change: 0,
                submitter_nick_name: "test2",
                isAuthor: true,
                total_supporters: 2,
                agreed_supporters: 1,
                ifIamSupporter: 0,
                ifIAmExplicitSupporter: false,
                status: "in_review",
              },
            ]}
            callManageCampApi={jest.fn()}
            changeAgree={jest.fn()}
            changeDiscard={jest.fn()}
            onSelectCompare={jest.fn()}
            setIsTreesApiCallStop={jest.fn()}
            isDisabledCheck={false}
            parentArchived={0}
          />
        </RouterContext.Provider>
      </Provider>
    );

    const statementHistory = screen.getByText("Select To Compare");
    expect(statementHistory).toBeInTheDocument();

    const statement = screen.getByText("Select To Compare");
    expect(statement).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /edit change/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /commit change/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    ).toBeInTheDocument();

    expect(container.getElementsByTagName("button")).toHaveLength(3);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(1);
    expect(container.getElementsByTagName("a")).toHaveLength(2);
    fireEvent.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );
    waitFor(() => {
      screen.getByText("Do you want to cancel this commit?");
    });
    waitFor(() => {
      screen.getByText("Do you want to cancel this commit?");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /ok/i,
      })
    );
    waitForElementToBeRemoved(
      screen.getByText("Do you want to cancel this commit?")
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /commit change/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /edit change/i,
      })
    );
  });
  test("renders agree or object", () => {
    const { container, debug } = render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/statement/history/3020-test-colapse-2/1-Agreement",
            pathname: "/statement/history/[...camp]",
          })}
        >
          <HistoryCollapse
            collapseKey={"1"}
            isChecked={false}
            campStatement={{
              value: "<p>stateedit</p>",
              parsed_value: "<p>stateedit</p>",
              topic_num: 3020,
              camp_num: 1,
              id: 6193,
              note: "editSum",
              submit_time: 1698656023,
              submitter_nick_id: 831,
              go_live_time: 1698656203,
              objector_nick_id: null,
              object_time: null,
              object_reason: null,
              proposed: null,
              replacement: null,
              language: "English",
              grace_period: 0,
              objector_nick_name: null,
              agreed_to_change: 0,
              submitter_nick_name: "test2",
              isAuthor: false,
              total_supporters: 2,
              agreed_supporters: 1,
              ifIamSupporter: 2,
              ifIAmExplicitSupporter: false,
              status: "in_review",
            }}
            topicNamespaceId={19}
            userNickNameData={[
              {
                id: 2,
                nick_name: "Malia_Allsop",
              },
            ]}
            campHistoryItems={[
              {
                value: "<p>stateedit</p>",
                parsed_value: "<p>stateedit</p>",
                topic_num: 3020,
                camp_num: 1,
                id: 6193,
                note: "editSum",
                submit_time: 1698656023,
                submitter_nick_id: 831,
                go_live_time: 1698656203,
                objector_nick_id: null,
                object_time: null,
                object_reason: null,
                proposed: null,
                replacement: null,
                language: "English",
                grace_period: 0,
                objector_nick_name: null,
                agreed_to_change: 0,
                submitter_nick_name: "test2",
                isAuthor: false,
                total_supporters: 2,
                agreed_supporters: 1,
                ifIamSupporter: 2,
                ifIAmExplicitSupporter: false,
                status: "in_review",
              },
            ]}
            callManageCampApi={jest.fn()}
            changeAgree={jest.fn()}
            changeDiscard={jest.fn()}
            onSelectCompare={jest.fn()}
            setIsTreesApiCallStop={jest.fn()}
            isDisabledCheck={false}
            parentArchived={0}
          />
        </RouterContext.Provider>
      </Provider>
    );

    const statementHistory = screen.getByText("Select To Compare");
    expect(statementHistory).toBeInTheDocument();

    const statement = screen.getByText("Select To Compare");
    expect(statement).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", {
        name: /i agree with this statement change/i,
      })
    ).toBeInTheDocument();

    expect(container.getElementsByTagName("button")).toHaveLength(3);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(2);
    expect(container.getElementsByTagName("a")).toHaveLength(2);
    // fireEvent.click(
    //   screen.getByRole("checkbox", {
    //     name: /i agree with this statement change/i,
    //   })
    // );
    // debug();
  });

  test("renders Objected", () => {
    const { container, debug } = render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/statement/history/3020-test-colapse-2/1-Agreement",
            pathname: "/statement/history/[...camp]",
          })}
        >
          <HistoryCollapse
            collapseKey={"1"}
            isChecked={false}
            campStatement={{
              value: "<p>stateeditobj</p>",
              parsed_value: "<p>stateeditobj</p>",
              topic_num: 3020,
              camp_num: 1,
              id: 6194,
              note: "",
              submit_time: 1698658180,
              submitter_nick_id: 831,
              go_live_time: 1698744672,
              objector_nick_id: 2,
              object_time: 1698658272,
              object_reason: "yes",
              proposed: null,
              replacement: null,
              language: "English",
              grace_period: 0,
              objector_nick_name: "Malia_Allsop",
              agreed_to_change: 0,
              submitter_nick_name: "test2",
              isAuthor: false,
              total_supporters: 2,
              agreed_supporters: 1,
              ifIamSupporter: 2,
              ifIAmExplicitSupporter: false,
              status: "objected",
            }}
            topicNamespaceId={19}
            userNickNameData={[
              {
                id: 2,
                nick_name: "Malia_Allsop",
              },
            ]}
            campHistoryItems={[
              {
                value: "<p>stateeditobj</p>",
                parsed_value: "<p>stateeditobj</p>",
                topic_num: 3020,
                camp_num: 1,
                id: 6194,
                note: "",
                submit_time: 1698658180,
                submitter_nick_id: 831,
                go_live_time: 1698744672,
                objector_nick_id: 2,
                object_time: 1698658272,
                object_reason: "yes",
                proposed: null,
                replacement: null,
                language: "English",
                grace_period: 0,
                objector_nick_name: "Malia_Allsop",
                agreed_to_change: 0,
                submitter_nick_name: "test2",
                isAuthor: false,
                total_supporters: 2,
                agreed_supporters: 1,
                ifIamSupporter: 2,
                ifIAmExplicitSupporter: false,
                status: "objected",
              },
            ]}
            callManageCampApi={jest.fn()}
            changeAgree={jest.fn()}
            changeDiscard={jest.fn()}
            onSelectCompare={jest.fn()}
            setIsTreesApiCallStop={jest.fn()}
            isDisabledCheck={false}
            parentArchived={0}
          />
        </RouterContext.Provider>
      </Provider>
    );

    const statementHistory = screen.getByText("Select To Compare");
    expect(statementHistory).toBeInTheDocument();

    const statement = screen.getByText("Select To Compare");
    expect(statement).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /object reason : yes/i,
      })
    ).toBeInTheDocument();

    const divElement = container.querySelector(
      ".ant-collapse-header.ant-collapse-header-collapsible-only"
    );

    expect(divElement).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(1);
    expect(container.getElementsByTagName("a")).toHaveLength(3);

    const element = container.querySelector('div[aria-expanded="false"]');

    expect(element).toBeInTheDocument();
    fireEvent.click(element);
  });

  test("renders Objected with unAuth user", () => {
    const { container, debug } = render(
      <Provider store={store}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/statement/history/3020-test-colapse-2/1-Agreement",
            pathname: "/statement/history/[...camp]",
          })}
        >
          <HistoryCollapse
            collapseKey={"1"}
            isChecked={false}
            campStatement={{
              value: "<p>stateedit</p>",
              parsed_value: "<p>stateedit</p>",
              topic_num: 3020,
              camp_num: 1,
              id: 6193,
              note: "editSum",
              submit_time: 1698656023,
              submitter_nick_id: 831,
              go_live_time: 1698656203,
              objector_nick_id: null,
              object_time: null,
              object_reason: null,
              proposed: null,
              replacement: null,
              language: "English",
              grace_period: 0,
              objector_nick_name: null,
              agreed_to_change: 0,
              submitter_nick_name: "test2",
              isAuthor: false,
              total_supporters: 2,
              agreed_supporters: 1,
              ifIamSupporter: 2,
              ifIAmExplicitSupporter: false,
              status: "in_review",
            }}
            topicNamespaceId={19}
            userNickNameData={[
              {
                id: 2,
                nick_name: "Malia_Allsop",
              },
            ]}
            campHistoryItems={[
              {
                value: "<p>stateedit</p>",
                parsed_value: "<p>stateedit</p>",
                topic_num: 3020,
                camp_num: 1,
                id: 6193,
                note: "editSum",
                submit_time: 1698656023,
                submitter_nick_id: 831,
                go_live_time: 1698656203,
                objector_nick_id: null,
                object_time: null,
                object_reason: null,
                proposed: null,
                replacement: null,
                language: "English",
                grace_period: 0,
                objector_nick_name: null,
                agreed_to_change: 0,
                submitter_nick_name: "test2",
                isAuthor: false,
                total_supporters: 2,
                agreed_supporters: 1,
                ifIamSupporter: 2,
                ifIAmExplicitSupporter: false,
                status: "in_review",
              },
            ]}
            callManageCampApi={jest.fn()}
            changeAgree={jest.fn()}
            changeDiscard={jest.fn()}
            onSelectCompare={jest.fn()}
            setIsTreesApiCallStop={jest.fn()}
            isDisabledCheck={false}
            parentArchived={0}
          />
        </RouterContext.Provider>
      </Provider>
    );

    const statementHistory = screen.getByText("Select To Compare");
    expect(statementHistory).toBeInTheDocument();

    const statement = screen.getByText("Select To Compare");
    expect(statement).toBeInTheDocument();

    expect(container.getElementsByTagName("button")).toHaveLength(3);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(1);
    expect(container.getElementsByTagName("a")).toHaveLength(2);
    debug();
    // const statementHistory = screen.getByText("Select To Compare");
    // expect(statementHistory).toBeInTheDocument();

    // const statement = screen.getByText("Select To Compare");
    // expect(statement).toBeInTheDocument();
    // expect(
    //   screen.getByRole("heading", {
    //     name: /object reason : yes/i,
    //   })
    // ).toBeInTheDocument();
    // expect(container.getElementsByTagName("button")).toHaveLength(2);
    // expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    // expect(container.getElementsByTagName("input")).toHaveLength(1);
    // expect(container.getElementsByTagName("a")).toHaveLength(3);
    fireEvent.click(
      screen.getByRole("button", {
        name: /object/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit statement update based on this/i,
      })
    );
  });
});
