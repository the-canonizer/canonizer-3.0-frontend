import {
  // eslint-disable-next-line no-unused-vars
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
// import DelegatedSupportCampsUI from "../DelegatedSupportCampsUI/index";
import messages from "../../../../messages";
import DelegatedSupportCamps from "..";
import userEvent from "@testing-library/user-event";
// import { useRouter } from "next/router";
// import { renderHook } from "@testing-library/react-hooks";
// import { useState } from "react";
// import { Input, message } from "antd";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("src/network/api/userApi", () => ({
  getDelegatedSupportCampsList: jest.fn(() =>
    Promise.resolve({ data: delegatedSupportCampsList, status_code: 200 })
  ),
  removeSupportedCampsEntireTopic: jest.fn((camp) =>
    Promise.resolve({
      status_code: 200,
      data: {
        topic_num: 1,
        nick_name_id: 10,
        delegated_nick_name_id: 1,
        ...camp,
      },
    })
  ),
}));
const { labels } = messages;

// const viewMoreModalVisible = true;
// const isRemoveSupportModalVisible = true;
// const showViewMoreModal = jest.fn();
// const removeCardDelegatedSupportedCamps = jest.fn();
// const handleSupportedCampsCancel = jest.fn();
// const handelViewMoreModalCancel = jest.fn();
// const removeSupport = jest.fn();
// const search = "";
const delegatedSupportCampsList = [
  {
    id: "1",
    title_link: "https://www.google.com/",
    title: "Direct Supported camps",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 1,
        camp_name: "Supported Camps",
      },
      {
        camp_link: "https://www.google.com/",
        support_order: 2,
        camp_name: "Supported Camps",
      },
      {
        camp_link: "https://www.google.com/",
        support_order: 3,
        camp_name: "Supported Camps",
      },
      {
        camp_link: "https://www.google.com/",
        support_order: 4,
        camp_name: "Supported Camps",
      },
      {
        camp_link: "https://www.google.com/",
        support_order: 5,
        camp_name: "Supported Camps",
      },
    ],
    delegated_to_nick_name: "Rohit_Talentelgia",
    delegated_to_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1138?topicnum=286&campnum=5&canon=19",
    my_nick_name: "reena_talentelgia",
    my_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1134?topicnum=286&campnum=5&canon=19",
  },
  {
    id: "2",
    title_link: "https://www.google.com/",
    title: "Direct Supported camps 2",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 2,
        camp_name: "Supported Camps 2",
      },
    ],
    delegated_to_nick_name: "Rohit_Talentelgia",
    delegated_to_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1138?topicnum=286&campnum=5&canon=19",
    my_nick_name: "reena_talentelgia",
    my_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1134?topicnum=286&campnum=5&canon=19",
  },
];
const viewMoreDataValue = {
  delegated_to_nick_name: "Rohit_Talentelgia",
  delegated_to_nick_name_link:
    "https://canonizer-api.teamtalentelgia.com/user/supports/1138?topicnum=286&campnum=5&canon=19",
  my_nick_name: "reena_talentelgia",
  my_nick_name_link:
    "https://canonizer-api.teamtalentelgia.com/user/supports/1134?topicnum=286&campnum=5&canon=19",
  title: "This is a test topic RG",
  title_link:
    "https://canonizer-api.teamtalentelgia.com/topic/286-This-is-a-test-topic-RG/1-Aggreement",
  topic_num: 286,
  camps: [
    {
      camp_link:
        "https://canonizer-api.teamtalentelgia.com/topic/286-This-is-a-test-topic-RG/5-test-camp-12#statement",
      camp_name: "test camp 12",
      camp_num: 5,
      support_added: "2021-10-29",
      support_order: 1,
    },
  ],
};
// const removeSupportCampsData = {
//   camps: [
//     {
//       camp_num: 2,
//       camp_name: "AI can only be friendly",
//       support_order: 1,
//       camp_link:
//         "/topic/16-Friendly-AI-Importance/2-AI-can-only-be-friendly#statement",
//       support_added: "2022-08-10",
//     },
//   ],
//   delegated_nick_name_id: 1,
//   delegated_to_nick_name: "Brent_Allsop",
//   delegated_to_nick_name_link: "/user/supports/1?topicnum=16&campnum=2&canon=1",
//   my_nick_name: "Nick",
//   my_nick_name_link: "/user/supports/643?topicnum=16&campnum=2&canon=1",
//   nick_name_id: 643,
//   title: "Friendly AI Importance",
//   title_link: "/topic/16-Friendly-AI-Importance/1-Agreement",
//   topic_num: 16,
// };

describe("delegated supported", () => {
  it("render a value when write in search box", () => {
    render(<DelegatedSupportCamps search="" />);
    waitFor(async () => {
      expect(screen.getAllByText("For topic").length).toEqual(2);
      expect(
        screen.getByText(delegatedSupportCampsList[0].title)
      ).toBeInTheDocument();
      expect(
        screen.getByText(delegatedSupportCampsList[1].title)
      ).toBeInTheDocument();
      expect(screen.getAllByText("Remove Support").length).toEqual(2);
      expect(screen.getByText("Agreement")).toBeInTheDocument();
      expect(screen.getByText("Agreement-2")).toBeInTheDocument();
    });
  });

  it("render view more data value of delegate supporter", () => {
    render(<DelegatedSupportCamps search="" />);
    waitFor(async () => {
      expect(
        screen.getByText(viewMoreDataValue[0].delegated_to_nick_name)
      ).toBeInTheDocument();
      expect(
        screen.getByText(viewMoreDataValue[0].delegated_to_nick_name_link)
      ).toBeInTheDocument();
      expect(
        screen.getByText(viewMoreDataValue[0].my_nick_name)
      ).toBeInTheDocument();
      expect(
        screen.getByText(viewMoreDataValue[0].my_nick_name_link)
      ).toBeInTheDocument();
      expect(screen.getByText(viewMoreDataValue[0].title)).toBeInTheDocument();
      expect(
        screen.getByText(viewMoreDataValue[0].title_link)
      ).toBeInTheDocument();
      expect(
        screen.getByText(viewMoreDataValue[0].topic_num)
      ).toBeInTheDocument();
    });
  });

  it("click on remove support button and open modal", () => {
    render(<DelegatedSupportCamps search={""} />);
    waitFor(async () => {
      const btns = screen.getAllByText("Remove Support");

      userEvent.click(btns[0]);

      expect(
        screen.getByText(delegatedSupportCampsList[0].title)
      ).toBeInTheDocument();
      const removeButton = screen.getAllByText("Remove Support");
      userEvent.click(removeButton[0]);
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  it("click on view more button for display all the camps", () => {
    render(<DelegatedSupportCamps search="" />);
    waitFor(async () => {
      const btns = screen.getAllByText(labels.viewMore);

      userEvent.click(btns[0]);

      expect(screen.getByText("Current Supported Camps:")).toBeInTheDocument();
      expect(screen.getByText("Agreement")).toBeInTheDocument();
      expect(screen.getByText("Agreement-2")).toBeInTheDocument();
    });
  });
  it("clicked on remove support button and open modal", async () => {
    render(<DelegatedSupportCamps search="" />);
    await waitFor(() => {
      const btns = screen.getAllByText("Remove Support");

      userEvent.click(btns[0]);

      // expect(
      //   screen.getByText(delegatedSupportCampsList[0].title)
      // ).toBeInTheDocument();
      const removeButton = screen.getAllByTestId(
        "removeCardDelegatedSupportedCamps"
      );
      userEvent.click(removeButton[0]);
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
});
