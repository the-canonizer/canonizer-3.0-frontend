import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import HotTopic from "../";

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
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {},
  },
  forum: {
    currentThread: null,
    currentPost: null,
  },
  hotTopic: {
    topicData: {
      id: 1,
      updated_at: Date.now(),
      created_at: Date.now(),
      file_full_path: "",
      topic_num: 88,
      topic_name: "Theories",
      camp_num: "",
      camp_name: "Agreement",
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo animi distinctio sed? Sapiente sed numquam molestiae deserunt neque temporibus officiis qui, doloremque excepturi rem harum nihil iste. Magnam ut veniam nobis corporis a amet reprehenderit officia enim fugiat sit, dignissimos cupiditate eius, dolores libero sequi aspernatur exercitationem in necessitatibus quasi!",
    },
  },
});

afterEach(cleanup);

// Mock the API functions used in the component
jest.mock("src/network/api/topicAPI", () => ({
  GetHotTopicDetails: jest.fn(() =>
    Promise.resolve({
      status_code: 200,
      data: {
        id: 1,
        updated_at: Date.now(),
        created_at: Date.now(),
        file_full_path: "",
        topic_num: 88,
        topic_name: "Theories",
        camp_num: "",
        camp_name: "Agreement",
        description:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo animi distinctio sed? Sapiente sed numquam molestiae deserunt neque temporibus officiis qui, doloremque excepturi rem harum nihil iste. Magnam ut veniam nobis corporis a amet reprehenderit officia enim fugiat sit, dignissimos cupiditate eius, dolores libero sequi aspernatur exercitationem in necessitatibus quasi!",
      },
    })
  ),
}));

describe("AddOrManage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/topicAPI", () => ({
      GetHotTopicDetails: jest.fn(() =>
        Promise.resolve({
          status_code: 200,
          data: {
            title: "Hot Topic",
            id: 1,
            updated_at: Date.now(),
            created_at: Date.now(),
            file_full_path: "",
            topic_num: 88,
            topic_name: "Theories",
            camp_num: "",
            camp_name: "Agreement",
            description:
              "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo animi distinctio sed? Sapiente sed numquam molestiae deserunt neque temporibus officiis qui, doloremque excepturi rem harum nihil iste. Magnam ut veniam nobis corporis a amet reprehenderit officia enim fugiat sit, dignissimos cupiditate eius, dolores libero sequi aspernatur exercitationem in necessitatibus quasi!",
          },
        })
      ),
    }));
  });

  test("Render Hot topic", () => {
    render(
      <Provider store={store1}>
        <HotTopic />
      </Provider>
    );

    expect(screen.getByText("Hot Topic")).toBeInTheDocument();
    expect(screen.getByText("Theories")).toBeInTheDocument();
    expect(screen.getByText("Agreement")).toBeInTheDocument();
  });
});
