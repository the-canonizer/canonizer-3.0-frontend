import { RouterContext } from "next/dist/shared/lib/router-context";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import HistoryCollapse from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

import configureMockStore from "redux-mock-store";

describe("HistoryCollapse component", () => {
  const mockCampStatement = {
    id: 1665,
    namespace: "/sandbox testing/",
    language: "English",
    topic_num: 989,
    note: "",
    submit_time: 1692094250,
    submitter_nick_id: 4,
    go_live_time: 1692094250,
    objector_nick_id: null,
    object_time: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    topic_name: "test case",
    namespace_id: 19,
    grace_period: 0,
    is_disabled: 0,
    is_one_level: 0,
    objector_nick_name: null,
    submitter_nick_name: "Andrea_Allsop",
    isAuthor: true,
    agreed_to_change: 0,
    total_supporters: 1,
    agreed_supporters: 1,
    ifIamSupporter: 4,
    ifIAmExplicitSupporter: true,
    status: "live",
    parsed_value: "<br />",
  };
  const mock2 = {
    id: 1665,
    namespace: "/sandbox testing/",
    language: "English",
    topic_num: 989,
    note: "",
    submit_time: 1692094250,
    submitter_nick_id: 4,
    go_live_time: 1692094250,
    objector_nick_id: null,
    object_time: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    topic_name: "test case",
    namespace_id: 19,
    grace_period: 0,
    is_disabled: 0,
    is_one_level: 0,
    objector_nick_name: null,
    submitter_nick_name: "Andrea_Allsop",
    isAuthor: true,
    agreed_to_change: 0,
    total_supporters: 1,
    agreed_supporters: 1,
    ifIamSupporter: 4,
    ifIAmExplicitSupporter: true,
    status: "live",
    parsed_value: "<br />",
  };

  function createMockRouter() {
    return {
      basePath: "",
      pathname: "/",
      route: "/",
      query: {
        camp: ["989-test-case", "1-Agreement"],
      },
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

  // afterEach(cleanup);

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

  it("should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter()}>
          <HistoryCollapse />
        </RouterContext.Provider>
      </Provider>
    );
  });

  test("renders commit and cancel button", () => {
    const { container } = render(
      <Provider store={store1}>
        {" "}
        <HistoryCollapse
          collapseKey={"1"}
          isChecked={false}
          campStatement={mockCampStatement}
          topicNamespaceId={19}
          userNickNameData={[
            {
              id: 4,
              owner_code: "TWFsaWE0TWFsaWE=",
              nick_name: "Andrea_Allsop",
              create_time: "1970-01-01",
              private: 1,
            },
          ]}
          campHistoryItems={[
            {
              id: 1669,
              namespace: "/sandbox testing/",
              language: "English",
              topic_num: 989,
              note: "this is test",
              submit_time: 1692113450,
              submitter_nick_id: 4,
              go_live_time: 1692199850,
              objector_nick_id: null,
              object_time: null,
              object_reason: null,
              proposed: null,
              replacement: null,
              topic_name: "test case",
              namespace_id: 19,
              grace_period: 1,
              is_disabled: 0,
              is_one_level: 0,
              objector_nick_name: null,
              submitter_nick_name: "Andrea_Allsop",
              isAuthor: true,
              agreed_to_change: 0,
              total_supporters: 1,
              agreed_supporters: 1,
              ifIamSupporter: 4,
              ifIAmExplicitSupporter: true,
              status: "in_review",
              parsed_value: "<br />",
            },
          ]}
          callManageCampApi={jest.fn()}
          changeAgree={jest.fn()}
          changeDiscard={jest.fn()}
          onSelectCompare={jest.fn()}
          setIsTreesApiCallStop={jest.fn()}
          isDisabledCheck={jest.fn()}
        />
      </Provider>
    );

    // const editButton = screen.getByRole("button", {
    //   name: /edit change/i,
    // });
    // const commitButton = screen.getByRole("button", {
    //   name: /commit change/i,
    // });
    // const cancelButton = screen.getByRole("button", {
    //   name: /cancel/i,
    // });
    const statementHistory = screen.getByText("Select To Compare");
    expect(statementHistory).toBeInTheDocument();

    const statement = screen.getByText("Select To Compare");
    expect(statement).toBeInTheDocument();

    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(1);
    expect(container.getElementsByTagName("a")).toHaveLength(1);
  });

  test("displays 'Object' button when status is 'in_review'", () => {
    const { container } = render(
      <Provider store={store}>
        {" "}
        <HistoryCollapse
          collapseKey={"1"}
          isChecked={false}
          campStatement={mock2}
          topicNamespaceId={19}
          userNickNameData={[
            {
              id: 4,
              owner_code: "TWFsaWE0TWFsaWE=",
              nick_name: "Andrea_Allsop",
              create_time: "1970-01-01",
              private: 1,
            },
          ]}
          campHistoryItems={[
            {
              id: 1665,
              namespace: "/sandbox testing/",
              language: "English",
              topic_num: 989,
              note: "",
              submit_time: 1692094250,
              submitter_nick_id: 4,
              go_live_time: 1692094250,
              objector_nick_id: null,
              object_time: null,
              object_reason: null,
              proposed: null,
              replacement: null,
              topic_name: "test case",
              namespace_id: 19,
              grace_period: 0,
              is_disabled: 0,
              is_one_level: 0,
              objector_nick_name: null,
              submitter_nick_name: "Andrea_Allsop",
              isAuthor: true,
              agreed_to_change: 0,
              total_supporters: 1,
              agreed_supporters: 1,
              ifIamSupporter: 4,
              ifIAmExplicitSupporter: true,
              status: "live",
              parsed_value: "<br />",
            },
          ]}
          callManageCampApi={jest.fn()}
          changeAgree={jest.fn()}
          changeDiscard={jest.fn()}
          onSelectCompare={jest.fn()}
          setIsTreesApiCallStop={jest.fn()}
          isDisabledCheck={jest.fn()}
        />
      </Provider>
    );

    const viewButton = screen.getByRole("button", {
      name: /view this version/i,
    });
    const submitButton = screen.getByRole("button", {
      name: /submit statement update based on this/i,
    });
    const statementHistory = screen.getByText("Select To Compare");
    expect(statementHistory).toBeInTheDocument();

    const statement = screen.getByText("Select To Compare");
    expect(statement).toBeInTheDocument();

    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(1);
    expect(container.getElementsByTagName("a")).toHaveLength(1);

    expect(viewButton.textContent).toBe("View This Version");
    expect(submitButton.textContent).toBe(
      "Submit Statement Update Based On This"
    );
  });
});
