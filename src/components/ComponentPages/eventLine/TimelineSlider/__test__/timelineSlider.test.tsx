import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import TimelineSlider from "../index";

import userEvent from "@testing-library/user-event";
const mockData = {
  asoftime_1159293015_1: {
    event: {
      message: "Event 1",
      id: 1,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1160967939_2: {
    event: {
      message: "Event 2",

      id: 52,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_removed",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1163361514_3: {
    event: {
      message: "Event 3",
      id: 2,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1164361514_3: {
    event: {
      message: "Event 4",
      id: 2,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
  },
  asoftime_1165361514_3: {
    event: {
      message: "Event 5",
      id: 2,
      namespaceId: 1,
      new_parent_id: null,
      nickname_id: 96,
      old_parent_id: null,
      type: "direct_support_added",
      url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
      url_new: null,
    },
    asoftime_1166361514_3: {
      event: {
        message: "Event 7",
        id: 2,
        namespaceId: 1,
        new_parent_id: null,
        nickname_id: 96,
        old_parent_id: null,
        type: "direct_support_added",
        url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
        url_new: null,
      },
      asoftime_1167361514_3: {
        event: {
          message: "Event 8",
          id: 2,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
      asoftime_1168361514_3: {
        event: {
          message: "Event 9",
          id: 2,
          namespaceId: 1,
          new_parent_id: null,
          nickname_id: 96,
          old_parent_id: null,
          type: "direct_support_added",
          url: "/user/supports/96?topicnum=88&campnum=52&canon=1",
          url_new: null,
        },
      },
    },
  },
};

describe("TimelineSlider", () => {
  it("should render the slider and control buttons", async () => {
    const setIteration = jest.fn();
    const setStart = jest.fn();
    const setIsPlaying = jest.fn();
    const { getByTestId } = render(
      <TimelineSlider
        mockData={mockData}
        setStart={setStart}
        start={false}
        setTimelineDescript={jest.fn()}
        handleEventSelection={jest.fn()}
        animationSpeed={1000}
        setAnimationSpeed={jest.fn()}
        iteration={0}
        setIteration={setIteration}
        handleForwardOrBackord={jest.fn()}
        isPlaying={false}
        setIsPlaying={setIsPlaying}
      />
    );
    expect(
      screen.getByRole("img", {
        name: /step-backward/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /caret-right/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /step-forward/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: /dashboard/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/sep 26, 06/i)).toBeInTheDocument();

    expect(screen.getByText(/oct 16, 06/i)).toBeInTheDocument();

    expect(screen.getByText(/nov 13, 06/i)).toBeInTheDocument();
    const playButton = getByTestId("play-button");
    expect(playButton).toBeInTheDocument();
    fireEvent.click(playButton);

    const speedIcon = getByTestId("speed-icon");

    expect(speedIcon).toBeInTheDocument();
    userEvent.hover(speedIcon);

    // Wait for the slider to open (adjust the timing as needed)
    await waitFor(() => {
      // Try to find an element containing "1.25x" text
      const speed125x = screen.getByText(/1.25x/i, { exact: false });
      expect(speed125x).toBeInTheDocument();

      fireEvent.click(speed125x);
      fireEvent.click(speedIcon);
    });
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
    const setIsPlaying = jest.fn();
    const { getByTestId } = render(
      <TimelineSlider
        mockData={mockData}
        setStart={jest.fn()}
        start={true}
        setTimelineDescript={jest.fn()}
        handleEventSelection={jest.fn()}
        animationSpeed={1000}
        setAnimationSpeed={jest.fn()}
        iteration={1}
        setIteration={setIteration}
        handleForwardOrBackord={handleForwardOrBackord}
        isPlaying={true}
        setIsPlaying={setIsPlaying}
      />
    );

    const backwardButton = getByTestId("backward-button");
    fireEvent.click(backwardButton);

    expect(setIteration).toHaveBeenCalledWith(0);
    expect(handleForwardOrBackord).toHaveBeenCalledWith(0);

    const playButton = getByTestId("play-button");
    expect(playButton).toBeInTheDocument();
    fireEvent.click(playButton);
    fireEvent.click(screen.getByText(/Dec 6, 06/i));
  });
});
