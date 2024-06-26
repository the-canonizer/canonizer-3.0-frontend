// TopicsList.test.tsx (or TopicsList.test.js if using JavaScript)

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import TopicsList from "./TopicsList"; // Adjust the import path as needed

// Mock useSelector and useDispatch
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock useRouter
jest.mock("next/router", () => ({
  useRouter: () => ({
    query: {},
    replace: jest.fn(),
  }),
}));

describe("TopicsList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it("renders without crashing", () => {
    render(<TopicsList />);
    // Add assertions based on your component structure
  });

  it("handles name space selection correctly", async () => {
    // Mock useSelector with mock state
    useSelector.mockReturnValue({
      canonizedTopicsData: {
        topics: [
          // Mock data for canonized topics
          {
            topic_name: "Topic 1",
            topic_score: 4.5,
            views: 100,
            description: "Description 1",
          },
          {
            topic_name: "Topic 2",
            topic_score: 3.2,
            views: 50,
            description: "Description 2",
          },
        ],
      },
      filters: {
        filterObject: {
          asof: "review",
          namespace_id: "1",
        },
      },
      auth: {
        loggedInUser: {
          email: "test@example.com",
        },
      },
      utils: {
        archived_checkbox: false,
        score_checkbox: false,
        sortLatestTopic: false,
        sortScoreViewTopic: false,
      },
      loading: {
        loading: false,
      },
      nameSpaces: [
        // Mock data for name spaces
        { id: "1", label: "General" },
        { id: "2", label: "Namespace 2" },
      ],
    });

    const { getByLabelText, getByText } = render(<TopicsList />);

    // Simulate selecting a name space
    fireEvent.change(getByLabelText("Filter by Canon"), {
      target: { value: "2" },
    });

    // Wait for API calls or state updates to settle
    await waitFor(() => {
      expect(getByText("Namespace 2")).toBeInTheDocument(); // Example assertion
    });

    // You can add more assertions based on your component behavior
  });

  // Add more tests for other functionalities such as pagination, search, etc.
});
