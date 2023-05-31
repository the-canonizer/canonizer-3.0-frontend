import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TopicDetails from "../index";

// Mock Redux store
const mockStore = configureStore([]);

describe("TopicDetails", () => {
  let store;
  beforeEach(() => {
    // Create a mock Redux store
    store = mockStore({
      filters: {
        filterObject: {
          asofdate: "2022-01-01",
          algorithm: "algorithm-1",
        },
        viewThisVersionCheck: false,
      },
      topicDetails: {
        newsFeed: [],
        currentTopicRecord: {
          topic_num: 1,
          topic_name: "Test Topic",
          camp_name: "Test Camp",
          camp_num: 1,
        },
        currentCampRecord: {},
        tree: [],
      },
    });
  });

  it("renders TopicDetails component correctly", async () => {
    render(
      <Provider store={store}>
        <TopicDetails />
      </Provider>
    );

    // // Assert loading indicator is initially shown
    // expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();

    // // Wait for the component to finish loading
    // await waitFor(() => {
    //   expect(screen.queryByTestId("loading-indicator")).toBeNull();
    // });

    // Assert the rendered components or elements as per your requirements
    // expect(screen.getByText("Test Topic")).toBeInTheDocument();
    // expect(screen.getByText("Test Camp")).toBeInTheDocument();
  });
});
