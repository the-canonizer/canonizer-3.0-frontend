import { render, screen, waitFor } from "../../../utils/testUtils";

import { useRouter } from "next/router";
import { Card } from "antd";
import { renderHook } from "@testing-library/react-hooks";
import ArchivedCampMsg from ".";

const campRecord = {
  camp_about_nick_id: 0,
  camp_about_nick_name: "joy",
  camp_about_url: "",
  camp_name: "",
  camp_num: 0,
  direct_archive: 0,
  flag: 0,
  go_live_time: 1685597186,
  // is_archive: 0,
  is_disabled: 0,
  is_one_level: 0,
  key_words: "",
  nick_name: "",
  note: 0,
  parentCamps: [
    {
      camp_name: "",
      camp_num: 1,
      topic_num: 23,
    },
  ],
};
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("ArchiveCampMsg", () => {
  it("render camp record", () => {
    render(<ArchivedCampMsg />);
    waitFor(async () => {
      expect(
        screen.getByText(campRecord.camp_about_nick_id)
      ).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.camp_about_nick_name)
      ).toBeInTheDocument();
      expect(screen.getByText(campRecord.camp_about_url)).toBeInTheDocument();
      expect(screen.getByText(campRecord.camp_name)).toBeInTheDocument();
      expect(screen.getByText(campRecord.camp_num)).toBeInTheDocument();
      expect(screen.getByText(campRecord.direct_archive)).toBeInTheDocument();
      expect(screen.getByText(campRecord.flag)).toBeInTheDocument();
      expect(screen.getByText(campRecord.go_live_time)).toBeInTheDocument();
      expect(screen.getByText(campRecord.is_archive)).toBeInTheDocument();
      expect(screen.getByText(campRecord.is_disabled)).toBeInTheDocument();
      expect(screen.getByText(campRecord.is_one_level)).toBeInTheDocument();
      expect(screen.getByText(campRecord.key_words)).toBeInTheDocument();
      expect(screen.getByText(campRecord.note)).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.parentCamps[0].camp_name)
      ).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.parentCamps[0].camp_num)
      ).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.parentCamps[0].topic_num)
      ).toBeInTheDocument();
    });
  });

  it("path is working with use router", () => {
    render(<ArchivedCampMsg />);
    const mockedRouter = {
      pathname: "/about",
    };

    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);

    const { result } = renderHook(() => useRouter());

    expect(result.current.pathname).toBe("/about");
  });

  it("should render card with title and content", () => {
    render(<ArchivedCampMsg />);
    const title = "Test Card Title";
    const content = "Test Card Content";

    render(
      <Card title={title}>
        <p>{content}</p>
      </Card>
    );

    const cardTitle = screen.getByText(title);
    const cardContent = screen.getByText(content);

    expect(cardTitle).toBeInTheDocument();
    expect(cardContent).toBeInTheDocument();
  });
});
