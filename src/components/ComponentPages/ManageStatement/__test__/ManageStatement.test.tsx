import React from "react";
import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "@testing-library/react";

import AddOrManage from "../index";
import { Provider } from "react-redux";

import {
  getAllCampNickNames,
  getAllParentsCamp,
  getAllUsedNickNames,
  getCurrentTopicRecordApi,
} from "src/network/api/campDetailApi";

import configureMockStore from "redux-mock-store";

import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

import {
  getEditCampApi,
  getEditStatementApi,
  getEditTopicApi,
  updateCampApi,
  updateStatementApi,
  updateTopicApi,
} from "src/network/api/campManageStatementApi";
import { getCanonizedNameSpacesApi } from "src/network/api/homePageApi";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

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

const getEditStatementData = {
  statement: {
    value: "<p>&nbsp;the brief analysis</p>",
    parsed_value: "<p>&nbsp;the brief analysis</p>",
    topic_num: 3042,
    camp_num: 1,
    id: 6249,
    note: "the canonizer",
    submit_time: 1701175398,
    submitter_nick_id: 4,
    go_live_time: 1701261798,
    objector_nick_id: null,
    object_time: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    language: "English",
    grace_period: 1,
  },
  topic: {
    topic_name: "test cases12",
    namespace_id: 19,
    id: 11052,
    topic_num: 3042,
    parent_camp_num: null,
    key_words: "",
    language: "English",
    camp_num: 1,
    note: "",
    submit_time: 1701166598,
    submitter_nick_id: 4,
    go_live_time: 1701166598,
    objector_nick_id: null,
    object_time: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    title: "test cases12",
    camp_name: "Agreement",
    camp_about_url: null,
    camp_about_nick_id: null,
    grace_period: 0,
    is_disabled: 0,
    is_one_level: 0,
    is_archive: 0,
    direct_archive: 0,
    old_parent_camp_num: null,
    archive_action_time: 0,
    namespace_name: "sandbox testing",
    name: "sandbox testing",
  },
  parent_camp: [
    {
      camp_name: "Agreement",
      topic_num: 3042,
      camp_num: 1,
    },
  ],
  nick_name: [
    {
      id: 4,
      owner_code: "TWFsaWE0TWFsaWE=",
      nick_name: "Andrea_Allsop",
      create_time: "1970-01-01",
      private: 1,
    },
  ],
  parent_camp_num: 0,
};
const editCampData = {
  camp: {
    id: 11053,
    topic_num: 3042,
    parent_camp_num: 1,
    key_words: "",
    language: "English",
    camp_num: 2,
    note: "",
    submit_time: 1701181669,
    submitter_nick_id: 4,
    go_live_time: 1701181669,
    objector_nick_id: null,
    object_time: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    title: "",
    camp_name: "camp1",
    camp_about_url: "",
    camp_about_nick_id: 0,
    grace_period: 0,
    is_disabled: 0,
    is_one_level: 0,
    is_archive: 0,
    direct_archive: 0,
    old_parent_camp_num: null,
    archive_action_time: 0,
  },
  nick_name: [
    {
      id: 4,
      owner_code: "TWFsaWE0TWFsaWE=",
      nick_name: "Andrea_Allsop",
      create_time: "1970-01-01",
      private: 1,
    },
  ],
  parent_camp: [
    {
      camp_name: "Agreement",
      topic_num: 3042,
      camp_num: 1,
    },
    {
      camp_name: "camp1",
      topic_num: 3042,
      camp_num: 2,
    },
  ],
  topic: {
    topic_name: "test cases12",
    namespace_id: 19,
    id: 11052,
    topic_num: 3042,
    parent_camp_num: null,
    key_words: "",
    language: "English",
    camp_num: 1,
    note: "",
    submit_time: 1701166598,
    submitter_nick_id: 4,
    go_live_time: 1701166598,
    objector_nick_id: null,
    object_time: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    title: "test cases12",
    camp_name: "Agreement",
    camp_about_url: null,
    camp_about_nick_id: null,
    grace_period: 0,
    is_disabled: 0,
    is_one_level: 0,
    is_archive: 0,
    direct_archive: 0,
    old_parent_camp_num: null,
    archive_action_time: 0,
    namespace_name: "sandbox testing",
    name: "sandbox testing",
  },
};

