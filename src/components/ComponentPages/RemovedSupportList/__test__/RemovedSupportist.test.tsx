import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import SubscriptionList from "..";

const subsList = [
  {
    topic_num: 323,
    title: "topic one 17 05",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [],
  },
  {
    topic_num: 324,
    title: "topic two",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [
      {
        camp_num: 4,
        camp_name: "Agreement",
        support_order: 1,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
      {
        camp_num: 5,
        camp_name: "Agreement-2",
        support_order: 2,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
    ],
  },
];

describe("Removed Support List Component", () => {
  it("render heading and labels", () => {
    render(<SubscriptionList isTestData={subsList} />);
    waitFor(async () => {
      expect(screen.getAllByText("For topic").length).toEqual(2);
      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText(subsList[1].title)).toBeInTheDocument();
      expect(screen.getAllByText("Remove subscription").length).toEqual(2);
      expect(screen.getByText("Agreement")).toBeInTheDocument();
      expect(screen.getByText("Agreement-2")).toBeInTheDocument();
    });
  });

  it("click on remove subscription button and open modal", () => {
    render(<SubscriptionList isTestData={subsList} />);
    waitFor(async () => {
      const btns = screen.getAllByText("Remove subscription");

      userEvent.click(btns[0]);

      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
});
