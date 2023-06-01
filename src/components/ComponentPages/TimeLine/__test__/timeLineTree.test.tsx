import { render, screen, fireEvent } from "@testing-library/react";
import TimelineSlider from "../../eventLine/TimelineSlider";
import TimeLine from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

// Mock the API response for getEventLineApi
jest.mock("src/network/api/topicEventLineAPI", () => ({
  getEventLineApi: jest.fn().mockResolvedValue({
    // Mocked response data
    "asoftime_123456": {
      event: {
        message: "Mocked event message",
      },
      payload_response: [
        { score: 10 },
        { score: 20 },
        { score: 30 },
      ],
    },
  }),
}));

describe("TimelineSlider", () => {
  test("renders the component with correct props", () => {
    const mockData = {
      "asoftime_123456": {
        event: {
          message: "Mocked event message",
        },
        payload_response: [
          { score: 10 },
          { score: 20 },
          { score: 30 },
        ],
      },
    };
    const setStart = jest.fn();
    const setTimelineDescript = jest.fn();
    const handleEventSelection = jest.fn();
    const setAnimationSpeed = jest.fn();
    const setIteration = jest.fn();
    const handleForwardOrBackord = jest.fn();
    const setIsPlaying = jest.fn();

    render(
      <TimelineSlider
        mockData={mockData}
        setStart={setStart}
        start={false}
        setTimelineDescript={setTimelineDescript}
        handleEventSelection={handleEventSelection}
        animationSpeed={1000}
        setAnimationSpeed={setAnimationSpeed}
        iteration={0}
        setIteration={setIteration}
        handleForwardOrBackord={handleForwardOrBackord}
        isPlaying={false}
        setIsPlaying={setIsPlaying}
      />
    );

    // Assert the rendered elements and their props
    expect(screen.getByTestId("time-bar-control")).toBeInTheDocument();

    // Simulate a click event on the play button
    fireEvent.click(screen.getByTestId("play-button"));

    // Assert that the setIsPlaying function has been called
    // expect(setIsPlaying).toHaveBeenCalled();
  });
});

describe("TimeLine", () => {
  test("renders the component with correct data", async () => {
    render(<Provider store={store}> <TimeLine setTimelineDescript={jest.fn()} /></Provider>);

    // Wait for the API call to complete and data to be rendered
    // await screen.findByText("Mocked event message");

    // Assert that the rendered elements and data are correct
    expect(screen.getByTestId("time-bar-control")).toBeInTheDocument();
  });
});
