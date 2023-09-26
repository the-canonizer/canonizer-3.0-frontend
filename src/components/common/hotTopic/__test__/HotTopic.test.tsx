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
    authenticated: false,
    loggedInUser: {
      is_admin: true,
    },
  },
  hotTopic: {
    topicData: {
      title: "Hot Topic",
      id: "1",
      updated_at: Date.now(),
      created_at: Date.now(),
      topic_num: "88",
      topic_name: "Topic",
      camp_num: "1",
      camp_name: "Agreement",
      file_full_path:
        "https://canonizer-public-file.s3.us-east-2.amazonaws.com/canonizer_logo.jpg",
      description:
        "Introducing It's Not a Hard Problem; It's a Color Problem, the new video that outlines the emerging consensus around the Representational Qualia Theory that is revolutionizing how we understand human consciousness.",
    },
  },
  utils: {
    remember_me: {
      email: "",
      password: "",
    },
  },
});

afterEach(cleanup);

// Mock the API functions used in the component
jest.mock("src/network/api/topicAPI", () => ({
  GetHotTopicDetails: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: [] })
  ),
}));

describe("AddOrManage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("src/network/api/topicAPI", () => ({
      GetHotTopicDetails: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: [] })
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
    expect(screen.getByText("View Topic")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Introducing It's Not a Hard Problem; It's a Color Problem, the new video that outlines the emerging consensus around the Representational Qualia Theory that is revolutionizing how we understand human consciousness."
      )
    ).toBeInTheDocument();
  });
});
