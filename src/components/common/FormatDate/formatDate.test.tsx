import { formatDate } from ".";
// import { render } from "../../../utils/testUtils";

describe("formatDate", () => {
  it("formats the date correctly", () => {
    const date = "2023-06-30";
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("2023-06-30");
  });

  it("adds leading zeros to month and day", () => {
    const date = "2023-6-7";
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("2023-06-07");
  });

  it("handles single-digit month and day", () => {
    const date = "2023-02-1";
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("2023-02-01");
  });
});
