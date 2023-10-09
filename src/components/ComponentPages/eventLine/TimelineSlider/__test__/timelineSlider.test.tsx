import { render, fireEvent } from "@testing-library/react";
import TimelineSlider from "../index";

describe("TimelineSlider", () => {
  const mockData = {
    0: {
      event: {
        message: "Event 1",
      },
    },
    1: {
      event: {
        message: "Event 2",
      },
    },
    2: {
      event: {
        message: "Event 3",
      },
    },
  };

  it("should render the slider and control buttons", () => {
    const { getByTestId } = render(
      <TimelineSlider
        mockData={mockData}
        setStart={jest.fn()}
        start={false}
        setTimelineDescript={jest.fn()}
        handleEventSelection={jest.fn()}
        animationSpeed={1000}
        setAnimationSpeed={jest.fn()}
        iteration={0}
        setIteration={jest.fn()}
        handleForwardOrBackord={jest.fn()}
        isPlaying={false}
        setIsPlaying={jest.fn()}
      />
    );

    // const slider = getByTestId("slider");
    // expect(slider).toBeInTheDocument();

    const playButton = getByTestId("play-button");
    expect(playButton).toBeInTheDocument();

    const speedIcon = getByTestId("speed-icon");
    expect(speedIcon).toBeInTheDocument();
  });

  it("should handle forward button click and increment iteration", () => {
    const setIteration = jest.fn();
    const handleForwardOrBackord = jest.fn();
    const { getByTestId } = render(
      <TimelineSlider
        mockData={mockData}
        setStart={jest.fn()}
        start={false}
        setTimelineDescript={jest.fn()}
        handleEventSelection={jest.fn()}
        animationSpeed={1000}
        setAnimationSpeed={jest.fn()}
        iteration={0}
        setIteration={setIteration}
        handleForwardOrBackord={handleForwardOrBackord}
        isPlaying={false}
        setIsPlaying={jest.fn()}
      />
    );

    const forwardButton = getByTestId("forward-button");
    fireEvent.click(forwardButton);

    expect(setIteration).toHaveBeenCalledWith(1);
    expect(handleForwardOrBackord).toHaveBeenCalledWith(1);
  });

  it("should handle backward button click and decrement iteration", () => {
    const setIteration = jest.fn();
    const handleForwardOrBackord = jest.fn();
    const { getByTestId } = render(
      <TimelineSlider
        mockData={mockData}
        setStart={jest.fn()}
        start={false}
        setTimelineDescript={jest.fn()}
        handleEventSelection={jest.fn()}
        animationSpeed={1000}
        setAnimationSpeed={jest.fn()}
        iteration={1}
        setIteration={setIteration}
        handleForwardOrBackord={handleForwardOrBackord}
        isPlaying={false}
        setIsPlaying={jest.fn()}
      />
    );

    const backwardButton = getByTestId("backward-button");
    fireEvent.click(backwardButton);

    expect(setIteration).toHaveBeenCalledWith(0);
    expect(handleForwardOrBackord).toHaveBeenCalledWith(0);
  });
});
