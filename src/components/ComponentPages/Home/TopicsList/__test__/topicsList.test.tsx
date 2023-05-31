import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import TopicsList from "../index";

jest.mock("react-redux"); // Mock react-redux hooks

describe("TopicsList", () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({
        homePage: {
          canonizedTopicsData: {
            topics: [
              { topic_id: 1, topic_name: "Topic 1", topic_score: 5 },
              { topic_id: 2, topic_name: "Topic 2", topic_score: 7 },
            ],
            numOfPages: 2,
          },
          nameSpaces: [
            { id: 1, label: "/general/" },
            { id: 2, label: "/organization/" },
          ],
        },
        filters: {
          filterObject: {
            asofdate: "",
            asof: "",
            algorithm: "",
            filterByScore: "",
            nameSpace: "",
            namespace_id: "",
            search: "",
            is_archive: "",
          },
        },
        auth: {
          loggedInUser: { email: "test@example.com" },
        },
        utils: {
          score_checkbox: true,
          archived_checkbox: false,
        },
      })
    );

    useDispatch.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    useSelector.mockClear();
    useDispatch.mockClear();
  });

  test("renders the topic list correctly", () => {
    render(<TopicsList />);

    expect(screen.getByText("Topic 1")).toBeInTheDocument();
    expect(screen.getByText("Topic 2")).toBeInTheDocument();
  });

  test("loads more topics when 'Load More' button is clicked", () => {
    render(<TopicsList />);

    fireEvent.click(screen.getByText("Load More"));

    // Add assertions for the expected behavior when 'Load More' button is clicked
  });

  test("updates the search input value correctly", () => {
    render(<TopicsList />);

    fireEvent.change(screen.getByPlaceholderText("Search by topic name"), {
      target: { value: "Topic 3" },
    });

    expect(screen.getByPlaceholderText("Search by topic name").value).toBe(
      "Topic 3"
    );
  });

 
});