const topicData = {
  topic: {
    id: 4035,
    namespace: null,
    language: "English",
    topic_num: 3042,
    note: "",
    submit_time: 1701166598,
    submitter_nick_id: 4,
    go_live_time: 1701166598,
    objector_nick_id: null,
    object_time: null,
    object_reason: null,
    proposed: null,
    replacement: null,
    topic_name: "test cases12",
    namespace_id: 19,
    grace_period: 0,
    is_disabled: 0,
    is_one_level: 0,
  },
  nick_name: [
    {
      id: 4,
      owner_code: "TWFsaWE0TWFsaWE=",
      nick_name: "Andrea_Allsop",
      create_time: "1970-01-01",
      private: 1,
    },
  ],
};

const namespaceData = [
  {
    id: 19,
    parent_id: 0,
    name: "sandbox testing",
    label: "/sandbox testing/",
    sort_order: 19,
  },
  {
    id: 1,
    parent_id: 0,
    name: "General",
    label: "/General/",
    sort_order: 1,
  },
];

const allUsedNickname = {
  status_code: 200,
  data: [
    {
      id: 4,
      owner_code: "TWFsaWE0TWFsaWE=",
      nick_name: "Andrea_Allsop",
      create_time: "1970-01-01",
      private: 1,
    },
  ],
};

afterEach(cleanup);
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

jest.mock("src/network/api/homePageApi");
jest.mock("src/network/api/campDetailApi");
jest.mock("src/network/api/campManageStatementApi");

