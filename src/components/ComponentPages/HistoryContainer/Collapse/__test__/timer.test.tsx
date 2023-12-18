import { act, render } from "@testing-library/react";
import { Timer } from "../index";

describe("HistoryCollapse component", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1698680495 * 1000).getTime());
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  test("renders commit and cancel button", async () => {
    const { container } = render(
      <Timer unixTime={1698680495} setCommited={jest.fn()} />
    );
    const timerText = container.querySelector("span");

    expect(timerText).toHaveTextContent("01:00:00");
    jest.advanceTimersByTime(1001);

    expect(timerText).toHaveTextContent("00:59:59");
    act(() => {
      jest.advanceTimersByTime(3543000);
    });

    expect(timerText).toHaveTextContent("00:01:00");
    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(timerText).toHaveTextContent("00:00:59");
    act(() => {
      jest.advanceTimersByTime(58000);
    });

    expect(timerText).toHaveTextContent("00:00:01");
    act(() => {
      jest.advanceTimersByTime(1001);
    });

    expect(timerText).toHaveTextContent("00:00:00");
    act(() => {
      jest.advanceTimersByTime(1001);
    });
  });
  it("renders with default time (00:00:00)", () => {
    const { container } = render(<Timer unixTime={0} />);
    const timerText = container.querySelector("span");

    expect(timerText).toHaveTextContent("00:00:00");
  });
});