describe("AddOrManage component", () => {
  beforeEach(() => {
    jest.mock("src/network/api/homePageApi");
    jest.mock("src/network/api/campDetailApi");
    jest.mock("src/network/api/campManageStatementApi");
  });
  //=============================================Create Statement Cases==================

  it("create statement", async () => {
    getCurrentTopicRecordApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic_num: 3042,
        camp_num: 1,
        topic_name: "test cases12",
        namespace_name: "/sandbox testing/",
        topicSubscriptionId: "",
        namespace_id: 19,
        note: "",
        submitter_nick_name: "Andrea_Allsop",
        go_live_time: 1701166598,
        camp_about_nick_id: null,
        submitter_nick_id: 4,
        submit_time: 1701166598,
      },
    });
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/create/statement/3042-test-cases12/1-Agreement",
            query: {
              statement: ["3042-test-cases12", "1-Agreement"],
            },
          })}
        >
          <AddOrManage add={true} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();
      expect(screen.getByText(/add camp statement/i)).toBeInTheDocument();
    });

    const mainHeading = screen.getByText(/add camp statement/i);
    const submitButton = screen.getByRole("button", {
      name: /submit statement/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });
    expect(screen.getByText(/nickname/i)).toBeInTheDocument();
    expect(screen.getAllByText(/statement/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/edit summary/i).textContent).toBe(
      "Edit Summary (Briefly describe your changes)"
    );
    expect(
      screen.getByText(/\(briefly describe your changes\)/i)
    ).toBeInTheDocument();
    expect(submitButton.textContent).toBe("Submit Statement");
    expect(cancelButton.textContent).toBe("Cancel");
    expect(mainHeading.textContent).toBe("Add Camp Statement");
    const editSum = screen.getByRole("textbox", {
      name: /edit summary \(briefly describe your changes\)/i,
    });
    fireEvent.change(editSum, { target: { value: "the canonizer" } });
    fireEvent.click(submitButton);
  });

  it("create statement cancel form", async () => {
    getCurrentTopicRecordApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic_num: 3042,
        camp_num: 1,
        topic_name: "test cases12",
        namespace_name: "/sandbox testing/",
        topicSubscriptionId: "",
        namespace_id: 19,
        note: "",
        submitter_nick_name: "Andrea_Allsop",
        go_live_time: 1701166598,
        camp_about_nick_id: null,
        submitter_nick_id: 4,
        submit_time: 1701166598,
      },
    });
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/create/statement/3042-test-cases12/1-Agreement",
            query: {
              statement: ["3042-test-cases12", "1-Agreement"],
            },
          })}
        >
          <AddOrManage add={true} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();
      expect(screen.getByText(/add camp statement/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/add camp statement/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /submit statement/i,
      })
    ).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });
    fireEvent.click(cancelButton);
  });

  // ===================================Edit Statement=============================

  it("Edit  statement", async () => {
    getEditStatementApi.mockResolvedValue({
      status_code: 200,
      data: getEditStatementData,
    });
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);
    updateStatementApi.mockResolvedValue({
      status_code: 200,
      data: {},
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/manage/statement/6249-update",
            query: {
              statement: ["6249-update"],
            },
          })}
        >
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();
      expect(screen.getByText(/the canonizer/i)).toBeInTheDocument();
    });
    const editSum = screen.getByRole("textbox", {
      name: /edit summary \(briefly describe your changes\)/i,
    });

    fireEvent.change(editSum, { target: { value: "the canonizer Edited" } });
    fireEvent.click(
      screen.getByRole("button", {
        name: /submit update/i,
      })
    );
  });

  // ==============================Statement Objected =============================

  it("Object statement", async () => {
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);
    getEditStatementApi.mockResolvedValue({
      status_code: 200,
      data: getEditStatementData,
    });
    updateStatementApi.mockResolvedValue({
      status_code: 200,
      data: "",
      message: "Objection submitted successfully.",
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/manage/statement/6249-objection",
            query: {
              statement: ["6249-objection"],
            },
          })}
        >
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();
      expect(
        screen.getByText(/object to this proposed change/i)
      ).toBeInTheDocument();
    });
    const objReason = screen.getByRole("textbox", {
      name: /your objection reason \* \(limit 100 char\)/i,
    });
    fireEvent.change(objReason, {
      target: { value: "the canonizer objected" },
    });
    fireEvent.click(screen.getByText(/submit objection/i));
  });

  // ====================================== Camp Update =============================

  it("Camp update  cancel form", async () => {
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);
    getEditCampApi.mockResolvedValue({
      status_code: 200,
      data: editCampData,
    });
    getAllCampNickNames.mockResolvedValue({
      status_code: 200,
      data: [
        {
          id: 764,
          owner_code: "TWFsaWExMzMzTWFsaWE=",
          nick_name: "$herl0ck",
          create_time: 1671779489,
          private: 0,
        },
        {
          id: 301,
          owner_code: "TWFsaWEyOTBNYWxpYQ==",
          nick_name: "1beardog1",
          create_time: 1372002836,
          private: 1,
        },
      ],
    });
    getAllParentsCamp.mockResolvedValue({
      status_code: 200,
      data: [
        {
          id: 11052,
          topic_num: 3042,
          parent_camp_num: null,
          key_words: "",
          language: "English",
          camp_num: 1,
          note: "",
          submit_time: 1701166598,
          submitter_nick_id: 4,
          go_live_time: 1701166598,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          title: "test cases12",
          camp_name: "Agreement",
          camp_about_url: null,
          camp_about_nick_id: null,
          grace_period: 0,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          old_parent_camp_num: null,
          archive_action_time: 0,
          support_order: 1,
        },
      ],
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/manage/camp/11053",
            query: {
              statement: ["11053"],
            },
          })}
        >
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();
      expect(screen.getByText(/camp update/i)).toBeInTheDocument();
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );
  });

  it("manage camp cancel form", async () => {
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);
    getEditCampApi.mockResolvedValue({
      status_code: 200,
      data: editCampData,
    });
    getAllCampNickNames.mockResolvedValue({
      status_code: 200,
      data: [
        {
          id: 764,
          owner_code: "TWFsaWExMzMzTWFsaWE=",
          nick_name: "$herl0ck",
          create_time: 1671779489,
          private: 0,
        },
        {
          id: 301,
          owner_code: "TWFsaWEyOTBNYWxpYQ==",
          nick_name: "1beardog1",
          create_time: 1372002836,
          private: 1,
        },
      ],
    });
    getAllParentsCamp.mockResolvedValue({
      status_code: 200,
      data: [
        {
          id: 11052,
          topic_num: 3042,
          parent_camp_num: null,
          key_words: "",
          language: "English",
          camp_num: 1,
          note: "",
          submit_time: 1701166598,
          submitter_nick_id: 4,
          go_live_time: 1701166598,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          title: "test cases12",
          camp_name: "Agreement",
          camp_about_url: null,
          camp_about_nick_id: null,
          grace_period: 0,
          is_disabled: 0,
          is_one_level: 0,
          is_archive: 0,
          direct_archive: 0,
          old_parent_camp_num: null,
          archive_action_time: 0,
          support_order: 1,
        },
      ],
    });
    updateCampApi.mockResolvedValue({
      status_code: 200,
      data: {
        topic_num: 3042,
        parent_camp_num: 1,
        old_parent_camp_num: 1,
        camp_name: "camp1",
        submit_time: 1701183383,
        go_live_time: 1701269783,
        language: "English",
        note: "th",
        key_words: "",
        submitter_nick_id: 4,
        camp_about_url: "",
        camp_about_nick_id: "",
        is_disabled: 0,
        is_one_level: 0,
        is_archive: 0,
        direct_archive: 0,
        camp_num: 2,
        grace_period: 1,
        id: 11054,
        topic: {
          id: 4035,
          namespace: null,
          language: "English",
          topic_num: 3042,
          note: "",
          submit_time: 1701166598,
          submitter_nick_id: 4,
          go_live_time: 1701166598,
          objector_nick_id: null,
          object_time: null,
          object_reason: null,
          proposed: null,
          replacement: null,
          topic_name: "test cases12",
          namespace_id: 19,
          grace_period: 0,
          is_disabled: 0,
          is_one_level: 0,
        },
      },
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/manage/camp/11053",
            query: {
              statement: ["11053"],
            },
          })}
        >
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();

      expect(screen.getByText(/camp update/i)).toBeInTheDocument();
    });
    const editSum = screen.getByRole("textbox", {
      name: /edit summary \(briefly describe your changes\)/i,
    });
    fireEvent.change(editSum, { target: { value: "the canonizer" } });
    fireEvent.click(
      screen.getByRole("button", {
        name: /submit update/i,
      })
    );
  });

  //======================================= Topic Update ============================

  it("Topic update  cancel form", async () => {
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);
    getEditTopicApi.mockResolvedValue({
      status_code: 200,
      data: topicData,
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: namespaceData,
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/manage/topic/4035",
            query: {
              statement: ["4035"],
            },
          })}
        >
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();
      expect(screen.getByText(/topic update/i)).toBeInTheDocument();
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );
  });

  it("Topic update   form", async () => {
    getAllUsedNickNames.mockResolvedValue(allUsedNickname);
    getEditTopicApi.mockResolvedValue({
      status_code: 200,
      data: topicData,
    });
    getCanonizedNameSpacesApi.mockResolvedValue({
      status_code: 200,
      data: namespaceData,
    });
    updateTopicApi.mockResolvedValue({
      status_code: 200,
      data: "",
      message: "Topic updated successfully.",
    });

    render(
      <Provider store={store1}>
        <RouterContext.Provider
          value={createMockRouter({
            asPath: "/manage/topic/4035",
            query: {
              statement: ["4035"],
            },
          })}
        >
          <AddOrManage add={false} />
        </RouterContext.Provider>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText(/andrea_allsop/i)).toBeInTheDocument();
      expect(screen.getByText(/topic update/i)).toBeInTheDocument();
    });

    const editSum = screen.getByRole("textbox", {
      name: /edit summary \(briefly describe your changes\)/i,
    });
    fireEvent.change(editSum, { target: { value: "the canonizer" } });
    fireEvent.click(
      screen.getByRole("button", {
        name: /submit update/i,
      })
    );
  });
});
